# FARMSHA - Smart Agricultural Machinery Sharing Platform

A comprehensive platform connecting farmers with machinery owners and agents, enabling seamless booking and management of agricultural equipment similar to Uber/Rapido for farm machinery.

## Features

- **Farmer Module**: Search, filter, and book machinery with live GPS tracking
- **Machinery Owner Module**: Add machinery, manage bookings, track earnings
- **Agent Module**: Coordinate between farmers and owners, manage disputes
- **Advanced Search & Filtering**: State → District → Village + Live GPS Location
- **Real-time Notifications**: Booking updates, GPS tracking, work status
- **Rating & Review System**: Farmer and machinery ratings
- **Live Booking Tracking**: Real-time tracking like Uber
- **OTP/Mobile Login**: Secure authentication for rural users
- **Responsive Design**: Optimized for web and mobile app conversion

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, JWT Authentication
- **UI Components**: Radix UI, Lucide Icons
- **Styling**: Tailwind CSS with custom design system

## Project Structure

```
farmshare/
├── frontend/          # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/           # Node.js backend API
│   ├── routes/       # API routes
│   ├── controllers/  # Route handlers
│   └── package.json  # Backend dependencies
└── package.json      # Root package.json for scripts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd farmshare
```

2. Install dependencies for both frontend and backend
```bash
npm run install:all
```

### Development

1. Start the backend server:
```bash
npm run dev:backend
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev:frontend
```

3. Open [http://localhost:8081](http://localhost:8081) for the frontend
4. Backend API runs on [http://localhost:5000](http://localhost:5000)

### Available Scripts

- `npm run dev:frontend` - Start frontend development server
- `npm run dev:backend` - Start backend development server
- `npm run build:frontend` - Build frontend for production
- `npm run install:all` - Install dependencies for both frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
