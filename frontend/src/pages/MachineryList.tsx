import { useState, useEffect } from "react";
import { MachineryCard } from "@/components/MachineryCard";
import { MachineryMap } from "@/components/MachineryMap";
import { BookingModal } from "@/components/BookingModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal, Loader2, Map, List, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance, getCoordinatesFromLocation } from "@/utils/distance";

interface Machinery {
  id: string;
  name: string;
  type: string;
  category: string;
  rate: number;
  available: boolean;
  owner: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  location: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    pincode: string;
  };
  coordinates?: { lat: number; lng: number };
  distance?: number;
  specifications: Record<string, any>;
  images: string[];
  description: string;
}

interface SearchResponse {
  machinery: Machinery[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    availableTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export default function MachineryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxDistance, setMaxDistance] = useState<string>("all");
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [filteredMachinery, setFilteredMachinery] = useState<Machinery[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const { toast } = useToast();
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();

  // Fetch machinery data from API
  useEffect(() => {
    fetchMachinery();
  }, [searchQuery, selectedType]);

  // Filter machinery based on distance and other criteria
  useEffect(() => {
    let filtered = [...machinery];

    // Add coordinates and calculate distances
    if (latitude && longitude) {
      filtered = filtered.map(machine => {
        const coords = getCoordinatesFromLocation(machine.location);
        const distance = calculateDistance(latitude, longitude, coords.lat, coords.lng);
        return {
          ...machine,
          coordinates: coords,
          distance
        };
      });

      // Filter by distance if specified
      if (maxDistance !== "all") {
        const maxDist = parseInt(maxDistance);
        filtered = filtered.filter(machine => machine.distance! <= maxDist);
      }

      // Sort by distance (closest first)
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else {
      // Add coordinates even without user location
      filtered = filtered.map(machine => ({
        ...machine,
        coordinates: getCoordinatesFromLocation(machine.location)
      }));
    }

    setFilteredMachinery(filtered);
  }, [machinery, latitude, longitude, maxDistance]);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('query', searchQuery);
      if (selectedType !== 'all') queryParams.append('type', selectedType);
      queryParams.append('available', 'true'); // Only show available machinery
      
      // For demo purposes, using mock data since API might not be available
      // Replace this with actual API call when backend is ready
      const mockMachinery: Machinery[] = [
        {
          id: "1",
          name: "John Deere 5075E",
          type: "tractor",
          category: "Tractor",
          rate: 500,
          available: true,
          owner: { id: "1", name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@example.com" },
          location: { state: "Punjab", district: "Amritsar", taluk: "Ajnala", village: "Bhikhiwind", pincode: "143109" },
          specifications: { "Engine Power": "75 HP", "Fuel Type": "Diesel" },
          images: [],
          description: "Well-maintained tractor suitable for all farming operations"
        },
        {
          id: "2",
          name: "Mahindra 575 DI",
          type: "tractor",
          category: "Tractor",
          rate: 450,
          available: true,
          owner: { id: "2", name: "Suresh Patel", phone: "+91 98765 43211", email: "suresh@example.com" },
          location: { state: "Punjab", district: "Ludhiana", taluk: "Samrala", village: "Doraha", pincode: "141421" },
          specifications: { "Engine Power": "75 HP", "Fuel Type": "Diesel" },
          images: [],
          description: "Reliable tractor with excellent fuel efficiency"
        },
        {
          id: "3",
          name: "Class Lexion 780",
          type: "harvester",
          category: "Harvester",
          rate: 1200,
          available: false,
          owner: { id: "3", name: "Priya Sharma", phone: "+91 98765 43212", email: "priya@example.com" },
          location: { state: "Haryana", district: "Karnal", taluk: "Assandh", village: "Nilokheri", pincode: "132117" },
          specifications: { "Cutting Width": "35 feet", "Tank Capacity": "10000 L" },
          images: [],
          description: "High-capacity combine harvester for large fields"
        },
        {
          id: "4",
          name: "New Holland TC5070",
          type: "tractor",
          category: "Tractor",
          rate: 480,
          available: true,
          owner: { id: "4", name: "Amit Singh", phone: "+91 98765 43213", email: "amit@example.com" },
          location: { state: "Punjab", district: "Jalandhar", taluk: "Phillaur", village: "Nakodar", pincode: "144040" },
          specifications: { "Engine Power": "70 HP", "Fuel Type": "Diesel" },
          images: [],
          description: "Modern tractor with advanced features"
        }
      ];

      // Apply filters to mock data
      let filtered = mockMachinery;
      if (searchQuery) {
        filtered = filtered.filter(machine => 
          machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          machine.location.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
          machine.location.district.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedType !== 'all') {
        filtered = filtered.filter(machine => machine.type === selectedType);
      }

      setMachinery(filtered);
    } catch (error) {
      console.error('Error fetching machinery:', error);
      toast({
        title: "Error",
        description: "Failed to load machinery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (id: string) => {
    const machine = machinery.find((m) => m.id === id);
    if (machine) {
      setSelectedMachinery(machine);
      setIsBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = (bookingDetails: any) => {
    console.log("Booking confirmed:", bookingDetails);
    toast({
      title: "Booking Requested!",
      description: `Your request for ${selectedMachinery?.name} has been sent to the owner.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Browse Machinery</h1>
        
        {/* Location Status */}
        {locationLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm text-blue-700">Getting your location...</span>
          </div>
        )}
        
        {locationError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <MapPin className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">{locationError}</span>
          </div>
        )}
        
        {latitude && longitude && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Navigation className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Location detected: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="mb-6">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "map")}>
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Map View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tractor">Tractor</SelectItem>
                  <SelectItem value="harvester">Harvester</SelectItem>
                  <SelectItem value="seeder">Seeder</SelectItem>
                  <SelectItem value="sprayer">Sprayer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {latitude && longitude && (
              <div className="w-full md:w-48">
                <Select value={maxDistance} onValueChange={setMaxDistance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="5">Within 5 km</SelectItem>
                    <SelectItem value="10">Within 10 km</SelectItem>
                    <SelectItem value="25">Within 25 km</SelectItem>
                    <SelectItem value="50">Within 50 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        <div className="mb-4 text-muted-foreground">
          {loading ? "Loading..." : `Showing ${filteredMachinery.length} results`}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div>
            {viewMode === "map" ? (
              <MachineryMap
                machinery={filteredMachinery}
                userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
                onMachinerySelect={handleBook}
                className="mb-6"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachinery.map((machine) => (
                  <MachineryCard
                    key={machine.id}
                    id={machine.id}
                    name={machine.name}
                    type={machine.category}
                    rate={machine.rate}
                    location={`${machine.location.village}, ${machine.location.taluk}, ${machine.location.district}, ${machine.location.state}`}
                    available={machine.available}
                    distance={machine.distance}
                    onBook={handleBook}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {filteredMachinery.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No machinery found matching your criteria</p>
          </div>
        )}
      </div>
      
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        machinery={selectedMachinery}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}