import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

old_periode = """                          {/* Baris 2: Periode */}
                          <div className="flex items-center gap-1.5 text-[13px] font-normal text-muted-foreground mt-0.5">
                            <CalendarRange className="w-3.5 h-3.5 opacity-70" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>"""

new_periode = """                          {/* Baris 2: Periode */}
                          <div className="flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground mt-0.5">
                            <CalendarRange className="w-3 h-3 opacity-70" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>"""

content = content.replace(old_periode, new_periode)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
