import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Tractor, Activity, UserCheck, UserX, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Dummy data
const pendingUsers = [
  { id: "1", name: "Deepak Verma", role: "farmer", phone: "+91 98765 43210", location: "Amritsar, Punjab" },
  { id: "2", name: "Sunita Kaur", role: "owner", phone: "+91 98765 43211", location: "Ludhiana, Punjab" },
];

const activeBookings = [
  { id: "1", farmer: "Amit Kumar", owner: "Rajesh Singh", machinery: "Tractor - John Deere", date: "2025-10-28", status: "ongoing" },
  { id: "2", farmer: "Priya Patel", owner: "Suresh Kumar", machinery: "Harvester - Class Lexion", date: "2025-10-30", status: "upcoming" },
];

const regionStats = [
  { location: "Amritsar", users: 45, machines: 12, bookings: 23 },
  { location: "Ludhiana", users: 38, machines: 10, bookings: 18 },
  { location: "Jalandhar", users: 32, machines: 8, bookings: 15 },
];

export default function DashboardAgent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Agent Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your community</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">115</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
              <Tractor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-xs text-muted-foreground">Across region</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending User Approvals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending User Approvals</CardTitle>
            <CardDescription>Review and approve new user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{user.name}</h4>
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{user.phone}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserX className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button variant="hero" size="sm" className="gap-2">
                      <UserCheck className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Bookings Monitor */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
            <CardDescription>Monitor ongoing and upcoming rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <div key={booking.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{booking.machinery}</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      Farmer: {booking.farmer} • Owner: {booking.owner}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={booking.status === "ongoing" ? "default" : "outline"}>
                    {booking.status === "ongoing" ? "Ongoing" : "Upcoming"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Region Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Region Overview</CardTitle>
            <CardDescription>Statistics by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionStats.map((stat, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">{stat.location}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Users</p>
                      <p className="text-xl font-bold">{stat.users}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Machines</p>
                      <p className="text-xl font-bold">{stat.machines}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bookings</p>
                      <p className="text-xl font-bold">{stat.bookings}</p>
                    </div>
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