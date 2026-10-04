const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "isSelected ? 'border-b-sky-500 text-sky-600 dark:text-sky-400' : 'border-b-transparent text-muted-foreground hover:text-foreground'",
  "isSelected ? 'border-b-danger text-danger' : 'border-b-transparent text-muted-foreground hover:text-foreground'"
);

code = code.replace(
  'isSelected ? "text-sky-500 dark:text-sky-400" : "opacity-70"',
  'isSelected ? "text-danger" : "opacity-70"'
);

code = code.replace(
  'bg-sky-50 dark:bg-sky-900/20',
  'bg-danger/10'
);

code = code.replace(
  'text-sky-500',
  'text-danger'
);

fs.writeFileSync(path, code);
console.log('Success');
