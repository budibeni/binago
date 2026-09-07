import { z } from 'zod';

export type CustomerType = 'INDIVIDUAL' | 'COMPANY';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE';
export type CustomerStatusFilter = 'all' | 'ACTIVE' | 'INACTIVE';
export type CustomerTypeFilter = 'all' | 'INDIVIDUAL' | 'COMPANY';

export interface BaseCustomer {
  id: string;
  code: string;
  type: CustomerType;
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndividualCustomer extends BaseCustomer {
  type: 'INDIVIDUAL';
  nik: string;
  ktpPhoto: string;
  birthPlace: string;
  birthDate: string;
  simNumber: string;
  simType: string;
  simExpiredAt: string;
  simPhoto: string;
}

export interface CompanyCustomer extends BaseCustomer {
  type: 'COMPANY';
  nib: string;
  npwp: string;
  picName: string;
  picPosition: string;
  picPhone: string;
  picEmail: string;
  picNik: string;
  picKtpPhoto: string;
}

export type Customer = IndividualCustomer | CompanyCustomer;

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatusFilter;
  type?: CustomerTypeFilter;
}

export const getCustomerFormSchema = (t: Record<string, string>) => z.object({
  type: z.enum(['INDIVIDUAL', 'COMPANY'], { required_error: t.typeRequired || 'Tipe pelanggan wajib dipilih' }),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  name: z.string().min(1, t.nameRequired || 'Nama wajib diisi'),
  phone: z.string().min(1, t.phoneRequired || 'No. telepon wajib diisi'),
  email: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  
  // Individual fields
  nik: z.string().optional(),
  ktpPhoto: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
  simNumber: z.string().optional(),
  simType: z.string().optional(),
  simExpiredAt: z.string().optional(),
  simPhoto: z.string().optional(),

  // Company fields
  nib: z.string().optional(),
  npwp: z.string().optional(),
  picName: z.string().optional(),
  picPosition: z.string().optional(),
  picPhone: z.string().optional(),
  picEmail: z.string().optional(),
  picNik: z.string().optional(),
  picKtpPhoto: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'INDIVIDUAL') {
    if (!data.nik) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: t.nikRequired || 'NIK/KTP wajib diisi', path: ['nik'] });
    }
  }
  if (data.type === 'COMPANY') {
    if (!data.picName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: t.picNameRequired || 'Nama PIC wajib diisi', path: ['picName'] });
    }
    if (!data.picPhone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: t.picPhoneRequired || 'No. telepon PIC wajib diisi', path: ['picPhone'] });
    }
  }
});
