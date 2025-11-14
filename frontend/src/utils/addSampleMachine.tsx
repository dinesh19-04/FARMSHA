import { useMachinery } from "@/context/MachineryContext";

type MachineType = 'tractor' | 'harvester' | 'cultivator' | 'sprayer' | 'tiller' | 'transplanter';

interface SampleMachine {
  name: string;
  type: MachineType;
  rate: number;
  available: boolean;
  description: string;
  location: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    pincode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
}

const generateRandomCoordinates = (baseLat: number, baseLng: number, range = 0.2) => ({
  lat: baseLat + (Math.random() * range * 2 - range),
  lng: baseLng + (Math.random() * range * 2 - range)
});

const sampleMachines: Omit<SampleMachine, 'location'>[] = [
  // Tractors
  {
    name: "John Deere 5050D",
    type: "tractor",
    rate: 1200,
    available: true,
    description: "50HP tractor with front loader attachment. Well maintained with low hours.",
    images: ["https://images.unsplash.com/photo-1638132960589-cf9e8e4f3d6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
  },
  {
    name: "Mahindra 575 DI",
    type: "tractor",
    rate: 1000,
    available: true,
    description: "45HP tractor with 8 forward + 2 reverse gears. Excellent condition.",
    images: ["https://5.imimg.com/data5/SELLER/Default/2021/1/VC/SA/ND/1003082/mahindra-575-di-tractor-500x500.jpg"]
  },
  
  // Harvesters
  {
    name: "Kubota DC60",
    type: "harvester",
    rate: 2500,
    available: true,
    description: "4-row paddy harvester with 60HP engine. Low maintenance and high efficiency.",
    images: ["https://5.imimg.com/data5/SELLER/Default/2022/1/JS/VA/TO/120784348/kubota-dc60-paddy-harvester-500x500.jpg"]
  },
  
  // Cultivators
  {
    name: "Sonalika Cultivator",
    type: "cultivator",
    rate: 800,
    available: true,
    description: "9 tine cultivator, perfect for soil preparation and weed control.",
    images: ["https://5.imimg.com/data5/SELLER/Default/2021/12/YC/HE/IG/116085507/sonalika-cultivator-500x500.jpg"]
  },
  
  // Sprayers
  {
    name: "John Deere 4036",
    type: "sprayer",
    rate: 700,
    available: true,
    description: "Self-propelled sprayer with 400L tank capacity. Perfect for large fields.",
    images: ["https://5.imimg.com/data5/SELLER/Default/2022/1/HS/AN/ZD/120784348/john-deere-4036-sprayer-500x500.jpg"]
  },
  
  // Tillers
  {
    name: "VST Shakti 135 DI",
    type: "tiller",
    rate: 600,
    available: true,
    description: "Power tiller with 13.5HP engine. Ideal for small to medium farms.",
    images: ["https://5.imimg.com/data5/SELLER/Default/2021/12/GG/DF/VP/120784348/vst-shakti-135-di-power-tiller-500x500.jpg"]
  },
  
  // Transplanters
  {
    name: "Kubota SPW-48C",
    type: "transplanter",
    rate: 1500,
    available: true,
    description: "4-row rice transplanter with 5HP engine. High precision planting.",
    images: ["https://5.imimg.com/data5/SELLER/Default/2022/1/HS/AN/ZD/120784348/kubota-spw-48c-rice-transplanter-500x500.jpg"]
  }
];

export const addSampleMachine = () => {
  const { addMachinery } = useMachinery();
  
  // Base location in Kerala (Ernakulam district)
  const baseLocation = {
    state: "Kerala",
    district: "Ernakulam",
    taluk: "Kothamangalam",
    village: "Kuttampuzha",
    pincode: "685591",
    coordinates: generateRandomCoordinates(10.1, 76.5, 0.3) // Wider spread for different machines
  };
  
  // Select a random machine from our sample data
  const randomMachine = sampleMachines[Math.floor(Math.random() * sampleMachines.length)];
  
  // Create the machine with location
  const machineWithLocation = {
    ...randomMachine,
    location: {
      ...baseLocation,
      village: ["Kuttampuzha", "Neriamangalam", 'Kothamangalam', 'Muvattupuzha', 'Perumbavoor'][Math.floor(Math.random() * 5)],
      coordinates: generateRandomCoordinates(10.1, 76.5, 0.3)
    }
  };

  addMachinery(machineWithLocation);
  console.log(`Added sample machine: ${machineWithLocation.name}`);
  return machineWithLocation;
};

// Function to add multiple sample machines at once
export const addMultipleSampleMachines = (count: number = 3) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(addSampleMachine());
  }
  return results;
};
