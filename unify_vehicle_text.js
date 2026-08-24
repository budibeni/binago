const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update StatusBadge
content = content.replace(
  /className="inline-flex items-center gap-1\.5 text-\[11px\] font-medium text-foreground tracking-tight"/g,
  'className="inline-flex items-center gap-1.5 text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors tracking-tight"'
);

// Update vehicleType
content = content.replace(
  /<span className="text-\[10px\] font-normal text-foreground-disabled truncate tracking-tight">/g,
  '<span className="text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors truncate tracking-tight">'
);

// Update driverName
content = content.replace(
  /<div className="flex items-center gap-1 text-\[10px\] font-normal text-foreground-disabled truncate tracking-tight">/g,
  '<div className="flex items-center gap-1.5 text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors truncate tracking-tight">'
);
content = content.replace(
  /<User className="h-2\.5 w-2\.5 shrink-0 opacity-70" \/>/g,
  '<User className="h-3 w-3 shrink-0 opacity-70" />'
);

fs.writeFileSync(file, content, 'utf8');
console.log('VehicleList secondary elements updated.');
