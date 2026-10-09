import re

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("    if (!contract) return null;", '    if (!contract) return <div className="p-8 text-center text-muted-foreground animate-pulse">Menyiapkan form...</div>;')

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)
