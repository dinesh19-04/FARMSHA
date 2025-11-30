import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MachineryProvider } from "@/context/MachineryContext";
import Landing from "./pages/Landing";
import FarmShaAuth from "./pages/FarmShaAuth";
import FarmerDashboard from "./pages/FarmerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MachineryProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/farmsha-auth" element={<FarmShaAuth />} />

                {/* FARMSHA New Dashboards */}
                <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
                <Route path="/dashboard/owner" element={<OwnerDashboard />} />
                <Route path="/dashboard/agent" element={<AgentDashboard />} />

                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </MachineryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
