import os
import re

TABLES = [
    "apps/business/src/features/core/drivers/components/DriverTable.tsx",
    "apps/business/src/features/core/access/card/components/CardTable.tsx",
    "apps/business/src/features/core/access/personel/components/PersonelTable.tsx",
    "apps/business/src/features/core/groups/components/GroupTable.tsx",
    "apps/business/src/features/core/vehicles/components/VehicleTable.tsx",
    "apps/business/src/features/modules/rental/pricing-category/components/PricingCategoryTable.tsx",
    "apps/business/src/features/modules/rental/vehicles/components/RentalVehicleTable.tsx"
]

def clean_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Add onRowActionClick to DataTable if onViewDetail exists
    if 'onViewDetail' in content and '<DataTable' in content and 'onRowActionClick=' not in content:
        content = content.replace('columns={columns}', 'columns={columns}\n      onRowActionClick={onViewDetail}')

    # Remove extra styles from span / divs in cell definitions
    # text-[12px], font-mono, text-foreground-muted, text-foreground
    content = re.sub(r'text-\[12px\]\s*', '', content)
    content = re.sub(r'font-mono\s*', '', content)
    content = re.sub(r'text-foreground-muted\s*', '', content)
    content = re.sub(r'text-foreground\s*', '', content)
    
    # Clean up empty classNames: className="" or className=" "
    content = re.sub(r'className="[\s]*"', '', content)
    content = re.sub(r"className='[\s]*'", '', content)

    # Clean up leftover spaces in className=" text-right" -> className="text-right"
    content = re.sub(r'className="\s+', 'className="', content)
    content = re.sub(r'\s+"', '"', content)

    # Some click events on columns
    content = re.sub(r'onClick=\{.*?onViewDetail.*?\}\s*', '', content)
    content = re.sub(r'cursor-pointer\s*', '', content)
    content = re.sub(r'hover:underline\s*', '', content)
    content = re.sub(r'hover:text-primary\s*', '', content)
    content = re.sub(r'transition-colors\s*', '', content)

    with open(filepath, 'w') as f:
        f.write(content)
        print("Cleaned", filepath)

for path in TABLES:
    clean_file(path)
