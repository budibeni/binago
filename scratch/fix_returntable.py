import re

with open('apps/business/src/features/modules/rental/returns/components/ReturnTable.tsx', 'r') as f:
    content = f.read()

content = content.replace("contract.customer?.name", "contract.customerSnapshot?.name")

with open('apps/business/src/features/modules/rental/returns/components/ReturnTable.tsx', 'w') as f:
    f.write(content)
