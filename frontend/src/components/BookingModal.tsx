import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  machinery: {
    id: string;
    name: string;
    type: string;
    rate: number;
    ownerName: string;
  } | null;
  onConfirm: (bookingDetails: {
    machineId: string;
    startDate: string;
    endDate: string;
    duration: number;
  }) => void;
}

export const BookingModal = ({ isOpen, onClose, machinery, onConfirm }: BookingModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 8; // Assuming 8 hours per day
  };

  const handleConfirm = () => {
    if (machinery && startDate && endDate) {
      onConfirm({
        machineId: machinery.id,
        startDate,
        endDate,
        duration: calculateDuration(),
      });
      onClose();
      setStartDate("");
      setEndDate("");
    }
  };

  if (!machinery) return null;

  const duration = calculateDuration();
  const totalCost = duration * machinery.rate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {machinery.name}</DialogTitle>
          <DialogDescription>
            Fill in the booking details to reserve this machinery
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Type:</span> {machinery.type}
            </div>
            <div className="text-sm">
              <span className="font-medium">Owner:</span> {machinery.ownerName}
            </div>
            <div className="text-sm">
              <span className="font-medium">Rate:</span> ₹{machinery.rate}/hour
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          
          {duration > 0 && (
            <div className="p-4 bg-secondary/50 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span className="font-medium">{duration} hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span className="font-medium">₹{machinery.rate}/hour</span>
              </div>
              <div className="flex justify-between font-bold text-primary pt-2 border-t">
                <span>Total Cost:</span>
                <span>₹{totalCost}</span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="hero" 
            onClick={handleConfirm}
            disabled={!startDate || !endDate}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};