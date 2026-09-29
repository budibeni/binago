const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/vehicles/components/VehicleForm.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldInit = "initialData: vehicle || DEFAULT_VEHICLE,";
const newInit = `initialData: vehicle ? {
      ...vehicle,
      deviceSimNumber: (vehicle.deviceSimNumber && !vehicle.deviceSimNumber.startsWith('+') && vehicle.deviceSimNumber.trim() !== '')
        ? '+' + vehicle.deviceSimNumber
        : vehicle.deviceSimNumber
    } : DEFAULT_VEHICLE,`;

content = content.replace(oldInit, newInit);

fs.writeFileSync(path, content);
console.log("Patched initialData formatting");
