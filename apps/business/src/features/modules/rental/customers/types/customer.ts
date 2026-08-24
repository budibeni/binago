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
