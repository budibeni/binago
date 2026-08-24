export type DriverStatus = 'active' | 'inactive' | 'on_leave';
export type DriverStatusFilter = 'all' | DriverStatus;

export interface DriverHistory {
  id: string;
  date: string;
  type: 'assignment' | 'violation' | 'achievement' | 'leave';
  description: string;
  vehicleId?: string; // If related to a vehicle
}

export interface Driver {
  id: string;
  name: string;
  avatarUrl?: string;
  
  // Contacts
  phone: string;
  email: string;
  address: string;
  
  // Identity
  ktpNumber: string;
  placeOfBirth: string;
  dateOfBirth: string; // YYYY-MM-DD
  
  // Work Info
  joinDate: string; // YYYY-MM-DD
  placement: string; // Branch/Location
  groupId?: string;
  groupName?: string;
  
  // Licensing
  licenseNumber: string;
  licenseExpiry: string; // YYYY-MM-DD
  
  // Status
  status: DriverStatus;
  assignedVehicleId?: string; // Currently driving
  assignedVehiclePlate?: string;
  
  // Performance
  performanceScore: number; // 0 - 100
  
  history: DriverHistory[];
}
