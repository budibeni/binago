import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("const selectedContract = useMemo(() => {", "console.log('ReturnsFeature: selectedContractId =', selectedContractId);\n  const selectedContract = useMemo(() => {")
content = content.replace("return currentList.find(c => c.id === selectedContractId) || null;", "const found = currentList.find(c => c.id === selectedContractId) || null;\n     console.log('ReturnsFeature: selectedContract =', found);\n     return found;")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    create_content = f.read()

create_content = create_content.replace("export function ReturnCreateFeature({ contractId, open, onOpenChange, onSuccess , inline = false }: ReturnCreateFeatureProps) {", "export function ReturnCreateFeature({ contractId, open, onOpenChange, onSuccess , inline = false }: ReturnCreateFeatureProps) {\n  console.log('ReturnCreateFeature rendering:', { contractId, open, inline, loading, errorMsg, hasContract: !!contract });")
with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(create_content)
