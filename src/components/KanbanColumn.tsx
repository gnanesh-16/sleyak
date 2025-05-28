"use client";

import type { LinkItem } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';

interface DateLinksListProps {
  items: LinkItem[];
  onDeleteLink: (linkId: string) => void;
  onEditLink: (linkItem: LinkItem) => void;
  onUpdateLinkDate: (linkId: string, date: Date | undefined) => void;
  onShareLink: (linkItem: LinkItem) => void;
  isCurrentTab: boolean;
  isDragging: boolean;
  draggingCardId: string | null;
  onSwapItems: (sourceId: string, targetId: string) => void;
}

export function DateLinksList({
  items,
  onDeleteLink,
  onEditLink,
  onUpdateLinkDate,
  onShareLink,
  isCurrentTab,
  isDragging,
  draggingCardId,
  onSwapItems
}: DateLinksListProps) {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, linkId: string) => {
    event.dataTransfer.setData('text/plain', linkId);
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDropOnCard = (event: React.DragEvent<HTMLDivElement>, targetLinkId: string) => {
    event.preventDefault();
    const sourceLinkId = event.dataTransfer.getData('text/plain');
    if (sourceLinkId !== targetLinkId && onSwapItems) {
      onSwapItems(sourceLinkId, targetLinkId);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
        No links for this date.
      </div>
    );
  }

  return (
    <div className="p-1 md:p-2 lg:p-4 grid grid-cols-1 gap-4">
      {items.map((linkItem) => (
        <KanbanCard
          key={linkItem.id}
          linkItem={linkItem}
          onDelete={onDeleteLink}
          onEdit={onEditLink}
          onShare={onShareLink}
          onUpdateDate={(linkId, date) => {
            // Only allow date updates if it's the current tab or if the date is being removed
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (!date || isCurrentTab || date >= today) {
              onUpdateLinkDate(linkId, date);
            }
          }}
          isBoardLocked={!isCurrentTab} // Lock cards in non-active tabs
          onDragStartCard={(e, id) => onSwapItems(id, id)} // Initialize the drag
          onDragEndCard={handleDragEnd}
          onDropOnCard={(e, targetId) => targetId !== linkItem.id && onSwapItems(linkItem.id, targetId)}
          isDragging={isDragging}
          draggingCardId={draggingCardId}
        />
      ))}
    </div>
  );
}
