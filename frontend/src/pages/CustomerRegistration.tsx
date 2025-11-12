import { useState } from "react";
import { CustomerRegistrationForm } from "@/components/CustomerRegistrationForm";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

export default function CustomerRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegistration = async (data: CustomerRegistrationData) => {
    setIsLoading(true);
    try {
      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "customer",
        location: data.location,
        customerInfo: {
          farmSize: data.farmSize,
          cropTypes: data.cropTypes,
          businessType: data.businessType
        }
      };

      const response = await authService.register(registrationData);
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to FarmShare! Your customer account has been created.",
      });
      
      // Redirect to farmer dashboard (customers use farmer dashboard)
      setTimeout(() => {
        navigate('/dashboard/farmer');
      }, 500);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <CustomerRegistrationForm 
          onSubmit={handleRegistration}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
