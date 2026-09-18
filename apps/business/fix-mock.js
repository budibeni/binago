const fs = require('fs');
let file = 'src/data/modules/rental/mock/vehicles.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/"GROUP"/g, '"CATEGORY"');
fs.writeFileSync(file, content);
console.log('done');
