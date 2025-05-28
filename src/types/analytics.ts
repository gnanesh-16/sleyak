
export type AnalyticsEventType = 
  | 'LINK_CREATED' 
  | 'LINK_DELETED' 
  | 'TAB_CREATED' 
  | 'TAB_DELETED'
  | 'ANALYTICS_CLEARED';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string; // ISO date string
  details: {
    title?: string; // For link/tab title
    relatedId?: string; // e.g., linkId or tab's dateString
    message?: string; // General message if needed
  };
}
