with open('apps/business/src/features/modules/rental/returns/components/ReturnTable.tsx', 'r') as f:
    content = f.read()

import re
content = re.sub(r'\s*onRowClick={onViewDetail}', '', content)

with open('apps/business/src/features/modules/rental/returns/components/ReturnTable.tsx', 'w') as f:
    f.write(content)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace('description="Kelola antrean pengembalian dan riwayat kendaraan"', '')

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)


with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    content = f.read()

group_def = """export interface ReturnGroup {
  id: string;
  contractId: string;
  contract?: any;
  customer?: any;
  handoverAt: string;
  handoverLatitude?: number;
  handoverLongitude?: number;
  handoverAddress?: string;
  status: 'PARTIAL' | 'COMPLETED';
  items: any[];
}
"""

content = content.replace("import type { ReturnGroup } from './ReturnTable';", group_def)
content = content.replace("returnGroup.items.reduce((sum, item)", "returnGroup.items.reduce((sum: number, item: any)")

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(content)

