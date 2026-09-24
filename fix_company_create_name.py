import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "r") as f:
    content = f.read()

content = content.replace('''		INSERT INTO adatrack_gps_master.tm_users (email, password_hash, must_change_password)
		VALUES ($1, $2, true)''', '''		INSERT INTO adatrack_gps_master.tm_users (email, full_name, password_hash, must_change_password)
		VALUES ($1, $2, $3, true)''')

content = content.replace("`, adminEmail, string(hash)).Scan(&newUserID)", "`, adminEmail, \"Admin of \"+req.Name, string(hash)).Scan(&newUserID)")

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "w") as f:
    f.write(content)
