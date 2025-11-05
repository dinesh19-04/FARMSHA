import { useState } from "react";
import { MachineryCard } from "@/components/MachineryCard";
import { BookingModal } from "@/components/BookingModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Dummy data
const dummyMachinery = [
  {
    id: "1",
    name: "John Deere 5075E",
    type: "Tractor",
    rate: 500,
    location: "Amritsar, Punjab",
    available: true,
    ownerName: "Rajesh Kumar",
  },
  {
    id: "2",
    name: "New Holland TC5070",
    type: "Tractor",
    rate: 450,
    location: "Ludhiana, Punjab",
    available: true,
    ownerName: "Priya Sharma",
  },
  {
    id: "3",
    name: "Mahindra Arjun 605 DI",
    type: "Tractor",
    rate: 400,
    location: "Jalandhar, Punjab",
    available: false,
    ownerName: "Amit Singh",
  },
  {
    id: "4",
    name: "Class Lexion 780",
    type: "Harvester",
    rate: 1200,
    location: "Patiala, Punjab",
    available: true,
    ownerName: "Suresh Patel",
  },
  {
    id: "5",
    name: "Case IH 2366",
    type: "Harvester",
    rate: 1100,
    location: "Bathinda, Punjab",
    available: true,
    ownerName: "Kavita Reddy",
  },
  {
    id: "6",
    name: "Fieldking Super Seeder",
    type: "Seeder",
    rate: 350,
    location: "Moga, Punjab",
    available: true,
    ownerName: "Vikram Yadav",
  },
];

export default function MachineryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMachinery, setSelectedMachinery] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredMachinery = dummyMachinery.filter((machine) => {
    const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         machine.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || machine.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleBook = (id: string) => {
    const machinery = dummyMachinery.find((m) => m.id === id);
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
          Showing {filteredMachinery.length} results
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachinery.map((machine) => (
            <MachineryCard
              key={machine.id}
              id={machine.id}
              name={machine.name}
              type={machine.type}
              rate={machine.rate}
              location={machine.location}
              available={machine.available}
              onBook={handleBook}
            />
          ))}
        </div>
        
        {filteredMachinery.length === 0 && (
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