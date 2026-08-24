const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update the wrapper to have px-2 py-2 space-y-2
content = content.replace(
  /<div className="flex-1 min-h-0 overflow-y-auto bg-surface space-y-2\.5 pb-2\.5" role="list">/g,
  '<div className="flex-1 min-h-0 overflow-y-auto bg-surface px-2 py-2 space-y-2" role="list">'
);

// Update the card to have rounded-md border border-border instead of border-y
content = content.replace(
  /<div key=\{group\.id\} role="listitem" className="bg-background border-y border-border shadow-\[0_2px_8px_-4px_rgba\(0,0,0,0\.03\)\] overflow-hidden">/g,
  '<div key={group.id} role="listitem" className="bg-background border border-border rounded-md shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] overflow-hidden">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('VehicleList margins updated.');
