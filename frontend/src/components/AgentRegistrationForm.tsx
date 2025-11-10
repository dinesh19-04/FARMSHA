import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

interface AgentRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
  experience: string;
  specialization: string[];
  licenseNumber?: string;
}

interface AgentRegistrationFormProps {
  onSubmit: (data: AgentRegistrationData) => Promise<void>;
  isLoading: boolean;
}

const SPECIALIZATION_OPTIONS = [
  "Tractor Operations",
  "Harvester Operations", 
  "Irrigation Systems",
  "Soil Management",
  "Crop Planning",
  "Pest Control",
  "Fertilizer Management",
  "Equipment Maintenance",
  "Agricultural Consulting",
  "Farm Management"
];

export const AgentRegistrationForm = ({ onSubmit, isLoading }: AgentRegistrationFormProps) => {
  const [formData, setFormData] = useState<AgentRegistrationData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: {
      state: "",
      district: "",
      village: "",
      pincode: ""
    },
    experience: "",
    specialization: [],
    licenseNumber: ""
  });

  const [newSpecialization, setNewSpecialization] = useState("");

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

  const addSpecialization = (spec: string) => {
    if (spec && !formData.specialization.includes(spec)) {
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, spec]
      }));
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter(s => s !== spec)
    }));
  };

  const addCustomSpecialization = () => {
    if (newSpecialization.trim()) {
      addSpecialization(newSpecialization.trim());
      setNewSpecialization("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Agent Registration</CardTitle>
          <CardDescription>
            Join as an agricultural agent and help connect farmers with machinery owners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.location.state}
                    onChange={(e) => handleInputChange("location.state", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.location.district}
                    onChange={(e) => handleInputChange("location.district", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">Village/City *</Label>
                  <Input
                    id="village"
                    value={formData.location.village}
                    onChange={(e) => handleInputChange("location.village", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.location.pincode}
                    onChange={(e) => handleInputChange("location.pincode", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="e.g., 5 years"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    placeholder="Agricultural agent license number"
                  />
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Areas of Specialization *</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <Button
                      key={spec}
                      type="button"
                      variant={formData.specialization.includes(spec) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (formData.specialization.includes(spec)) {
                          removeSpecialization(spec);
                        } else {
                          addSpecialization(spec);
                        }
                      }}
                      className="justify-start text-xs h-auto py-2"
                    >
                      {spec}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom specialization"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSpecialization())}
                  />
                  <Button type="button" onClick={addCustomSpecialization} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.specialization.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Specializations:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary" className="gap-1">
                          {spec}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => removeSpecialization(spec)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                disabled={isLoading || formData.specialization.length === 0}
              >
                {isLoading ? 'Creating Account...' : 'Register as Agent'}
              </Button>
              
              <div className="text-center">
                <Link to="/auth" className="text-sm text-primary hover:underline">
                  ← Back to Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
