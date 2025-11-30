# 🏗️ FARMSHA - System Architecture & Implementation Details

## System Architecture Diagram

```
                        ┌─────────────────────────────────────────┐
                        │     FARMSHA Platform                    │
                        │   "Uber for Farm Equipment"             │
                        └─────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
          ┌─────────▼─────────┐  ┌────▼────┐  ┌──────▼──────────┐
          │   FARMER MODULE   │  │  OWNER   │  │ AGENT MODULE    │
          │  (Search & Book)  │  │ MODULE   │  │ (Coordinate)    │
          └───────────────────┘  └──────────┘  └─────────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │   Frontend (React + TS)  │
                        │  - Authentication UI      │
                        │  - Dashboards             │
                        │  - Forms & Components    │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │   API Layer (farmsha-api) │
                        │  - authAPI                │
                        │  - farmerAPI              │
                        │  - ownerAPI               │
                        │  - agentAPI               │
                        │  - commonAPI              │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │  Backend (Express.js)     │
                        │  - Routes                 │
                        │  - Controllers            │
                        │  - Middleware             │
                        │  - Authentication         │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │   Data Layer              │
                        │  - Users                  │
                        │  - Machinery              │
                        │  - Bookings               │
                        │  - Ratings                │
                        │  - Notifications          │
                        └───────────────────────────┘
```

---

## 📊 Database Schema (Models)

