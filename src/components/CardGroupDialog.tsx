"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardGroup } from '@/hooks/useCardGroups';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LinkItem } from '@/types/kanban';

interface CardGroupDialogProps {
    selectedCards: LinkItem[];
    onSaveGroup: (name: string) => void;
    groups: CardGroup[];
    onDeleteGroup: (groupId: string) => void;
    onOpenGroup: (groupId: string) => void;
    activeTab: string;
}

export function CardGroupDialog({
    selectedCards,
    onSaveGroup,
    groups,
    onDeleteGroup,
    onOpenGroup,
    activeTab
}: CardGroupDialogProps) {
    const [newGroupName, setNewGroupName] = useState('');
    const [dialogMode, setDialogMode] = useState<'save' | 'view'>('save');
    const { toast } = useToast(); const handleSaveGroup = () => {
        if (!newGroupName.trim()) {
            toast({
                title: "Group name required",
                description: "Please enter a name for your card group.",
                variant: "destructive",
            });
            return;
        }

        onSaveGroup(newGroupName);
        setNewGroupName('');
        toast({
            title: "Group saved",
            description: `Group "${newGroupName}" has been saved with ${selectedCards.length} cards.`
        });
    };

    const filteredGroups = groups.filter(group => group.dateString === activeTab);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="flex gap-1.5 items-center">
                    {selectedCards.length > 0 ? (
                        <>
                            <Save className="h-4 w-4" />
                            <span>Save as Group ({selectedCards.length})</span>
                        </>
                    ) : (
                        <>
                            <FolderOpen className="h-4 w-4" />
                            <span>My Groups</span>
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {selectedCards.length > 0 ? "Save Card Group" : "Saved Card Groups"}
                    </DialogTitle>
                </DialogHeader>

                {selectedCards.length > 0 ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Group Name</Label>
                            <Input
                                id="group-name"
                                placeholder="Enter a name for this group"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {selectedCards.length} cards selected in this group
                        </div>
                        <Button
                            onClick={handleSaveGroup}
                            className="w-full"
                            disabled={selectedCards.length === 0}
                        >
                            Save Group
                        </Button>
                    </div>
                ) : (
                    <div className="py-4">
                        <ScrollArea className="h-72 pr-4">
                            {filteredGroups.length === 0 ? (
                                <div className="text-center p-4 text-muted-foreground">
                                    No saved groups for this tab. Select cards and save a group first.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredGroups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="flex justify-between items-center p-3 rounded-md border hover:bg-accent"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium">{group.name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {group.cardIds.length} cards • {new Date(group.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onOpenGroup(group.id)}
                                                >
                                                    <FolderOpen className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onDeleteGroup(group.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
