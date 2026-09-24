import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "r") as f:
    content = f.read()

content = content.replace("if (data.status === 'success' && data.data?.token) {", "if (data.status === 'success' && (data.data?.token || data.data?.access_token)) {")
content = content.replace("const token = data.data?.token || data.data?.access_token;", "const token = data.data?.token || data.data?.access_token;")
content = content.replace("const token = data.data.token;", "const token = data.data?.token || data.data?.access_token;")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "w") as f:
    f.write(content)
