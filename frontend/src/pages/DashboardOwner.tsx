import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tractor, DollarSign, Clock, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data
const dummyMachines = [
  { id: "1", name: "John Deere 5075E", type: "Tractor", rate: 500, available: true },
  { id: "2", name: "Class Lexion 780", type: "Harvester", rate: 1200, available: false },
];

const dummyRequests = [
  { id: "1", farmer: "Amit Kumar", machinery: "John Deere 5075E", startDate: "2025-11-01", duration: "3 days", status: "pending" },
  { id: "2", farmer: "Priya Singh", machinery: "Class Lexion 780", startDate: "2025-11-05", duration: "2 days", status: "pending" },
];

const earningsData = [
  { month: 'Jun', earnings: 15000 },
  { month: 'Jul', earnings: 22000 },
  { month: 'Aug', earnings: 18000 },
  { month: 'Sep', earnings: 28000 },
  { month: 'Oct', earnings: 32000 },
];

export default function DashboardOwner() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your machinery and bookings</p>
          </div>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Machinery
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
              <Tractor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyMachines.length}</div>
              <p className="text-xs text-muted-foreground">{dummyMachines.filter(m => m.available).length} available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹32,000</div>
              <p className="text-xs text-muted-foreground">+14.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your monthly rental income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
            <CardDescription>Review and respond to rental requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyRequests.map((request) => (
                <div key={request.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{request.farmer}</h4>
                    <p className="text-sm text-muted-foreground mb-1">Machinery: {request.machinery}</p>
                    <p className="text-sm text-muted-foreground">
                      From {new Date(request.startDate).toLocaleDateString()} • {request.duration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button variant="hero" size="sm" className="gap-2">
                      <Check className="h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Machinery */}
        <Card>
          <CardHeader>
            <CardTitle>My Machinery</CardTitle>
            <CardDescription>Manage your equipment listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyMachines.map((machine) => (
                <div key={machine.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{machine.name}</h4>
                      {machine.available ? (
                        <Badge variant="outline" className="border-primary text-primary">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Booked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{machine.type}</p>
                    <p className="text-sm font-semibold text-primary">₹{machine.rate}/hour</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
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