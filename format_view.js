const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverView.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. InfoItem text size
code = code.replace(
  'cn("text-xs font-medium"',
  'cn("text-[11px] font-medium"'
);

// 2. Card header title size
code = code.replace(/text-\[11px\] font-bold text-foreground uppercase tracking-widest/g, 'text-[10px] font-bold text-foreground uppercase tracking-wider');
// and smaller icons in headers
code = code.replace(/w-3\.5 h-3\.5 text-muted-foreground/g, 'w-3 h-3 text-muted-foreground');

// 3. Card inner padding
// "p-3.5" -> "p-2.5"
code = code.replace(/p-3\.5/g, 'p-2.5');
// "gap-3.5" -> "gap-2.5"
code = code.replace(/gap-3\.5/g, 'gap-2.5');
// "gap-y-3.5 gap-x-3" -> "gap-y-2.5 gap-x-3"
code = code.replace(/gap-y-3\.5/g, 'gap-y-2.5');

// 4. Wrapper margin/gap
// "<div className=\"p-3 flex flex-col gap-3\">" -> "<div className=\"p-4 flex flex-col gap-4\">"
code = code.replace(
  '<div className="p-3 flex flex-col gap-3">',
  '<div className="p-4 flex flex-col gap-4">'
);

// 5. Tabs styling
// pt-1.5 px-1 -> pt-2 px-1
code = code.replace('pt-1.5 px-1', 'pt-2 px-1');
// h-[32px] or h-[38px] -> h-[30px]
code = code.replace(/h-\[38px\]/g, 'h-[30px]');
code = code.replace(/h-\[32px\]/g, 'h-[30px]');
// text-[11px] for tabs -> text-[10px]
code = code.replace('text-[11px] font-semibold border-b-2', 'text-[10px] font-semibold border-b-[1.5px]');
// px-3 -> px-2.5 in tabs
code = code.replace(
  '"px-3 h-[30px]',
  '"px-2.5 h-[30px]'
);

// 6. Header Section padding
code = code.replace(
  '<div className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">',
  '<div className="px-4 py-3 bg-background border-b border-border/40 flex justify-between items-start">'
);

// 7. General text size reductions for specific elements
// e.g. text-[13px] -> text-[12px]
code = code.replace('text-[13px] text-foreground', 'text-[12px] text-foreground');
code = code.replace('text-xs text-muted-foreground', 'text-[11px] text-muted-foreground');

fs.writeFileSync(path, code);
console.log('Success');
