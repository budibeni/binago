import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# 1. Reduce left panel width
old_panel = 'className={cn("w-full md:w-[350px] lg:w-[420px] shrink-0 border-r border-border bg-neutral-50/50 dark:bg-neutral-950/50 flex-col h-full", selectedContractId ? "hidden md:flex" : "flex")}'
new_panel = 'className={cn("w-full md:w-[280px] lg:w-[320px] shrink-0 border-r border-border bg-neutral-50/50 dark:bg-neutral-950/50 flex-col h-full", selectedContractId ? "hidden md:flex" : "flex")}'
content = content.replace(old_panel, new_panel)

# 2. Reduce card padding
content = content.replace('"w-full flex flex-col py-3.5 px-4 transition-all text-left outline-none"', '"w-full flex flex-col py-2.5 px-3 transition-all text-left outline-none"')

# 3. Reduce text sizes inside the card
old_card = """                      <div className="flex flex-col w-full text-left">
                          {/* Baris 1: Kiri :#no kontrak, Kanan : status */}
                          <div className="flex justify-between items-center w-full mb-0.5">
                            <div className="text-[11px] font-normal text-muted-foreground truncate max-w-[50%]">
                              {contract.contractNumber}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 justify-end text-[11px] font-medium tracking-wide shrink-0 max-w-[50%]">
                               {status.safeCount > 0 && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aman ({status.safeCount})</span>}
                               {status.warningCount > 0 && <span className="flex items-center gap-1 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                               {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                               {activeTab === 'COMPLETED' && <span className="flex items-center gap-1 text-neutral-500"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Selesai</span>}
                            </div>
                          </div>
                          
                          {/* Baris 2: Periode */}
                          <div className="flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                            <CalendarRange className="w-3 h-3 text-neutral-400" />
                            <span>{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>

                          {/* Baris 3: Customer */}
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-foreground w-full mt-1.5">
                            {contract.customerSnapshot?.type?.toLowerCase().includes('perusahaan') || contract.customerSnapshot?.type?.toLowerCase().includes('b2b') || contract.customerSnapshot?.type?.toLowerCase().includes('company') ? (
                               <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            ) : (
                               <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            )}
                            <span className="truncate w-full">{contract.customerSnapshot?.name || 'Pelanggan'}</span>
                          </div>
                      </div>"""

new_card = """                      <div className="flex flex-col w-full text-left">
                          {/* Baris 1: Kiri :#no kontrak, Kanan : status */}
                          <div className="flex justify-between items-center w-full mb-0.5">
                            <div className="text-[10px] font-normal text-muted-foreground truncate max-w-[50%]">
                              {contract.contractNumber}
                            </div>
                            <div className="flex items-center flex-wrap gap-1 justify-end text-[10px] font-medium tracking-wide shrink-0 max-w-[50%]">
                               {status.safeCount > 0 && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aman ({status.safeCount})</span>}
                               {status.warningCount > 0 && <span className="flex items-center gap-1 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                               {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                               {activeTab === 'COMPLETED' && <span className="flex items-center gap-1 text-neutral-500"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Selesai</span>}
                            </div>
                          </div>
                          
                          {/* Baris 2: Periode */}
                          <div className="flex items-center gap-1 text-[10px] font-normal text-muted-foreground">
                            <CalendarRange className="w-3 h-3 text-neutral-400" />
                            <span className="truncate">{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                          </div>

                          {/* Baris 3: Customer */}
                          <div className="flex items-center gap-1 text-[12px] font-medium text-foreground w-full mt-1.5">
                            {contract.customerSnapshot?.type?.toLowerCase().includes('perusahaan') || contract.customerSnapshot?.type?.toLowerCase().includes('b2b') || contract.customerSnapshot?.type?.toLowerCase().includes('company') ? (
                               <Building2 className="w-3 h-3 text-neutral-400 shrink-0" />
                            ) : (
                               <User className="w-3 h-3 text-neutral-400 shrink-0" />
                            )}
                            <span className="truncate w-full">{contract.customerSnapshot?.name || 'Pelanggan'}</span>
                          </div>
                      </div>"""

content = content.replace(old_card, new_card)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
