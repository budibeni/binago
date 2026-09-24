import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "r") as f:
    content = f.read()

content = content.replace("const user = data.data.user || { email: data.data.email, role: data.data.role };", "const user = data.data.user || { email: data.data.email, role: data.data.role, name: data.data.name };")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "w") as f:
    f.write(content)
