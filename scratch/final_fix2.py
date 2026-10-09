with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'r') as f:
    content = f.read()
    
content = content.replace("variant={layout === 'drawer' ? 'drawer' : 'default'}", "layout={layout === 'drawer' ? 'drawer' : 'default'}")

with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'w') as f:
    f.write(content)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# I will recreate filteredData
filtered_data = """  const filteredData = useMemo(() => {
    return returnsGrouped.filter((g) => {
      if (filterState.condition) {
        if (!g.items.some(i => i.returnCondition?.vehicleCondition === filterState.condition)) return false;
      }
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        g.id.toLowerCase().includes(s) ||
        g.contractId.toLowerCase().includes(s) ||
        g.contract?.contractNumber?.toLowerCase().includes(s) ||
        g.customer?.name?.toLowerCase().includes(s) ||
        g.items.some(i => i.vehicleSnapshot?.licensePlate?.toLowerCase().includes(s))
      );
    });
  }, [returnsGrouped, search, filterState]);
"""

content = content.replace("const filterConfig = useMemo(() => {", filtered_data + "\n  const filterConfig = useMemo(() => {")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
