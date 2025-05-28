"use client";

import type { LinkItem } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';
import React from 'react';

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
  isGroupMode?: boolean;
  selectedCards?: LinkItem[];
  onToggleCardSelection?: (card: LinkItem) => void;
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
  onSwapItems,
  isGroupMode = false,
  selectedCards = [],
  onToggleCardSelection
}: DateLinksListProps) {

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-muted-foreground p-6">
        No links here yet. Paste a link (Ctrl+V or Cmd+V) to add it to this date!
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6"
      onDragOver={(e) => {
        if (isCurrentTab) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }
      }}
      onDrop={(e) => {
        if (isCurrentTab) {
          e.preventDefault();
          const draggedId = e.dataTransfer.getData('text/plain');
          if (draggedId) {
            // If dropped on the container itself, find the last card and use its ID
            const lastCard = items[items.length - 1];
            if (lastCard && draggedId !== lastCard.id) {
              onSwapItems(draggedId, lastCard.id);
            }
          }
        }
      }}
    >
      {items.map((linkItem) => (
        <KanbanCard
          key={linkItem.id}
          linkItem={linkItem}
          onDelete={onDeleteLink}
          onEdit={onEditLink}
          onUpdateDate={onUpdateLinkDate}
          onShare={onShareLink}
          isBoardLocked={!isCurrentTab}
          onDragStartCard={(e, id) => {
            if (isCurrentTab) {
              onSwapItems(id, id); // Initialize the drag
            }
          }}
          onDragEndCard={() => {
            // Nothing needed here, handled by useBoardState
          }}
          onDropOnCard={(e, targetId) => {
            if (isCurrentTab) {
              e.preventDefault();
              const draggedId = e.dataTransfer.getData('text/plain');
              if (draggedId && draggedId !== targetId) {
                onSwapItems(draggedId, targetId);
              }
            }
          }}
          isDragging={isDragging}
          draggingCardId={draggingCardId}
          isGroupMode={isGroupMode}
          isSelected={selectedCards.some(card => card.id === linkItem.id)}
          onToggleSelect={onToggleCardSelection}
        />
      ))}
    </div>
  );
}
