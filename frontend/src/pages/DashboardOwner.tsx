import { useState } from 'react';
import { useMachinery } from "@/context/MachineryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tractor, DollarSign, Clock, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Types
interface Location {
  state: string;
  district: string;
  taluk: string;
  village: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Machinery {
  id: string;
  name: string;
  type: string;
  rate: number;
  available: boolean;
  location: Location;
  description?: string;
  images?: string[];
  distance?: number; // Distance from user's location in km
}

// We'll use the context for state management instead of dummy data

const dummyRequests = [
  { id: "1", farmer: "Amit Kumar", machinery: "John Deere 5075E", startDate: "2025-11-01", duration: "8 hours", status: "pending" },
  { id: "2", farmer: "Priya Singh", machinery: "Class Lexion 780", startDate: "2025-11-05", duration: "6 hours", status: "pending" },
];

const earningsData = [
  { month: 'Jun', earnings: 15000 },
  { month: 'Jul', earnings: 22000 },
  { month: 'Aug', earnings: 18000 },
  { month: 'Sep', earnings: 28000 },
  { month: 'Oct', earnings: 32000 },
];

const machineryTypes = [
  { value: "Tractor", label: "Tractor" },
  { value: "Harvester", label: "Harvester" },
  { value: "Seeder", label: "Seeder" },
  { value: "Plough", label: "Plough" },
  { value: "Sprayer", label: "Sprayer" },
  { value: "Cultivator", label: "Cultivator" },
];

export default function DashboardOwner() {
  const { machinery: machines, addMachinery, deleteMachinery } = useMachinery();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMachine, setNewMachine] = useState<Omit<Machinery, 'id'>>({ 
    name: '', 
    type: 'Tractor', 
    rate: 0, 
    available: true,
    location: {
      state: '',
      district: '',
      taluk: '',
      village: '',
      pincode: ''
    },
    description: ''
  });

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newMachine.name || !newMachine.rate || !newMachine.location.state || 
        !newMachine.location.district || !newMachine.location.taluk || 
        !newMachine.location.village || !newMachine.location.pincode || !newMachine.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      addMachinery(newMachine);
      
      toast({
        title: "Success!",
        description: `${newMachine.name} has been added successfully and is now visible in Browse Machinery`,
      });
      
      // Reset form
      setNewMachine({ 
        name: '', 
        type: 'Tractor', 
        rate: 0, 
        available: true,
        location: {
          state: '',
          district: '',
          taluk: '',
          village: '',
          pincode: ''
        },
        description: ''
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding machinery:', error);
      toast({
        title: "Error",
        description: "Failed to add machinery. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLocationChange = (field: keyof Location, value: string) => {
    setNewMachine(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  // deleteMachine is now provided by the context
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your machinery and bookings</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Machinery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Machinery</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMachine} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Machine Name</Label>
                  <Input
                    id="name"
                    value={newMachine.name}
                    onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
                    placeholder="e.g., John Deere 5075E"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Machine Type</Label>
                  <Select
                    value={newMachine.type}
                    onValueChange={(value) => setNewMachine({...newMachine, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select machine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {machineryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate per hour (₹)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={newMachine.rate}
                    onChange={(e) => setNewMachine({...newMachine, rate: Number(e.target.value)})}
                    placeholder="e.g., 500"
                    min="0"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={newMachine.available}
                    onChange={(e) => setNewMachine({...newMachine, available: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="available" className="text-sm font-medium leading-none">
                    Available for rent
                  </Label>
                </div>
                {/* Location Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newMachine.location.state}
                      onChange={(e) => handleLocationChange('state', e.target.value)}
                      placeholder="e.g., Tamil Nadu"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={newMachine.location.district}
                      onChange={(e) => handleLocationChange('district', e.target.value)}
                      placeholder="e.g., Coimbatore"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taluk">Taluk</Label>
                    <Input
                      id="taluk"
                      value={newMachine.location.taluk}
                      onChange={(e) => handleLocationChange('taluk', e.target.value)}
                      placeholder="e.g., Coimbatore North"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Village/Town</Label>
                    <Input
                      id="village"
                      value={newMachine.location.village}
                      onChange={(e) => handleLocationChange('village', e.target.value)}
                      placeholder="e.g., Perur"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      type="number"
                      value={newMachine.location.pincode}
                      onChange={(e) => handleLocationChange('pincode', e.target.value)}
                      placeholder="e.g., 641010"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 pt-4">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={newMachine.description}
                    onChange={(e) => setNewMachine({...newMachine, description: e.target.value})}
                    placeholder="Add details about the machinery, features, condition, etc."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-2 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero">
                    Add Machine
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
              <Tractor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machines.length}</div>
              <p className="text-xs text-muted-foreground">{machines.filter(m => m.available).length} available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹32,000</div>
              <p className="text-xs text-muted-foreground">+14.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your monthly rental income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
            <CardDescription>Review and respond to rental requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyRequests.map((request) => (
                <div key={request.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{request.farmer}</h4>
                    <p className="text-sm text-muted-foreground mb-1">Machinery: {request.machinery}</p>
                    <p className="text-sm text-muted-foreground">
                      From {new Date(request.startDate).toLocaleDateString()} • {request.duration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button variant="hero" size="sm" className="gap-2">
                      <Check className="h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Machinery */}
        <Card>
          <CardHeader>
            <CardTitle>My Machinery</CardTitle>
            <CardDescription>Manage your equipment listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machines.map((machine) => (
                <div key={machine.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{machine.name}</h4>
                      {machine.available ? (
                        <Badge variant="outline" className="border-primary text-primary">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Booked</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{machine.type}</span>
                      <span>•</span>
                      <span>{machine.location.district}, {machine.location.state}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-semibold text-primary">₹{machine.rate}/hour</p>
                      {machine.distance && (
                        <p className="text-xs text-muted-foreground">
                          ~{machine.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => deleteMachinery(machine.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}