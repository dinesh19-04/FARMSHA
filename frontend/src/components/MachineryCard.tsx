import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";

interface MachineryCardProps {
  id: string;
  name: string;
  type: string;
  rate: number;
  location: string;
  available: boolean;
  image?: string;
  onBook: (id: string) => void;
}

export const MachineryCard = ({
  id,
  name,
  type,
  rate,
  location,
  available,
  image,
  onBook,
}: MachineryCardProps) => {
  return (
    <Card className="overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)]">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="text-4xl">🚜</span>
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          available 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {available ? 'Available' : 'Booked'}
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{type}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-lg font-bold text-primary">
          <Clock className="h-4 w-4" />
          <span>₹{rate}/hour</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="hero" 
          className="w-full" 
          disabled={!available}
          onClick={() => onBook(id)}
        >
          {available ? 'Book Now' : 'Not Available'}
        </Button>
      </CardFooter>
    </Card>
  );
};