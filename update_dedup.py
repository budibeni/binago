import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "r") as f:
    content = f.read()

replacement = """						if err := accessRows.Scan(&uid, &ccode); err == nil {
							if user, ok := userMap[uid]; ok {
								found := false
								for _, t := range user.Tenants {
									if t == ccode {
										found = true
										break
									}
								}
								if !found {
									user.Tenants = append(user.Tenants, ccode)
								}
							}
						}"""

content = re.sub(
    r'						if err := accessRows\.Scan\(&uid, &ccode\); err == nil \{\n\t\t\t\t\t\t\tif user, ok := userMap\[uid\]; ok \{\n\t\t\t\t\t\t\t\tuser\.Tenants = append\(user\.Tenants, ccode\)\n\t\t\t\t\t\t\t\}\n\t\t\t\t\t\t\}',
    replacement,
    content,
    flags=re.DOTALL
)

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "w") as f:
    f.write(content)
