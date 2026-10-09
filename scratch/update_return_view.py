with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    content = f.read()

import re

# Add onProcessReturn to props
content = content.replace("interface ReturnViewProps {", "interface ReturnViewProps {\n  onProcessReturn?: () => void;")
content = content.replace("}: ReturnViewProps) {", ", onProcessReturn }: ReturnViewProps) {")

# Add button inside the view header
old_header = """            <div className="flex gap-2 shrink-0">
              {returnGroup?.status === 'COMPLETED' && (
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 text-[13px]">
                  <Printer className="w-4 h-4" /> Cetak Tanda Terima
                </Button>
              )}
            </div>"""

new_header = """            <div className="flex gap-2 shrink-0">
              {onProcessReturn && returnGroup?.items?.some((i: any) => i.itemStatus === 'IN_USE') && (
                <Button variant="primary" size="sm" onClick={onProcessReturn} className="gap-2 text-[13px]">
                  <RotateCcw className="w-4 h-4" /> Proses Pengembalian
                </Button>
              )}
              {returnGroup?.status === 'COMPLETED' && (
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 text-[13px]">
                  <Printer className="w-4 h-4" /> Cetak Tanda Terima
                </Button>
              )}
            </div>"""

content = content.replace(old_header, new_header)

if "RotateCcw" not in content:
    content = content.replace("Printer, ", "Printer, RotateCcw, ")

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(content)

