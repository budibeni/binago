import re

# Fix ReturnForm.tsx
with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'r') as f:
    content = f.read()

content = content.replace("Drawer, DrawerContent", "Dialog, DialogContent")
content = content.replace("formatIDR,", "")
content = content.replace("formatCurrency(grandTotal)", "formatCurrency(grandTotal)")
content = content.replace("formatIDR(", "formatCurrency(")
content = content.replace('description="Catat kondisi akhir dan odometer kendaraan."', "")
content = content.replace('headerClassName="px-0 pt-0"', "")
content = content.replace('includeTime={true}', "")
content = content.replace('value={data.damageFee}', 'value={data.damageFee || null}')


with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'w') as f:
    f.write(content)

# Fix ReturnFeature.tsx
with open('apps/business/src/features/modules/rental/returns/ReturnFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("Drawer, DrawerContent", "Dialog, DialogContent")
content = content.replace("<Drawer", "<Dialog")
content = content.replace("</Drawer>", "</Dialog>")
content = content.replace("<DrawerContent", "<DialogContent")
content = content.replace("</DrawerContent>", "</DialogContent>")

with open('apps/business/src/features/modules/rental/returns/ReturnFeature.tsx', 'w') as f:
    f.write(content)

# Fix ReturnView.tsx
with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    content = f.read()

content = content.replace("item.lateFee || 0) + (item.damageFee || 0) + (item.additionalCharges || 0)", "item.lateFee || 0) + (item.damageFee || 0) + (item.extraCharges || 0)")
content = content.replace("cv?.plateNumber || item.vehicleId", "cv?.licensePlate || item.vehicleId")
content = content.replace("{cv?.brand} {cv?.vehicleName}", "{cv?.brand} {cv?.model}")
content = content.replace("{cv?.plateNumber}", "{cv?.licensePlate}")
content = content.replace("formatNumber(item.odometerEnd)", "formatNumber(item.returnOdometer || 0)")
content = content.replace("getConditionLabel(item.returnCondition?.vehicleCondition)", "getConditionLabel(item.returnCondition?.vehicleCondition || '')")
content = content.replace("i.notes && i.vehicleConditionEnd === 'GOOD'", "i.returnCondition?.notes && i.returnCondition?.vehicleCondition === 'GOOD'")
content = content.replace("item.notes", "item.returnCondition?.notes")

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(content)

