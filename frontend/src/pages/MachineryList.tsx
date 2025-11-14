import { useState, useEffect, useMemo } from "react";
import { MachineryCard } from "@/components/MachineryCard";
import { MachineryMap } from "@/components/MachineryMap";
import { BookingModal } from "@/components/BookingModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal, Loader2, Map as MapIcon, List, MapPin, Navigation, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/utils/distance";
import { useMachinery } from "@/context/MachineryContext";
import { addSampleMachine, addMultipleSampleMachines } from "@/utils/addSampleMachine";

interface SearchFilters {
  query: string;
  type: string;
  maxDistance: string;
}

interface Machinery {
  id: string;
  name: string;
  type: string;
  rate: number;
  available: boolean;
  description?: string;
  location: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  owner: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  specifications: Record<string, string>;
  images: string[];
  distance?: number;
}

export default function MachineryList() {
  const { machinery: allMachinery } = useMachinery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxDistance, setMaxDistance] = useState<string>("all");
  const [selectedMachinery, setSelectedMachinery] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filteredMachinery, setFilteredMachinery] = useState(allMachinery);
  const [loading, setLoading] = useState(false);
  const [isAddingMachines, setIsAddingMachines] = useState(false);
  
  const { toast } = useToast();
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();
  
  // Update filtered machinery when filters or data changes
  useEffect(() => {
    setLoading(true);
    try {
      let filtered = [...allMachinery];

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(machine => 
          machine.name.toLowerCase().includes(query) ||
          (machine.description?.toLowerCase().includes(query) ?? false) ||
          (machine.location?.village?.toLowerCase().includes(query) ?? false) ||
          (machine.location?.district?.toLowerCase().includes(query) ?? false)
        );
      }

      // Filter by type
      if (selectedType !== 'all') {
        filtered = filtered.filter(machine => machine.type === selectedType);
      }

      // Add coordinates and calculate distances if location is available
      if (latitude && longitude) {
        filtered = filtered.map(machine => {
          const coords = machine.location?.coordinates || { lat: 0, lng: 0 };
          const distance = calculateDistance(
            latitude, 
            longitude, 
            coords.lat, 
            coords.lng
          );
          return {
            ...machine,
            distance
          };
        });

        // Filter by distance if specified
        if (maxDistance !== "all") {
          const maxDist = parseInt(maxDistance);
          filtered = filtered.filter(machine => 
            machine.distance !== undefined && machine.distance <= maxDist
          );
        }

        // Sort by distance (closest first)
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      setFilteredMachinery(filtered);
    } catch (error) {
      console.error('Error filtering machinery:', error);
      toast({
        title: "Error",
        description: "Failed to filter machinery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [allMachinery, searchQuery, selectedType, maxDistance, latitude, longitude, toast]);

  const handleBook = (id: string) => {
    const machine = allMachinery.find((m: any) => m.id === id);
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

        {/* Action buttons */}
        <div className="flex justify-between mb-4">
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSampleMachine()}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Sample Machine
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="py-1">
                <button
                  onClick={async () => {
                    setIsAddingMachines(true);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const machines = addMultipleSampleMachines(5);
                    setIsAddingMachines(false);
                    toast({
                      title: "Machines Added",
                      description: `Successfully added ${machines.length} sample machines.`,
                    });
                  }}
                  disabled={isAddingMachines}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  {isAddingMachines ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add 5 Random Machines
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            className="flex items-center gap-2"
          >
            {viewMode === "list" ? (
              <>
                <MapIcon className="h-4 w-4 mr-2" />
                Show Map
              </>
            ) : (
              <>
                <List className="h-4 w-4 mr-2" />
                Show List
              </>
            )}
          </Button>
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
              <div className="h-[500px] rounded-lg overflow-hidden border flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Map View</h3>
                  <p className="text-gray-500 mt-2">Map integration coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {filteredMachinery.length} machines available in this area
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachinery.map((machine) => (
                  <MachineryCard
                    key={machine.id}
                    id={machine.id}
                    name={machine.name}
                    type={machine.type}
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