import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/components/BusinessShellLayout.tsx", "r") as f:
    content = f.read()

# Add useRouter import if not present
if "useRouter" not in content:
    content = content.replace("import { usePathname } from 'next/navigation';", "import { usePathname, useRouter } from 'next/navigation';")

# Add router instance
content = content.replace("const currentPath = usePathname() || '/';", "const currentPath = usePathname() || '/';\n  const router = useRouter();")

# Add onNavigate prop to AppShell
content = content.replace("currentPath={currentPath}", "currentPath={currentPath}\n        onNavigate={(href) => router.push(href)}")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/components/BusinessShellLayout.tsx", "w") as f:
    f.write(content)
