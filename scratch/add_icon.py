import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import { AlertCircle, CheckCircle2, Car, Search } from 'lucide-react';", "import { AlertCircle, CheckCircle2, Car, Search, CalendarRange } from 'lucide-react';")

# Update Periode line
old_periode = """                          {/* Baris 3: Periode */}
                          <div className="text-[12px] text-muted-foreground mt-0.5">
                            {formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}
                          </div>"""

new_periode = """                          {/* Baris 3: Periode */}
                          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-0.5">
                            <CalendarRange className="w-3.5 h-3.5 opacity-70" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>"""

content = content.replace(old_periode, new_periode)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
