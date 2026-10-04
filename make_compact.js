const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverView.tsx';

let code = fs.readFileSync(path, 'utf8');

// Header section padding
code = code.replace('px-4 py-4', 'px-3 py-3');

// Container padding
code = code.replace(/p-3 flex flex-col gap-3/g, 'p-2 flex flex-col gap-2.5');

// Section headers padding
code = code.replace(/px-4 py-3/g, 'px-3 py-2.5');

// Section content padding
code = code.replace(/p-3\.5/g, 'p-3');

// Specific gap reductions
code = code.replace(/gap-y-3\.5/g, 'gap-y-2');
code = code.replace(/gap-4/g, 'gap-3');
code = code.replace(/gap-3/g, 'gap-2.5');

// Tab height
code = code.replace(/h-\[38px\]/g, 'h-[32px]');

// Border padding
code = code.replace(/pb-3 border-b/g, 'pb-2.5 border-b');
code = code.replace(/pt-3 border-t/g, 'pt-2.5 border-t');

// Map height
code = code.replace(/h-32/g, 'h-24');

// Some inner grid gaps
code = code.replace(/gap-y-2 gap-x-3/g, 'gap-y-1.5 gap-x-2');

fs.writeFileSync(path, code);
console.log('Success');
