import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { farmerAPI, commonAPI, tokenStorage } from '@/services/farmsha-api';
import { MapPin, Clock, Tractor, Star, ArrowRight, LogOut, Bell } from 'lucide-react';

import MapComponent from '@/components/MapComponent';
import TrackingModal from '@/components/TrackingModal';
import ChatWindow from '@/components/ChatWindow';

interface Machinery {
  id: string;
  name: string;
  category: string;
  pricePerHour: number;
  pricePerAcre: number;
  location: { lat: number; lng: number };
  rating: number;
  totalRatings: number;
  owner: any;
}

interface Booking {
  id: string;
  machineryId: string;
  status: string;
  bookingDate: string;
  bookingTime: string;
  estimatedCost: number;
  machinery: Machinery;
  owner: any;
}

const FarmerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenStorage.getUser();

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<string | null>(null);

  // Search filters
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    village: '',
    machineryType: '',
    maxPrice: '',
  });

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    bookingDate: '',
    bookingTime: '',
    startLocation: '',
    endLocation: '',
    acreage: '',
    notes: '',
  });

  // Verify user is logged in
  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/farmsha-auth');
    }
  }, [user, navigate]);

  // Fetch initial data
  useEffect(() => {
    const token = tokenStorage.getToken();
    if (token) {
      fetchNotifications(token);
      fetchBookings(token);
    }
  }, []);

  const fetchNotifications = async (token: string) => {
    try {
      const response = await commonAPI.getNotifications(token);
      setNotifications(response.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchBookings = async (token: string) => {
    try {
      const response = await farmerAPI.getBookings(token);
      setBookings(response.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  // Search machinery
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/farmsha-auth');
        return;
      }

      const response = await farmerAPI.searchMachinery(filters, token);
      setMachinery(response.machinery || []);

      if (response.count === 0) {
        setError('No machinery found matching your criteria');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create booking
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedMachinery) {
      setError('Please select machinery');
      return;
    }

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/farmsha-auth');
        return;
      }

      const response = await farmerAPI.createBooking(
        {
          machineryId: selectedMachinery.id,
          ...bookingForm,
        },
        token
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess('Booking request sent!');
      setSelectedMachinery(null);
      setBookingForm({
        bookingDate: '',
        bookingTime: '',
        startLocation: '',
        endLocation: '',
        acreage: '',
        notes: '',
      });

      // Refresh bookings
      const bookingsResponse = await farmerAPI.getBookings(token);
      setBookings(bookingsResponse.bookings || []);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to create booking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/farmsha-auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-600">FARMSHA</h1>
            <p className="text-gray-600">Farmer Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 cursor-pointer" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500">{notifications.length}</Badge>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">{user?.fullName}</p>
              <p className="text-sm text-gray-600">{user?.phone}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Machinery</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* SEARCH TAB */}
          <TabsContent value="search" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Agricultural Machinery</CardTitle>
                <CardDescription>
                  Search and book quality equipment from verified machinery owners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <Label>State</Label>
                      <Input
                        placeholder="Maharashtra"
                        value={filters.state}
                        onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>District</Label>
                      <Input
                        placeholder="Pune"
                        value={filters.district}
                        onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Village</Label>
                      <Input
                        placeholder="Village name"
                        value={filters.village}
                        onChange={(e) => setFilters({ ...filters, village: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Machinery Type</Label>
                      <Select
                        value={filters.machineryType}
                        onValueChange={(value) =>
                          setFilters({ ...filters, machineryType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="tractor">Tractor</SelectItem>
                          <SelectItem value="harvester">Harvester</SelectItem>
                          <SelectItem value="rotavator">Rotavator</SelectItem>
                          <SelectItem value="cultivator">Cultivator</SelectItem>
                          <SelectItem value="sprayer">Sprayer</SelectItem>
                          <SelectItem value="planter">Planting Machine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Max Price/Hour</Label>
                      <Input
                        type="number"
                        placeholder="₹500"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Machinery'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* View Toggle */}
            <div className="flex justify-end mb-4">
              <div className="bg-white p-1 rounded-lg border inline-flex">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List View
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  Map View
                </Button>
              </div>
            </div>

            {/* Machinery Results */}
            {viewMode === 'list' ? (
              machinery.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {machinery.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all ${selectedMachinery?.id === item.id ? 'ring-2 ring-green-500' : ''
                        }`}
                      onClick={() => setSelectedMachinery(item)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription>{item.category}</CardDescription>
                          </div>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{item.rating}</span>
                          <span className="text-gray-600">({item.totalRatings})</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Per Hour:</span>
                            <span className="font-bold">₹{item.pricePerHour}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Per Acre:</span>
                            <span className="font-bold">₹{item.pricePerAcre}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {item.location?.lat.toFixed(2)}, {item.location?.lng.toFixed(2)}
                          </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p className="font-semibold">{item.owner?.fullName}</p>
                          <p className="text-gray-600">{item.owner?.phone}</p>
                        </div>

                        {selectedMachinery?.id === item.id && (
                          <Button className="w-full" variant="outline">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Selected for booking
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="h-[500px] w-full rounded-lg overflow-hidden border">
                <MapComponent
                  center={user?.location || { lat: 20.5937, lng: 78.9629 }} // Default to India center if no location
                  markers={machinery.map(m => ({
                    id: m.id,
                    position: m.location,
                    title: m.name,
                    description: `₹${m.pricePerHour}/hr - ${m.category}`,
                    onClick: () => setSelectedMachinery(m)
                  }))}
                  className="h-full w-full"
                />
              </div>
            )}

            {/* Booking Form */}
            {selectedMachinery && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle>Book {selectedMachinery.name}</CardTitle>
                  <CardDescription>
                    Complete the form to send a booking request to the owner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateBooking} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Booking Date</Label>
                        <Input
                          type="date"
                          value={bookingForm.bookingDate}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, bookingDate: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Booking Time</Label>
                        <Input
                          type="time"
                          value={bookingForm.bookingTime}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, bookingTime: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Start Location</Label>
                      <Input
                        placeholder="Your farm location"
                        value={bookingForm.startLocation}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, startLocation: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>End Location</Label>
                      <Input
                        placeholder="Work completion location"
                        value={bookingForm.endLocation}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, endLocation: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Acreage</Label>
                      <Input
                        type="number"
                        placeholder="Number of acres"
                        value={bookingForm.acreage}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, acreage: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <Input
                        placeholder="Any special requests..."
                        value={bookingForm.notes}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, notes: e.target.value })
                        }
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating booking...' : 'Send Booking Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-4 mt-6">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">
                  No bookings yet. Search for machinery to get started!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.machinery?.name}</CardTitle>
                          <CardDescription>{booking.machinery?.category}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            booking.status === 'accepted'
                              ? 'default'
                              : booking.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-semibold">
                          {booking.bookingDate} at {booking.bookingTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Owner</p>
                        <p className="font-semibold">{booking.owner?.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Cost</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{booking.estimatedCost}
                        </p>
                      </div>



                      {/* Track and Chat Buttons */}
                      {['accepted', 'in-progress'].includes(booking.status) && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            className="flex-1"
                            onClick={() => {
                              setTrackingBooking(booking);
                              setIsTrackingOpen(true);
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Track
                          </Button>
                          <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => setChatRecipient(booking.owner?.fullName)}
                          >
                            Chat
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ... notifications tab ... */}

          {/* Modals */}
          {trackingBooking && (
            <TrackingModal
              isOpen={isTrackingOpen}
              onClose={() => setIsTrackingOpen(false)}
              booking={trackingBooking}
            />
          )}

          {chatRecipient && (
            <ChatWindow
              recipientName={chatRecipient}
              onClose={() => setChatRecipient(null)}
            />
          )}

        </Tabs>
      </div>
    </div>
  );
};

export default FarmerDashboard;
