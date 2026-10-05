import os
import re

path = 'apps/business/src/features/modules/rental/customers/components/CustomerTable.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace text-[12px] or 'text-[12px]' in cn() with empty string if it leaves empty string, 
# or just remove it from class strings.
# Wait, "text-[12px] font-mono" -> "font-mono"
# "text-[12px]" -> ""

new_content = re.sub(r'text-\[12px\]\s*', '', content)
# Fix potential empty classNames: className="" or className={cn('')}
new_content = re.sub(r'className=""', '', new_content)
# Clean up leftover cn('', ...) if any, but it's fine cn ignores empty strings.

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Removed text-[12px] from CustomerTable.tsx")
