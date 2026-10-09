import re

with open('apps/business/src/features/modules/rental/returns/components/ReturnList.tsx', 'r') as f:
    content = f.read()

content = content.replace("import type { RentalReturn } from '../types/return';", "import type { BookingItem } from '../../bookings/types/booking';")
content = content.replace("items: RentalReturn[];", "items: BookingItem[];")
content = content.replace("onViewMap: (r: RentalReturn) => void", "onViewMap: (r: BookingItem) => void")
content = content.replace("const handleViewMap = React.useCallback((r: RentalReturn) => {", "const handleViewMap = React.useCallback((r: BookingItem) => {")
content = content.replace("const startDate = new Date(r.returnedAt).toISOString();", "const startDate = new Date(r.returnDate || '').toISOString();")
content = content.replace("vehicle?: RentalVehicle", "vehicle?: any")

with open('apps/business/src/features/modules/rental/returns/components/ReturnList.tsx', 'w') as f:
    f.write(content)


with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    content = f.read()

content = content.replace("import type { RentalReturn } from '../types/return';", "import type { BookingItem } from '../../bookings/types/booking';")
content = content.replace("item.vehicle?.coreVehicle", "item.vehicleSnapshot")
content = content.replace("item.returnedAt", "item.returnDate")
content = content.replace("item.staffName", "item.returnCondition?.staffName")
content = content.replace("item.fuelLevelEnd", "item.returnCondition?.fuelLevel")
content = content.replace("item.vehicleConditionEnd", "item.returnCondition?.vehicleCondition")
content = content.replace("item.equipmentChecklistEnd", "item.returnCondition?.equipmentChecklist")
content = content.replace("item.damageNotes", "item.returnCondition?.damageNotes")
content = content.replace("item.notes", "item.returnCondition?.notes")
content = content.replace("item.returnAddress", "item.returnLocation?.address")
content = content.replace("item.returnLatitude", "item.returnLocation?.latitude")
content = content.replace("item.returnLongitude", "item.returnLocation?.longitude")

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(content)
