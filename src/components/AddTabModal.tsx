
"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useState } from 'react';
import { startOfDay, isFuture } from 'date-fns'; // Removed useToast, not needed here
// Removed useToast import as it's not used

interface AddTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTab: (selectedDate: Date) => void;
}

export function AddTabModal({ isOpen, onClose, onAddTab }: AddTabModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  // const { toast } = useToast(); // toast is not used

  const handleAdd = () => {
    if (selectedDate) {
      // Future date check is primarily handled in Dashboard.tsx or DatePicker,
      // but can be a light check here too if desired.
      // For now, we allow selection and let Dashboard handle logic/toast for future dates.
      onAddTab(selectedDate);
      onClose(); 
    }
  };

  // The DatePicker component itself can handle disabling future dates
  // So a specific isFutureDate function here might be redundant if DatePicker is configured
  // const isFutureDateDisabled = (date: Date) => {
  //   return startOfDay(date) > startOfDay(new Date());
  // };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Date Tab</DialogTitle>
          <DialogDescription>
            Select a date to create a new tab for organizing links.
            {/* Future dates will be styled differently on the board. */}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tab-date" className="text-right">
              Tab Date
            </Label>
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              buttonClassName="col-span-3"
              // disabled={(date) => isFutureDateDisabled(date)} // Example of disabling future dates in picker
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleAdd} disabled={!selectedDate}>Create Tab</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
