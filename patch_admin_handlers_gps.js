const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go';
let content = fs.readFileSync(path, 'utf8');

// Update CreateGPSDevice validation
content = content.replace(
  /if err := json\.NewDecoder\(r\.Body\)\.Decode\(\&req\); err != nil \{/,
  `if err := json.NewDecoder(r.Body).Decode(&req); err != nil {`
);
// wait, easier to just regex the point after decode
content = content.replace(
  /if req\.Iccid != nil && \*req\.Iccid == "" \{\s*\*req\.Iccid = ""\s*\}/, // this might not exist
  ``
);

// We'll just patch the specific lines manually.
