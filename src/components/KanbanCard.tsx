"use client";

import type { LinkItem } from '@/types/kanban';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Trash2, Edit3, ExternalLink, CalendarDays, ImageOff, Share2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  linkItem: LinkItem;
  onDelete: (linkId: string) => void;
  onEdit: (linkItem: LinkItem) => void;
  onUpdateDate: (linkId: string, date: Date | undefined) => void;
  onShare: (linkItem: LinkItem) => void;
  isBoardLocked: boolean;
  onDragStartCard: (event: React.DragEvent<HTMLDivElement>, linkId: string) => void;
  onDragEndCard: (event: React.DragEvent<HTMLDivElement>) => void;
  onDropOnCard: (event: React.DragEvent<HTMLDivElement>, targetLinkId: string) => void;
  isDragging: boolean; // True if any card is being dragged globally
  draggingCardId: string | null; // The ID of the card currently being dragged, or null
}

export function KanbanCard({
  linkItem,
  onDelete,
  onEdit,
  onUpdateDate,
  onShare,
  isBoardLocked,
  onDragStartCard,
  onDragEndCard,
  onDropOnCard,
  isDragging,
  draggingCardId
}: KanbanCardProps) {
  const [imageError, setImageError] = useState(false);
  const indianTimeZone = 'Asia/Kolkata';

  useEffect(() => {
    setImageError(false); // Reset error state if linkItem.ogImageUrl changes
  }, [linkItem.ogImageUrl]);

  const handleDateChange = (date: Date | undefined) => {
    onUpdateDate(linkItem.id, date);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isBoardLocked) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', linkItem.id);
      onDragStartCard(e, linkItem.id);
      // Add a class to the dragged element for visual feedback
      if (e.currentTarget) {
        e.currentTarget.classList.add('dragging');
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isBoardLocked) {
      e.preventDefault();
      const draggedLinkId = e.dataTransfer.getData('text/plain');
      if (draggedLinkId && draggedLinkId !== linkItem.id) { // Prevent dropping on self
        onDropOnCard(e, linkItem.id);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isBoardLocked) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      // Add visual feedback for the drop target
      if (e.currentTarget && linkItem.id !== draggingCardId) {
        e.currentTarget.classList.add('drop-target');
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Remove drop target styling
    if (e.currentTarget) {
      e.currentTarget.classList.remove('drop-target');
    }
  };

  const faviconUrl = linkItem.favicon || `https://www.google.com/s2/favicons?domain=${new URL(linkItem.url).hostname}&sz=32`;

  const formattedPasteTime = linkItem.createdAt
    ? formatInTimeZone(parseISO(linkItem.createdAt), indianTimeZone, 'hh:mm a')
    : '';

  const renderImagePlaceholder = () => (
    <div
      className="relative w-full aspect-[16/9] rounded-t-lg overflow-hidden bg-muted/30 flex items-center justify-center backdrop-blur-sm"
    >
      {linkItem.orderInTab && (
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full z-10 shadow-md">
          {linkItem.orderInTab}
        </div>
      )}
      <div className="text-center p-2">
        <ImageOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="font-geist-mono text-sm font-semibold text-muted-foreground" data-ai-hint="placeholder image">No Preview Available</p>
      </div>
    </div>
  );

  return (
    <Card
      draggable={!isBoardLocked}
      onDragStart={handleDragStart}
      onDragEnd={(e) => {
        if (e.currentTarget) {
          e.currentTarget.classList.remove('dragging');
        }
        onDragEndCard(e);
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'card-hover relative',
        {
          'dragging': isDragging && draggingCardId === linkItem.id,
          'drop-target': isDragging && draggingCardId !== linkItem.id
        }
      )}
    >
      <div className="relative w-full aspect-[16/9] rounded-t-lg overflow-hidden bg-muted">
        {linkItem.orderInTab && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full z-10 shadow-md">
            {linkItem.orderInTab}
          </div>
        )}
        {linkItem.ogImageUrl && !imageError ? (
          <Image
            src={linkItem.ogImageUrl}
            alt={`${linkItem.title} preview`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint="website preview"
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          renderImagePlaceholder()
        )}
      </div>
      <CardHeader className={`p-4 ${linkItem.ogImageUrl && !imageError ? 'pt-2' : 'pt-4'}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            <Image
              data-ai-hint="website logo"
              src={faviconUrl}
              alt="favicon"
              width={20}
              height={20}
              className="rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.srcset = "https://placehold.co/20x20.png"; // Fallback for favicon error
                target.src = "https://placehold.co/20x20.png";
                target.setAttribute('data-ai-hint', 'placeholder icon');
              }}
            />
            <CardTitle className="text-base font-semibold truncate" title={linkItem.title}>
              {linkItem.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground truncate pt-1" title={linkItem.url}>
          <a href={linkItem.url} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
            {linkItem.url} <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      {linkItem.description && (
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground break-words line-clamp-2">{linkItem.description}</p>
        </CardContent>
      )}
      <CardFooter className="p-4 pt-2 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <DatePicker
            date={linkItem.todoDate ? parseISO(linkItem.todoDate) : undefined}
            setDate={handleDateChange}
            buttonClassName="h-8 text-xs"
          />
          {linkItem.todoDate && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> Due: {format(parseISO(linkItem.todoDate), "MMM d")}
            </p>
          )}
          <span className="text-[0.7rem] text-muted-foreground whitespace-nowrap">{formattedPasteTime}</span>
        </div>

        <div className="flex gap-1 self-end">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onShare(linkItem)} aria-label="Share link">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(linkItem)} aria-label="Edit link">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(linkItem.id)} aria-label="Delete link">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
