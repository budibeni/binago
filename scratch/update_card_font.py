import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Update Font Sizes for the card content
old_card = """<div className="flex flex-col gap-0.5 w-full text-left">
                          {/* Baris 1: Kiri :#no kontrak, Kanan : status */}
                          <div className="flex justify-between items-center w-full">
                            <div className="text-[12px] font-bold text-muted-foreground truncate max-w-[50%]">
                              {contract.contractNumber}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 justify-end text-[10px] font-bold tracking-wide shrink-0 max-w-[50%]">
                               {status.safeCount > 0 && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aman ({status.safeCount})</span>}
                               {status.warningCount > 0 && <span className="flex items-center gap-1 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                               {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                               {activeTab === 'COMPLETED' && <span className="flex items-center gap-1 text-neutral-500"><CheckCircle2 className="w-3 h-3" /> Selesai</span>}
                            </div>
                          </div>
                          
                          {/* Baris 2: Customer */}
                          <div className="text-[14px] font-bold text-foreground truncate w-full">
                            {contract.customerSnapshot?.name || 'Pelanggan'}
                          </div>
                          
                          {/* Baris 3: Periode */}
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                            <CalendarRange className="w-3.5 h-3.5 opacity-70" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>
                      </div>"""

new_card = """<div className="flex flex-col gap-1 w-full text-left">
                          {/* Baris 1: Kiri :#no kontrak, Kanan : status */}
                          <div className="flex justify-between items-center w-full">
                            <div className="text-[13px] font-medium text-muted-foreground truncate max-w-[50%]">
                              {contract.contractNumber}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 justify-end text-[11px] font-medium tracking-wide shrink-0 max-w-[50%]">
                               {status.safeCount > 0 && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aman ({status.safeCount})</span>}
                               {status.warningCount > 0 && <span className="flex items-center gap-1 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                               {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                               {activeTab === 'COMPLETED' && <span className="flex items-center gap-1 text-neutral-500"><CheckCircle2 className="w-3 h-3" /> Selesai</span>}
                            </div>
                          </div>
                          
                          {/* Baris 2: Customer */}
                          <div className="text-[13px] font-medium text-foreground truncate w-full">
                            {contract.customerSnapshot?.name || 'Pelanggan'}
                          </div>
                          
                          {/* Baris 3: Periode */}
                          <div className="flex items-center gap-1.5 text-[13px] font-normal text-muted-foreground mt-0.5">
                            <CalendarRange className="w-3.5 h-3.5 opacity-70" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>
                      </div>"""

content = content.replace(old_card, new_card)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
