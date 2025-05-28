
"use client";

import { useEffect, useState, useCallback } from 'react';
import useLocalStorage, { initialLinkFlowBoardData } from '@/hooks/useLocalStorage';
import type { BoardData, LinkItem, DateGroup } from '@/types/kanban';
import { KanbanBoard } from './KanbanBoard';
import { LinkItemModal } from './LinkItemModal';
import { AddTabModal } from './AddTabModal';
import { ShareLinkModal } from './ShareLinkModal';
import { useToast } from "@/hooks/use-toast";
import { fetchLinkMetadata } from '@/app/actions';
import { format, parseISO, isSameDay, startOfDay, isFuture, subDays } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAnalyticsLog from '@/hooks/useAnalyticsLog';
import useHistory from '@/hooks/useHistory';


function getFormattedDateTitle(dateString: string): string {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);
  const inputDate = startOfDay(parseISO(dateString));

  if (isSameDay(inputDate, today)) {
    return `Today - ${format(inputDate, 'MMMM d, yyyy, EEEE')}`;
  }
  if (isSameDay(inputDate, yesterday)) {
    return `Yesterday - ${format(inputDate, 'MMMM d, yyyy, EEEE')}`;
  }
  return format(inputDate, 'MMMM d, yyyy, EEEE');
}


