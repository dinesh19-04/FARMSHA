import { useState, useEffect } from "react";
import { MachineryCard } from "@/components/MachineryCard";
import { BookingModal } from "@/components/BookingModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Filter,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationOptions {
  states: string[];
  districts: string[];
  taluks: string[];
  villages: string[];
}

interface MachineryType {
  type: string;
  count: number;
  displayName: string;
}

interface SearchFilters {
  query: string;
  type: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  available: string;
  minRate: number;
  maxRate: number;
  sortBy: string;
  sortOrder: string;
}

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

export default function AdvancedSearch() {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [locationOptions, setLocationOptions] = useState<LocationOptions>({
    states: [],
    districts: [],
    taluks: [],
    villages: []
  });
  const [machineryTypes, setMachineryTypes] = useState<MachineryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    type: "",
    state: "",
    district: "",
    taluk: "",
    village: "",
    available: "",
    minRate: 0,
    maxRate: 2000,
    sortBy: "name",
    sortOrder: "asc"
  });

  // Fetch initial data
  useEffect(() => {
    fetchLocationOptions();
    fetchMachineryTypes();
    performSearch(); // Initial search
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (filters.state) {
      fetchDistrictsByState(filters.state);
      setFilters(prev => ({ ...prev, district: "", taluk: "", village: "" }));
    }
  }, [filters.state]);

  // Fetch taluks when district changes
  useEffect(() => {
    if (filters.state && filters.district) {
      fetchTaluksByDistrict(filters.state, filters.district);
      setFilters(prev => ({ ...prev, taluk: "", village: "" }));
    }
  }, [filters.district]);

  // Fetch villages when taluk changes
  useEffect(() => {
    if (filters.state && filters.district && filters.taluk) {
      fetchVillagesByTaluk(filters.state, filters.district, filters.taluk);
      setFilters(prev => ({ ...prev, village: "" }));
    }
  }, [filters.taluk]);

  const fetchLocationOptions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/search/locations');
      const data = await response.json();
      setLocationOptions(data);
    } catch (error) {
      console.error('Error fetching location options:', error);
    }
  };

  const fetchDistrictsByState = async (state: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/search/locations/${encodeURIComponent(state)}/districts`);
      const data = await response.json();
      setLocationOptions(prev => ({ ...prev, districts: data.districts }));
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchTaluksByDistrict = async (state: string, district: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/search/locations/${encodeURIComponent(state)}/${encodeURIComponent(district)}/taluks`);
      const data = await response.json();
      setLocationOptions(prev => ({ ...prev, taluks: data.taluks }));
    } catch (error) {
      console.error('Error fetching taluks:', error);
    }
  };

  const fetchVillagesByTaluk = async (state: string, district: string, taluk: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/search/locations/${encodeURIComponent(state)}/${encodeURIComponent(district)}/${encodeURIComponent(taluk)}/villages`);
      const data = await response.json();
      setLocationOptions(prev => ({ ...prev, villages: data.villages }));
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const fetchMachineryTypes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/search/types');
      const data = await response.json();
      setMachineryTypes(data.types);
    } catch (error) {
      console.error('Error fetching machinery types:', error);
    }
  };

  const performSearch = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "" && value !== 0)
        )
      });

      const response = await fetch(`http://localhost:8000/api/search/machinery?${queryParams}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search machinery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      type: "",
      state: "",
      district: "",
      taluk: "",
      village: "",
      available: "",
      minRate: 0,
      maxRate: 2000,
      sortBy: "name",
      sortOrder: "asc"
    });
  };

  const handleBook = (id: string) => {
    const machinery = searchResults?.machinery.find((m) => m.id === id);
    if (machinery) {
      setSelectedMachinery(machinery);
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Farm Machinery</h1>
          <p className="text-muted-foreground">Search by location, type, and specifications</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search machinery, owner, or location..."
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => performSearch()} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Advanced Filters</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Filters */}
              <div>
                <Label className="text-base font-medium mb-3 block">Location</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={filters.state} onValueChange={(value) => handleFilterChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All States</SelectItem>
                        {locationOptions.states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Select 
                      value={filters.district} 
                      onValueChange={(value) => handleFilterChange('district', value)}
                      disabled={!filters.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Districts</SelectItem>
                        {locationOptions.districts.map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taluk">Taluk</Label>
                    <Select 
                      value={filters.taluk} 
                      onValueChange={(value) => handleFilterChange('taluk', value)}
                      disabled={!filters.district}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Taluk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Taluks</SelectItem>
                        {locationOptions.taluks.map((taluk) => (
                          <SelectItem key={taluk} value={taluk}>{taluk}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="village">Village/Town</Label>
                    <Select 
                      value={filters.village} 
                      onValueChange={(value) => handleFilterChange('village', value)}
                      disabled={!filters.taluk}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Village/Town" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Villages</SelectItem>
                        {locationOptions.villages.map((village) => (
                          <SelectItem key={village} value={village}>{village}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Machinery Type and Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Machinery Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {machineryTypes.map((type) => (
                      <Button
                        key={type.type}
                        variant={filters.type === type.type ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange('type', filters.type === type.type ? "" : type.type)}
                        className="justify-between"
                      >
                        <span>{type.displayName}</span>
                        <Badge variant="secondary">{type.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium mb-3 block">Availability & Sorting</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.available === "true"}
                        onCheckedChange={(checked) => handleFilterChange('available', checked ? "true" : "")}
                      />
                      <Label>Available only</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="rate">Rate</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Price Range: ₹{filters.minRate} - ₹{filters.maxRate} per day
                </Label>
                <div className="px-2">
                  <Slider
                    value={[filters.minRate, filters.maxRate]}
                    onValueChange={([min, max]) => {
                      handleFilterChange('minRate', min);
                      handleFilterChange('maxRate', max);
                    }}
                    max={2000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {searchResults && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-muted-foreground">
              Showing {searchResults.machinery.length} of {searchResults.pagination.totalResults} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSearch(searchResults.pagination.currentPage - 1)}
                disabled={!searchResults.pagination.hasPrev || loading}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {searchResults.pagination.currentPage} of {searchResults.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSearch(searchResults.pagination.currentPage + 1)}
                disabled={!searchResults.pagination.hasNext || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Machinery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults?.machinery.map((machine) => (
              <MachineryCard
                key={machine.id}
                id={machine.id}
                name={machine.name}
                type={machine.category}
                rate={machine.rate}
                location={`${machine.location.village}, ${machine.location.district}, ${machine.location.state}`}
                available={machine.available}
                onBook={handleBook}
              />
            ))}
          </div>
        )}

        {searchResults?.machinery.length === 0 && !loading && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">No machinery found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search filters</p>
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
