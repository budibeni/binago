with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

import re

# Revert back to the standard side-drawer classes
new_classes = 'className="h-full max-h-[100vh] w-full max-w-[1200px] ml-auto p-0 flex flex-col rounded-none sm:rounded-l-2xl after:hidden border-l border-border/50 bg-background/95 backdrop-blur-sm"'
content = re.sub(r'className="w-full max-w-\[1200px\] h-\[95vh\].*?"', new_classes, content)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)
