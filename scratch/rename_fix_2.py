with open('apps/business/src/features/modules/rental/contracts/ContractFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ReturnFeature } from '../returns/ReturnFeature';", "import { ReturnCreateFeature } from '../returns/ReturnCreateFeature';")
content = content.replace("<ReturnFeature", "<ReturnCreateFeature")

with open('apps/business/src/features/modules/rental/contracts/ContractFeature.tsx', 'w') as f:
    f.write(content)

with open('apps/business/src/app/(modules)/rental/returns/create/page.tsx', 'r') as f:
    content = f.read()
    
content = content.replace("import { ReturnFeature as ReturnFormFeature } from '@/features/modules/rental/returns/ReturnFeature';", "import { ReturnCreateFeature as ReturnFormFeature } from '@/features/modules/rental/returns/ReturnCreateFeature';")
content = content.replace("onOpenChange={(open) => {", "onOpenChange={(open: boolean) => {")

with open('apps/business/src/app/(modules)/rental/returns/create/page.tsx', 'w') as f:
    f.write(content)
