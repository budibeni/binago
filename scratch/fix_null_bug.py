import re

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

# Remove 'if (!contract) return null;' from its current place
content = content.replace("  if (!contract) return null;\n\n  if (inline) {", "  if (inline) {")

# Add it back inside inline AFTER loading
inline_fix = """  if (inline) {
    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (!contract) return null;"""
    
content = content.replace('  if (inline) {\n    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;', inline_fix)


# Also fix ReturnView.tsx !
with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    view_content = f.read()

view_content = view_content.replace("  if (!returnGroup) return null;\n\n  if (inline) {", "  if (inline) {\n    if (!returnGroup) return null;")
with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(view_content)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)
