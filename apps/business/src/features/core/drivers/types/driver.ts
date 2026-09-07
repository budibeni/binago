import { z } from 'zod';

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

export const getDriverFormSchema = (t: Record<string, string>) => z.object({
  name: z.string().min(1, t.nameRequired || 'Nama lengkap wajib diisi'),
  ktpNumber: z.string().min(1, t.ktpRequired || 'Nomor KTP wajib diisi'),
  placeOfBirth: z.string().optional(),
  dateOfBirth: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().min(1, t.phoneRequired || 'Nomor telepon wajib diisi'),
  address: z.string().optional(),
  placement: z.string().min(1, t.placementRequired || 'Penempatan wajib diisi'),
  groupId: z.string().min(1, t.groupRequired || 'Grup armada wajib dipilih'),
  licenseNumber: z.string().min(1, t.licenseRequired || 'Nomor SIM wajib diisi'),
  licenseExpiry: z.string().optional(),
  joinDate: z.string().optional(),
});
