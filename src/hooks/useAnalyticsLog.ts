
"use client";

import type { AnalyticsEvent, AnalyticsEventType } from '@/types/analytics';
import { useState, useEffect, useCallback }
from 'react';

const ANALYTICS_LOG_KEY = 'todlex-analytics-log';
const MAX_LOG_ENTRIES = 100; // Keep a reasonable limit for localStorage

function useAnalyticsLog() {
  const [log, setLog] = useState<AnalyticsEvent[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      try {
        const storedLog = window.localStorage.getItem(ANALYTICS_LOG_KEY);
        if (storedLog) {
          setLog(JSON.parse(storedLog));
        }
      } catch (error) {
        console.error("Error reading analytics log from localStorage:", error);
        setLog([]);
      }
    }
  }, [hasMounted]);

  const saveLog = useCallback((updatedLog: AnalyticsEvent[]) => {
    try {
      const logToStore = updatedLog.slice(-MAX_LOG_ENTRIES); // Keep only the last N entries
      window.localStorage.setItem(ANALYTICS_LOG_KEY, JSON.stringify(logToStore));
      setLog(logToStore);
    } catch (error) {
      console.error("Error saving analytics log to localStorage:", error);
    }
  }, []);

  const logEvent = useCallback((type: AnalyticsEventType, details: AnalyticsEvent['details']) => {
    if (!hasMounted) return; // Don't log before client is mounted

    const newEvent: AnalyticsEvent = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
      details,
    };
    // Use a functional update to ensure we're working with the latest state
    setLog(prevLog => {
      const updatedLog = [newEvent, ...prevLog];
      const logToStore = updatedLog.slice(-MAX_LOG_ENTRIES);
      try {
        window.localStorage.setItem(ANALYTICS_LOG_KEY, JSON.stringify(logToStore));
      } catch (error) {
        console.error("Error saving analytics log to localStorage during logEvent:", error);
      }
      return logToStore;
    });
  }, [hasMounted]);

  const clearLog = useCallback(() => {
    if (!hasMounted) return;
    logEvent('ANALYTICS_CLEARED', { message: 'Analytics log was cleared.' });
    // The above logEvent will save an empty array if max_log_entries is small,
    // or an array with just the clear event. So we need to explicitly clear after.
    saveLog([{
      id: crypto.randomUUID(),
      type: 'ANALYTICS_CLEARED',
      timestamp: new Date().toISOString(),
      details: { message: 'Analytics log was cleared by user.' },
    }]);
     // To immediately reflect the cleared state, we can also update the local state
    setLog([{
      id: crypto.randomUUID(),
      type: 'ANALYTICS_CLEARED',
      timestamp: new Date().toISOString(),
      details: { message: 'Analytics log was cleared by user.' },
    }]);


  }, [hasMounted, saveLog, logEvent]);

  const getEvents = useCallback(() => {
    return log;
  }, [log]);
  
  const displayLog = hasMounted ? log : [];

  return { logEvent, getEvents, clearLog, events: displayLog };
}

export default useAnalyticsLog;
