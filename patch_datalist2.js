const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldDatalist = `                <datalist id="sim-options">
                  {simCards
                    .filter(s => {
                      const isUsed = devices.some(d => d.iccid === s.iccid && d.iccid !== null);
                      const isCurrent = isEditMode && formData.iccid === s.iccid;
                      return !isUsed || isCurrent;
                    })
                    .map(s => <option key={s.iccid} value={s.phone_number}>{s.iccid}</option>)}
                </datalist>`;

const newDatalist = `                <datalist id="sim-options">
                  {simCards
                    .filter(s => {
                      const normalize = (num) => (num || '').replace(/^\\+/, '');
                      const isUsed = devices.some(d => {
                        const matchIccid = d.iccid && d.iccid === s.iccid;
                        const matchPhone = d.sim_number && normalize(d.sim_number) === normalize(s.phone_number);
                        return matchIccid || matchPhone;
                      });
                      
                      const matchCurrentIccid = isEditMode && formData.iccid && formData.iccid === s.iccid;
                      const matchCurrentPhone = isEditMode && formData.sim_number && normalize(formData.sim_number) === normalize(s.phone_number);
                      const isCurrent = matchCurrentIccid || matchCurrentPhone;
                      
                      return !isUsed || isCurrent;
                    })
                    .map(s => <option key={s.iccid} value={s.phone_number}>{s.iccid}</option>)}
                </datalist>`;

content = content.replace(oldDatalist, newDatalist);
fs.writeFileSync(path, content);
console.log("Patched datalist 2");