export function Dashboard() {
  const [boardData, setBoardData] = useLocalStorage<BoardData>('todlex-board', initialLinkFlowBoardData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("");

  const [showDeleteTabDialog, setShowDeleteTabDialog] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<string | null>(null);

  const { logEvent } = useAnalyticsLog();
  const { addLinkToHistory, addMultipleLinksToHistory } = useHistory();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingLink, setSharingLink] = useState<LinkItem | null>(null);
  const [isBoardBlurred, setIsBoardBlurred] = useState(false);


  useEffect(() => {
    if (boardData.dateGroups.length > 0) {
      const currentActiveTabExists = boardData.dateGroups.some(dg => dg.dateString === activeTab);
      if (!activeTab || !currentActiveTabExists) {
         const sortedGroups = [...boardData.dateGroups].sort((a, b) => b.dateString.localeCompare(a.dateString));
         if (sortedGroups.length > 0) {
           setActiveTab(sortedGroups[0].dateString);
         } else {
           setActiveTab("");
         }
      }
    } else if (activeTab && boardData.dateGroups.length === 0) {
      setActiveTab("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardData.dateGroups]);

  const handleAddLink = useCallback(async (url: string, userProvidedTitle?: string) => {
    let targetDateString = activeTab;

    if (!targetDateString) {
      // If no tab is active (e.g., board is empty), default to creating/using a "Today" tab.
      // Check if any tabs exist at all. If not, prompt user to create one.
      if(boardData.dateGroups.length === 0) {
        toast({ title: "No Tab Selected", description: "Please create or select a tab first to add links.", variant: "default" });
        return;
      }
      // If tabs exist but none is active (edge case), default to most recent or prompt.
      // For now, let's be strict: an active tab must be present.
      toast({ title: "No Tab Active", description: "Please select an active tab to add your link.", variant: "default" });
      return;
    }


    if (!url.trim()) {
      toast({ title: "Error", description: "URL cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      new URL(url);
    } catch (_) {
      toast({ title: "Error", description: "Invalid URL format.", variant: "destructive" });
      return;
    }

    setIsAddingLink(true);
    const { id: toastId } = toast({ title: "Processing Link", description: "Fetching metadata..." });

    let linkTitle = userProvidedTitle || url;
    let linkDescription: string | undefined = undefined;
    let linkFavicon: string | undefined = undefined;
    let linkOgImageUrl: string | undefined = undefined;

    try {
      const metadata = await fetchLinkMetadata(url);
      if (metadata.title && (!userProvidedTitle || userProvidedTitle === url)) {
        linkTitle = metadata.title;
      }
      if (metadata.description) {
        linkDescription = metadata.description;
      }
      if (metadata.faviconUrl) {
        linkFavicon = metadata.faviconUrl;
      }
       if (metadata.ogImageUrl) {
        linkOgImageUrl = metadata.ogImageUrl;
      }
      toast({id: toastId, title: "Link Added", description: `"${linkTitle}" metadata fetched.`});
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
      toast({id: toastId, title: "Link Added (No Metadata)", description: `"${linkTitle}" added. Could not fetch metadata.`, variant: "default"});
    }


    setBoardData(prevData => {
      let newDateGroups = [...(prevData.dateGroups || [])];
      let targetGroup = newDateGroups.find(dg => dg.dateString === targetDateString);

      if (!targetGroup) {
         // This case should ideally not be reached if activeTab is always valid.
         // If it is, means the activeTab string doesn't match any existing group.
         toast({ title: "Error", description: "Could not find the active tab to add the link.", variant: "destructive" });
         setIsAddingLink(false);
         return prevData; // Return previous data without changes
      }
      
      // Calculate orderInTab
      const maxOrderInTab = targetGroup.items.reduce((max, item) => Math.max(max, item.orderInTab || 0), 0);
      const newOrderInTab = maxOrderInTab + 1;

      const newLink: LinkItem = {
        id: crypto.randomUUID(),
        url,
        title: linkTitle,
        description: linkDescription,
        favicon: linkFavicon,
        ogImageUrl: linkOgImageUrl,
        createdAt: new Date().toISOString(), // Actual paste time
        orderInTab: newOrderInTab, // Assign sequence number
      };


      targetGroup.items = [newLink, ...targetGroup.items];
      // No need to re-sort items within group if new items are always prepended
      // or if orderInTab is used for display sorting later.

      return { ...prevData, dateGroups: newDateGroups };
    });

    // Log event using the title from the newly created newLink object
    logEvent('LINK_CREATED', { title: linkTitle, relatedId: crypto.randomUUID() }); // Assuming newLink.id is set correctly above.
    setIsAddingLink(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBoardData, toast, activeTab, logEvent, boardData.dateGroups]); 

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const activeElement = document.activeElement;
      const isAnyModalOpen = isModalOpen || isAddTabModalOpen || showDeleteTabDialog || isShareModalOpen;
      const isGeneralInputFocused = activeElement &&
                                 (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') &&
                                 !activeElement.closest('.sm\\:max-w-\\[425px\\]') && 
                                 !activeElement.closest('.sm\\:max-w-md');


      if (isAddingLink || isAnyModalOpen || isGeneralInputFocused) return;

      if (!activeTab && boardData.dateGroups.length === 0) {
        toast({ title: "Paste Blocked", description: "Create and select a tab first to paste links.", variant: "default" });
        return;
      }
      if (!activeTab && boardData.dateGroups.length > 0) {
        toast({ title: "No Tab Active", description: "Please select a tab to paste links.", variant: "default" });
        return; 
      }


      const pastedText = event.clipboardData?.getData('text');
      if (pastedText) {
        if (pastedText.startsWith('http://') || pastedText.startsWith('https://')) {
          event.preventDefault();
          handleAddLink(pastedText);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAddLink, isAddingLink, isModalOpen, isAddTabModalOpen, showDeleteTabDialog, isShareModalOpen, activeTab, toast, boardData.dateGroups.length]);


  const handleDeleteLink = (linkId: string) => {
    let deletedLink: LinkItem | null = null;
    let originalDateGroup = "";
    let originalTabTitle = "";

    setBoardData(prevData => {
      const newDateGroups = (prevData.dateGroups || []).map(dg => {
        const itemToDelete = dg.items.find(item => item.id === linkId);
        if (itemToDelete) {
            deletedLink = itemToDelete;
            originalDateGroup = dg.dateString;
            originalTabTitle = dg.title;
        }
        return {
          ...dg,
          items: dg.items.filter(item => item.id !== linkId),
        };
      });
      return { ...prevData, dateGroups: newDateGroups };
    });

    if (deletedLink) {
      addLinkToHistory(deletedLink, originalDateGroup, originalTabTitle);
      logEvent('LINK_DELETED', { title: deletedLink.title, relatedId: deletedLink.id });
      toast({ title: "Link Moved to History", description: `"${deletedLink.title}" has been moved to history.` });
    }
  };

  const handleEditLink = (linkItem: LinkItem) => {
    setEditingLink(linkItem);
    setIsModalOpen(true);
    setIsBoardBlurred(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setIsBoardBlurred(false);
  };

  const handleSaveLink = (updatedItem: LinkItem) => {
    setBoardData(prevData => {
      const originalItem = prevData.dateGroups
        .flatMap(dg => dg.items)
        .find(item => item.id === updatedItem.id);
      
      if (!originalItem) return prevData;

      const originalDateStringForGrouping = startOfDay(parseISO(originalItem.createdAt)).toISOString().split('T')[0];
      const newDateStringForGrouping = startOfDay(parseISO(updatedItem.createdAt)).toISOString().split('T')[0];

      let newDateGroups = [...(prevData.dateGroups || [])];

      if (originalDateStringForGrouping !== newDateStringForGrouping) {
        // Remove from old group
        let oldGroup = newDateGroups.find(dg => dg.dateString === originalDateStringForGrouping);
        if (oldGroup) {
          oldGroup.items = oldGroup.items.filter(item => item.id !== updatedItem.id);
        }

        // Add to new group
        let newGroup = newDateGroups.find(dg => dg.dateString === newDateStringForGrouping);
        if (newGroup) {
          // Re-assign orderInTab if moving to a new group.
          // For simplicity, keep existing orderInTab if it exists, or assign new if needed.
          // A more robust solution might re-calculate order for the new group or use a different strategy.
          // For now, if it moves, it might disrupt the orderInTab sequence visually in the new tab.
          // Let's assign a new orderInTab when moving to ensure it's at the end of the new tab.
           const maxOrderInNewTab = newGroup.items.reduce((max, item) => Math.max(max, item.orderInTab || 0), 0);
           updatedItem.orderInTab = maxOrderInNewTab + 1;
          
          newGroup.items = [updatedItem, ...newGroup.items.filter(i => i.id !== updatedItem.id)];
          // Sort items by orderInTab after adding to new group
          newGroup.items.sort((a, b) => (a.orderInTab || 0) - (b.orderInTab || 0));

        } else {
          // Create new group if it doesn't exist
          updatedItem.orderInTab = 1; // First item in a new group
          newDateGroups.push({
            dateString: newDateStringForGrouping,
            title: getFormattedDateTitle(newDateStringForGrouping),
            items: [updatedItem],
          });
        }
        
        newDateGroups = newDateGroups.filter(dg => dg.items.length > 0 || dg.dateString === newDateStringForGrouping);
        newDateGroups.sort((a, b) => b.dateString.localeCompare(a.dateString)); // Sort tabs
        setActiveTab(newDateStringForGrouping);
      } else {
        // Update within the same group
        newDateGroups = newDateGroups.map(dg => {
          if (dg.dateString === originalDateStringForGrouping) {
            return {
              ...dg,
              items: dg.items.map(item => (item.id === updatedItem.id ? updatedItem : item))
                             .sort((a, b) => (a.orderInTab || 0) - (b.orderInTab || 0)), // Sort by orderInTab
            };
          }
          return dg;
        });
      }
      return { ...prevData, dateGroups: newDateGroups };
    });

    handleCloseEditModal();
    toast({ title: "Link Updated", description: "Changes saved successfully." });
  };

  const handleUpdateLinkDate = (linkId: string, date: Date | undefined) => {
     setBoardData(prevData => {
        const newDateGroups = (prevData.dateGroups || []).map(dg => ({
          ...dg,
          items: dg.items.map(item => item.id === linkId ? {...item, todoDate: date?.toISOString()} : item),
        }));
      return { ...prevData, dateGroups: newDateGroups };
    });
    toast({ title: "Date Updated", description: `To-do date for link has been ${date ? 'set' : 'cleared'}.` });
  };

  const handleCreateTab = (selectedDate: Date) => {
    const newDateString = selectedDate.toISOString().split('T')[0];

    if (isFuture(startOfDay(selectedDate))) {
        toast({
          title: "Future Date Tab Not Allowed",
          description: "Cannot create tabs for future dates.",
          variant: "destructive",
        });
        setIsAddTabModalOpen(false);
        setIsBoardBlurred(false);
        return;
    }

    setBoardData(prevData => {
      const existingGroup = prevData.dateGroups.find(dg => dg.dateString === newDateString);
      if (existingGroup) {
        toast({ title: "Tab Exists", description: `Tab for ${getFormattedDateTitle(newDateString)} already exists. Switching to it.`, variant: "default" });
        setActiveTab(newDateString); 
        return prevData;
      }

      const newGroup: DateGroup = {
        dateString: newDateString,
        title: getFormattedDateTitle(newDateString),
        items: [],
      };
      const updatedDateGroups = [...prevData.dateGroups, newGroup];
      updatedDateGroups.sort((a, b) => b.dateString.localeCompare(a.dateString));

      logEvent('TAB_CREATED', { title: newGroup.title, relatedId: newGroup.dateString });
      toast({ title: "Tab Created", description: `New tab for ${newGroup.title} added.` });
      setActiveTab(newDateString); 
      return { ...prevData, dateGroups: updatedDateGroups };
    });
    setIsAddTabModalOpen(false);
    setIsBoardBlurred(false);
  };

  const handleAttemptDeleteTab = (dateString: string) => {
    setTabToDelete(dateString);
    setShowDeleteTabDialog(true);
    setIsBoardBlurred(true);
  };

  const handleConfirmDeleteTab = () => {
    if (!tabToDelete) return;

    let deletedTabTitle = "Unknown Tab";
    let linksToMoveToHistory: LinkItem[] = [];

    setBoardData(prevData => {
      const tabGroupToDelete = prevData.dateGroups.find(dg => dg.dateString === tabToDelete);
      if (tabGroupToDelete) {
        deletedTabTitle = tabGroupToDelete.title;
        linksToMoveToHistory = [...tabGroupToDelete.items];
      }

      const updatedDateGroups = prevData.dateGroups.filter(dg => dg.dateString !== tabToDelete);
      let newActiveTab = activeTab;

      if (tabToDelete === activeTab) {
        if (updatedDateGroups.length > 0) {
          const sortedGroups = [...updatedDateGroups].sort((a, b) => b.dateString.localeCompare(a.dateString));
          newActiveTab = sortedGroups[0].dateString;
        } else {
          newActiveTab = "";
        }
      }
      if (activeTab !== newActiveTab) setActiveTab(newActiveTab);
      return { ...prevData, dateGroups: updatedDateGroups };
    });

    if (linksToMoveToHistory.length > 0) {
        addMultipleLinksToHistory(linksToMoveToHistory, tabToDelete, deletedTabTitle);
    }
    logEvent('TAB_DELETED', { title: deletedTabTitle, relatedId: tabToDelete });
    toast({ title: "Tab Moved to History", description: `Tab "${deletedTabTitle}" and its links moved to history.`});

    setShowDeleteTabDialog(false);
    setTabToDelete(null);
    setIsBoardBlurred(false);
  };

  const handleCancelDeleteTab = () => {
    setShowDeleteTabDialog(false);
    setTabToDelete(null);
    setIsBoardBlurred(false);
  };

  const deleteDialogContent = tabToDelete ? {
    title: "Delete Tab?",
    description: `Are you sure you want to delete the tab "${getFormattedDateTitle(tabToDelete)}" and all its links? The links will be moved to History.`,
    actionText: "Delete Tab",
  } : { title: "", description: "", actionText: ""};

  const handleOpenShareModal = (linkItem: LinkItem) => {
    setSharingLink(linkItem);
    setIsShareModalOpen(true);
    setIsBoardBlurred(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setSharingLink(null);
    setIsBoardBlurred(false);
  };


  return (
    <div className={`flex flex-col h-[calc(100vh-var(--header-height))] ${isBoardBlurred ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
       <style jsx global>{`
        :root {
          --header-height: 65px; 
          --input-section-height: 40px; 
        }
      `}</style>
      <div className="p-4 border-b">
         <p className="text-xs text-muted-foreground container mx-auto text-center">Tip: You can paste links (Ctrl+V or Cmd+V) into the active tab.</p>
      </div>
      <KanbanBoard
        boardData={boardData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDeleteLink={handleDeleteLink}
        onEditLink={handleEditLink}
        onUpdateLinkDate={handleUpdateLinkDate}
        onOpenAddTabModal={() => {setIsAddTabModalOpen(true); setIsBoardBlurred(true);}}
        onAttemptDeleteTab={handleAttemptDeleteTab}
        onShareLink={handleOpenShareModal}
      />
      {editingLink && (
        <LinkItemModal
          isOpen={isModalOpen}
          onClose={handleCloseEditModal}
          linkItem={editingLink}
          onSave={handleSaveLink}
        />
      )}
      <AddTabModal
        isOpen={isAddTabModalOpen}
        onClose={() => {setIsAddTabModalOpen(false); setIsBoardBlurred(false);}}
        onAddTab={handleCreateTab}
      />
      {sharingLink && (
        <ShareLinkModal
          isOpen={isShareModalOpen}
          onClose={handleCloseShareModal}
          linkUrl={sharingLink.url}
          linkTitle={sharingLink.title}
        />
      )}
      <AlertDialog open={showDeleteTabDialog} onOpenChange={(open) => { if (!open) handleCancelDeleteTab(); else setShowDeleteTabDialog(open);}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteDialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeleteTab}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteTab} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                {deleteDialogContent.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
