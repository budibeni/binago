const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newDatalist = `                <datalist id="sim-options">
                  {simCards
                    .filter(s => {
                      const isUsed = devices.some(d => d.iccid === s.iccid && d.iccid !== null);
                      const isCurrent = isEditMode && formData.iccid === s.iccid;
                      return !isUsed || isCurrent;
                    })
                    .map(s => <option key={s.iccid} value={s.phone_number}>{s.iccid}</option>)}
                </datalist>`;

content = content.replace(
  /<datalist id="sim-options">\s*\{simCards\.map\(s => <option key=\{s\.iccid\} value=\{s\.phone_number\}>\{s\.iccid\}<\/option>\)\}\s*<\/datalist>/,
  newDatalist
);

fs.writeFileSync(path, content);
console.log("Patched datalist");
