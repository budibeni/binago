const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /const normalize = \(num\) => \(num \|\| ''\)\.replace\(\/\\^\\\\+\/,\s*''\);/,
  "const normalize = (num: string | null | undefined) => (num || '').replace(/^\\\\+/, '');"
);

fs.writeFileSync(path, content);
console.log("Patched typescript typing");
