import { z } from 'zod';

export type PersonelType = 'CHECKER' | 'MECHANIC' | 'STAFF' | 'MANAGEMENT' | 'OTHER';
export type PersonelStatus = 'ACTIVE' | 'INACTIVE';
export type PersonelStatusFilter = 'all' | PersonelStatus;
export type PersonelTypeFilter = 'all' | PersonelType;

export interface Personel {
  id: string;
  name: string;
  personelType: PersonelType;
  nik?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: PersonelStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const getPersonelFormSchema = (t: Record<string, string>) => z.object({
  name: z.string().min(1, t.nameRequired || 'Nama lengkap wajib diisi'),
  personelType: z.enum(['CHECKER', 'MECHANIC', 'STAFF', 'MANAGEMENT', 'OTHER']),
  nik: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(t.emailInvalid || 'Format email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  notes: z.string().optional(),
});
