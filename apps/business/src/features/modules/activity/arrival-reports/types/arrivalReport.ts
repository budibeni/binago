export type ArrivalStatus = 'verified' | 'pending_review' | 'flagged';
export type DestinationType =
  | 'Gudang Klien'
  | 'Pusat Distribusi'
  | 'Proyek / Konstruksi'
  | 'Retail / Mall'
  | 'Fasilitas Umum'
  | 'Lainnya';

export interface ArrivalReportRecord {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar?: string;
  vehiclePlate: string;
  vehicleModel?: string;
  destinationName: string;
  destinationType: DestinationType;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photo: string; // SVG data URI or URL
  recipientName?: string;
  recipientPhone?: string;
  status: ArrivalStatus;
  notes?: string;
}

export interface ArrivalReportStats {
  total: number;
  today: number;
  verified: number;
  pendingReview: number;
  uniqueDestinations: number;
}
