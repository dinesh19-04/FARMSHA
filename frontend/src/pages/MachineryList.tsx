import { useState, useEffect } from "react";
import { MachineryCard } from "@/components/MachineryCard";
import { BookingModal } from "@/components/BookingModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch machinery data from API
  useEffect(() => {
    fetchMachinery();
  }, [searchQuery, selectedType]);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('query', searchQuery);
      if (selectedType !== 'all') queryParams.append('type', selectedType);
      queryParams.append('available', 'true'); // Only show available machinery
      
      const response = await fetch(`http://localhost:8000/api/search/machinery?${queryParams}`);
      const data: SearchResponse = await response.json();
      setMachinery(data.machinery);
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
          </div>
        </div>
        
        {/* Results */}
        <div className="mb-4 text-muted-foreground">
          {loading ? "Loading..." : `Showing ${machinery.length} results`}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machinery.map((machine) => (
              <MachineryCard
                key={machine.id}
                id={machine.id}
                name={machine.name}
                type={machine.category}
                rate={machine.rate}
                location={`${machine.location.village}, ${machine.location.taluk}, ${machine.location.district}, ${machine.location.state}`}
                available={machine.available}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
        
        {machinery.length === 0 && !loading && (
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