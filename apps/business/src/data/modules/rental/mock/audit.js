const fs = require('fs');

function loadModule(path) {
  const content = fs.readFileSync(path, 'utf8');
  // Strip TS syntax if simple enough, or we can use ts-node
  return content;
}
