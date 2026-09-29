const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/vehicles/components/VehicleForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// Auto format SIM Number to prepend +
content = content.replace(
  /<InputString\s*label=\{tF\.lblSimCard\}\s*value=\{formData\.deviceSimNumber \|\| ''\}\s*onChange=\{\(val\) => handleChange\('deviceSimNumber', val\)\}\s*\/>/m,
  `<InputString
            label={tF.lblSimCard}
            value={formData.deviceSimNumber || ''}
            onChange={(val) => {
              if (val && !val.startsWith('+') && val.trim() !== '') {
                val = '+' + val;
              }
              handleChange('deviceSimNumber', val);
            }}
            placeholder="e.g. +62812345678"
          />`
);

fs.writeFileSync(path, content);
console.log("Patched vehicle form");
