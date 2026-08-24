const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<span className="text-\[11\.5px\] font-normal text-foreground-muted group-hover:text-danger transition-colors truncate leading-none pt-px">\s*\{vehicle\.plateNumber\}\s*<\/span>/,
  '<span className="text-[11.5px] font-semibold text-foreground-muted group-hover:text-danger transition-colors truncate leading-none pt-px">\n          {vehicle.plateNumber}\n        </span>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Plate number thickened.');
