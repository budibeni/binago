with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function ReturnFeature", "export function ReturnCreateFeature")
content = content.replace("interface ReturnFeatureProps", "interface ReturnCreateFeatureProps")
content = content.replace("({ contractId, open, onOpenChange, onSuccess }: ReturnFeatureProps)", "({ contractId, open, onOpenChange, onSuccess }: ReturnCreateFeatureProps)")

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ReturnFeature as ReturnFormFeature } from './ReturnFeature';", "import { ReturnCreateFeature } from './ReturnCreateFeature';")
content = content.replace("<ReturnFormFeature", "<ReturnCreateFeature")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)

