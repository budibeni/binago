const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go';
let content = fs.readFileSync(path, 'utf8');

const validationCode = `
	if req.SimNumber != "" && !strings.HasPrefix(req.SimNumber, "+") {
		http.Error(w, "SIM Number must include country code (e.g. +62)", http.StatusBadRequest)
		return
	}`;

content = content.replace(
  /if err := json\.NewDecoder\(r\.Body\)\.Decode\(\&req\); err != nil \{\n\s*http\.Error\(w, "Invalid payload", http\.StatusBadRequest\)\n\s*return\n\s*\}/g,
  `if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}` + validationCode
);

fs.writeFileSync(path, content);
console.log("Patched admin_handlers.go");
