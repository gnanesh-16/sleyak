
export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  todoDate?: string; // ISO date string
  favicon?: string; // URL to favicon, optional
  ogImageUrl?: string; // URL for OpenGraph image, optional
  orderInTab?: number; // Sequential order of the link within its tab
}

export interface DateGroup {
  dateString: string; // YYYY-MM-DD format
  title: string;      // User-friendly title e.g., "Today", "October 26, 2023"
  items: LinkItem[];
}

export interface BoardData {
  dateGroups: DateGroup[];
}
