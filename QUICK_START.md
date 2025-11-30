# 🚀 FARMSHA - Quick Setup Guide

## Installation & Startup (5 minutes)

### Step 1: Navigate to project
```bash
cd c:\Users\acer\OneDrive\Desktop\Farmshare
```

### Step 2: Install dependencies (first time only)
```bash
npm run install:all
```

### Step 3: Start Backend (Terminal 1)
```bash
npm run dev:backend
# OR
cd backend && npm start
```
✅ Backend runs on: **http://localhost:5000/api**

### Step 4: Start Frontend (Terminal 2)
```bash
npm run dev:frontend
# OR
cd frontend && npm run dev
```
✅ Frontend runs on: **http://localhost:5173**

---

## 📱 Quick Access URLs

| Module | URL | Login Role |
|--------|-----|-----------|
| **Auth Page** | http://localhost:5173/farmsha-auth | All |
| **Farmer Dashboard** | http://localhost:5173/dashboard/farmer | farmer |
| **Owner Dashboard** | http://localhost:5173/dashboard/owner | owner |
| **Agent Dashboard** | http://localhost:5173/dashboard/agent | agent |
| **API Health** | http://localhost:5000/api/health | - |

---

## 👤 Test Accounts

### Farmer
- **Email**: farmer@test.com
- **Phone**: +91 9999999991
- **Password**: password123

### Machinery Owner
- **Email**: owner@test.com
- **Phone**: +91 9999999992
- **Password**: password123

### Agent
- **Email**: agent@test.com
- **Phone**: +91 9999999993
- **Password**: password123

---

## 🧪 Quick Testing Flow

### 1️⃣ Farmer Flow
1. Go to `/farmsha-auth`
2. Click "Register" tab
3. Select "Farmer" role
4. Enter phone number (e.g., 9999999991)
5. Enter OTP: **123456** (any 6 digits for testing)
6. Create password: password123
7. ✅ Auto-redirected to `/dashboard/farmer`
8. Try searching for machinery

### 2️⃣ Owner Flow
1. Go to `/farmsha-auth`
2. Select "Owner" role
3. Complete registration
4. ✅ Access `/dashboard/owner`
5. Add machinery with pricing
6. View booking requests

### 3️⃣ Agent Flow
1. Go to `/farmsha-auth`
2. Select "Agent" role
3. Complete registration
4. ✅ Access `/dashboard/agent`
5. View users and bookings in region
6. Manage disputes

---

## 📂 File Structure Overview

```
Farmshare/
├── backend/
│   └── server.js                    ← Main server with all API routes
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── FarmShaAuth.tsx      ← New unified auth
│       │   ├── FarmerDashboard.tsx  ← Farmer module
│       │   ├── OwnerDashboard.tsx   ← Owner module
│       │   ├── AgentDashboard.tsx   ← Agent module
│       │   └── ...
│       ├── services/
│       │   └── farmsha-api.ts       ← All API calls
│       └── App.tsx                  ← Routes config
├── FARMSHA_README.md                ← Full documentation
└── package.json                     ← Monorepo config
```

---

## 🔧 Common Issues & Solutions

### Issue: Port 5000 already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or use different port
PORT=5001 npm run dev:backend
```

### Issue: Frontend can't connect to backend
```bash
# Check if backend is running
curl http://localhost:5000/api/health
# If error, restart backend
npm run dev:backend
```

### Issue: CORS errors
✅ Already configured in `server.js` for localhost:5173
- Adjust `cors` origins if using different port

### Issue: OTP verification fails
✅ For development, any 6-digit code works (e.g., 000000, 123456)

---

## 📊 Key Features to Test

### ✅ Farmer Module
- [x] Search machinery with filters
- [x] View machinery details
- [x] Create booking request
- [x] View my bookings
- [x] Rate machinery after use

### ✅ Owner Module
- [x] Add machinery with pricing
- [x] Update pricing dynamically
- [x] Accept/reject booking requests
- [x] View earnings and analytics
- [x] Manage machinery availability

### ✅ Agent Module
- [x] Search and filter users
- [x] Add users manually
- [x] Track bookings in region
- [x] View user metrics
- [x] Manage notifications

---

## 🚢 Deployment (When Ready)

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build:frontend
# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway)
```bash
# Add Procfile
web: node backend/server.js
# Deploy with git push
```

---

## 📞 Support

For issues:
1. Check the full documentation: `FARMSHA_README.md`
2. Verify backend/frontend are running
3. Check browser console for errors
4. Review API response in Network tab

---

## 🎯 Next Steps

1. **Test all modules** - Go through each role's features
2. **Connect database** - Replace in-memory storage with MongoDB/PostgreSQL
3. **Integrate payments** - Add Razorpay/Stripe payment gateway
4. **Add notifications** - Implement Socket.io for real-time updates
5. **Deploy** - Push to production platforms

---

**Happy testing! 🌾**
