import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/home/components/BusinessHeroSection.tsx", "r") as f:
    content = f.read()

content = content.replace("useBusinessLocale } from '../../../../components/BusinessShellLayout';", "useBusinessLocale, useBusinessUser } from '../../../../components/BusinessShellLayout';")
content = content.replace("const h = t.home;", "const h = t.home;\n  const user = useBusinessUser();\n  const displayName = user?.name && user.name !== 'User' && user.name !== user.email ? user.name : user?.email?.split('@')[0] || 'Pengguna';")
content = content.replace("Budi Setiawan!", "{displayName}!")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/home/components/BusinessHeroSection.tsx", "w") as f:
    f.write(content)
