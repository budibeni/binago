import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "r") as f:
    content = f.read()

with open("/home/arfian107/Projects/adatrack/frontend/tmp_login.go", "r") as f:
    replacement = f.read()

# Using basic string replacement
start_str = '\tif req.Email == "" || req.Password == "" || req.CompanyCode == "" {'
end_str = '\tschema := fmt.Sprintf("adatrack_gps_%s", strings.ToLower(req.CompanyCode))'

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + replacement + content[end_idx:]
    with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "w") as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print(f"FAILED TO MATCH: start_idx={start_idx}, end_idx={end_idx}")

