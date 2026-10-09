with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("console.log('ReturnsFeature: selectedContractId =', selectedContractId);\n", "")
content = content.replace("     console.log('ReturnsFeature: selectedContract =', found);\n", "")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    create_content = f.read()

create_content = create_content.replace("  console.log('ReturnCreateFeature rendering:', { contractId, open, inline, loading, errorMsg, hasContract: !!contract });\n", "")
with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(create_content)
