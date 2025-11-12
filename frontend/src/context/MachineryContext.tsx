import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Location {
  state: string;
  district: string;
  taluk: string;
  village: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Machinery {
  id: string;
  name: string;
  type: string;
  rate: number;
  available: boolean;
  location: Location;
  description?: string;
  images?: string[];
  distance?: number;
}

interface MachineryContextType {
  machinery: Machinery[];
  addMachinery: (machine: Omit<Machinery, 'id'>) => void;
  updateMachinery: (id: string, updates: Partial<Machinery>) => void;
  deleteMachinery: (id: string) => void;
}

const MachineryContext = createContext<MachineryContextType | undefined>(undefined);

export const MachineryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [machinery, setMachinery] = useState<Machinery[]>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('farmShareMachinery');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save to localStorage whenever machinery changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmShareMachinery', JSON.stringify(machinery));
    }
  }, [machinery]);

  const addMachinery = (machine: Omit<Machinery, 'id'>) => {
    const newMachine: Machinery = {
      ...machine,
      id: Date.now().toString(),
      images: machine.images || [],
      location: {
        ...machine.location,
        coordinates: machine.location.coordinates || {
          lat: 10 + Math.random() * 2,
          lng: 76 + Math.random() * 2
        }
      }
    };
    console.log('Adding new machinery:', newMachine);
    setMachinery(prev => {
      const updated = [...prev, newMachine];
      console.log('Updated machinery list:', updated);
      return updated;
    });
  };

  const updateMachinery = (id: string, updates: Partial<Machinery>) => {
    setMachinery(prev => 
      prev.map(machine => 
        machine.id === id ? { ...machine, ...updates } : machine
      )
    );
  };

  const deleteMachinery = (id: string) => {
    setMachinery(prev => prev.filter(machine => machine.id !== id));
  };

  return (
    <MachineryContext.Provider 
      value={{ 
        machinery, 
        addMachinery, 
        updateMachinery, 
        deleteMachinery 
      }}
    >
      {children}
    </MachineryContext.Provider>
  );
};

export const useMachinery = (): MachineryContextType => {
  const context = useContext(MachineryContext);
  if (context === undefined) {
    throw new Error('useMachinery must be used within a MachineryProvider');
  }
  return context;
};
