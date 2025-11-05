import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tractor, Clock, CheckCircle, XCircle, Bell } from "lucide-react";
import { Link } from "react-router-dom";

// Dummy bookings data
const dummyBookings = [
  {
    id: "1",
    machinery: "John Deere 5075E",
    owner: "Rajesh Kumar",
    status: "pending",
    startDate: "2025-11-01",
    endDate: "2025-11-03",
    totalCost: 12000,
  },
  {
    id: "2",
    machinery: "Class Lexion 780",
    owner: "Suresh Patel",
    status: "confirmed",
    startDate: "2025-10-28",
    endDate: "2025-10-30",
    totalCost: 28800,
  },
  {
    id: "3",
    machinery: "New Holland TC5070",
    owner: "Priya Sharma",
    status: "completed",
    startDate: "2025-10-20",
    endDate: "2025-10-22",
    totalCost: 10800,
  },
];

export default function DashboardFarmer() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-accent text-accent">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="border-primary text-primary">Confirmed</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Manage your machinery bookings and find equipment</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Tractor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹51,600</div>
            </CardContent>
          </Card>
        </div>

        {/* Find Machinery CTA */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Need Equipment?</h3>
                <p className="text-muted-foreground">Browse available machinery in your area</p>
              </div>
              <Button asChild variant="hero">
                <Link to="/machinery">Find Machinery</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Booking Confirmed</p>
                  <p className="text-sm text-muted-foreground">Suresh Patel accepted your request for Class Lexion 780</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Awaiting Response</p>
                  <p className="text-sm text-muted-foreground">Your booking request for John Deere 5075E is pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>Track all your machinery rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyBookings.map((booking) => (
                <div key={booking.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{booking.machinery}</h4>
                    <p className="text-sm text-muted-foreground mb-2">Owner: {booking.owner}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    {getStatusBadge(booking.status)}
                    <p className="text-sm font-semibold text-primary">₹{booking.totalCost.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}