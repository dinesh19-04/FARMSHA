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

// Get owner's machinery list
const getMachinery = (req, res) => {
  // TODO: Replace with actual database query
  res.json({ machines: dummyMachines });
};

// Get owner's booking requests
const getBookingRequests = (req, res) => {
  // TODO: Replace with actual database query
  res.json({ requests: dummyRequests });
};

// Get owner's earnings data
const getEarningsData = (req, res) => {
  // TODO: Replace with actual database query
  res.json({ earnings: earningsData });
};

// Add new machinery
const addMachinery = (req, res) => {
  const { name, type, rate } = req.body;
  // TODO: Add to database
  res.status(201).json({ message: 'Machinery added successfully' });
};

// Update machinery status
const updateMachineryStatus = (req, res) => {
  const { id, available } = req.body;
  // TODO: Update in database
  res.json({ message: 'Status updated successfully' });
};

// Handle booking request
const handleBookingRequest = (req, res) => {
  const { requestId, action } = req.body;
  // TODO: Update in database
  res.json({ message: `Booking ${action}d successfully` });
};

module.exports = {
  getMachinery,
  getBookingRequests,
  getEarningsData,
  addMachinery,
  updateMachineryStatus,
  handleBookingRequest
};