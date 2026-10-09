import re

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    content = f.read()

content = content.replace("    if (!returnGroup) return null;", '    if (!returnGroup) return <div className="p-8 text-center text-muted-foreground animate-pulse">Menyiapkan data...</div>;')

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(content)
