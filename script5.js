import * as fs from 'fs';

const filePath = 'd:/03. DEVELOPMENT/03. AJB/GPS/binago/apps/business/src/components/BusinessShellLayout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find the administration block
const adminRegex = /\{\s*id:\s*'administration',[\s\S]*?\},/;
const adminMatch = content.match(adminRegex);

if (adminMatch) {
  // Remove the block
  content = content.replace(adminRegex, '');
  
  // Find the end of the array (the last }])
  content = content.replace(/\s*\];\s*}\s*function buildBottomNavigation/, "\n    " + adminMatch[0] + "\n  ];\n\n  function buildBottomNavigation");
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Moved administration menu to the bottom');
} else {
  console.error('Administration block not found');
}
