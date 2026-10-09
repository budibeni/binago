import re

# Fix mock returns
with open('apps/business/src/data/modules/rental/mock/returns.ts', 'w') as f:
    f.write('export const mockReturns: any[] = [];\n')

# Fix return repository
with open('apps/business/src/data/modules/rental/repositories/returnRepository.ts', 'w') as f:
    f.write('export const returnRepository = { getReturns: () => [], getReturnById: () => null, getReturnByBookingItemId: () => null, createReturn: () => null };\n')

# Fix ReturnForm.tsx
with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'r') as f:
    content = f.read()

content = content.replace("Button, FormShell, InputText, InputNumber, InputSelect,", "Button, FormShell, Input, InputNumber, InputSelect,")
content = content.replace("  Drawer, DrawerContent\n", "")
content = content.replace('      saveLabel="Simpan Pengembalian"\n', "")
content = content.replace("formatIDR(data.lateFee)", "formatCurrency(data.lateFee)")

with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'w') as f:
    f.write(content)

# Fix ReturnList.tsx
with open('apps/business/src/features/modules/rental/returns/components/ReturnList.tsx', 'r') as f:
    content = f.read()
    
content = content.replace("if (!coreVehicleId || !r.returnedAt) return;", "if (!coreVehicleId || !r.returnDate) return;")
with open('apps/business/src/features/modules/rental/returns/components/ReturnList.tsx', 'w') as f:
    f.write(content)


# Fix ReturnsFeature.tsx
with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()
    
# Remove old filteredData definition which is causing errors
content = re.sub(r'  const filteredData = useMemo\(\(\) => \{\n    // Filter first\n    const filtered = returns\.filter\(\(r\) => \{[\s\S]*?    return groups;\n  \}, \[returns, search, filterState\]\);', '', content)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
