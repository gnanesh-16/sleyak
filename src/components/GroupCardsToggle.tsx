"use client";

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LayersIcon } from 'lucide-react';

interface GroupCardsToggleProps {
    isGroupMode: boolean;
    onToggleGroupMode: (value: boolean) => void;
}

export function GroupCardsToggle({ isGroupMode, onToggleGroupMode }: GroupCardsToggleProps) {
    return (
        <div className="flex items-center gap-2">
            <Switch
                id="group-cards"
                checked={isGroupMode}
                onCheckedChange={onToggleGroupMode}
            />
            <Label htmlFor="group-cards" className="flex items-center cursor-pointer">
                <LayersIcon className="h-4 w-4 mr-2" />
                Group Cards
            </Label>
        </div>
    );
}
