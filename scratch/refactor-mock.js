const fs = require('fs');

const path = './apps/business/src/data/modules/rental/mock/vehicles.ts';
let content = fs.readFileSync(path, 'utf8');

// Parse the array out of the file
const mockArrayString = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
const oldVehicles = eval(`(${mockArrayString})`);

const newVehicles = oldVehicles.map(v => {
  return {
    id: v.id,
    vehicleId: v.vehicleId,
    status: v.status,
    categoryId: v.pricingType === 'CATEGORY' ? v.pricingCategoryId : null,
    currentOdometer: v.currentOdometer,
    rateOverrideDaily: v.pricingType === 'INDEPENDENT' ? v.dailyRate : null,
    rateOverrideWeekly: v.pricingType === 'INDEPENDENT' ? v.weeklyRate : null,
    rateOverrideMonthly: v.pricingType === 'INDEPENDENT' ? v.monthlyRate : null,
    conditionNotes: v.condition === 'NEEDS_REPAIR' ? 'Perlu perbaikan' : null,
    completenessChecklist: {
      stnkOriginal: v.equipment.stnk,
      spareKey: true,
      jackAndTools: v.equipment.jack || v.equipment.toolkit,
      spareTire: v.equipment.spareTire,
      firstAidKit: v.equipment.firstAidKit,
    },
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
    ...(v.customerId ? { currentContractId: 'ctr-' + v.id.slice(-3) } : {})
  };
});

const newContent = `import type { RentalVehicleProfile } from '@/features/modules/rental/vehicles/types/rentalVehicle';\n\nexport const mockRentalVehicles: RentalVehicleProfile[] = ${JSON.stringify(newVehicles, null, 2)};\n`;

fs.writeFileSync(path, newContent);
console.log('Done rewriting mock data');
