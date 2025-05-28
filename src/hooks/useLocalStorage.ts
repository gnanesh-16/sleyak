
"use client";

import type { BoardData } from '@/types/kanban';
import { useState, useEffect, useCallback } from 'react';

// Define the initial structure for BoardData, now using dateGroups
export const initialLinkFlowBoardData: BoardData = {
  dateGroups: [], // Start with no default date groups
};

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsedItem = JSON.parse(item);
          // Check for old 'columns' structure specifically for 'todlex-board'
          if (key === 'todlex-board' && parsedItem.columns && !parsedItem.dateGroups) {
            console.warn("Old board data structure detected for 'todlex-board', resetting to new structure.");
            // Ensure newInitial is correctly typed as BoardData for comparison
            const newInitial = initialValue as unknown as BoardData; 
            // If initialValue passed to the hook for 'todlex-board' is different than the default initialLinkFlowBoardData, respect it.
            // Otherwise, default to initialLinkFlowBoardData.
            const resetValue = (JSON.stringify(newInitial) !== JSON.stringify(initialLinkFlowBoardData) && 'dateGroups' in newInitial) 
                               ? newInitial 
                               : initialLinkFlowBoardData;
            window.localStorage.setItem(key, JSON.stringify(resetValue));
            setStoredValue(resetValue as T);
          } else if (parsedItem && (key !== 'todlex-board' || 'dateGroups' in parsedItem)) {
            // Ensure dateGroups is always an array
            if (key === 'todlex-board' && parsedItem.dateGroups && !Array.isArray(parsedItem.dateGroups)) {
              console.warn("Corrupted dateGroups found in localStorage for 'todlex-board', resetting to initial value.");
              window.localStorage.setItem(key, JSON.stringify(initialValue));
              setStoredValue(initialValue);
            } else {
              setStoredValue(parsedItem);
            }
          } else { // Item is null or parsedItem is not valid for 'todlex-board' (e.g. missing dateGroups)
             window.localStorage.setItem(key, JSON.stringify(initialValue));
             setStoredValue(initialValue);
          }
        } else { // No item found in localStorage
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          if (JSON.stringify(storedValue) !== JSON.stringify(initialValue)) {
             setStoredValue(initialValue);
          }
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, hasMounted]); // initialValue removed, should only be used on first mount effectively

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (!hasMounted) {
        // For server-side or pre-hydration, just update React state without localStorage interaction
        const newValue = value instanceof Function ? value(storedValue) : value;
        setStoredValue(newValue); 
        return;
      }
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, hasMounted]
  );

  // Return initialValue on server/pre-hydration, storedValue after hydration
  const displayValue = hasMounted ? storedValue : initialValue;

  return [displayValue, setValue];
}

export default useLocalStorage;
