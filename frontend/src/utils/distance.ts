// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Convert address to approximate coordinates (for demo purposes)
// In production, you'd use a geocoding service like Google Maps API
export const getCoordinatesFromLocation = (location: {
  state: string;
  district: string;
  village: string;
  pincode: string;
}): { lat: number; lng: number } => {
  // This is a simplified mapping for demo purposes
  // In production, use proper geocoding services
  const stateCoordinates: Record<string, { lat: number; lng: number }> = {
    'Punjab': { lat: 31.1471, lng: 75.3412 },
    'Haryana': { lat: 29.0588, lng: 76.0856 },
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
    'Rajasthan': { lat: 27.0238, lng: 74.2179 },
    'Maharashtra': { lat: 19.7515, lng: 75.7139 },
    'Karnataka': { lat: 15.3173, lng: 75.7139 },
    'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
    'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  };

  const baseCoords = stateCoordinates[location.state] || { lat: 20.5937, lng: 78.9629 }; // Default to India center
  
  // Add some random offset based on district/village for demo
  const offset = {
    lat: (Math.random() - 0.5) * 2, // ±1 degree
    lng: (Math.random() - 0.5) * 2, // ±1 degree
  };
  
  return {
    lat: baseCoords.lat + offset.lat,
    lng: baseCoords.lng + offset.lng,
  };
};
