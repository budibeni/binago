import re

# 1. Update backend to return email in the response
with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "r") as f:
    content = f.read()

content = content.replace('"role":                 role,', '"role":                 role,\n\t\t\t"email":                req.Email,')

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "w") as f:
    f.write(content)

# 2. Update auth.ts to create the user object manually
with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "r") as f:
    content = f.read()

content = content.replace("const user = data.data.user;", "const user = data.data.user || { email: data.data.email, role: data.data.role };")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "w") as f:
    f.write(content)

# 3. Update BusinessHeroSection to use context or props
with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/home/components/BusinessHeroSection.tsx", "r") as f:
    content = f.read()

# I need to export the UserInfo from BusinessShellLayout somehow, or just pass it down if possible.
# Actually, BusinessShellLayout renders children. We can't easily pass it to children without a Context.
