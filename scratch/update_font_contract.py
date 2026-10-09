import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

old_str = '<div className="text-[13px] font-medium text-muted-foreground truncate max-w-[50%]">'
new_str = '<div className="text-[12px] font-normal text-muted-foreground truncate max-w-[50%]">'

content = content.replace(old_str, new_str)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
