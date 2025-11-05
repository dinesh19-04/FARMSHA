const express = require('express');
const router = express.Router();
const {
  getPendingUsers,
  getActiveBookings,
  getRegionStats,
  verifyUser,
  updateAgentStatus
} = require('../controllers/agentController.cjs');

// Get agent's data
router.get('/pending-users', getPendingUsers);
router.get('/active-bookings', getActiveBookings);
router.get('/region-stats', getRegionStats);

// Manage users and status
router.put('/verify-user/:id', verifyUser);
router.put('/status', updateAgentStatus);

module.exports = router;