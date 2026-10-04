const fs = require('fs');
const path = './packages/ui/src/DataTable/DataTable.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'toolbarActions,',
  'toolbarActions,\n    extraMiddleActions,'
);

code = code.replace(
  'customActions={toolbarActions}',
  'customActions={toolbarActions}\n            extraMiddleActions={extraMiddleActions}'
);

fs.writeFileSync(path, code);
console.log('Success');
