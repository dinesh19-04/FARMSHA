import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tractor } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MachineryMapProps {
  machinery: Array<{
    id: string;
    name: string;
    type: string;
    category: string;
    rate: number;
    available: boolean;
    coordinates?: { lat: number; lng: number };
    distance?: number;
    location: {
      village: string;
      district: string;
      state: string;
    };
  }>;
  userLocation?: { lat: number; lng: number } | null;
  onMachinerySelect: (id: string) => void;
  className?: string;
}

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const tractorIcon = createCustomIcon('#10b981'); // Green for available
const unavailableIcon = createCustomIcon('#ef4444'); // Red for unavailable
const userIcon = createCustomIcon('#3b82f6'); // Blue for user location

// Component to update map view when user location changes
const MapUpdater = ({ userLocation }: { userLocation?: { lat: number; lng: number } | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 10);
    }
  }, [userLocation, map]);
  
  return null;
};

export const MachineryMap = ({ 
  machinery, 
  userLocation, 
  onMachinerySelect, 
  className = "" 
}: MachineryMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter;

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={userLocation ? 10 : 6}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater userLocation={userLocation} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className="text-center">
                <MapPin className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                <p className="font-semibold">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Machinery markers */}
        {machinery.filter(machine => machine.coordinates).map((machine) => (
          <Marker
            key={machine.id}
            position={[machine.coordinates!.lat, machine.coordinates!.lng]}
            icon={machine.available ? tractorIcon : unavailableIcon}
          >
            <Popup>
              <Card className="w-64 border-0 shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <Tractor className="h-4 w-4 mt-1 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{machine.name}</h4>
                      <p className="text-xs text-muted-foreground">{machine.category}</p>
                    </div>
                    <Badge 
                      variant={machine.available ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {machine.available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-muted-foreground">
                      📍 {machine.location.village}, {machine.location.district}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      ₹{machine.rate}/hour
                    </p>
                    {machine.distance && (
                      <p className="text-xs text-muted-foreground">
                        📏 {machine.distance} km away
                      </p>
                    )}
                  </div>
                  
                  {machine.available && (
                    <Button 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => onMachinerySelect(machine.id)}
                    >
                      Book Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
