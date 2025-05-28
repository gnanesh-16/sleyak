
"use client";

import type { LinkItem } from '@/types/kanban';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';

interface LinkItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkItem: LinkItem | null;
  onSave: (updatedItem: LinkItem) => void;
}

export function LinkItemModal({ isOpen, onClose, linkItem, onSave }: LinkItemModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [todoDate, setTodoDate] = useState<Date | undefined>(undefined);
  const [groupingDate, setGroupingDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (linkItem) {
      setTitle(linkItem.title);
      setUrl(linkItem.url);
      setDescription(linkItem.description || '');
      setTodoDate(linkItem.todoDate ? parseISO(linkItem.todoDate) : undefined);
      setGroupingDate(linkItem.createdAt ? parseISO(linkItem.createdAt) : undefined);
    }
  }, [linkItem]);

  if (!linkItem) return null;

  const handleSave = () => {
    // Ensure groupingDate is set; if not, retain original createdAt to avoid errors.
    // However, the DatePicker should ideally always provide a date if interacted with.
    const finalGroupingDate = groupingDate || (linkItem.createdAt ? parseISO(linkItem.createdAt) : new Date());
    
    onSave({
      ...linkItem,
      title,
      url,
      description,
      createdAt: finalGroupingDate.toISOString(), // Update createdAt for grouping
      todoDate: todoDate?.toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the details for your link. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="groupingDate" className="text-right">
              Grouping Date
            </Label>
            <DatePicker
              date={groupingDate}
              setDate={setGroupingDate}
              buttonClassName="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="todoDate" className="text-right">
              To-Do Date
            </Label>
            <DatePicker
              date={todoDate}
              setDate={setTodoDate}
              buttonClassName="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
