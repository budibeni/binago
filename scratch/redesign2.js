const fs = require('fs');
const path = '/Users/beni/Developer/DEV_AJB/binago/apps/business/src/features/modules/rental/handover/components/HandoverForm.tsx';
let content = fs.readFileSync(path, 'utf8');

const newGrid = `            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                <p className="text-[11px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-1">{labels.fieldContractNumber || 'Nomor Kontrak'}</p>
                <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{contract.contractNumber}</p>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                <p className="text-[11px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-1">{labels.fieldCustomer || 'Pelanggan'}</p>
                <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{contract.customerSnapshot?.name || '-'}</p>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                <p className="text-[11px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-1">{labels.fieldRentPeriod || 'Periode Sewa'}</p>
                <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(contract.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(getMaxEndDate(contract.items || [])).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                <p className="text-[11px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-1">{labels.fieldService || 'Layanan'}</p>
                <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                  {contract.rentalType === 'SELF_DRIVE' ? labels.typeSelfDrive || 'Lepas Kunci' : labels.typeWithDriver || 'Dgn Sopir'}
                </p>
              </div>
            </div>`;

content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">[\s\S]*?<\/div>\n\s*<\/div>/,
  newGrid + '\n            </div>'
);

const newReadySection = `            <div className="mt-5 p-4 rounded-2xl border border-primary/10 bg-primary/[0.03] dark:bg-primary/[0.05] flex items-center justify-between animate-in fade-in duration-300">
              <div>
                <p className="text-sm font-semibold text-foreground">Siap Serah Terima</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">Centang untuk memproses serah terima kendaraan pada kontrak ini.</p>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-700 hover:border-primary/50 shadow-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                <InputCheckbox
                  label="Proses Serah Terima"
                  value={selectedItemIds.length > 0 && selectedItemIds.length === pendingItems.length}
                  onChange={(checked) => {
                    if (checked) setSelectedItemIds(pendingItems.map(i => i.id));
                    else setSelectedItemIds([]);
                  }}
                  className="m-0 font-semibold text-primary"
                />
              </div>
            </div>`;

content = content.replace(
  /<div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between animate-in fade-in duration-300">[\s\S]*?<\/div>\n\s*<\/div>/,
  newReadySection
);

const newTabs = `                {!isSingleVehicle && (
                  <div className="bg-slate-50/50 dark:bg-slate-800/30 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50 mb-6">
                    <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                      {pendingItems.map(item => {
                        const id = item.id;
                        const isSelected = activeTab === id;
                        const isChecked = selectedItemIds.includes(id);

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            className={cn(
                              "px-4 py-2 text-[13px] font-semibold rounded-lg transition-all flex items-center gap-2.5 whitespace-nowrap",
                              isSelected 
                                ? 'bg-white dark:bg-neutral-900 shadow-sm border border-slate-200/60 dark:border-slate-600 text-slate-800 dark:text-slate-100' 
                                : 'border border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                            )}
                          >
                            <div className={cn("w-2 h-2 rounded-full", isChecked ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-slate-300 dark:bg-slate-600")} />
                            <div className="flex items-center gap-1.5">
                              <Car className={cn("h-4 w-4", isSelected ? "text-sky-500 dark:text-sky-400" : "opacity-60")} />
                              {item.vehicleSnapshot?.licensePlate}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}`;

content = content.replace(
  /\{!isSingleVehicle && \([\s\S]*?<div className="shrink-0 bg-background border-b border-border mb-3">[\s\S]*?<\/div>\n\s*<\/div>\n\s*\)\}/,
  newTabs
);

fs.writeFileSync(path, content);
