const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'apps/business/src/features/tracking/data/mockTrackingData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace groups
content = content.replace(/groupId:\s*'grp-001',\s*groupName:\s*'Hino Dutro'/g, "groupId: 'grp-001', groupName: 'Pabrik'");
content = content.replace(/groupId:\s*'grp-002',\s*groupName:\s*'Toyota Hiace'/g, "groupId: 'grp-002', groupName: 'Depo'");
content = content.replace(/groupId:\s*'grp-003',\s*groupName:\s*'Mitsubishi Fuso'/g, "groupId: 'grp-003', groupName: 'Marketing'");
content = content.replace(/groupId:\s*'grp-004',\s*groupName:\s*'Isuzu Elf'/g, "groupId: 'grp-004', groupName: 'Logistik'");
content = content.replace(/groupId:\s*'grp-005',\s*groupName:\s*'Suzuki Carry'/g, "groupId: 'grp-005', groupName: 'Operasional'");

// The arrays hinoDutroVehicles etc. can stay named the same or we just rewrite the mockTrackingData.ts export
// Let's just do a blanket regex replacement for all vehicles.
// Randomly assign some to Marketing, Depo, Pabrik? No, changing the existing group definitions is easier.

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done');
