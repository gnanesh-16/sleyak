
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
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // No longer needed for this simplified modal
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2 } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkUrl: string;
  linkTitle?: string;
}

export function ShareLinkModal({ isOpen, onClose, linkUrl, linkTitle }: ShareLinkModalProps) {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast({
        title: "Link Copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to Copy",
        description: "Could not copy the link. Please try again manually.",
        variant: "destructive",
      });
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary"/> Share Link
          </DialogTitle>
          {linkTitle && <DialogDescription>Share "{linkTitle}"</DialogDescription>}
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              id="link"
              value={linkUrl}
              readOnly
              className="flex-1"
            />
            <Button type="button" size="icon" onClick={handleCopyLink} aria-label="Copy link">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Footer is removed as per request, close button will be the 'x' in the corner or Esc key */}
        {/* <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
