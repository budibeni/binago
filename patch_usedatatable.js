const fs = require('fs');
const file = '../frontend/packages/ui/src/DataTable/useDataTable.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /pagination: \{\n\s*pageIndex,\n\s*pageSize,\n\s*\}/,
  'pagination: pagination ? { pageIndex, pageSize } : { pageIndex: 0, pageSize: 999999 }'
);

fs.writeFileSync(file, content);
console.log('Patched useDataTable.ts');
