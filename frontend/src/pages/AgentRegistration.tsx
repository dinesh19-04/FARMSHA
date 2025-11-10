import { useState } from "react";
import { AgentRegistrationForm } from "@/components/AgentRegistrationForm";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

export default function AgentRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegistration = async (data: AgentRegistrationData) => {
    setIsLoading(true);
    try {
      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "agent",
        location: data.location,
        agentInfo: {
          experience: data.experience,
          specialization: data.specialization,
          licenseNumber: data.licenseNumber
        }
      };

      const response = await authService.register(registrationData);
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to FarmShare! Your agent account has been created.",
      });
      
      // Redirect to agent dashboard
      navigate('/dashboard/agent');
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
        <AgentRegistrationForm 
          onSubmit={handleRegistration}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
