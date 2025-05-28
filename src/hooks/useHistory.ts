
"use client";

import type { TrashedLinkItem, HistoryData } from '@/types/history';
import type { LinkItem } from '@/types/kanban';
import { useState, useEffect, useCallback } from 'react';
import { subDays, parseISO, isBefore } from 'date-fns';

const HISTORY_KEY = 'todlex-history';
const HISTORY_RETENTION_DAYS = 24;
const MAX_HISTORY_ENTRIES = 200; // Limit total history entries to prevent excessive localStorage use

const initialHistoryData: HistoryData = {
  trashedLinks: [],
};

function useHistory() {
  const [historyData, setHistoryData] = useState<HistoryData>(initialHistoryData);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const pruneOldHistory = useCallback((currentTrashedLinks: TrashedLinkItem[]): TrashedLinkItem[] => {
    const retentionDate = subDays(new Date(), HISTORY_RETENTION_DAYS);
    return currentTrashedLinks.filter(item => 
      !isBefore(parseISO(item.deletedAt), retentionDate)
    );
  }, []);

  useEffect(() => {
    if (hasMounted) {
      try {
        const storedHistory = window.localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
          const parsedHistory: HistoryData = JSON.parse(storedHistory);
          const prunedLinks = pruneOldHistory(parsedHistory.trashedLinks || []);
          setHistoryData({ trashedLinks: prunedLinks.slice(-MAX_HISTORY_ENTRIES) });
          // If pruning changed the data, save it back
          if (prunedLinks.length !== (parsedHistory.trashedLinks || []).length) {
            window.localStorage.setItem(HISTORY_KEY, JSON.stringify({ trashedLinks: prunedLinks.slice(-MAX_HISTORY_ENTRIES) }));
          }
        } else {
          setHistoryData(initialHistoryData);
           window.localStorage.setItem(HISTORY_KEY, JSON.stringify(initialHistoryData));
        }
      } catch (error) {
        console.error("Error reading history from localStorage:", error);
        setHistoryData(initialHistoryData);
      }
    }
  }, [hasMounted, pruneOldHistory]);

  const saveHistory = useCallback((updatedData: HistoryData) => {
    try {
      const prunedLinks = pruneOldHistory(updatedData.trashedLinks);
      const dataToStore = { trashedLinks: prunedLinks.slice(-MAX_HISTORY_ENTRIES) };
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(dataToStore));
      setHistoryData(dataToStore);
    } catch (error) {
      console.error("Error saving history to localStorage:", error);
    }
  }, [pruneOldHistory]);

  const addLinkToHistory = useCallback((link: LinkItem, originalDateGroup: string, originalTabTitle: string) => {
    if (!hasMounted) return;
    const trashedLink: TrashedLinkItem = {
      ...link,
      deletedAt: new Date().toISOString(),
      originalDateGroup: originalDateGroup,
      originalTitle: originalTabTitle,
    };
    setHistoryData(prevData => {
      const updatedLinks = [trashedLink, ...(prevData.trashedLinks || [])];
      const prunedLinks = pruneOldHistory(updatedLinks);
      const finalLinks = prunedLinks.slice(-MAX_HISTORY_ENTRIES);
      saveHistory({ trashedLinks: finalLinks }); // Save immediately after update
      return { trashedLinks: finalLinks };
    });
  }, [hasMounted, saveHistory, pruneOldHistory]);

  const addMultipleLinksToHistory = useCallback((links: LinkItem[], originalDateGroup: string, originalTabTitle: string) => {
    if (!hasMounted) return;
    const newTrashedLinks: TrashedLinkItem[] = links.map(link => ({
      ...link,
      deletedAt: new Date().toISOString(),
      originalDateGroup: originalDateGroup,
      originalTitle: originalTabTitle,
    }));

    setHistoryData(prevData => {
      const updatedLinks = [...newTrashedLinks, ...(prevData.trashedLinks || [])];
      const prunedLinks = pruneOldHistory(updatedLinks);
      const finalLinks = prunedLinks.slice(-MAX_HISTORY_ENTRIES);
      saveHistory({ trashedLinks: finalLinks });
      return { trashedLinks: finalLinks };
    });
  }, [hasMounted, saveHistory, pruneOldHistory]);
  
  const removeLinksFromHistoryByOriginalGroup = useCallback((originalDateGroup: string) => {
    if (!hasMounted) return;
    setHistoryData(prevData => {
        const updatedLinks = prevData.trashedLinks.filter(link => link.originalDateGroup !== originalDateGroup);
        saveHistory({ trashedLinks: updatedLinks });
        return { trashedLinks: updatedLinks };
    });
  }, [hasMounted, saveHistory]);

  const removeLinkFromHistoryById = useCallback((linkId: string) => {
     if (!hasMounted) return;
     setHistoryData(prevData => {
        const updatedLinks = prevData.trashedLinks.filter(link => link.id !== linkId);
        saveHistory({ trashedLinks: updatedLinks });
        return { trashedLinks: updatedLinks };
    });
  }, [hasMounted, saveHistory]);


  const clearAllHistory = useCallback(() => {
    if (!hasMounted) return;
    saveHistory({ trashedLinks: [] });
  }, [hasMounted, saveHistory]);

  return { 
    history: hasMounted ? historyData : initialHistoryData, 
    addLinkToHistory, 
    addMultipleLinksToHistory,
    removeLinksFromHistoryByOriginalGroup,
    removeLinkFromHistoryById,
    clearAllHistory 
  };
}

export default useHistory;
