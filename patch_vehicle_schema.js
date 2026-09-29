const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/vehicles/types/vehicle.ts';
let content = fs.readFileSync(path, 'utf8');

// Update deviceSimNumber validation in getVehicleFormSchema
content = content.replace(
  /deviceSimNumber: z\.string\(\)\.nullable\(\)\.optional\(\),/,
  `deviceSimNumber: z.string().refine(val => !val || val.startsWith('+'), { message: "Harus diawali simbol + (kode negara)" }).nullable().optional(),`
);

fs.writeFileSync(path, content);
console.log("Patched vehicle schema");
