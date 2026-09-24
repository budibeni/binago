import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "r") as f:
    content = f.read()

replacement = """				var userCompanies []string
				for rowsAccess.Next() {
					var comp string
					if err := rowsAccess.Scan(&comp); err == nil {
						found := false
						for _, c := range userCompanies {
							if c == comp {
								found = true
								break
							}
						}
						if !found {
							userCompanies = append(userCompanies, comp)
						}
					}
				}"""

content = re.sub(
    r'\t\t\t\tvar userCompanies \[\]string\n\t\t\t\tfor rowsAccess\.Next\(\) \{\n\t\t\t\t\tvar comp string\n\t\t\t\t\tif err := rowsAccess\.Scan\(&comp\); err == nil \{\n\t\t\t\t\t\tuserCompanies = append\(userCompanies, comp\)\n\t\t\t\t\t\}\n\t\t\t\t\}',
    replacement,
    content,
    flags=re.DOTALL
)

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "w") as f:
    f.write(content)
