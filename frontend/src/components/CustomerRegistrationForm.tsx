import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

interface CustomerRegistrationData {
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
  farmSize?: string;
  cropTypes: string[];
  businessType: string;
}

interface CustomerRegistrationFormProps {
  onSubmit: (data: CustomerRegistrationData) => Promise<void>;
  isLoading: boolean;
}

const CROP_OPTIONS = [
  "Rice", "Wheat", "Corn", "Sugarcane", "Cotton", "Soybean", 
  "Potato", "Onion", "Tomato", "Cabbage", "Carrot", "Beans",
  "Mango", "Apple", "Banana", "Orange", "Grapes", "Coconut",
  "Tea", "Coffee", "Spices", "Pulses", "Oilseeds", "Fodder"
];

const BUSINESS_TYPES = [
  "Individual Farmer",
  "Farming Cooperative",
  "Agricultural Business",
  "Food Processing Unit",
  "Export Business",
  "Retail/Wholesale"
];

export const CustomerRegistrationForm = ({ onSubmit, isLoading }: CustomerRegistrationFormProps) => {
  const [formData, setFormData] = useState<CustomerRegistrationData>({
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
    farmSize: "",
    cropTypes: [],
    businessType: ""
  });

  const [newCrop, setNewCrop] = useState("");

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

  const addCropType = (crop: string) => {
    if (crop && !formData.cropTypes.includes(crop)) {
      setFormData(prev => ({
        ...prev,
        cropTypes: [...prev.cropTypes, crop]
      }));
    }
  };

  const removeCropType = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      cropTypes: prev.cropTypes.filter(c => c !== crop)
    }));
  };

  const addCustomCrop = () => {
    if (newCrop.trim()) {
      addCropType(newCrop.trim());
      setNewCrop("");
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
            <User className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Customer Registration</CardTitle>
          <CardDescription>
            Join FarmShare as a customer to access agricultural machinery and services
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

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (Optional)</Label>
                  <Input
                    id="farmSize"
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange("farmSize", e.target.value)}
                    placeholder="e.g., 10 acres"
                  />
                </div>
              </div>
            </div>

            {/* Crop Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Crop Types/Products</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {CROP_OPTIONS.map((crop) => (
                    <Button
                      key={crop}
                      type="button"
                      variant={formData.cropTypes.includes(crop) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (formData.cropTypes.includes(crop)) {
                          removeCropType(crop);
                        } else {
                          addCropType(crop);
                        }
                      }}
                      className="justify-start text-xs h-auto py-2"
                    >
                      {crop}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom crop/product"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCrop())}
                  />
                  <Button type="button" onClick={addCustomCrop} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.cropTypes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Crops/Products:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.cropTypes.map((crop) => (
                        <Badge key={crop} variant="secondary" className="gap-1">
                          {crop}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => removeCropType(crop)}
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
                disabled={isLoading || !formData.businessType}
              >
                {isLoading ? 'Creating Account...' : 'Register as Customer'}
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
