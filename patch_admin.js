const fs = require('fs');

const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the IoT SIM Card <select> completely
content = content.replace(
  /<div>\s*<label className="block text-sm font-medium text-slate-700">IoT SIM Card \(Optional\)<\/label>\s*<select[^>]*>\s*<option[^>]*>-- Manual Input \/ None --<\/option>\s*\{simCards\.map\([^)]*\)\}\s*<\/select>\s*<\/div>/,
  ''
);

// 2. Update SIM Number input to use datalist
content = content.replace(
  /<input type="text" placeholder="e\.g\. 0812345678" value=\{formData\.sim_number\} onChange=\{e => setFormData\(\{\.\.\.formData, sim_number: e\.target\.value\}\)\} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" \/>/,
  `<input list="sim-options" type="text" placeholder="e.g. 0812345678 (Ketik manual atau pilih)" value={formData.sim_number} onChange={e => setFormData({...formData, sim_number: e.target.value})} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                <datalist id="sim-options">
                  {simCards.map(s => <option key={s.iccid} value={s.phone_number}>{s.iccid}</option>)}
                </datalist>`
);

// 3. Update handleAddSubmit to figure out the ICCID automatically
content = content.replace(
  /body: JSON\.stringify\(\{ \.\.\.formData, iccid: formData\.iccid \|\| null \}\)/,
  `body: JSON.stringify({ ...formData, iccid: (simCards.find(s => s.phone_number === formData.sim_number)?.iccid) || null })`
);

fs.writeFileSync(path, content);
console.log("Patched successfully!");
