import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { agentAPI, commonAPI, tokenStorage } from '@/services/farmsha-api';
import { LogOut, Bell, Users, Briefcase } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  state: string;
  district: string;
  village: string;
  rating: number;
  isVerified: boolean;
}

interface Booking {
  id: string;
  farmer: User;
  machinery: any;
  owner: User;
  status: string;
  bookingDate: string;
  estimatedCost: number;
}

const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenStorage.getUser();

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Add user form
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    phone: '',
    role: 'farmer',
    state: user?.state || '',
    district: user?.district || '',
    village: user?.village || '',
  });

  // Filters
  const [userFilter, setUserFilter] = useState({
    role: '',
    state: '',
    district: '',
  });

  // Verify user is logged in
  useEffect(() => {
    if (!user || user.role !== 'agent') {
      navigate('/farmsha-auth');
    }
  }, [user, navigate]);

  // Fetch initial data
  useEffect(() => {
    const token = tokenStorage.getToken();
    if (token) {
      fetchUsers(token);
      fetchBookings(token);
      fetchNotifications(token);
    }
  }, []);

  const fetchUsers = async (token: string, filters = {}) => {
    try {
      const response = await agentAPI.getUsers(filters, token);
      setUsers(response.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchBookings = async (token: string) => {
    try {
      const response = await agentAPI.getBookings(token);
      setBookings(response.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
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

  // Add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/farmsha-auth');
        return;
      }

      if (!newUserForm.fullName || !newUserForm.phone || !newUserForm.role) {
        setError('Please fill required fields');
        return;
      }

      const response = await agentAPI.addUser(newUserForm, token);

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess('User added successfully!');
      setShowAddUserForm(false);
      setNewUserForm({
        fullName: '',
        phone: '',
        role: 'farmer',
        state: user?.state || '',
        district: user?.district || '',
        village: user?.village || '',
      });

      // Refresh users list
      const usersResponse = await agentAPI.getUsers({}, token);
      setUsers(usersResponse.users || []);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/farmsha-auth');
        return;
      }

      const filters = Object.fromEntries(
        Object.entries(userFilter).filter(([_, v]) => v !== '')
      );

      const response = await agentAPI.getUsers(filters, token);
      setUsers(response.users || []);

      if (response.users?.length === 0) {
        setError('No users found matching your criteria');
      }
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/farmsha-auth');
  };

  // Stats
  const farmers = users.filter((u) => u.role === 'farmer');
  const owners = users.filter((u) => u.role === 'owner');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-600">FARMSHA</h1>
            <p className="text-gray-600">Agent Dashboard</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-gray-500 mt-2">In your region</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{farmers.length}</div>
              <p className="text-xs text-gray-500 mt-2">Registered farmers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Machinery Owners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{owners.length}</div>
              <p className="text-xs text-gray-500 mt-2">Equipment providers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-gray-500 mt-2">In your region</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-6 mt-6">
            <Button className="mb-4" onClick={() => setShowAddUserForm(!showAddUserForm)}>
              {showAddUserForm ? 'Cancel' : '+ Add User Manually'}
            </Button>

            {showAddUserForm && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle>Register New User</CardTitle>
                  <CardDescription>
                    Manually add a farmer or machinery owner to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          placeholder="User Name"
                          value={newUserForm.fullName}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, fullName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          placeholder="+91 XXXXX XXXXX"
                          value={newUserForm.phone}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Role</Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(value) =>
                          setNewUserForm({ ...newUserForm, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="owner">Machinery Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>State</Label>
                        <Input
                          placeholder="Maharashtra"
                          value={newUserForm.state}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, state: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>District</Label>
                        <Input
                          placeholder="Pune"
                          value={newUserForm.district}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, district: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Village</Label>
                        <Input
                          placeholder="Village name"
                          value={newUserForm.village}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, village: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Adding user...' : 'Add User'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search Users</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearchUsers} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Role</Label>
                      <Select value={userFilter.role} onValueChange={(value) => setUserFilter({ ...userFilter, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="All roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Roles</SelectItem>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="owner">Machinery Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        placeholder="Filter by state"
                        value={userFilter.state}
                        onChange={(e) => setUserFilter({ ...userFilter, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>District</Label>
                      <Input
                        placeholder="Filter by district"
                        value={userFilter.district}
                        onChange={(e) => setUserFilter({ ...userFilter, district: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Users List */}
            {users.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">
                  No users found in your region
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <Card key={u.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{u.fullName}</h4>
                            <Badge variant={u.isVerified ? 'default' : 'outline'}>
                              {u.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                            <Badge variant="outline">{u.role}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Phone</p>
                              <p className="font-semibold">{u.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Email</p>
                              <p className="font-semibold">{u.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Location</p>
                              <p className="font-semibold">
                                {u.state}, {u.district}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Rating</p>
                              <p className="font-semibold text-yellow-600">⭐ {u.rating}</p>
                            </div>
                          </div>
                        </div>
                      </div>
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
                  No bookings in your region
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
                            {booking.farmer?.fullName} ➜ {booking.owner?.fullName}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            booking.status === 'completed'
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
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-semibold">{booking.bookingDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Farmer</p>
                          <p className="font-semibold">{booking.farmer?.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Owner</p>
                          <p className="font-semibold">{booking.owner?.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cost</p>
                          <p className="font-bold text-green-600">₹{booking.estimatedCost}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-4 mt-6">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">
                  No notifications
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <Card key={notif.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold">{notif.title}</h4>
                          <p className="text-gray-600 text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notif.read && <Badge className="bg-blue-500">New</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;
