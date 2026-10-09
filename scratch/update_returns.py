import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Replace returnService.getReturns() with returnService.getReturnedItemsGroupedByContract()
content = content.replace("import type { RentalReturn } from './types/return';", "import type { ReturnPayload } from './types/return';")
content = content.replace("const [returns, setReturns] = useState<RentalReturn[]>([]);", "const [returnsGrouped, setReturnsGrouped] = useState<ReturnGroup[]>([]);")
content = content.replace("returnService.getReturns()", "returnService.getReturnedItemsGroupedByContract()")
content = content.replace("const sorted = [...data].sort(\n        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()\n      );", "")
content = content.replace("setReturns(sorted);", "setReturnsGrouped(data);")

# Update filteredData
old_filtered_data = """  const filteredData = useMemo(() => {
    // Filter first
    const filtered = returns.filter((r) => {
      if (filterState.condition) {
        if (r.vehicleConditionEnd !== filterState.condition) return false;
      }
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(s) ||
        r.contractId.toLowerCase().includes(s) ||
        r.contract?.contractNumber?.toLowerCase().includes(s) ||
        r.customer?.name?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s)
      );
    });

    // Group by contractId
    const map = new Map<string, ReturnGroup>();
    for (const r of filtered) {
      if (!map.has(r.contractId)) {
        map.set(r.contractId, {
          id: r.contractId,
          contractId: r.contractId,
          contract: r.contract,
          customer: r.customer,
          returnedAt: r.returnedAt,
          returnAddress: r.returnAddress,
          returnLatitude: r.returnLatitude,
          returnLongitude: r.returnLongitude,
          status: 'PARTIAL',
          items: [],
        });
      }
      map.get(r.contractId)!.items.push(r);
    }

    // Determine status for groups
    const groups = Array.from(map.values());
    for (const g of groups) {
      if (g.contract) {
        // If the number of returned items matches the total items in contract, it's COMPLETED
        const totalItems = g.contract.items?.length || 0;
        if (g.items.length === totalItems) {
          g.status = 'COMPLETED';
        }
      }
    }

    return groups;
  }, [returns, search, filterState]);"""

new_filtered_data = """  const filteredData = useMemo(() => {
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
  }, [returnsGrouped, search, filterState]);"""

content = content.replace(old_filtered_data, new_filtered_data)

# Update the renderPanel button
old_button_click = """                        onClick={() => {
                          setSelectedContractId(contract.id);
                          router.push(`/rental/returns/create?contractId=${contract.id}`);
                        }}"""
new_button_click = """                        onClick={() => {
                          setSelectedContractId(contract.id);
                        }}"""

content = content.replace(old_button_click, new_button_click)

# Inject ReturnFormFeature
old_return_view = """      <ReturnView
        open={isDetailOpen}
        onClose={closeDetail}
        returnGroup={selectedReturnGroup}
      />"""

new_return_view = """      <ReturnView
        open={isDetailOpen}
        onClose={closeDetail}
        returnGroup={selectedReturnGroup}
      />

      <ReturnFormFeature
        contractId={selectedContractId}
        open={!!selectedContractId}
        onOpenChange={(open) => !open && setSelectedContractId(null)}
        onSuccess={() => {
          setSelectedContractId(null);
          loadData();
        }}
      />"""

content = content.replace(old_return_view, new_return_view)

# Fix returnedItemIds
old_returned_ids = """  const returnedItemIds = useMemo(() => {
    return new Set(returns.map(r => r.bookingItemId));
  }, [returns]);"""
new_returned_ids = """  const returnedItemIds = useMemo(() => {
    const ids = new Set<string>();
    returnsGrouped.forEach(g => {
      g.items.forEach(i => ids.add(i.id));
    });
    return ids;
  }, [returnsGrouped]);"""

content = content.replace(old_returned_ids, new_returned_ids)


with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
