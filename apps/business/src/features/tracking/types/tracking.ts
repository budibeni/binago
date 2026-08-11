// ─── Vehicle Status ────────────────────────────────────────────────────────────

export type VehicleStatus = 'driving' | 'idle' | 'parking' | 'offline';

// ─── View Mode ─────────────────────────────────────────────────────────────────

export type TrackingViewMode = 'map' | 'video';

// ─── Status Filter ─────────────────────────────────────────────────────────────

export type StatusFilter = 'all' | VehicleStatus;

// ─── Location ──────────────────────────────────────────────────────────────────

export interface VehicleLocation {
  lat: number;
  lng: number;
  address?: string;
}

// ─── Vehicle ───────────────────────────────────────────────────────────────────

export interface TrackingVehicle {
  id: string;
  plateNumber: string;
  driverName: string | null;
  groupId: string;
  groupName: string;
  status: VehicleStatus;
  speed: number;           // km/h
  location: VehicleLocation;
  lastUpdate: string;      // ISO 8601
  vehicleType?: string;    // e.g. 'Truk', 'Minibus'
}

// ─── Vehicle Group ─────────────────────────────────────────────────────────────

export interface TrackingVehicleGroup {
  id: string;
  name: string;
  vehicles: TrackingVehicle[];
}

// ─── Group Status Summary ──────────────────────────────────────────────────────

export interface GroupStatusSummary {
  driving: number;
  idle: number;
  parking: number;
  offline: number;
}

// ─── Date Range ────────────────────────────────────────────────────────────────

export interface DateRange {
  date: string;       // ISO date string: YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
}

// ─── Playback Status ───────────────────────────────────────────────────────────

export type PlaybackStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'error';

// ─── Playback State ────────────────────────────────────────────────────────────

export interface PlaybackState {
  status: PlaybackStatus;
  /** Total duration in seconds — only meaningful when status is 'ready' | 'playing' | 'paused' */
  totalDuration: number;
  /** Current playback position in seconds */
  currentTime: number;
  /** Error message when status === 'error' */
  errorMessage?: string;
}

