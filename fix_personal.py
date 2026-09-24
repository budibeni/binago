import os
import re

shell_path = "/home/arfian107/Projects/adatrack/frontend/apps/personal/src/components/PersonalShellLayout.tsx"
if os.path.exists(shell_path):
    with open(shell_path, "r") as f:
        content = f.read()
    if "useRouter" not in content:
        content = content.replace("import { usePathname } from 'next/navigation';", "import { usePathname, useRouter } from 'next/navigation';")
    content = content.replace("const currentPath = usePathname() || '/';", "const currentPath = usePathname() || '/';\n  const router = useRouter();")
    content = content.replace("currentPath={currentPath}", "currentPath={currentPath}\n        onNavigate={(href) => router.push(href)}")
    with open(shell_path, "w") as f:
        f.write(content)

auth_path = "/home/arfian107/Projects/adatrack/frontend/apps/personal/src/app/actions/auth.ts"
if os.path.exists(auth_path):
    with open(auth_path, "r") as f:
        content = f.read()
    content = content.replace("secure: process.env.NODE_ENV === 'production',", "secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL?.startsWith('https'),")
    with open(auth_path, "w") as f:
        f.write(content)
