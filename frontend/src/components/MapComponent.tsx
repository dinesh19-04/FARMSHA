import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    lat: number;
    lng: number;
}

interface MapComponentProps {
    center: Location;
    zoom?: number;
    markers?: Array<{
        id: string;
        position: Location;
        title: string;
        description?: string;
        onClick?: () => void;
    }>;
    onLocationSelect?: (lat: number, lng: number) => void;
    className?: string;
}

// Component to update map center when props change
const MapUpdater: React.FC<{ center: Location }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], map.getZoom());
    }, [center, map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
    center,
    zoom = 13,
    markers = [],
    onLocationSelect,
    className = "h-[400px] w-full rounded-lg z-0"
}) => {
    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={zoom}
            scrollWheelZoom={false}
            className={className}
            style={{ zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />

            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[marker.position.lat, marker.position.lng]}
                    eventHandlers={{
                        click: () => marker.onClick && marker.onClick(),
                    }}
                >
                    <Popup>
                        <div className="font-semibold">{marker.title}</div>
                        {marker.description && <div className="text-sm">{marker.description}</div>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
