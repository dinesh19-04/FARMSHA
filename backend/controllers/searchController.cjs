// Enhanced machinery data with detailed location and owner information
const machineryDatabase = [
  {
    id: "1",
    name: "John Deere 5075E",
    type: "tractor",
    category: "Agricultural Tractor",
    rate: 500,
    available: true,
    owner: {
      id: "owner1",
      name: "Rajesh Kumar",
      phone: "+91-9876543210",
      email: "rajesh.kumar@email.com"
    },
    location: {
      state: "Punjab",
      district: "Amritsar",
      village: "Majitha",
      pincode: "143601",
      coordinates: { lat: 31.6340, lng: 74.8723 }
    },
    specifications: {
      horsepower: "75 HP",
      fuelType: "Diesel",
      year: 2022,
      condition: "Excellent"
    },
    images: ["tractor1.jpg"],
    description: "Well-maintained John Deere tractor suitable for all farming operations"
  },
  {
    id: "2",
    name: "New Holland TC5070",
    type: "tractor",
    category: "Agricultural Tractor",
    rate: 450,
    available: true,
    owner: {
      id: "owner2",
      name: "Priya Sharma",
      phone: "+91-9876543211",
      email: "priya.sharma@email.com"
    },
    location: {
      state: "Punjab",
      district: "Ludhiana",
      village: "Pakhowal",
      pincode: "141013",
      coordinates: { lat: 30.9010, lng: 75.8573 }
    },
    specifications: {
      horsepower: "70 HP",
      fuelType: "Diesel",
      year: 2021,
      condition: "Good"
    },
    images: ["tractor2.jpg"],
    description: "Reliable New Holland tractor for medium-scale farming"
  },
  {
    id: "3",
    name: "Mahindra Arjun 605 DI",
    type: "tractor",
    category: "Agricultural Tractor",
    rate: 400,
    available: false,
    owner: {
      id: "owner3",
      name: "Amit Singh",
      phone: "+91-9876543212",
      email: "amit.singh@email.com"
    },
    location: {
      state: "Punjab",
      district: "Jalandhar",
      village: "Nakodar",
      pincode: "144040",
      coordinates: { lat: 31.1260, lng: 75.4735 }
    },
    specifications: {
      horsepower: "60 HP",
      fuelType: "Diesel",
      year: 2020,
      condition: "Good"
    },
    images: ["tractor3.jpg"],
    description: "Mahindra Arjun tractor ideal for small to medium farms"
  },
  {
    id: "4",
    name: "Class Lexion 780",
    type: "harvester",
    category: "Combine Harvester",
    rate: 1200,
    available: true,
    owner: {
      id: "owner4",
      name: "Suresh Patel",
      phone: "+91-9876543213",
      email: "suresh.patel@email.com"
    },
    location: {
      state: "Punjab",
      district: "Patiala",
      village: "Samana",
      pincode: "147001",
      coordinates: { lat: 30.3398, lng: 76.3869 }
    },
    specifications: {
      cuttingWidth: "35 feet",
      grainTankCapacity: "10500 liters",
      year: 2023,
      condition: "Excellent"
    },
    images: ["harvester1.jpg"],
    description: "High-capacity combine harvester for large-scale harvesting operations"
  },
  {
    id: "5",
    name: "Case IH 2366",
    type: "harvester",
    category: "Combine Harvester",
    rate: 1100,
    available: true,
    owner: {
      id: "owner5",
      name: "Kavita Reddy",
      phone: "+91-9876543214",
      email: "kavita.reddy@email.com"
    },
    location: {
      state: "Haryana",
      district: "Karnal",
      village: "Assandh",
      pincode: "132039",
      coordinates: { lat: 29.5218, lng: 76.6066 }
    },
    specifications: {
      cuttingWidth: "30 feet",
      grainTankCapacity: "8000 liters",
      year: 2022,
      condition: "Good"
    },
    images: ["harvester2.jpg"],
    description: "Efficient Case IH harvester for wheat and rice harvesting"
  },
  {
    id: "6",
    name: "Fieldking Super Seeder",
    type: "seeder",
    category: "Seeding Equipment",
    rate: 350,
    available: true,
    owner: {
      id: "owner6",
      name: "Vikram Yadav",
      phone: "+91-9876543215",
      email: "vikram.yadav@email.com"
    },
    location: {
      state: "Punjab",
      district: "Moga",
      village: "Baghapurana",
      pincode: "142038",
      coordinates: { lat: 30.6890, lng: 75.0974 }
    },
    specifications: {
      workingWidth: "12 feet",
      seedingRate: "Variable",
      year: 2021,
      condition: "Good"
    },
    images: ["seeder1.jpg"],
    description: "Super seeder for direct seeding in rice stubble"
  },
  {
    id: "7",
    name: "Swaraj 855 FE",
    type: "tractor",
    category: "Agricultural Tractor",
    rate: 380,
    available: true,
    owner: {
      id: "owner7",
      name: "Deepak Gupta",
      phone: "+91-9876543216",
      email: "deepak.gupta@email.com"
    },
    location: {
      state: "Uttar Pradesh",
      district: "Meerut",
      village: "Sardhana",
      pincode: "250342",
      coordinates: { lat: 29.1492, lng: 77.6130 }
    },
    specifications: {
      horsepower: "55 HP",
      fuelType: "Diesel",
      year: 2020,
      condition: "Good"
    },
    images: ["tractor4.jpg"],
    description: "Compact Swaraj tractor suitable for small farms"
  },
  {
    id: "8",
    name: "Kubota M7060",
    type: "tractor",
    category: "Agricultural Tractor",
    rate: 600,
    available: true,
    owner: {
      id: "owner8",
      name: "Anita Joshi",
      phone: "+91-9876543217",
      email: "anita.joshi@email.com"
    },
    location: {
      state: "Maharashtra",
      district: "Pune",
      village: "Baramati",
      pincode: "413102",
      coordinates: { lat: 18.1124, lng: 74.5815 }
    },
    specifications: {
      horsepower: "70 HP",
      fuelType: "Diesel",
      year: 2023,
      condition: "Excellent"
    },
    images: ["tractor5.jpg"],
    description: "Modern Kubota tractor with advanced features"
  },
  {
    id: "9",
    name: "Eicher 5660 Super DI",
    type: "tractor",
    category: "Agricultural Tractor",
    rate: 420,
    available: true,
    owner: {
      id: "owner9",
      name: "Ramesh Patel",
      phone: "+91-9876543218",
      email: "ramesh.patel@email.com"
    },
    location: {
      state: "Gujarat",
      district: "Ahmedabad",
      village: "Dholka",
      pincode: "382225",
      coordinates: { lat: 22.7279, lng: 72.4418 }
    },
    specifications: {
      horsepower: "60 HP",
      fuelType: "Diesel",
      year: 2021,
      condition: "Good"
    },
    images: ["tractor6.jpg"],
    description: "Reliable Eicher tractor for diverse farming needs"
  },
  {
    id: "10",
    name: "John Deere S660",
    type: "harvester",
    category: "Combine Harvester",
    rate: 1500,
    available: true,
    owner: {
      id: "owner10",
      name: "Sunita Kaur",
      phone: "+91-9876543219",
      email: "sunita.kaur@email.com"
    },
    location: {
      state: "Punjab",
      district: "Bathinda",
      village: "Rampura Phul",
      pincode: "151103",
      coordinates: { lat: 30.2586, lng: 75.2441 }
    },
    specifications: {
      cuttingWidth: "40 feet",
      grainTankCapacity: "14000 liters",
      year: 2023,
      condition: "Excellent"
    },
    images: ["harvester3.jpg"],
    description: "Premium John Deere combine harvester for large operations"
  },
  {
    id: "11",
    name: "Lemken Plough",
    type: "ploughing_machine",
    category: "Ploughing Equipment",
    rate: 300,
    available: true,
    owner: {
      id: "owner11",
      name: "Harpreet Singh",
      phone: "+91-9876543220",
      email: "harpreet.singh@email.com"
    },
    location: {
      state: "Punjab",
      district: "Ferozepur",
      village: "Zira",
      pincode: "152024",
      coordinates: { lat: 30.9686, lng: 74.9910 }
    },
    specifications: {
      workingWidth: "8 feet",
      ploughShares: "4",
      year: 2022,
      condition: "Good"
    },
    images: ["plough1.jpg"],
    description: "Heavy-duty plough for deep tillage operations"
  },
  {
    id: "12",
    name: "Tata 407 Load Vehicle",
    type: "load_vehicle",
    category: "Transportation",
    rate: 800,
    available: true,
    owner: {
      id: "owner12",
      name: "Mohan Lal",
      phone: "+91-9876543221",
      email: "mohan.lal@email.com"
    },
    location: {
      state: "Rajasthan",
      district: "Jaipur",
      village: "Chomu",
      pincode: "303702",
      coordinates: { lat: 27.1592, lng: 75.7138 }
    },
    specifications: {
      loadCapacity: "2.5 tons",
      fuelType: "Diesel",
      year: 2020,
      condition: "Good"
    },
    images: ["truck1.jpg"],
    description: "Reliable load vehicle for transporting farm produce"
  }
];

