import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ownerAPI, commonAPI, tokenStorage } from '@/services/farmsha-api';
import { LogOut, Bell, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import ChatWindow from '@/components/ChatWindow';

interface Machinery {
  id: string;
  name: string;
  category: string;
  implements: string[];
  pricePerHour: number;
  pricePerAcre: number;
  availability: boolean;
  rating: number;
  totalRatings: number;
  totalBookings: number;
}

interface Booking {
  id: string;
  farmerId: string;
  farmer: any;
  machineryId: string;
  machinery: Machinery;
  status: string;
  bookingDate: string;
  estimatedCost: number;
  actualCost?: number;
}

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenStorage.getUser();

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [chatRecipient, setChatRecipient] = useState<string | null>(null);

  // Add machinery form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMachinery, setNewMachinery] = useState({
    name: '',
    category: '',
    implements: '',
    pricePerHour: '',
    pricePerAcre: '',
    description: '',
    state: user?.state || '',
    district: user?.district || '',
    village: user?.village || '',
  });

  // Edit pricing form
  const [editingPricing, setEditingPricing] = useState<string | null>(null);
  const [pricingForm, setPricingForm] = useState({
    pricePerHour: '',
    pricePerAcre: '',
  });

  // Verify user is logged in
  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/farmsha-auth');
    }
  }, [user, navigate]);

  // Fetch initial data
  useEffect(() => {
    const token = tokenStorage.getToken();
    if (token) {
      fetchMachinery(token);
      fetchBookings(token);
      fetchEarnings(token);
      fetchNotifications(token);
    }
  }, []);

  const fetchMachinery = async (token: string) => {
    try {
      const response = await ownerAPI.getMachinery(token);
      setMachinery(response.machinery || []);
    } catch (err) {
      console.error('Error fetching machinery:', err);
    }
  };

  const fetchBookings = async (token: string) => {
    try {
      const response = await ownerAPI.getBookings(token);
      setBookings(response.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchEarnings = async (token: string) => {
    try {
      const response = await ownerAPI.getEarnings(token);
      setEarnings(response);
    } catch (err) {
      console.error('Error fetching earnings:', err);
    }
  };

  const fetchNotifications = async (token: string) => {
    try {
      const response = await commonAPI.getNotifications(token);
      setNotifications(response.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Add machinery
  const handleAddMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/farmsha-auth');
        return;
      }

      const response = await ownerAPI.addMachinery(
        {
          ...newMachinery,
          pricePerHour: parseFloat(newMachinery.pricePerHour),
          pricePerAcre: parseFloat(newMachinery.pricePerAcre),
          implements: newMachinery.implements.split(',').map((s) => s.trim()),
          location: user?.location || { lat: 0, lng: 0 },
        },
        token
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess('Machinery added successfully!');
      setShowAddForm(false);
      setNewMachinery({
        name: '',
        category: '',
        implements: '',
        pricePerHour: '',
        pricePerAcre: '',
        description: '',
        state: user?.state || '',
        district: user?.district || '',
        village: user?.village || '',
      });

      // Refresh machinery list
      const machineryResponse = await ownerAPI.getMachinery(token);
      setMachinery(machineryResponse.machinery || []);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add machinery');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update pricing
  const handleUpdatePricing = async (machineryId: string) => {
    setError('');
    setLoading(true);

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/farmsha-auth');
        return;
      }

      const response = await ownerAPI.updatePricing(
        machineryId,
        parseFloat(pricingForm.pricePerHour),
        parseFloat(pricingForm.pricePerAcre),
        token
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess('Pricing updated!');
      setEditingPricing(null);

      // Refresh machinery list
      const machineryResponse = await ownerAPI.getMachinery(token);
      setMachinery(machineryResponse.machinery || []);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update pricing');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Respond to booking
  const handleBookingResponse = async (bookingId: string, action: 'accept' | 'reject') => {
    setError('');
    setLoading(true);

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/farmsha-auth');
        return;
      }

      const response = await ownerAPI.respondToBooking(bookingId, action, token);

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess(`Booking ${action}ed!`);

      // Refresh bookings
      const bookingsResponse = await ownerAPI.getBookings(token);
      setBookings(bookingsResponse.bookings || []);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to ${action} booking`);
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
            <p className="text-gray-600">Machinery Owner Dashboard</p>
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

        {/* Earnings Summary */}
        {earnings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{earnings.totalEarnings?.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-2">
                  From {earnings.completedBookings} completed bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Machinery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{machinery.length}</div>
                <p className="text-xs text-gray-500 mt-2">Listed for rent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter((b) => b.status === 'pending').length}
                </div>
                <p className="text-xs text-gray-500 mt-2">Awaiting response</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="machinery" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="machinery">My Machinery</TabsTrigger>
            <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
            <TabsTrigger value="earnings">Earnings & Analytics</TabsTrigger>
          </TabsList>

          {/* MACHINERY TAB */}
          <TabsContent value="machinery" className="space-y-6 mt-6">
            <Button className="mb-4" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : '+ Add New Machinery'}
            </Button>

            {showAddForm && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle>Add New Machinery</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddMachinery} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Machinery Name</Label>
                        <Input
                          placeholder="e.g., Mahindra Tractor 585"
                          value={newMachinery.name}
                          onChange={(e) =>
                            setNewMachinery({ ...newMachinery, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          placeholder="e.g., Tractor"
                          value={newMachinery.category}
                          onChange={(e) =>
                            setNewMachinery({ ...newMachinery, category: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Implements (comma-separated)</Label>
                      <Input
                        placeholder="Rotavator, Plough, Cultivator"
                        value={newMachinery.implements}
                        onChange={(e) =>
                          setNewMachinery({ ...newMachinery, implements: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Price Per Hour (₹)</Label>
                        <Input
                          type="number"
                          placeholder="500"
                          value={newMachinery.pricePerHour}
                          onChange={(e) =>
                            setNewMachinery({ ...newMachinery, pricePerHour: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Price Per Acre (₹)</Label>
                        <Input
                          type="number"
                          placeholder="1000"
                          value={newMachinery.pricePerAcre}
                          onChange={(e) =>
                            setNewMachinery({ ...newMachinery, pricePerAcre: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Input
                        placeholder="Details about your machinery..."
                        value={newMachinery.description}
                        onChange={(e) =>
                          setNewMachinery({ ...newMachinery, description: e.target.value })
                        }
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Machinery'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {machinery.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">
                  No machinery listed yet. Add your first machine to get started!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {machinery.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription>{item.category}</CardDescription>
                        </div>
                        <Badge variant={item.availability ? 'default' : 'destructive'}>
                          {item.availability ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Implements</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.implements.map((impl) => (
                            <Badge key={impl} variant="outline">
                              {impl}
                            </Badge>
                          ))}
                        </div>
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

                      <div className="text-sm text-gray-600">
                        <p>Rating: {item.rating} ({item.totalRatings})</p>
                        <p>Total Bookings: {item.totalBookings}</p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setPricingForm({
                            pricePerHour: item.pricePerHour.toString(),
                            pricePerAcre: item.pricePerAcre.toString(),
                          });
                          setEditingPricing(item.id);
                        }}
                      >
                        Update Pricing
                      </Button>

                      {editingPricing === item.id && (
                        <Card className="mt-4 border-blue-200">
                          <CardContent className="pt-4 space-y-3">
                            <div>
                              <Label>Price Per Hour</Label>
                              <Input
                                type="number"
                                value={pricingForm.pricePerHour}
                                onChange={(e) =>
                                  setPricingForm({ ...pricingForm, pricePerHour: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Price Per Acre</Label>
                              <Input
                                type="number"
                                value={pricingForm.pricePerAcre}
                                onChange={(e) =>
                                  setPricingForm({ ...pricingForm, pricePerAcre: e.target.value })
                                }
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUpdatePricing(item.id)}
                                disabled={loading}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setEditingPricing(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-4 mt-6">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">
                  No booking requests yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.machinery?.name}</CardTitle>
                          <CardDescription>
                            Farmer: {booking.farmer?.fullName}
                          </CardDescription>
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
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-semibold">{booking.bookingDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Estimated Cost</p>
                          <p className="font-bold text-green-600">₹{booking.estimatedCost}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Farmer Phone</p>
                          <p className="font-semibold">{booking.farmer?.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className="font-semibold capitalize">{booking.status}</p>
                        </div>
                      </div>



                      {booking.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => handleBookingResponse(booking.id, 'accept')}
                            disabled={loading}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleBookingResponse(booking.id, 'reject')}
                            disabled={loading}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setChatRecipient(booking.farmer?.fullName)}
                        >
                          Chat with Farmer
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ... earnings tab ... */}

          {chatRecipient && (
            <ChatWindow
              recipientName={chatRecipient}
              onClose={() => setChatRecipient(null)}
            />
          )}

          {/* EARNINGS TAB */}
          <TabsContent value="earnings" className="space-y-6 mt-6">
            {earnings ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Total Earnings</p>
                        <p className="text-3xl font-bold text-green-600">
                          ₹{earnings.totalEarnings?.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Completed Bookings</p>
                        <p className="text-3xl font-bold text-blue-600">{earnings.completedBookings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {Object.keys(earnings.dailyEarnings || {}).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(earnings.dailyEarnings).map(([date, amount]: [string, any]) => (
                          <div key={date} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-gray-600">{date}</span>
                            <span className="font-bold text-green-600">₹{amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">
                  Loading earnings data...
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;
