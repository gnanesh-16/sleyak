
"use client";

import { AppHeader } from '@/components/AppHeader';
import useHistory from '@/hooks/useHistory';
import type { TrashedLinkItem } from '@/types/history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useState, useMemo, useEffect } from 'react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { Trash2, ExternalLink, RotateCcw, HistoryIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const formatTimestamp = (timestamp: string): string => {
  try {
    return `${format(parseISO(timestamp), 'MMM d, yyyy HH:mm')} (${formatDistanceToNow(parseISO(timestamp), { addSuffix: true })})`;
  } catch (error) {
    return "Invalid Date";
  }
};

export default function HistoryPage() {
  const { history, removeLinkFromHistoryById, removeLinksFromHistoryByOriginalGroup, clearAllHistory } = useHistory();
  const { toast } = useToast();

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'link' | 'group', id: string } | null>(null);
  
  // Client-side state for history to prevent hydration mismatches initially
  const [clientHistory, setClientHistory] = useState<TrashedLinkItem[]>([]);
  useEffect(() => {
    setClientHistory(history.trashedLinks);
  }, [history.trashedLinks]);


  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: { title: string; items: TrashedLinkItem[] } } = {};
    clientHistory.forEach(item => {
      if (!groups[item.originalDateGroup]) {
        groups[item.originalDateGroup] = { title: item.originalTitle || `From Tab: ${format(parseISO(item.originalDateGroup), 'MMM d, yyyy')}`, items: [] };
      }
      groups[item.originalDateGroup].items.push(item);
    });
    // Sort groups by original date (most recent first), then items within groups by deletion date (most recent first)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => parseISO(dateB).getTime() - parseISO(dateA).getTime())
      .map(([dateString, groupData]) => ({
        dateString,
        ...groupData,
        items: groupData.items.sort((a, b) => parseISO(b.deletedAt).getTime() - parseISO(a.deletedAt).getTime()),
      }));
  }, [clientHistory]);

  const handleAttemptDelete = (type: 'link' | 'group', id: string) => {
    setItemToDelete({ type, id });
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'link') {
      removeLinkFromHistoryById(itemToDelete.id);
      toast({ title: "Link Deleted", description: "The link has been permanently removed from history." });
    } else if (itemToDelete.type === 'group') {
      removeLinksFromHistoryByOriginalGroup(itemToDelete.id);
      toast({ title: "Group Cleared", description: "All links from this group have been permanently removed from history." });
    }
    setItemToDelete(null);
  };
  
  const handleClearAllHistory = () => {
    clearAllHistory();
    toast({ title: "History Cleared", description: "All items have been permanently removed from history." });
    setShowClearDialog(false);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <HistoryIcon className="mr-3 h-8 w-8" /> Deletion History
          </h1>
          {clientHistory.length > 0 && (
            <Button variant="outline" onClick={() => setShowClearDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear All History
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recently Deleted Items</CardTitle>
            <CardDescription>
              Links deleted from your board are kept here for 24 days before permanent removal.
              You can also permanently delete them from here at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {groupedHistory.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
                <Accordion type="multiple" className="w-full">
                  {groupedHistory.map((group) => (
                    <AccordionItem value={group.dateString} key={group.dateString}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-2">
                           <span>{group.title} ({group.items.length} items)</span>
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="text-xs h-7"
                             onClick={(e) => { e.stopPropagation(); handleAttemptDelete('group', group.dateString);}}
                           >
                             <Trash2 className="mr-1 h-3 w-3"/> Clear Group
                           </Button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">Favicon</TableHead>
                              <TableHead>Title & URL</TableHead>
                              <TableHead>Deleted At (IST)</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.items.map(item => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.favicon ? (
                                     <Image 
                                        src={item.favicon} 
                                        alt="favicon" 
                                        width={20} 
                                        height={20} 
                                        className="rounded"
                                        onError={(e) => { 
                                          const target = e.target as HTMLImageElement;
                                          target.srcset = "https://placehold.co/20x20.png";
                                          target.src = "https://placehold.co/20x20.png";
                                        }}
                                      />
                                  ) : (
                                    <div className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs">?</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium truncate max-w-xs" title={item.title}>{item.title}</div>
                                  <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-xs text-muted-foreground hover:underline truncate max-w-xs inline-flex items-center gap-1"
                                    title={item.url}
                                  >
                                    {item.url} <ExternalLink className="h-3 w-3"/>
                                  </a>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {formatTimestamp(item.deletedAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleAttemptDelete('link', item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <HistoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your deletion history is empty.</p>
                <p className="text-xs text-muted-foreground mt-1">Deleted links and tabs will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => { if (!open) setItemToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Permanent Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this {itemToDelete?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All History?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete all items from your history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllHistory} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Clear All History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
