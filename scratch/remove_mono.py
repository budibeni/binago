import os
import re

path = 'apps/business/src/features/modules/rental/customers/components/CustomerTable.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove font-mono
content = re.sub(r'font-mono\s*', '', content)
# Fix potential empty classNames: className="" or className={cn('')}
content = re.sub(r'className=""', '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Removed font-mono from CustomerTable.tsx")
