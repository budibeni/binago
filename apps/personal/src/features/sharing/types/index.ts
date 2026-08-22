export type ShareSessionStatus = 'active' | 'expired' | 'revoked';

export interface ShareSession {
  id: string;
  vehicleId: string;
  /** Public token used in URL - never exposes vehicleId */
  token: string;
  durationHours: number;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string
  status: ShareSessionStatus;
}
