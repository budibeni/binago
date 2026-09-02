export interface Checker {
  id: string;
  name: string;
  assignedGeofenceId: string; // CORE Geofence.id
  status: 'ACTIVE' | 'INACTIVE';
}