### 1. User Model
```javascript
{
  id: string,                    // Unique user ID
  fullName: string,              // User's name
  email: string,                 // Email address
  phone: string,                 // Phone number (unique)
  role: "farmer" | "owner" | "agent",
  state: string,                 // Location: State
  district: string,              // Location: District
  village: string,               // Location: Village
  location: {                    // GPS coordinates
    lat: number,
    lng: number
  },
  avatar: string,                // Profile picture URL
  rating: number,                // 1-5 star rating
  totalRatings: number,          // Count of ratings received
  isVerified: boolean,           // Email/Phone verified
  passwordHash: string,          // Hashed password
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Machinery Model
```javascript
{
  id: string,
  ownerId: string,               // Reference to User (owner)
  name: string,                  // e.g., "Mahindra Tractor 585"
  category: string,              // tractor, harvester, rotavator, etc.
  implements: [string],          // e.g., ["Rotavator", "Plough"]
  images: [string],              // Image URLs
  description: string,           // Machine details
  pricePerHour: number,          // ₹/hour
  pricePerAcre: number,          // ₹/acre
  location: {                    // GPS coordinates
    lat: number,
    lng: number
  },
  state: string,
  district: string,
  village: string,
  availability: boolean,         // Currently available
  totalBookings: number,
  rating: number,                // Average rating
  totalRatings: number,          // Count of ratings
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Booking Model
```javascript
{
  id: string,
  farmerId: string,              // Reference to Farmer
  machineryId: string,           // Reference to Machinery
  ownerId: string,               // Reference to Owner
  agentId: string,               // Optional: Agent mediating
  status: "pending" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled",
  bookingDate: string,           // YYYY-MM-DD
  bookingTime: string,           // HH:MM
  startLocation: string,         // Farmer's location
  endLocation: string,           // Work completion location
  acreage: number,               // Land area in acres
  estimatedCost: number,         // Calculated cost
  actualCost: number,            // Final cost
  notes: string,                 // Special requests
  gpsTracking: boolean,          // Enable live tracking
  currentLocation: {             // Current machine location
    lat: number,
    lng: number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Rating Model
```javascript
{
  id: string,
  bookingId: string,             // Reference to Booking
  ratedBy: string,               // User giving rating
  ratedTo: string,               // User receiving rating
  rating: number,                // 1-5 stars
  review: string,                // Detailed review
  createdAt: Date
}
```

### 5. Notification Model
```javascript
{
  id: string,
  userId: string,                // Recipient
  type: "booking_request" | "booking_accepted" | "booking_rejected" | "on_the_way" | "completed",
  title: string,                 // Notification title
  message: string,               // Notification message
  relatedBookingId: string,      // Related booking
  read: boolean,                 // Read status
  createdAt: Date
}
```

---

## 🔌 API Endpoints Reference

### Authentication Endpoints

#### POST /api/auth/register
```
Request:
{
  fullName: string,
  email: string,
  phone: string,
  role: "farmer" | "owner" | "agent",
  state: string,
  district: string,
  village: string,
  location: { lat, lng }
}

Response:
{
  message: "OTP sent to your phone",
  userId: string,
  phone: string
}
```

#### POST /api/auth/verify-otp
```
Request:
{
  userId: string,
  otp: string,
  password: string
}

Response:
{
  message: "Registration successful",
  token: string,
  user: { id, fullName, email, phone, role, location }
}
```

#### POST /api/auth/login
```
Request:
{
  email: string,
  password: string,
  role: "farmer" | "owner" | "agent"
}

Response:
{
  message: "Login successful",
  token: string,
  user: { id, fullName, email, phone, role, location }
}
```

---

### Farmer Endpoints

#### GET /api/farmer/search?state=&district=&village=&machineryType=&maxPrice=&lat=&lng=
```
Query Parameters:
- state: string (optional)
- district: string (optional)
- village: string (optional)
- machineryType: string (optional)
- maxPrice: number (optional)
- lat: number (optional) - for GPS-based search
- lng: number (optional) - for GPS-based search

Response:
{
  count: number,
  machinery: [
    {
      id, name, category, pricePerHour, pricePerAcre,
      location, rating, totalRatings,
      owner: { id, fullName, phone, rating }
    }
  ]
}
```

#### GET /api/farmer/machinery/:id
```
Response:
{
  machinery: { full machinery object },
  owner: { full owner object },
  ratings: [ array of rating objects ],
  averageRating: number
}
```

#### POST /api/farmer/booking/create
```
Request:
{
  machineryId: string,
  bookingDate: string,
  bookingTime: string,
  startLocation: string,
  endLocation: string,
  acreage: number,
  notes: string
}

Response:
{
  message: "Booking request created",
  booking: { full booking object }
}
```

#### GET /api/farmer/bookings
```
Response:
{
  bookings: [
    {
      ...booking,
      machinery: { machinery object },
      owner: { owner object }
    }
  ]
}
```

#### POST /api/farmer/booking/:bookingId/rate
```
Request:
{
  rating: number (1-5),
  review: string
}

Response:
{
  message: "Rating submitted",
  rating: { rating object }
}
```

---

### Owner Endpoints

#### POST /api/owner/machinery/add
```
Request:
{
  name: string,
  category: string,
  implements: [string],
  images: [string],
  description: string,
  pricePerHour: number,
  pricePerAcre: number,
  location: { lat, lng },
  state: string,
  district: string,
  village: string
}

Response:
{
  message: "Machinery added successfully",
  machinery: { full machinery object }
}
```

#### PUT /api/owner/machinery/:id/pricing
```
Request:
{
  pricePerHour: number,
  pricePerAcre: number
}

Response:
{
  message: "Pricing updated",
  machinery: { updated machinery object }
}
```

#### GET /api/owner/machinery
```
Response:
{
  machinery: [ array of owner's machinery ]
}
```

#### GET /api/owner/bookings
```
Response:
{
  bookings: [
    {
      ...booking,
      machinery: { machinery object },
      farmer: { farmer object }
    }
  ]
}
```

#### PUT /api/owner/booking/:bookingId/respond
```
Request:
{
  action: "accept" | "reject"
}

Response:
{
  message: "Booking accepted/rejected",
  booking: { updated booking object }
}
```

#### GET /api/owner/earnings
```
Response:
{
  totalEarnings: number,
  completedBookings: number,
  dailyEarnings: {
    "2025-11-24": 5000,
    "2025-11-23": 3500,
    ...
  },
  bookings: [ array of completed bookings ]
}
```

---

### Agent Endpoints

#### GET /api/agent/users?role=&state=&district=
```
Query Parameters:
- role: "farmer" | "owner" (optional)
- state: string (optional)
- district: string (optional)

Response:
{
  users: [ array of user objects ]
}
```

#### GET /api/agent/bookings
```
Response:
{
  bookings: [
    {
      ...booking,
      farmer: { farmer object },
      machinery: { machinery object },
      owner: { owner object }
    }
  ]
}
```

#### POST /api/agent/user/add
```
Request:
{
  fullName: string,
  phone: string,
  role: "farmer" | "owner",
  state: string,
  district: string,
  village: string
}

Response:
{
  message: "User added successfully",
  user: { new user object }
}
```

---

### Common Endpoints

#### GET /api/notifications
```
Response:
{
  notifications: [
    {
      id, userId, type, title, message,
      relatedBookingId, read, createdAt
    }
  ]
}
```

#### PUT /api/notifications/:id/read
```
Response:
{
  message: "Notification marked as read",
  notification: { updated notification }
}
```

#### GET /api/profile
```
Response:
{
  user: { full user object (without password) }
}
```

#### PUT /api/profile
```
Request:
{
  fullName: string (optional),
  location: { lat, lng } (optional),
  state: string (optional),
  district: string (optional),
  village: string (optional),
  avatar: string (optional)
}

Response:
{
  message: "Profile updated",
  user: { updated user object }
}
```

#### GET /api/health
```
Response:
{
  status: "FARMSHA Server is running",
  timestamp: Date,
  environment: string
}
```

---

## 🔐 Authentication Flow

```
1. USER REGISTRATION (OTP-based)
   ├─ User selects role: Farmer/Owner/Agent
   ├─ Enters: Full Name, Email, Phone, Location
   ├─ Sends registration request
   ├─ Server generates OTP (6 digits)
   ├─ OTP sent to user's phone (mock/Twilio)
   ├─ User receives OTP
   ├─ User enters OTP + Password
   ├─ Server verifies OTP (10-minute expiry)
   ├─ Server hashes password with bcryptjs
   ├─ User account created in database
   ├─ JWT token generated
   ├─ Token stored in localStorage
   └─ User redirected to dashboard

2. USER LOGIN
   ├─ User selects role & enters email/password
   ├─ Server validates credentials
   ├─ Server generates JWT token
   ├─ Token sent to frontend
   ├─ Token stored in localStorage
   └─ User redirected to dashboard

3. AUTHENTICATED REQUEST
   ├─ Client includes Authorization header: "Bearer {token}"
   ├─ Server verifies JWT token
   ├─ If valid: Process request
   ├─ If invalid: Return 401 Unauthorized
   └─ Continue with business logic
```

---

## 🔄 Booking Workflow

```
┌─ FARMER CREATES BOOKING ──────────────────────┐
│                                                 │
│  1. Farmer searches machinery                  │
│  2. Selects machinery and clicks "Book"        │
│  3. Fills booking details (date, time, etc.)   │
│  4. Submits booking request                    │
│                                                 │
├─► Server creates Booking (status: pending)    │
├─► Creates notification for owner              │
└─► Returns success to farmer                   │
                  │
                  ▼
┌─ OWNER REVIEWS BOOKING ───────────────────────┐
│                                                 │
│  1. Owner receives notification                │
│  2. Views booking request details              │
│  3. Reviews farmer profile & requirements      │
│  4. Accepts or Rejects                         │
│                                                 │
├─► If Accept:                                   │
│   ├─ Booking status → "accepted"              │
│   ├─ Notify farmer of acceptance              │
│   └─ Farmer starts arranging transport         │
│                                                 │
└─► If Reject:                                   │
    ├─ Booking status → "rejected"              │
    ├─ Notify farmer with reason                │
    └─ Farmer can book different machinery       │
                  │
                  ▼
┌─ MACHINERY WORK ──────────────────────────────┐
│                                                 │
│  1. Machinery transported to farmer's location │
│  2. Work begins at specified time              │
│  3. Owner updates job progress                 │
│  4. Real-time GPS tracking (if enabled)       │
│  5. Work completion notification sent          │
│                                                 │
├─► Booking status → "in-progress"              │
├─► Farmer can track location                   │
└─► Owner updates progress                      │
                  │
                  ▼
┌─ BOOKING COMPLETION ──────────────────────────┐
│                                                 │
│  1. Work completed                             │
│  2. Final cost calculated                      │
│  3. Payment processed (ready for integration)  │
│  4. Completion notification sent               │
│  5. Booking marked as completed                │
│                                                 │
├─► Booking status → "completed"                │
├─► Farmer receives rating prompt                │
└─► Farmer can rate owner & machinery            │
```

---

## 🌐 Frontend Component Hierarchy

```
App.tsx
├── Routes
│   ├── /farmsha-auth
│   │   └── FarmShaAuth.tsx
│   │       ├── Login Tab
│   │       │   ├── Role Select
│   │       │   ├── Email Input
│   │       │   └── Password Input
│   │       └── Register Tab
│   │           ├── User Details Form
│   │           └── OTP Verification Form
│   │
│   ├── /dashboard/farmer
│   │   └── FarmerDashboard.tsx
│   │       ├── Header (Logout, Notifications)
│   │       ├── Tabs
│   │       │   ├── Search Tab
│   │       │   │   ├── Filter Form
│   │       │   │   ├── Machinery Cards
│   │       │   │   └── Booking Form
│   │       │   ├── Bookings Tab
│   │       │   │   └── Booking List
│   │       │   └── Notifications Tab
│   │       │       └── Notifications List
│   │       └── Various Components
│   │           ├── Card
│   │           ├── Badge
│   │           ├── Button
│   │           ├── Input
│   │           └── Select
│   │
│   ├── /dashboard/owner
│   │   └── OwnerDashboard.tsx
│   │       ├── Header (Logout, Notifications)
│   │       ├── Stats Cards
│   │       ├── Tabs
│   │       │   ├── Machinery Tab
│   │       │   │   ├── Add Machinery Form
│   │       │   │   ├── Machinery List
│   │       │   │   └── Pricing Editor
│   │       │   ├── Bookings Tab
│   │       │   │   └── Booking Requests
│   │       │   └── Earnings Tab
│   │       │       ├── Earnings Summary
│   │       │       └── Daily Breakdown
│   │       └── Various Components
│   │
│   ├── /dashboard/agent
│   │   └── AgentDashboard.tsx
│   │       ├── Header (Logout, Notifications)
│   │       ├── Stats Cards
│   │       ├── Tabs
│   │       │   ├── Users Tab
│   │       │   │   ├── Add User Form
│   │       │   │   ├── Search Filters
│   │       │   │   └── User List
│   │       │   ├── Bookings Tab
│   │       │   │   └── Booking List
│   │       │   └── Notifications Tab
│   │       │       └── Notifications List
│   │       └── Various Components
│   │
│   └── /
│       └── Landing.tsx
│
├── MachineryProvider (Context)
├── TooltipProvider
└── Toasters (UI)
```

---

## 🔄 State Management Flow

```
Frontend State Management:

┌─────────────────────────────────────┐
│   localStorage (Token Storage)      │
├─────────────────────────────────────┤
│ - farmsha_token: JWT string        │
│ - farmsha_user: User object JSON   │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Component State (useState)         │
├─────────────────────────────────────┤
│ - User data                         │
│ - Form inputs                       │
│ - Loading states                    │
│ - Error messages                    │
│ - Selected machinery                │
│ - Bookings list                     │
│ - Notifications list                │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   React Query (API Data)            │
├─────────────────────────────────────┤
│ - API responses cached              │
│ - Background refetching             │
│ - Automatic invalidation            │
└─────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture (Future)

```
                    ┌─────────────────────────────┐
                    │   Client Request            │
                    └────────────┬────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   CDN / Vercel          │
                    │  (Frontend Delivery)    │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
      ┌─────────▼──────────┐        ┌────────────▼───────────┐
      │  React App         │        │  API Requests          │
      │  (farmsha.in)      │        │  (api.farmsha.in)      │
      └────────────────────┘        └────────────┬───────────┘
                                                 │
                                    ┌────────────▼────────────┐
                                    │   Railway/Heroku/AWS    │
                                    │   (Backend Server)      │
                                    └────────────┬────────────┘
                                                 │
                                    ┌────────────▼────────────┐
                                    │  Node.js + Express      │
                                    │  (API Routes)           │
                                    └────────────┬────────────┘
                                                 │
                                    ┌────────────▼────────────┐
                                    │   Supabase/MongoDB      │
                                    │   (Database)            │
                                    └────────────────────────┘
```

---

This architecture provides:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability

**Ready for production deployment!** 🚀
