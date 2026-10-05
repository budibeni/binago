import os
import re

path = 'apps/business/src/features/modules/rental/customers/components/CustomerTable.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken className="/50"
content = content.replace('<span className="/50">-</span>', '<span>-</span>')

# Remove text-info from type
content = re.sub(r'<span className=\{cn\(\'\', row.original.type === \'COMPANY\' \? \'text-info\' : \'\'\)\}>', '<span>', content)

# Remove text-foreground
content = re.sub(r'className="text-foreground"', '', content)

# Remove font-medium and text-success from currency
content = re.sub(r'className="font-medium text-foreground"', '', content)
content = re.sub(r'className="font-medium text-success"', '', content)

# Remove danger styling from outstanding
content = re.sub(r'<span className=\{cn\(\'font-medium\', val > 0 \? \'text-danger font-bold\' : \'\'\)\}>', '<span>', content)

# Remove empty class names
content = re.sub(r'className=""', '', content)
content = re.sub(r'className="\s+"', '', content)
content = re.sub(r'className=" "', '', content)

# Clean up empty spans
content = re.sub(r'<span\s*>\s*([^{<]+)\s*</span>', r'\1', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Cleaned up CustomerTable.tsx styles")
