"use client";

import type { BoardData, LinkItem, DateGroup } from '@/types/kanban';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateLinksList } from './DateLinksList';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { PlusCircle, X as XIcon } from 'lucide-react';
import React from 'react';
import { isFuture, parseISO, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBoardState } from '@/hooks/useBoardState';


interface KanbanBoardProps {
  boardData: BoardData;
  activeTab: string;
  setActiveTab: (dateString: string) => void;
  onDeleteLink: (linkId: string) => void;
  onEditLink: (linkItem: LinkItem) => void;
  onUpdateLinkDate: (linkId: string, date: Date | undefined) => void;
  onOpenAddTabModal: () => void;
  onAttemptDeleteTab: (dateString: string) => void;
  onShareLink: (linkItem: LinkItem) => void;
  onBoardUpdate: (updatedBoardData: BoardData) => void; // Add this to handle board updates
}

export function KanbanBoard({
  boardData,
  activeTab,
  setActiveTab,
  onDeleteLink,
  onEditLink,
  onUpdateLinkDate,
  onOpenAddTabModal,
  onAttemptDeleteTab,
  onShareLink,
  onBoardUpdate  // Add this to handle board updates
}: KanbanBoardProps) {
  const { isDragging, draggingCardId, handleDragStart, handleDragEnd, handleSwapItems } = useBoardState();

  const onSwapItems = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      // This is just the start of a drag, set the dragging state
      handleDragStart({} as React.DragEvent<HTMLDivElement>, sourceId);
      return;
    }

    // This is a drop, update the items
    const activeGroup = boardData.dateGroups.find(group => group.dateString === activeTab);
    if (!activeGroup) return;

    // Update the items in the active group
    const updatedItems = handleSwapItems(activeGroup.items, sourceId, targetId);

    // Create updated board data
    const updatedBoardData = {
      ...boardData,
      dateGroups: boardData.dateGroups.map(group =>
        group.dateString === activeTab
          ? { ...group, items: updatedItems }
          : group
      )
    };

    // Save the updated board data and end the drag
    if (onBoardUpdate) {
      onBoardUpdate(updatedBoardData);
    }
    handleDragEnd();
  };

  const displayableDateGroups = boardData.dateGroups || [];

  // Ensure activeTab is valid, defaulting to the first tab if the current activeTab doesn't exist
  let currentActiveTab = activeTab;
  if (displayableDateGroups.length > 0) {
    const activeTabExists = displayableDateGroups.some(dg => dg.dateString === activeTab);
    if (!activeTabExists) {
      currentActiveTab = displayableDateGroups[0].dateString;
    }
  } else {
    currentActiveTab = ""; // No tabs, no active tab
  }


  if (displayableDateGroups.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 text-muted-foreground dots-background h-[calc(100vh-var(--header-height)-var(--input-section-height))]">
        <p className="mb-4 text-lg text-center">Your Todlex board is empty!</p>
        <p className="mb-4 text-sm text-center">Click the 'Add Date Tab' button to create your first date group and start organizing links.</p>
        <Button onClick={onOpenAddTabModal} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Date Tab
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow p-4 dots-background overflow-hidden h-[calc(100vh-var(--header-height)-var(--input-section-height))]">
      <Tabs value={currentActiveTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <ScrollArea className="flex-grow w-full whitespace-nowrap rounded-md border">
            <TabsList className="inline-flex h-auto p-1">
              {displayableDateGroups.map((group) => {
                const isFutureTab = isFuture(startOfDay(parseISO(group.dateString)));
                return (
                  <TabsTrigger
                    key={group.dateString}
                    value={group.dateString}
                    className={cn(
                      "px-3 py-2 relative group/tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      isFutureTab && "border-red-500 border-2"
                    )}
                  >
                    {group.title} ({group.items.length})
                    <div
                      role="button"
                      tabIndex={0}
                      className="absolute -top-1.5 -right-1.5 h-6 w-6 p-0.5 rounded-full opacity-50 group-hover/tab:opacity-100 hover:bg-destructive/80 hover:text-destructive-foreground transition-all flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onAttemptDeleteTab(group.dateString);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          e.preventDefault();
                          onAttemptDeleteTab(group.dateString);
                        }
                      }}
                      aria-label={`Delete tab ${group.title}`}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button variant="outline" onClick={onOpenAddTabModal} className="flex-shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Tab
          </Button>
        </div>

        <div className="flex-grow mt-2 overflow-y-auto">
          {displayableDateGroups.map((group) => (
            <TabsContent key={group.dateString} value={group.dateString} className="h-full mt-0">
              <DateLinksList
                items={group.items}
                onDeleteLink={onDeleteLink}
                onEditLink={onEditLink}
                onUpdateLinkDate={onUpdateLinkDate}
                onShareLink={onShareLink}
                isCurrentTab={group.dateString === currentActiveTab}
                isDragging={isDragging}
                draggingCardId={draggingCardId}
                onSwapItems={onSwapItems}
              />
            </TabsContent>
          ))}
          {displayableDateGroups.length > 0 && !displayableDateGroups.find(g => g.dateString === currentActiveTab) && (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
              Select a tab to view links or add a new one.
            </div>
          )}
          {displayableDateGroups.find(g => g.dateString === currentActiveTab && g.items.length === 0) && (
            <TabsContent value={currentActiveTab} className="h-full mt-0">
              <div className="flex items-center justify-center h-full text-lg text-muted-foreground p-6 text-center">
                This tab is empty. Paste a link (Ctrl+V or Cmd+V) to add it!
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
