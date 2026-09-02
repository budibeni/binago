export type PassengerEventType = 'BOARDING' | 'ALIGHTING';

export interface PassengerEvent {
  id: string;
  departureId: string; // Transport Departure.id
  vehicleId: string;   // CORE Vehicle.id
  geofenceId: string;  // CORE Geofence.id
  type: PassengerEventType;
  quantity: number;
  recordedAt: string;  // ISO 8601
  recordedBy?: string; // Checker ID
  note?: string;
}
