export type TaskAttendanceStatus = 'completed' | 'in_progress';

export interface TaskAttendanceLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceMeters: number;
  isNearVehicle: boolean;
}

export interface TaskAttendanceRecord {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar?: string;
  vehiclePlate: string;
  vehicleModel: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO string
  endTime?: string; // ISO string
  durationMinutes?: number;
  startLocation: TaskAttendanceLocation;
  endLocation?: TaskAttendanceLocation;
  startPhoto: string; // URL / SVG data URI
  endPhoto?: string; // URL / SVG data URI
  status: TaskAttendanceStatus;
  notes?: string;
}

export interface TaskAttendanceStats {
  total: number;
  completed: number;
  inProgress: number;
  avgDurationMinutes: number;
}
