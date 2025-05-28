import { useState } from 'react';
import type { LinkItem } from '@/types/kanban';

export function useBoardState() {
    const [isDragging, setIsDragging] = useState(false);
    const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, linkId: string) => {
        setIsDragging(true);
        setDraggingCardId(linkId);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDraggingCardId(null);
    };

    const handleSwapItems = (items: LinkItem[], sourceId: string, targetId: string): LinkItem[] => {
        const updatedItems = [...items];
        const sourceIndex = updatedItems.findIndex(item => item.id === sourceId);
        const targetIndex = updatedItems.findIndex(item => item.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1) return items;

        // Store the orderInTab values
        const sourceOrder = updatedItems[sourceIndex].orderInTab;
        const targetOrder = updatedItems[targetIndex].orderInTab;

        // Swap the orderInTab values
        updatedItems[sourceIndex] = {
            ...updatedItems[sourceIndex],
            orderInTab: targetOrder
        };
        updatedItems[targetIndex] = {
            ...updatedItems[targetIndex],
            orderInTab: sourceOrder
        };

        // Swap the positions in the array
        [updatedItems[sourceIndex], updatedItems[targetIndex]] =
            [updatedItems[targetIndex], updatedItems[sourceIndex]];

        return updatedItems;
    };

    return {
        isDragging,
        draggingCardId,
        handleDragStart,
        handleDragEnd,
        handleSwapItems
    };
}
