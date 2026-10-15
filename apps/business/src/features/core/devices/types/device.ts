import { z } from 'zod';

export type DeviceStatus = 'idle' | 'assigned' | 'active' | 'offline';
export type DeviceProtocol = 'SMARTPHONE' | 'HTTP_MOBILE' | 'GT06' | 'TELTONIKA' | 'TK103' | 'JT808' | 'OTHER';

export interface Device {
  imei: string;
  deviceBrand: string;
  deviceModel: string;
  simNumber?: string;
  protocol: string;
  assignedCompany: string;
  status: DeviceStatus;
  iccid?: string;
  vehicleId?: number;
  vehicleName?: string;
  plateNumber?: string;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceFilter {
  search?: string;
  status?: string;
  protocol?: string;
}

export const getDeviceFormSchema = (t: Record<string, string>) => z.object({
  imei: z.string().min(3, t.imeiRequired || 'ID Perangkat / IMEI wajib diisi (minimal 3 karakter)'),
  protocol: z.string().min(1, t.protocolRequired || 'Protokol perangkat wajib dipilih'),
  deviceBrand: z.string().min(1, t.brandRequired || 'Merk / Brand wajib diisi'),
  deviceModel: z.string().min(1, t.modelRequired || 'Model / Tipe perangkat wajib diisi'),
  simNumber: z.string().optional(),
  iccid: z.string().optional(),
  vehicleId: z.string().optional(),
  status: z.string().optional(),
});
