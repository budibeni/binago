const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add SIM Number header after Model
content = content.replace(
  /<th className="px-3 py-4 text-left text-sm font-semibold text-slate-900">Model<\/th>/,
  `<th className="px-3 py-4 text-left text-sm font-semibold text-slate-900">Model</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-slate-900">SIM Number</th>`
);

// Add SIM Number cell after Model cell
content = content.replace(
  /<td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">\s*<div className="flex items-center">\s*<Cpu className="h-4 w-4 mr-2 text-slate-400" \/>\s*\{d\.device_model\}\s*<\/div>\s*<\/td>/,
  `<td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-slate-400" />
                      {d.device_model}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{d.sim_number || "-"}</td>`
);

fs.writeFileSync(path, content);
console.log("Patched global-devices page");
