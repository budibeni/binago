export type EmergencyCategory = 'kerusakan' | 'kehilangan' | 'kecelakaan' | 'lainnya';
export type EmergencyStatus = 'baru' | 'ditangani' | 'selesai';

export interface EmergencyReportNote {
  id: string;
  timestamp: string;  // ISO string
  author: string;     // e.g. "Supervisor Doni"
  content: string;    // Isi catatan
}

export interface EmergencyReport {
  id: string;
  timestamp: string;        // ISO string
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  vehicleType: string;
  category: EmergencyCategory;
  description: string;
  location: string;          // Human-readable address
  coordinates: { lat: number; lng: number };
  status: EmergencyStatus;
  handledBy?: string;        // Nama admin yang menangani
  handledAt?: string;        // ISO string
  resolvedAt?: string;       // ISO string
  notes?: string;            // Ringkasan catatan terakhir
  activityLog?: EmergencyReportNote[]; // Timeline log catatan berkala
}
