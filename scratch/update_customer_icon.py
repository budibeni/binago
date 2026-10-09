import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import { AlertCircle, CheckCircle2, Car, Search, CalendarRange } from 'lucide-react';", "import { AlertCircle, CheckCircle2, Car, Search, CalendarRange, User, Building2 } from 'lucide-react';")

old_customer = """                          {/* Baris 3: Customer */}
                          <div className="text-[13px] font-medium text-foreground truncate w-full mt-1.5">
                            {contract.customerSnapshot?.name || 'Pelanggan'}
                          </div>"""

new_customer = """                          {/* Baris 3: Customer */}
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-foreground w-full mt-1.5">
                            {contract.customerSnapshot?.type?.toLowerCase().includes('perusahaan') || contract.customerSnapshot?.type?.toLowerCase().includes('b2b') || contract.customerSnapshot?.type?.toLowerCase().includes('company') ? (
                               <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            ) : (
                               <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span className="truncate w-full">{contract.customerSnapshot?.name || 'Pelanggan'}</span>
                          </div>"""

content = content.replace(old_customer, new_customer)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
