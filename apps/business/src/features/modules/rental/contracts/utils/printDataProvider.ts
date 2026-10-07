
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

  // 2. Customer Data
  let customerIdentity = '-';
  if (contract.customer) {
    if (contract.customer.type === 'INDIVIDUAL') {
      customerIdentity = contract.customer.nik || '-';
    } else if (contract.customer.type === 'COMPANY') {
      customerIdentity = contract.customer.npwp || '-';
    }
  }

  const customer = {
    name: contract.customer?.name || '-',
    type: contract.customer?.type || '-',
    phone: contract.customer?.phone || '-',
    email: contract.customer?.email || '-',
    address: contract.customer?.address || '-',
    identity: customerIdentity,
  };

  // 3. Vehicles
  const items = contract.booking?.items || [];
  const vehicles = items.map((item: BookingItem, index: number) => {
    const core = item.vehicle?.coreVehicle;
    return {
      no: index + 1,
      brand: core?.brand || '-',
      model: core?.vehicleName || '-',
      plateNumber: core?.plateNumber || '-',
      odometer: item.vehicle?.currentOdometer ? formatNumber(item.vehicle.currentOdometer) : '0',
    };
  });

  // 4. Contract Data
  const contractData = {
    number: contract.contractNumber || '-',
    contractDate: formatDate(contract.contractDate),
    startDate: formatDate(contract.startDate),
    endDate: formatDate(getMaxEndDate(contract.booking?.items || [])),
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
