import os
import re

path = 'apps/business/src/features/modules/rental/customers/components/CustomerTable.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove text-foreground-muted
content = re.sub(r'text-foreground-muted\s*', '', content)
# Fix potential empty classNames: className="" or className={cn('')}
content = re.sub(r'className=""', '', content)
# Ensure font-mono remains without leading spaces if it was like " font-mono"
content = re.sub(r'className="\s+font-mono"', 'className="font-mono"', content)
content = re.sub(r'className="\s+font-mono\s+"', 'className="font-mono"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Removed text-foreground-muted from CustomerTable.tsx")
