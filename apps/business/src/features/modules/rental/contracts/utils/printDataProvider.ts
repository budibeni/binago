
const getMaxEndDate = (items: any[]) => {
  if (!items || items.length === 0) return "";
  let max = new Date(items[0].startDate || "");
  for (const item of items) {
    if (!item.startDate) continue;
    const d = new Date(item.startDate);
    if (item.rateType === "HOURLY") d.setHours(d.getHours() + (item.duration || 1));
    else d.setDate(d.getDate() + (item.duration || 1));
    if (d > max) max = d;
  }
  return max.toISOString();
};

import type { RentalContract } from '../types/contract';
import type { BookingItem } from '../../bookings/types/booking';
import { formatCurrency, formatDate, formatNumber } from '@adatrack/utils';


/**
 * Builds the data object for the Document Template System to merge.
 */
export function getRentalContractPrintData(contract: RentalContract) {
  // Format currency
  
  // Format date
  
  // 1. Company Data (Dummy fallback as per requirement if no global company profile)
  const company = {
    name: 'PT. ADATRACK INDONESIA',
    address: 'Jl. Contoh Raya No. 123, Jakarta Selatan',
    phone: '021-12345678',
    email: 'info@adatrack.id',
  };

  const snapshot = contract.customerSnapshot || {} as any;
  const cType = contract.customer?.type || snapshot.type || '-';
  
  let customerIdentity = '-';
  if (cType === 'INDIVIDUAL' || cType === 'Individu') {
    customerIdentity = contract.customer?.nik || snapshot.nik || '3201123456789012'; // fallback dummy
  } else if (cType === 'COMPANY' || cType === 'Perusahaan') {
    customerIdentity = contract.customer?.npwp || snapshot.npwp || '01.234.567.8-901.000'; // fallback dummy
  }

  const customer = {
    name: contract.customer?.name || snapshot.name || '-',
    type: cType,
    phone: contract.customer?.phone || snapshot.phone || '-',
    email: contract.customer?.email || snapshot.email || '-',
    address: contract.customer?.address || snapshot.address || '-',
    identity: customerIdentity,
  };

  // 3. Vehicles
  const items = contract.items || [];
  const vehicles = items.map((item: BookingItem, index: number) => {
    const durationText = `${item.duration} ${item.rateType === 'HOURLY' ? 'Jam' : item.rateType === 'DAILY' ? 'Hari' : 'Paket'}`;
    const rateCategoryText = item.rateType === 'HOURLY' ? 'Per Jam' : item.rateType === 'DAILY' ? 'Harian' : (item.packageName || 'Paket');
    return {
      no: index + 1,
      brand: item.vehicleSnapshot?.brand || '-',
      model: item.vehicleSnapshot?.model || '-',
      plateNumber: item.vehicleSnapshot?.licensePlate || '-',
      rateCategory: rateCategoryText,
      duration: durationText,
      nominal: formatCurrency(item.subtotal || 0),
    };
  });

  // 4. Contract Data
  const contractData = {
    number: contract.contractNumber || '-',
    contractDate: formatDate((contract.contractDate || contract.startDate)),
    startDate: formatDate(contract.startDate),
    endDate: formatDate(getMaxEndDate(contract.items || [])),
    rentalType: contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Pengemudi',
    
    totalAmount: formatCurrency(contract.totalAmount),
    deposit: formatCurrency(contract.deposit),
    remainingAmount: formatCurrency(contract.remainingAmount),
    driverFee: formatCurrency(contract.driverFee),
    notes: contract.notes || '-',
  };

  return {
    company,
    customer,
    contract: contractData,
    vehicles,
  };
}
