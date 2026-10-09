import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

new_card_content = """<button 
                     key={contract.id}
                     onClick={() => setSelectedContractId(contract.id)}
                     className={cn(
                       "w-full flex flex-col p-4 transition-all text-left border rounded-xl shadow-sm",
                       isSelected 
                         ? "bg-primary/5 border-primary/30" 
                         : "bg-background border-border/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:border-border"
                     )}
                   >
                      <div className="flex flex-col gap-1 w-full text-left">
                          {/* Baris 1: Kiri :#no kontrak, Kanan : status */}
                          <div className="flex justify-between items-start w-full">
                            <div className="text-[13px] font-bold text-muted-foreground truncate max-w-[50%]">
                              {contract.contractNumber}
                            </div>
                            <div className="flex items-center flex-wrap gap-2 justify-end text-[10px] font-bold tracking-wide shrink-0 max-w-[50%]">
                               {status.safeCount > 0 && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aman ({status.safeCount})</span>}
                               {status.warningCount > 0 && <span className="flex items-center gap-1 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                               {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                               {activeTab === 'COMPLETED' && <span className="flex items-center gap-1 text-neutral-500"><CheckCircle2 className="w-3 h-3" /> Selesai</span>}
                            </div>
                          </div>
                          
                          {/* Baris 2: Customer */}
                          <div className="text-[15px] font-bold text-foreground mt-1 truncate w-full">
                            {contract.customerSnapshot?.name || 'Pelanggan'}
                          </div>
                          
                          {/* Baris 3: Periode */}
                          <div className="text-[12px] text-muted-foreground mt-0.5">
                            {formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}
                          </div>
                      </div>
                   </button>"""

content = re.sub(r'<button\s*key=\{contract\.id\}[\s\S]*?</button>', new_card_content, content, count=1)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
