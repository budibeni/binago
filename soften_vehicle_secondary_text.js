const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<span className="text-\[11px\] font-medium text-foreground-secondary truncate tracking-tight">/g,
  '<span className="text-[10px] font-normal text-foreground-disabled truncate tracking-tight">'
);
content = content.replace(
  /<div className="flex items-center gap-1 text-\[10px\] font-medium text-foreground-muted truncate tracking-tight">/g,
  '<div className="flex items-center gap-1 text-[10px] font-normal text-foreground-disabled truncate tracking-tight">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('VehicleList secondary text softened.');
