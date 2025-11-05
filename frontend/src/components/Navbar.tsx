import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tractor, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Tractor className="h-8 w-8" />
            <span className="text-xl font-bold">FarmShare</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/machinery" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/machinery') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Browse Machinery
            </Link>
            <Link 
              to="/auth" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/auth') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Login
            </Link>
            <Button asChild variant="hero" size="sm">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/machinery" 
                className={`text-sm font-medium ${isActive('/machinery') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Machinery
              </Link>
              <Link 
                to="/auth" 
                className={`text-sm font-medium ${isActive('/auth') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Button asChild variant="hero" size="sm" className="w-full">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};