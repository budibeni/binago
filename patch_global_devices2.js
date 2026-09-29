const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Insert SIM Number cell
content = content.replace(
  /<td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">\{d\.device_model \|\| "-"\}<\/td>/,
  `<td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">{d.device_model || "-"}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{d.sim_number || "-"}</td>`
);

// We also need to add colSpan=7 to the empty/loading states
content = content.replace(/colSpan=\{6\}/g, "colSpan={7}");

fs.writeFileSync(path, content);
console.log("Patched correctly");
