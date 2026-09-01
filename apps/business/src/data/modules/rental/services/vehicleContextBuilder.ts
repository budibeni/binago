import type { VehicleContext, VehicleContextField } from '@/features/core/tracking/types/tracking';
import { rentalVehicleService } from './vehicleService';
import { contractService } from './contractService';
import { rentalCustomerService } from './customerService';
import { handoverService } from './handoverService';

import type { Locale } from '@adatrack/types';

export async function buildRentalVehicleContext(coreVehicleId: string, locale: Locale = 'id'): Promise<VehicleContext | null> {
  try {
    // 1. Dapatkan Rental Vehicle Profile berdasarkan CORE vehicleId
    const rentalVehicle = await rentalVehicleService.getRentalVehicleByVehicleId(coreVehicleId);
    if (!rentalVehicle) return null;

    const isEn = locale === 'en';
    
    // Default context data
    const data: VehicleContextField[] = [
      { label: isEn ? 'Rental Status' : 'Status Rental', value: rentalVehicle.status, type: 'status' },
    ];
    let entityId = rentalVehicle.id;
    let entityType = 'rentalVehicle';

    // 2. Jika status disewa (RENTED) atau dipesan (RESERVED), cari contract aktif atau confirmed
    if (rentalVehicle.status === 'RENTED' || rentalVehicle.status === 'RESERVED') {
      const allContracts = await contractService.getContracts();
      const activeContract = allContracts.find(c => 
        c.vehicleId === coreVehicleId && 
        (c.status === 'ACTIVE' || c.status === 'CONFIRMED')
      );

      if (activeContract) {
        entityId = activeContract.id;
        entityType = 'contract';

        // 3. Tambahkan customer
        const customer = await rentalCustomerService.getCustomerById(activeContract.customerId);
        if (customer) {
          data.unshift({ label: isEn ? 'Customer' : 'Pelanggan', value: customer.name, type: 'text' });
        }

        // 4. Tambahkan info contract
        data.push({ label: isEn ? 'Contract No.' : 'No. Kontrak', value: activeContract.contractNumber, type: 'text' });
        
        // 5. Tambahkan info tarif & periode
        data.push({ 
          label: isEn ? 'Rental Period' : 'Periode Rental', 
          value: `${new Date(activeContract.startDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(activeContract.endDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
          type: 'date' 
        });
        
        const rateLabel = activeContract.rateType === 'DAILY' ? (isEn ? 'day' : 'hari') : activeContract.rateType === 'WEEKLY' ? (isEn ? 'week' : 'minggu') : (isEn ? 'month' : 'bulan');
        data.push({ 
          label: isEn ? 'Rate' : 'Tarif', 
          value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(activeContract.rate) + ` / ${rateLabel}`,
          type: 'currency' 
        });

        // 6. Cari Handover data untuk mendapatkan Odometer dan Serah Terima
        const latestHandover = await handoverService.getHandoverByContractId(activeContract.id);
        
        if (latestHandover) {
          data.push({ 
            label: isEn ? 'Odometer (Handover)' : 'Odometer (Handover)', 
            value: `${new Intl.NumberFormat('id-ID').format(latestHandover.odometerStart)} KM`, 
            type: 'number' 
          });
          data.push({ 
            label: isEn ? 'Handover Time' : 'Serah Terima', 
            value: new Date(latestHandover.handoverAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), 
            type: 'date' 
          });
        }
      }
    }

    return {
      vehicleId: coreVehicleId,
      module: 'rental',
      entityType,
      entityId,
      label: 'Rental',
      data
    };
  } catch (error) {
    console.error('Failed to build rental vehicle context:', error);
    return null;
  }
}
