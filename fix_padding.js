const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverView.tsx';
let code = fs.readFileSync(path, 'utf8');

// The main wrapper for cards is likely around line 100-110:
code = code.replace(/<div className="p-[0-9.]+ flex flex-col gap-[0-9.]+"/g, '<div className="p-4 flex flex-col gap-4"');

// Fix inner padding for cards
// In the previous version, it might be p-2.5 or p-3.5 or p-3
// We will replace inner container classes.
code = code.replace(/className="p-[0-9.]+ grid grid-cols-2 gap-y-[0-9.]+ gap-x-[0-9.]+"/g, 'className="p-4 grid grid-cols-2 gap-y-4 gap-x-4"');
code = code.replace(/className="p-[0-9.]+ flex flex-col gap-[0-9.]+ animate-in/g, 'className="p-4 flex flex-col gap-4 animate-in');
code = code.replace(/className="p-[0-9.]+ text-\[11px\]/g, 'className="p-4 text-[11px]');
code = code.replace(/className="p-[0-9.]+">/g, 'className="p-4">');
code = code.replace(/className="p-[0-9.]+ flex flex-col gap-[0-9.]+"/g, 'className="p-4 flex flex-col gap-4"');

// Tab container padding: currently pt-2 px-1 or pt-1.5 px-1
// The user said "tambahkan margin". Maybe the tabs needed margin on top.
code = code.replace(/pt-[0-9.]+ px-[0-9.]+"/g, 'pt-2 px-2"');

fs.writeFileSync(path, code);
console.log('Success');
