const express = require('express');
const router = express.Router();
const {
  searchMachinery,
  getLocationOptions,
  getDistrictsByState,
  getVillagesByDistrict,
  getMachineryById,
  getMachineryTypes
} = require('../controllers/searchController.cjs');

// Main search endpoint with filters
router.get('/machinery', searchMachinery);

// Get machinery by ID
router.get('/machinery/:id', getMachineryById);

// Get all location options
router.get('/locations', getLocationOptions);

// Get districts by state
router.get('/locations/:state/districts', getDistrictsByState);

// Get villages by district
router.get('/locations/:state/:district/villages', getVillagesByDistrict);

// Get machinery types with counts
router.get('/types', getMachineryTypes);

module.exports = router;
