
import type { LinkItem } from './kanban';

export interface TrashedLinkItem extends LinkItem {
  deletedAt: string; // ISO date string of when it was soft-deleted
  originalDateGroup: string; // The YYYY-MM-DD string of the tab it was in
  originalTitle: string; // Title of the original tab
}

export interface HistoryData {
  trashedLinks: TrashedLinkItem[];
}