// Get all unique states, districts, and villages for filter options
const getLocationOptions = (req, res) => {
  try {
    const states = [...new Set(machineryDatabase.map(item => item.location.state))].sort();
    const districts = [...new Set(machineryDatabase.map(item => item.location.district))].sort();
    const villages = [...new Set(machineryDatabase.map(item => item.location.village))].sort();
    
    res.json({
      states,
      districts,
      villages
    });
  } catch (error) {
    console.error('Error fetching location options:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get districts by state
const getDistrictsByState = (req, res) => {
  try {
    const { state } = req.params;
    const districts = [...new Set(
      machineryDatabase
        .filter(item => item.location.state.toLowerCase() === state.toLowerCase())
        .map(item => item.location.district)
    )].sort();
    
    res.json({ districts });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get villages by district
const getVillagesByDistrict = (req, res) => {
  try {
    const { state, district } = req.params;
    const villages = [...new Set(
      machineryDatabase
        .filter(item => 
          item.location.state.toLowerCase() === state.toLowerCase() &&
          item.location.district.toLowerCase() === district.toLowerCase()
        )
        .map(item => item.location.village)
    )].sort();
    
    res.json({ villages });
  } catch (error) {
    console.error('Error fetching villages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Advanced search with multiple filters
const searchMachinery = (req, res) => {
  try {
    const {
      query = '',
      type = '',
      state = '',
      district = '',
      village = '',
      available = '',
      minRate = '',
      maxRate = '',
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    let filteredResults = machineryDatabase.filter(item => {
      // Text search in name, category, and description
      const matchesQuery = !query || 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.owner.name.toLowerCase().includes(query.toLowerCase());

      // Type filter
      const matchesType = !type || item.type.toLowerCase() === type.toLowerCase();

      // Location filters
      const matchesState = !state || item.location.state.toLowerCase() === state.toLowerCase();
      const matchesDistrict = !district || item.location.district.toLowerCase() === district.toLowerCase();
      const matchesVillage = !village || item.location.village.toLowerCase() === village.toLowerCase();

      // Availability filter
      const matchesAvailability = available === '' || 
        (available === 'true' && item.available) ||
        (available === 'false' && !item.available);

      // Rate range filter
      const matchesMinRate = !minRate || item.rate >= parseInt(minRate);
      const matchesMaxRate = !maxRate || item.rate <= parseInt(maxRate);

      return matchesQuery && matchesType && matchesState && matchesDistrict && 
             matchesVillage && matchesAvailability && matchesMinRate && matchesMaxRate;
    });

    // Sorting
    filteredResults.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rate':
          aValue = a.rate;
          bValue = b.rate;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'location':
          aValue = `${a.location.district}, ${a.location.state}`.toLowerCase();
          bValue = `${b.location.district}, ${b.location.state}`.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    // Response with metadata
    res.json({
      machinery: paginatedResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredResults.length / parseInt(limit)),
        totalResults: filteredResults.length,
        hasNext: endIndex < filteredResults.length,
        hasPrev: startIndex > 0
      },
      filters: {
        availableTypes: [...new Set(machineryDatabase.map(item => item.type))],
        priceRange: {
          min: Math.min(...machineryDatabase.map(item => item.rate)),
          max: Math.max(...machineryDatabase.map(item => item.rate))
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get machinery by ID with full details
const getMachineryById = (req, res) => {
  try {
    const { id } = req.params;
    const machinery = machineryDatabase.find(item => item.id === id);
    
    if (!machinery) {
      return res.status(404).json({ message: 'Machinery not found' });
    }
    
    res.json({ machinery });
  } catch (error) {
    console.error('Error fetching machinery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get machinery types with counts
const getMachineryTypes = (req, res) => {
  try {
    const typeCounts = machineryDatabase.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    
    const types = Object.keys(typeCounts).map(type => ({
      type,
      count: typeCounts[type],
      displayName: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
    
    res.json({ types });
  } catch (error) {
    console.error('Error fetching machinery types:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  searchMachinery,
  getLocationOptions,
  getDistrictsByState,
  getVillagesByDistrict,
  getMachineryById,
  getMachineryTypes
};
