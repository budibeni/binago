const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update edit onClick to prepend + if missing
content = content.replace(
  /sim_number: d\.sim_number \|\| ""/g,
  `sim_number: (d.sim_number && !d.sim_number.startsWith('+') && d.sim_number.trim() !== '') ? '+' + d.sim_number : (d.sim_number || "")`
);

// Update input to include pattern and placeholder
content = content.replace(
  /<input list="sim-options" type="text" placeholder="e.g. 0812345678 \(Ketik manual atau pilih\)" value=\{formData\.sim_number\}/,
  `<input list="sim-options" type="text" placeholder="e.g. +62812345678 (Ketik manual atau pilih)" pattern="^\\+[0-9]+" title="Harus diawali kode negara (misal: +62)" value={formData.sim_number}`
);

fs.writeFileSync(path, content);
console.log("Patched global-devices sim input");
