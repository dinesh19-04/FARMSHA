import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, MapPin, Tractor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  state: string;
  district: string;
  taluk: string;
  village: string;
  pincode: string;
}

interface MachineryItem {
  id: string;
  name: string;
  type: string;
  category: string;
  rate: number;
  specifications: {
    [key: string]: string;
  };
  description: string;
}

interface OwnerRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: LocationData;
  machinery: MachineryItem[];
}

const machineryTypes = [
  { value: "tractor", label: "Tractor" },
  { value: "harvester", label: "Harvester" },
  { value: "seeder", label: "Seeder" },
  { value: "ploughing_machine", label: "Ploughing Machine" },
  { value: "load_vehicle", label: "Load Vehicle" },
  { value: "sprayer", label: "Sprayer" },
  { value: "cultivator", label: "Cultivator" },
  { value: "thresher", label: "Thresher" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface OwnerRegistrationFormProps {
  onSubmit: (data: OwnerRegistrationData) => Promise<void>;
  isLoading: boolean;
}

export const OwnerRegistrationForm = ({ onSubmit, isLoading }: OwnerRegistrationFormProps) => {
  const [formData, setFormData] = useState<OwnerRegistrationData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: {
      state: "",
      district: "",
      taluk: "",
      village: "",
      pincode: ""
    },
    machinery: []
  });

  const [currentMachine, setCurrentMachine] = useState<Partial<MachineryItem>>({
    name: "",
    type: "",
    category: "",
    rate: 0,
    specifications: {},
    description: ""
  });

  const [currentSpec, setCurrentSpec] = useState({ key: "", value: "" });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("location.")) {
      const locationField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [locationField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleMachineInputChange = (field: string, value: string | number) => {
    setCurrentMachine(prev => ({ ...prev, [field]: value }));
  };

  const addSpecification = () => {
    if (currentSpec.key && currentSpec.value) {
      setCurrentMachine(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [currentSpec.key]: currentSpec.value
        }
      }));
      setCurrentSpec({ key: "", value: "" });
    }
  };

  const removeSpecification = (key: string) => {
    setCurrentMachine(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const addMachine = () => {
    if (currentMachine.name && currentMachine.type && currentMachine.rate) {
      const newMachine: MachineryItem = {
        id: Date.now().toString(),
        name: currentMachine.name || "",
        type: currentMachine.type || "",
        category: currentMachine.category || currentMachine.type || "",
        rate: currentMachine.rate || 0,
        specifications: currentMachine.specifications || {},
        description: currentMachine.description || ""
      };

      setFormData(prev => ({
        ...prev,
        machinery: [...prev.machinery, newMachine]
      }));

      setCurrentMachine({
        name: "",
        type: "",
        category: "",
        rate: 0,
        specifications: {},
        description: ""
      });

      toast({
        title: "Machine Added",
        description: `${newMachine.name} has been added to your inventory.`
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in machine name, type, and rate.",
        variant: "destructive"
      });
    }
  };

  const removeMachine = (id: string) => {
    setFormData(prev => ({
      ...prev,
      machinery: prev.machinery.filter(m => m.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all personal details.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.location.state || !formData.location.district || !formData.location.taluk || !formData.location.village) {
      toast({
        title: "Missing Location",
        description: "Please provide complete location details including taluk.",
        variant: "destructive"
      });
      return;
    }

    if (formData.machinery.length === 0) {
      toast({
        title: "No Machinery",
        description: "Please add at least one machine to your inventory.",
        variant: "destructive"
      });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-6 w-6" />
            Machinery Owner Registration
          </CardTitle>
          <CardDescription>
            Join FarmShare as a machinery owner and start earning by renting out your equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.location.state} onValueChange={(value) => handleInputChange("location.state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.location.district}
                    onChange={(e) => handleInputChange("location.district", e.target.value)}
                    placeholder="Enter district name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="taluk">Taluk *</Label>
                  <Input
                    id="taluk"
                    value={formData.location.taluk}
                    onChange={(e) => handleInputChange("location.taluk", e.target.value)}
                    placeholder="Enter taluk name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="village">Village/Town *</Label>
                  <Input
                    id="village"
                    value={formData.location.village}
                    onChange={(e) => handleInputChange("location.village", e.target.value)}
                    placeholder="Enter village or town name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={formData.location.pincode}
                    onChange={(e) => handleInputChange("location.pincode", e.target.value)}
                    placeholder="Enter PIN code"
                  />
                </div>
              </div>
            </div>

            {/* Machinery Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Machinery Inventory</h3>
              
              {/* Current Machinery List */}
              {formData.machinery.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Your Machines:</h4>
                  <div className="grid gap-2">
                    {formData.machinery.map((machine) => (
                      <div key={machine.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{machine.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {machine.category} • ₹{machine.rate}/day
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMachine(machine.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Machine */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add New Machine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="machine-name">Machine Name</Label>
                      <Input
                        id="machine-name"
                        value={currentMachine.name || ""}
                        onChange={(e) => handleMachineInputChange("name", e.target.value)}
                        placeholder="e.g., John Deere 5075E"
                      />
                    </div>
                    <div>
                      <Label htmlFor="machine-type">Type</Label>
                      <Select 
                        value={currentMachine.type || ""} 
                        onValueChange={(value) => {
                          handleMachineInputChange("type", value);
                          handleMachineInputChange("category", machineryTypes.find(t => t.value === value)?.label || value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
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
                    <div>
                      <Label htmlFor="machine-rate">Rate (₹/day)</Label>
                      <Input
                        id="machine-rate"
                        type="number"
                        value={currentMachine.rate || ""}
                        onChange={(e) => handleMachineInputChange("rate", parseInt(e.target.value) || 0)}
                        placeholder="Enter daily rate"
                      />
                    </div>
                    <div>
                      <Label htmlFor="machine-description">Description</Label>
                      <Textarea
                        id="machine-description"
                        value={currentMachine.description || ""}
                        onChange={(e) => handleMachineInputChange("description", e.target.value)}
                        placeholder="Brief description of the machine"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <Label>Specifications</Label>
                    <div className="space-y-2">
                      {Object.entries(currentMachine.specifications || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {key}: {value}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSpecification(key)}
                              className="h-4 w-4 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Specification name"
                          value={currentSpec.key}
                          onChange={(e) => setCurrentSpec(prev => ({ ...prev, key: e.target.value }))}
                        />
                        <Input
                          placeholder="Value"
                          value={currentSpec.value}
                          onChange={(e) => setCurrentSpec(prev => ({ ...prev, value: e.target.value }))}
                        />
                        <Button type="button" onClick={addSpecification} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={addMachine} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Machine
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Register as Machinery Owner"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
