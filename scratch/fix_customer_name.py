import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("contract.customer?.name", "contract.customerSnapshot?.name")
content = content.replace("c.customer?.name", "c.customerSnapshot?.name")
content = content.replace("selectedContract.customer,", "selectedContract.customerSnapshot,")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
