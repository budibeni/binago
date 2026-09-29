const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go';
let content = fs.readFileSync(path, 'utf8');

// Update CreateGPSDevice
content = content.replace(
  /if err \!\= nil \{\s*log\.Printf\("Failed to create GPS device: %v", err\)\s*http\.Error\(w, "Internal server error", http\.StatusInternalServerError\)\s*return\s*\}/g,
  `if err != nil {
		if strings.Contains(err.Error(), "tm_gps_devices_iccid_key") {
			http.Error(w, "IoT SIM Card ini sudah terpakai di GPS Device lain", http.StatusConflict)
			return
		}
		log.Printf("Failed to create GPS device: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}`
);

// Update UpdateGPSDevice
content = content.replace(
  /if err \!\= nil \{\s*log\.Printf\("Failed to update GPS device: %v", err\)\s*http\.Error\(w, "Internal server error", http\.StatusInternalServerError\)\s*return\s*\}/g,
  `if err != nil {
		if strings.Contains(err.Error(), "tm_gps_devices_iccid_key") {
			http.Error(w, "IoT SIM Card ini sudah terpakai di GPS Device lain", http.StatusConflict)
			return
		}
		log.Printf("Failed to update GPS device: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}`
);

fs.writeFileSync(path, content);
console.log("Patched admin_handlers.go");
