const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix "Select All" checkbox color to match bg-neutral-400
content = content.replace(/data-\[state=checked\]:bg-neutral-700/g, 'data-[state=checked]:bg-neutral-400');
content = content.replace(/data-\[state=checked\]:border-neutral-700/g, 'data-[state=checked]:border-neutral-400');
content = content.replace(/data-\[state=indeterminate\]:bg-neutral-700/g, 'data-[state=indeterminate]:bg-neutral-400');
content = content.replace(/data-\[state=indeterminate\]:border-neutral-700/g, 'data-[state=indeterminate]:border-neutral-400');

// 2. Fix VehicleGroupHeader text
content = content.replace(
  /<span className="text-xs font-semibold text-foreground flex-1 truncate ml-0\.5 tracking-tight">/g,
  '<span className="text-[11px] font-bold text-foreground-muted flex-1 truncate ml-0.5 tracking-wider uppercase">'
);

// 3. Fix VehicleListItem text (plate number) to match Geofence/Route item text
// "text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors leading-none pt-px"
content = content.replace(
  /<span className="text-xs font-semibold text-foreground truncate tracking-tight leading-tight">/g,
  '<span className="text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors truncate leading-none pt-px">'
);

// 4. Update the Select All label text to match the section header style or geofence item style?
// Usually Select All is treated like a header or an action. The user said "warna dan ukuran text harus sama", let's apply it everywhere.
content = content.replace(
  /className="text-\[11px\] font-bold text-foreground cursor-pointer select-none tracking-tight"/g,
  'className="text-[11.5px] font-normal text-foreground-muted hover:text-danger transition-colors cursor-pointer select-none leading-none"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('VehicleList text and checkbox synced.');
