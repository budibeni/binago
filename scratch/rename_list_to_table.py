with open('apps/business/src/features/modules/rental/returns/components/ReturnTable.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function ReturnList(", "export function ReturnTable(")

with open('apps/business/src/features/modules/rental/returns/components/ReturnTable.tsx', 'w') as f:
    f.write(content)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ReturnList, type ReturnGroup } from './components/ReturnList';", "import { ReturnTable, type ReturnGroup } from './components/ReturnTable';")
content = content.replace("<ReturnList", "<ReturnTable")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
