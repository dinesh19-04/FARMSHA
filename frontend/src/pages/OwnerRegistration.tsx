import { useState } from "react";
import { OwnerRegistrationForm } from "@/components/OwnerRegistrationForm";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useMachinery } from "@/context/MachineryContext";

interface OwnerRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    pincode: string;
  };
  machinery: Array<{
    id: string;
    name: string;
    type: string;
    category: string;
    rate: number;
    specifications: { [key: string]: string };
    description: string;
  }>;
}

export default function OwnerRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addMachinery } = useMachinery();

  const handleRegistration = async (data: OwnerRegistrationData) => {
    setIsLoading(true);
    try {
      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "owner",
        location: data.location,
        machinery: data.machinery
      };

      const response = await authService.register(registrationData);
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Add machinery to context if provided during registration
      if (data.machinery && data.machinery.length > 0) {
        data.machinery.forEach(machine => {
          addMachinery({
            name: machine.name,
            type: machine.type,
            rate: machine.rate,
            available: true,
            description: machine.description,
            location: data.location
          });
        });
      }
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to FarmShare! Your machinery owner account has been created.",
      });
      
      // Redirect to owner dashboard
      setTimeout(() => {
        navigate('/dashboard/owner');
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
        <OwnerRegistrationForm 
          onSubmit={handleRegistration}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
