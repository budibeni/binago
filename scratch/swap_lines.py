import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

old_order = """                          {/* Baris 2: Customer */}
                          <div className="text-[13px] font-medium text-foreground truncate w-full">
                            {contract.customerSnapshot?.name || 'Pelanggan'}
                          </div>
                          
                          {/* Baris 3: Periode */}
                          <div className="flex items-center gap-1.5 text-[13px] font-normal text-muted-foreground mt-0.5">
                            <CalendarRange className="w-3.5 h-3.5 opacity-70" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>"""

new_order = """                          {/* Baris 2: Periode */}
                          <div className="flex items-center gap-1.5 text-[13px] font-normal text-muted-foreground mt-0.5">
                            <CalendarRange className="w-3.5 h-3.5 opacity-70" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>

                          {/* Baris 3: Customer */}
                          <div className="text-[13px] font-medium text-foreground truncate w-full mt-0.5">
                            {contract.customerSnapshot?.name || 'Pelanggan'}
                          </div>"""

content = content.replace(old_order, new_order)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
