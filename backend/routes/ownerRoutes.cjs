const express = require('express');
const router = express.Router();
const {
  getMachinery,
  getBookingRequests,
  getEarningsData,
  addMachinery,
  updateMachineryStatus,
  handleBookingRequest
} = require('../controllers/ownerController.cjs');

// Get owner's data
router.get('/machinery', getMachinery);
router.get('/booking-requests', getBookingRequests);
router.get('/earnings', getEarningsData);

// Manage machinery
router.post('/machinery', addMachinery);
router.put('/machinery/:id/status', updateMachineryStatus);

// Handle bookings
router.put('/booking/:id', handleBookingRequest);

module.exports = router;