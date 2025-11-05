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

// Get pending user verifications
const getPendingUsers = (req, res) => {
  // TODO: Replace with actual database query
  res.json({ users: pendingUsers });
};

// Get active bookings
const getActiveBookings = (req, res) => {
  // TODO: Replace with actual database query
  res.json({ bookings: activeBookings });
};

// Get region statistics
const getRegionStats = (req, res) => {
  // TODO: Replace with actual database query
  res.json({ stats: regionStats });
};

// Verify user
const verifyUser = (req, res) => {
  const { userId, action } = req.body;
  // TODO: Update in database
  res.json({ message: `User ${action === 'approve' ? 'approved' : 'rejected'} successfully` });
};

// Update agent status
const updateAgentStatus = (req, res) => {
  const { isActive } = req.body;
  // TODO: Update in database
  res.json({ message: `Agent status updated to ${isActive ? 'active' : 'inactive'}` });
};

module.exports = {
  getPendingUsers,
  getActiveBookings,
  getRegionStats,
  verifyUser,
  updateAgentStatus
};