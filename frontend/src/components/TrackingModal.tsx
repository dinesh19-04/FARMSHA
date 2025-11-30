import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MapComponent from './MapComponent';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';

interface TrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ isOpen, onClose, booking }) => {
    // Simulate movement from a start point to end point
    // For demo, we'll just move the marker slightly around a center point
    const startLat = 20.5937;
    const startLng = 78.9629;

    const [position, setPosition] = useState({ lat: startLat, lng: startLng });
    const [status, setStatus] = useState('On the way');
    const [eta, setEta] = useState(15);

    useEffect(() => {
        if (!isOpen) return;

        // Reset position when opened
        setPosition({ lat: startLat, lng: startLng });
        setStatus('On the way');
        setEta(15);

        // Simulate movement
        const interval = setInterval(() => {
            setPosition(prev => ({
                lat: prev.lat + 0.0001,
                lng: prev.lng + 0.0001
            }));

            setEta(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    useEffect(() => {
        if (eta === 0) {
            setStatus('Arrived at location');
        }
    }, [eta]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Live Tracking</DialogTitle>
                    <DialogDescription>
                        Tracking {booking?.machinery?.name} ({booking?.machinery?.category})
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Status Bar */}
                    <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-green-800">{status}</p>
                            <p className="text-sm text-green-600">
                                {eta > 0 ? `Arriving in ${eta} mins` : 'Machinery has arrived'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Driver</p>
                            <p className="font-semibold">{booking?.owner?.fullName}</p>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="h-[300px] rounded-lg overflow-hidden border">
                        <MapComponent
                            center={position}
                            zoom={15}
                            markers={[{
                                id: 'tracking-marker',
                                position: position,
                                title: 'Current Location',
                                description: status
                            }]}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button className="flex-1" variant="outline">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Owner
                        </Button>
                        <Button className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TrackingModal;
