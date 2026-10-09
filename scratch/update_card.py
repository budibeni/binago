import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

card_content_old = """                      <div className="flex flex-col gap-1 mb-3">
                         <span className="font-bold text-[14px] text-foreground">{contract.customer?.name}</span>
                         <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5">
                            {contract.contractNumber}
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            {formatDateTime(contract.startDate)}
                         </span>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold tracking-wide">
                         <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div> {status.total} Unit</span>
                         {status.returnedCount > 0 && <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {status.returnedCount} Selesai</span>}
                         {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger bg-danger/10 px-1.5 py-0.5 rounded-md"><AlertCircle className="w-3 h-3" /> {status.overdueCount} Overdue</span>}
                         {activeTab === 'COMPLETED' && <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md"><CheckCircle2 className="w-3 h-3 inline mr-0.5" /> COMPLETED</span>}
                      </div>"""

card_content_new = """                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 w-full text-left">
                        <div className="col-span-1">
                          <div className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-1 uppercase">Nomor Kontrak</div>
                          <div className="text-[13px] font-bold text-foreground">{contract.contractNumber}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{formatDateTime(contract.createdAt || contract.startDate).split(',')[0]}</div>
                        </div>
                        <div className="col-span-1">
                          <div className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-1 uppercase">Pelanggan</div>
                          <div className="text-[13px] font-bold text-foreground truncate">{contract.customer?.name}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{contract.customer?.type || 'Individu'} - {contract.customer?.phone}</div>
                        </div>
                        
                        <div className="col-span-2 pt-3 border-t border-border/50">
                          <div className="flex justify-between items-end w-full">
                            <div>
                              <div className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-1 uppercase">Periode Sewa</div>
                              <div className="text-[13px] font-bold text-foreground">{formatDateTime(contract.startDate)}</div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">Selesai: {contract.endDate ? formatDateTime(contract.endDate) : '-'}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 text-[10px] font-bold tracking-wide">
                               <span className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div> {status.total} Unit</span>
                               {status.returnedCount > 0 && <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {status.returnedCount} Selesai</span>}
                               {status.overdueCount > 0 && <span className="flex items-center gap-1.5 text-danger bg-danger/10 px-2 py-0.5 rounded-md"><AlertCircle className="w-3 h-3" /> {status.overdueCount} Overdue</span>}
                               {activeTab === 'COMPLETED' && <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md"><CheckCircle2 className="w-3 h-3 inline mr-1" /> COMPLETED</span>}
                            </div>
                          </div>
                        </div>
                      </div>"""

content = content.replace(card_content_old, card_content_new)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
