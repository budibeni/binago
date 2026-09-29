const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const strToRemove = `<div>
                <label className="block text-sm font-medium text-slate-700">IoT SIM Card (Optional)</label>
                <select value={formData.iccid || ""} onChange={(e) => {
                  const iccid = e.target.value;
                  const sim = simCards.find(s => s.iccid === iccid);
                  setFormData({ ...formData, iccid, sim_number: sim ? sim.phone_number : formData.sim_number });
                }} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border mb-4">
                  <option value="">-- Manual Input / None --</option>
                  {simCards.map(s => <option key={s.iccid} value={s.iccid}>{s.iccid} - {s.phone_number}</option>)}
                </select>
              </div>`;

content = content.replace(strToRemove, "");
fs.writeFileSync(path, content);
console.log("Patched 2!");
