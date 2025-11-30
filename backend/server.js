const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:8000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// DATABASE (In-Memory for now - Replace with MongoDB/PostgreSQL/Supabase)
// ============================================================================

const database = {
  users: [],
  machinery: [],
  bookings: [],
  ratings: [],
  notifications: [],
  messages: []
};

// ============================================================================
// MODELS / DATABASE SCHEMAS
// ============================================================================

// User Model (with roles: farmer, owner, agent)
const createUser = (data) => ({
  id: Math.random().toString(36).substr(2, 9),
  fullName: data.fullName,
  email: data.email,
  phone: data.phone,
  role: data.role, // 'farmer', 'owner', 'agent'
  state: data.state,
  district: data.district,
  village: data.village,
  location: data.location, // { lat, lng }
  avatar: data.avatar || null,
  rating: data.rating || 0,
  totalRatings: data.totalRatings || 0,
  isVerified: false,
  otp: null,
  otpExpiry: null,
  passwordHash: data.passwordHash,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Machinery Model
const createMachinery = (data) => ({
  id: Math.random().toString(36).substr(2, 9),
  ownerId: data.ownerId,
  name: data.name,
  category: data.category, // tractor, harvester, rotavator, cultivator, etc.
  implements: data.implements || [], // Array of implements attached
  images: data.images || [],
  description: data.description,
  pricePerHour: data.pricePerHour,
  pricePerAcre: data.pricePerAcre,
  location: data.location, // { lat, lng }
  state: data.state,
  district: data.district,
  village: data.village,
  availability: data.availability || true,
  totalBookings: 0,
  rating: 0,
  totalRatings: 0,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Booking Model
const createBooking = (data) => ({
  id: Math.random().toString(36).substr(2, 9),
  farmerId: data.farmerId,
  machineryId: data.machineryId,
  ownerId: data.ownerId,
  agentId: data.agentId || null,
  status: data.status || 'pending', // pending, accepted, rejected, in-progress, completed, cancelled
  bookingDate: data.bookingDate,
  bookingTime: data.bookingTime,
  startLocation: data.startLocation,
  endLocation: data.endLocation,
  acreage: data.acreage,
  estimatedCost: data.estimatedCost,
  actualCost: data.actualCost || null,
  notes: data.notes,
  gpsTracking: data.gpsTracking || false,
  currentLocation: data.currentLocation || null,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Rating Model
const createRating = (data) => ({
  id: Math.random().toString(36).substr(2, 9),
  bookingId: data.bookingId,
  ratedBy: data.ratedBy, // userId
  ratedTo: data.ratedTo, // userId
  rating: data.rating, // 1-5
  review: data.review,
  createdAt: new Date()
});

// Notification Model
const createNotification = (data) => ({
  id: Math.random().toString(36).substr(2, 9),
  userId: data.userId,
  type: data.type, // booking_request, booking_accepted, booking_rejected, on_the_way, completed
  title: data.title,
  message: data.message,
  relatedBookingId: data.relatedBookingId,
  read: false,
  createdAt: new Date()
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Generate OTP
const generateOTP = () => '123456';

// Send OTP (Mock - integrate with Twilio/SendGrid)
const sendOTP = (phone, otp) => {
  console.log(`[MOCK] Sending OTP ${otp} to ${phone}`);
  return true;
};

// Create JWT Token
const createToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

// Middleware: Authenticate User
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  req.userRole = decoded.role;
  next();
};

// Calculate Distance (simple approximation)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, role, state, district, village, location } = req.body;

    // Validate
    if (!fullName || !email || !phone || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = database.users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create temporary user entry
    const tempUser = {
      ...createUser({
        fullName,
        email,
        phone,
        role,
        state,
        district,
        village,
        location,
        passwordHash: ''
      }),
      otp,
      otpExpiry,
      verified: false
    };

    database.users.push(tempUser);

    // Send OTP
    sendOTP(phone, otp);

    res.status(200).json({
      message: 'OTP sent to your phone',
      userId: tempUser.id,
      phone: phone
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { userId, otp, password } = req.body;

    if (!userId || !otp || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = database.users.find(u => u.id === userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check OTP
    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Update user
    user.passwordHash = passwordHash;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    const token = createToken(user.id, user.role);

    res.status(200).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = database.users.find(u => u.email === email && u.role === role);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcryptjs.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user.id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================================================================
// FARMER ROUTES
// ============================================================================

// Search Machinery
app.get('/api/farmer/search', authenticateUser, (req, res) => {
  try {
    const { state, district, village, lat, lng, machineryType, maxPrice } = req.query;

    let results = database.machinery;

    // Filter by location
    if (state) results = results.filter(m => m.state === state);
    if (district) results = results.filter(m => m.district === district);
    if (village) results = results.filter(m => m.village === village);

    // Filter by machinery type
    if (machineryType) {
      results = results.filter(m => m.category === machineryType);
    }

    // Filter by price
    if (maxPrice) {
      results = results.filter(m => m.pricePerHour <= maxPrice);
    }

    // Filter by GPS location (nearby - within 10km)
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      results = results.filter(m => {
        const distance = calculateDistance(
          userLat, userLng,
          m.location.lat, m.location.lng
        );
        return distance <= 10; // 10km radius
      });
    }

    res.status(200).json({
      count: results.length,
      machinery: results.map(m => ({
        ...m,
        owner: database.users.find(u => u.id === m.ownerId)
      }))
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get Single Machinery Details
app.get('/api/farmer/machinery/:id', authenticateUser, (req, res) => {
  try {
    const machinery = database.machinery.find(m => m.id === req.params.id);

    if (!machinery) {
      return res.status(404).json({ error: 'Machinery not found' });
    }

    const owner = database.users.find(u => u.id === machinery.ownerId);
    const ratings = database.ratings.filter(r => r.ratedTo === machinery.ownerId);

    res.status(200).json({
      machinery,
      owner,
      ratings,
      averageRating: ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0
    });
  } catch (error) {
    console.error('Machinery detail error:', error);
    res.status(500).json({ error: 'Failed to fetch details' });
  }
});

// Create Booking Request
app.post('/api/farmer/booking/create', authenticateUser, (req, res) => {
  try {
    const { machineryId, bookingDate, bookingTime, startLocation, endLocation, acreage, notes } = req.body;

    if (!machineryId || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const machinery = database.machinery.find(m => m.id === machineryId);
    if (!machinery) {
      return res.status(404).json({ error: 'Machinery not found' });
    }

    // Calculate estimated cost
    const estimatedCost = acreage ? machinery.pricePerAcre * acreage : machinery.pricePerHour;

    const booking = createBooking({
      farmerId: req.userId,
      machineryId,
      ownerId: machinery.ownerId,
      bookingDate,
      bookingTime,
      startLocation,
      endLocation,
      acreage,
      estimatedCost,
      notes
    });

    database.bookings.push(booking);

    // Create notification for owner
    database.notifications.push(createNotification({
      userId: machinery.ownerId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `You have a new booking request for ${machinery.name}`,
      relatedBookingId: booking.id
    }));

    res.status(201).json({
      message: 'Booking request created',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get Farmer Bookings
app.get('/api/farmer/bookings', authenticateUser, (req, res) => {
  try {
    const bookings = database.bookings
      .filter(b => b.farmerId === req.userId)
      .map(b => ({
        ...b,
        machinery: database.machinery.find(m => m.id === b.machineryId),
        owner: database.users.find(u => u.id === b.ownerId)
      }));

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Rate Booking
app.post('/api/farmer/booking/:bookingId/rate', authenticateUser, (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    const booking = database.bookings.find(b => b.id === req.params.bookingId);
    if (!booking || booking.farmerId !== req.userId) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const ratingEntry = createRating({
      bookingId: req.params.bookingId,
      ratedBy: req.userId,
      ratedTo: booking.ownerId,
      rating,
      review
    });

    database.ratings.push(ratingEntry);

    // Update owner's rating
    const owner = database.users.find(u => u.id === booking.ownerId);
    if (owner) {
      const ownerRatings = database.ratings.filter(r => r.ratedTo === owner.id);
      owner.rating = (ownerRatings.reduce((sum, r) => sum + r.rating, 0) / ownerRatings.length).toFixed(1);
      owner.totalRatings = ownerRatings.length;
    }

    res.status(201).json({
      message: 'Rating submitted',
      rating: ratingEntry
    });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// ============================================================================
// MACHINERY OWNER ROUTES
// ============================================================================

// Add New Machinery
app.post('/api/owner/machinery/add', authenticateUser, (req, res) => {
  try {
    const { name, category, implements: impl, images, description, pricePerHour, pricePerAcre, location, state, district, village } = req.body;

    if (!name || !category || !pricePerHour) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const machinery = createMachinery({
      ownerId: req.userId,
      name,
      category,
      implements: impl || [],
      images: images || [],
      description,
      pricePerHour,
      pricePerAcre,
      location,
      state,
      district,
      village
    });

    database.machinery.push(machinery);

    res.status(201).json({
      message: 'Machinery added successfully',
      machinery
    });
  } catch (error) {
    console.error('Add machinery error:', error);
    res.status(500).json({ error: 'Failed to add machinery' });
  }
});

// Update Machinery Pricing
app.put('/api/owner/machinery/:id/pricing', authenticateUser, (req, res) => {
  try {
    const { pricePerHour, pricePerAcre } = req.body;

    const machinery = database.machinery.find(m => m.id === req.params.id && m.ownerId === req.userId);
    if (!machinery) {
      return res.status(404).json({ error: 'Machinery not found' });
    }

    if (pricePerHour) machinery.pricePerHour = pricePerHour;
    if (pricePerAcre) machinery.pricePerAcre = pricePerAcre;
    machinery.updatedAt = new Date();

    res.status(200).json({
      message: 'Pricing updated',
      machinery
    });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ error: 'Failed to update pricing' });
  }
});

// Get Owner's Machinery
app.get('/api/owner/machinery', authenticateUser, (req, res) => {
  try {
    const machinery = database.machinery.filter(m => m.ownerId === req.userId);
    res.status(200).json({ machinery });
  } catch (error) {
    console.error('Fetch machinery error:', error);
    res.status(500).json({ error: 'Failed to fetch machinery' });
  }
});

// Get Booking Requests for Owner
app.get('/api/owner/bookings', authenticateUser, (req, res) => {
  try {
    const bookings = database.bookings
      .filter(b => b.ownerId === req.userId)
      .map(b => ({
        ...b,
        machinery: database.machinery.find(m => m.id === b.machineryId),
        farmer: database.users.find(u => u.id === b.farmerId)
      }));

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Accept/Reject Booking
app.put('/api/owner/booking/:bookingId/respond', authenticateUser, (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const booking = database.bookings.find(b => b.id === req.params.bookingId && b.ownerId === req.userId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = action === 'accept' ? 'accepted' : 'rejected';
    booking.updatedAt = new Date();

    // Notify farmer
    const notificationType = action === 'accept' ? 'booking_accepted' : 'booking_rejected';
    database.notifications.push(createNotification({
      userId: booking.farmerId,
      type: notificationType,
      title: action === 'accept' ? 'Booking Accepted' : 'Booking Rejected',
      message: `Your booking request has been ${action === 'accept' ? 'accepted' : 'rejected'}`,
      relatedBookingId: booking.id
    }));

    res.status(200).json({
      message: `Booking ${action}ed`,
      booking
    });
  } catch (error) {
    console.error('Booking response error:', error);
    res.status(500).json({ error: 'Failed to respond to booking' });
  }
});

// Get Owner Earnings
app.get('/api/owner/earnings', authenticateUser, (req, res) => {
  try {
    const completedBookings = database.bookings.filter(
      b => b.ownerId === req.userId && b.status === 'completed'
    );

    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.actualCost || 0), 0);

    // Group by date for daily earnings
    const dailyEarnings = {};
    completedBookings.forEach(b => {
      const date = new Date(b.updatedAt).toISOString().split('T')[0];
      dailyEarnings[date] = (dailyEarnings[date] || 0) + (b.actualCost || 0);
    });

    res.status(200).json({
      totalEarnings,
      completedBookings: completedBookings.length,
      dailyEarnings,
      bookings: completedBookings
    });
  } catch (error) {
    console.error('Earnings error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

// ============================================================================
// AGENT ROUTES
// ============================================================================

// Get All Users (for agent to view/manage)
app.get('/api/agent/users', authenticateUser, (req, res) => {
  try {
    const { role, state, district } = req.query;

    let users = database.users.filter(u => u.id !== req.userId);

    if (role) users = users.filter(u => u.role === role);
    if (state) users = users.filter(u => u.state === state);
    if (district) users = users.filter(u => u.district === district);

    res.status(200).json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get Bookings in Agent's Region
app.get('/api/agent/bookings', authenticateUser, (req, res) => {
  try {
    const agent = database.users.find(u => u.id === req.userId && u.role === 'agent');
    if (!agent) {
      return res.status(403).json({ error: 'Not an agent' });
    }

    const bookings = database.bookings
      .filter(b => b.state === agent.state && b.district === agent.district)
      .map(b => ({
        ...b,
        farmer: database.users.find(u => u.id === b.farmerId),
        machinery: database.machinery.find(m => m.id === b.machineryId),
        owner: database.users.find(u => u.id === b.ownerId)
      }));

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Fetch regional bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Add User (Agent can manually add farmers/owners)
app.post('/api/agent/user/add', authenticateUser, (req, res) => {
  try {
    const { fullName, phone, role, state, district, village } = req.body;

    if (!fullName || !phone || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = database.users.find(u => u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = createUser({
      fullName,
      email: `${phone}@farmsha.local`,
      phone,
      role,
      state,
      district,
      village,
      passwordHash: '' // To be set by user later
    });

    user.isVerified = true; // Agent-added users are pre-verified

    database.users.push(user);

    res.status(201).json({
      message: 'User added successfully',
      user
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// ============================================================================
// NOTIFICATIONS ROUTES
// ============================================================================

// Get User Notifications
app.get('/api/notifications', authenticateUser, (req, res) => {
  try {
    const notifications = database.notifications
      .filter(n => n.userId === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark Notification as Read
app.put('/api/notifications/:id/read', authenticateUser, (req, res) => {
  try {
    const notification = database.notifications.find(
      n => n.id === req.params.id && n.userId === req.userId
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;

    res.status(200).json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// ============================================================================
// PROFILE ROUTES
// ============================================================================

// Get User Profile
app.get('/api/profile', authenticateUser, (req, res) => {
  try {
    const user = database.users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, otp, otpExpiry, ...safeUser } = user;

    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update User Profile
app.put('/api/profile', authenticateUser, (req, res) => {
  try {
    const { fullName, location, state, district, village, avatar } = req.body;

    const user = database.users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (location) user.location = location;
    if (state) user.state = state;
    if (district) user.district = district;
    if (village) user.village = village;
    if (avatar) user.avatar = avatar;
    user.updatedAt = new Date();

    const { passwordHash, otp, otpExpiry, ...safeUser } = user;

    res.status(200).json({
      message: 'Profile updated',
      user: safeUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'FARMSHA Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FARMSHA Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
