import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tractor, Users, MapPin, CheckCircle, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroFarm from "@/assets/hero-farm.jpg";

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroFarm})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Empowering Farmers through<br />Shared Machinery Access
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Connect with nearby farmers to rent, share, and access agricultural equipment when you need it
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/machinery">Find Machinery</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/auth">List Your Machine</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)]">
              <CardContent className="pt-12 pb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Find Nearby Equipment</h3>
                <p className="text-muted-foreground">
                  Search for available machinery in your area by type, price, and availability
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)]">
              <CardContent className="pt-12 pb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Tractor className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Book Instantly</h3>
                <p className="text-muted-foreground">
                  Request bookings with a single click and coordinate directly with equipment owners
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)]">
              <CardContent className="pt-12 pb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Build Community</h3>
                <p className="text-muted-foreground">
                  Connect with fellow farmers and local agents to create a thriving agricultural network
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose FarmShare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Cost-Effective</h3>
                <p className="text-muted-foreground">Save money by renting equipment only when needed instead of buying</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Quick Access</h3>
                <p className="text-muted-foreground">Get the machinery you need within hours, not days</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Verified Community</h3>
                <p className="text-muted-foreground">All users and equipment verified by local agents</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Earn Extra Income</h3>
                <p className="text-muted-foreground">Machine owners can monetize idle equipment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Farmers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-8">
                <p className="text-muted-foreground mb-4">
                  "FarmShare helped me access a harvester during peak season. Saved me thousands and got the job done on time!"
                </p>
                <div className="font-semibold">Rajesh Kumar</div>
                <div className="text-sm text-muted-foreground">Wheat Farmer, Punjab</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-8">
                <p className="text-muted-foreground mb-4">
                  "I list my tractor when I'm not using it. The extra income has been a game-changer for my family."
                </p>
                <div className="font-semibold">Priya Sharma</div>
                <div className="text-sm text-muted-foreground">Equipment Owner, Maharashtra</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-8">
                <p className="text-muted-foreground mb-4">
                  "As an agent, I love connecting farmers and helping build our agricultural community stronger."
                </p>
                <div className="font-semibold">Amit Patel</div>
                <div className="text-sm text-muted-foreground">Community Agent, Gujarat</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers already sharing machinery in your community
          </p>
          <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link to="/auth">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}