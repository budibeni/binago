export interface APIResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error_code?: string;
  message?: string;
  timestamp?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    role: string;
    company_code: string;
  };
}

export interface Vehicle {
  id: string;
  imei: string;
  plate_number: string;
  company_code: string;
  status: 'MOVING' | 'STOPPED' | 'IDLE' | 'OFFLINE';
  lat: number;
  lon: number;
  speed: number;
  heading: number;
  acc: boolean;
  battery: number;
  fuel_level?: number;
  fuel_volume?: number;
  fuel_temp_c?: number;
  satellites: number;
  altitude: number;
  gsm_signal: number;
  timestamp: string;
}
