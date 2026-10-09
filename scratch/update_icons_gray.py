import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Update Calendar icon
content = content.replace('<CalendarRange className="w-3 h-3 opacity-70" />', '<CalendarRange className="w-3 h-3 text-neutral-400" />')

# Update Building2 icon
content = content.replace('<Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />', '<Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />')

# Update User icon
content = content.replace('<User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />', '<User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />')

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
