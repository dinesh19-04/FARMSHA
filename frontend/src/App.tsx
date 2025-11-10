import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import MachineryList from "./pages/MachineryList";
import AdvancedSearch from "./pages/AdvancedSearch";
import OwnerRegistration from "./pages/OwnerRegistration";
import AgentRegistration from "./pages/AgentRegistration";
import CustomerRegistration from "./pages/CustomerRegistration";
import DashboardFarmer from "./pages/DashboardFarmer";
import DashboardOwner from "./pages/DashboardOwner";
import DashboardAgent from "./pages/DashboardAgent";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/machinery" element={<MachineryList />} />
              <Route path="/search" element={<AdvancedSearch />} />
              <Route path="/register/owner" element={<OwnerRegistration />} />
              <Route path="/register/agent" element={<AgentRegistration />} />
              <Route path="/register/customer" element={<CustomerRegistration />} />
              <Route path="/dashboard/farmer" element={<DashboardFarmer />} />
              <Route path="/dashboard/owner" element={<DashboardOwner />} />
              <Route path="/dashboard/agent" element={<DashboardAgent />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
