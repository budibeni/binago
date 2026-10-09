import re

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    content = f.read()

content = content.replace("interface ReturnViewProps {", "interface ReturnViewProps {\n  inline?: boolean;")
content = content.replace("layout = 'drawer',", "layout = 'drawer',\n  inline = false,")

render_part = """  if (!returnGroup) return null;

  if (inline) {
    return (
      <div className="w-full bg-background border border-border/50 rounded-xl overflow-hidden mt-4">
        {/* We can just render the content of DetailShell but without the wrapper, or wrap it in a simple div */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">{returnGroup.contract?.contractNumber}</h2>
              <p className="text-sm text-muted-foreground">{returnGroup.customer?.name}</p>
            </div>
            {onProcessReturn && returnGroup?.items?.some((i: any) => i.itemStatus === 'IN_USE') && (
              <Button variant="primary" size="sm" onClick={onProcessReturn} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Proses Pengembalian
              </Button>
            )}
          </div>
          {/* Re-use the existing logic to display items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {returnGroup.items.map((item: any, idx: number) => {
              const cv = item.vehicleSnapshot;
              return (
                <div key={idx} className="border border-border/50 p-4 rounded-lg bg-background">
                  <div className="font-bold">{cv?.licensePlate}</div>
                  <div className="text-sm text-muted-foreground mb-2">{cv?.brand} {cv?.model}</div>
                  <div className="flex justify-between text-xs">
                     <span className={item.itemStatus === 'RETURNED' ? 'text-emerald-600 font-bold' : 'text-blue-600 font-bold'}>{item.itemStatus}</span>
                     <span>Odo: {item.returnOdometer || '-'} km</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DetailShell"""

content = re.sub(r'if \(!returnGroup\) return null;\n\n  return \(\n    <DetailShell', render_part, content)

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(content)
