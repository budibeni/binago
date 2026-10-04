const fs = require('fs');
const path = './apps/business/src/data/modules/rental/mock/handovers.ts';
let code = fs.readFileSync(path, 'utf8');

const regex = /\{\s*"id":\s*"([^"]+)",\s*"bookingItemId":\s*"([^"]+)",\s*"contractId":\s*"([^"]+)",\s*"customerId":\s*"([^"]+)",\s*"vehicleId":\s*"([^"]+)",\s*"handoverAt":\s*"([^"]+)",\s*"handoverLatitude":\s*([0-9.-]+),\s*"handoverLongitude":\s*([0-9.-]+),\s*"handoverAddress":\s*"([^"]+)",\s*"odometerStart":\s*([0-9]+),\s*"odometerSource":\s*"([^"]+)",\s*"fuelLevel":\s*"([^"]+)",\s*"vehicleCondition":\s*"([^"]+)",\s*"equipmentChecklist":\s*(\{[\s\S]*?\}),\s*"notes":\s*"([^"]*)",\s*"staffId":\s*"([^"]+)",\s*"staffName":\s*"([^"]+)",\s*"createdAt":\s*"([^"]+)",\s*"updatedAt":\s*"([^"]+)"\s*\}/g;

let matches = [...code.matchAll(regex)];

let newArray = "[\n";
matches.forEach((m, idx) => {
  newArray += `  {
    "id": "${m[1]}",
    "contractId": "${m[3]}",
    "customerId": "${m[4]}",
    "status": "${m[3] === 'ctr-001' ? 'PARTIAL' : 'COMPLETED'}",
    "handoverAt": "${m[6]}",
    "handoverLatitude": ${m[7]},
    "handoverLongitude": ${m[8]},
    "handoverAddress": "${m[9]}",
    "notes": "${m[15]}",
    "staffId": "${m[16]}",
    "staffName": "${m[17]}",
    "createdAt": "${m[18]}",
    "updatedAt": "${m[19]}",
    "items": [
      {
        "id": "itm-${Date.now()}-${idx}",
        "handoverId": "${m[1]}",
        "bookingItemId": "${m[2]}",
        "vehicleId": "${m[5]}",
        "odometerStart": ${m[10]},
        "odometerSource": "${m[11]}",
        "fuelLevel": "${m[12]}",
        "vehicleCondition": "${m[13]}",
        "equipmentChecklist": ${m[14]}
      }
    ]
  }${idx < matches.length - 1 ? ',' : ''}\n`;
});
newArray += "]";

code = code.replace(/\[[\s\S]*\]/, newArray);
fs.writeFileSync(path, code);
