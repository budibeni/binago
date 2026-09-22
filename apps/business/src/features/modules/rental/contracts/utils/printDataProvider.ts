import type { RentalContract } from '../types/contract';
import type { BookingItem } from '../../bookings/types/booking';

/**
 * Builds the data object for the Document Template System to merge.
 */
export function getRentalContractPrintData(contract: RentalContract) {
  // Format currency
  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
      odometer: item.vehicle?.currentOdometer?.toLocaleString('id-ID') || '0',
    };
  });

  // 4. Contract Data
  const contractData = {
    number: contract.contractNumber || '-',
    contractDate: formatDate(contract.contractDate),
    startDate: formatDate(contract.startDate),
    endDate: formatDate(contract.endDate),
    rentalType: contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Pengemudi',
    rateType: contract.rateType || '-',
    totalAmount: formatCurrency(contract.totalAmount),
    deposit: formatCurrency(contract.deposit),
    remainingAmount: formatCurrency(contract.remainingAmount),
    driverFee: formatCurrency(contract.driverFee),
    notes: contract.notes || '-',
    terms: contract.terms || '-',
  };

  return {
    company,
    customer,
    contract: contractData,
    vehicles,
  };
}
