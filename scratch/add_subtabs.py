import re

with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'r') as f:
    content = f.read()

# 1. Add subTab state
if "const [subTab, setSubTab]" not in content:
    content = content.replace(
        "const [activeTab, setActiveTab] = useState<string>(itemsToReturn[0]?.id || '');",
        "const [activeTab, setActiveTab] = useState<string>(itemsToReturn[0]?.id || '');\n  const [subTab, setSubTab] = useState<'RETURN' | 'HANDOVER'>('RETURN');"
    )

# 2. Reset subTab when vehicle changes
if "setActiveTab(id);" not in content:
    content = content.replace(
        "onClick={() => setActiveTab(id)}",
        "onClick={() => { setActiveTab(id); setSubTab('RETURN'); }}"
    )

# 3. Fix the TypeScript error and replace the banner with the new tabs
old_banner = """                  {/* INFO SERAH TERIMA AWAL */}
                  {item && (
                    <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Waktu Serah Terima</span>
                        <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{item.handoverAt ? formatDateTime(item.handoverAt) : '-'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Odometer Awal</span>
                        <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{item.handoverOdometer ? `${item.handoverOdometer} km` : '-'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sisa BBM Awal</span>
                        <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">
                          {({EMPTY: 'Kosong', QUARTER: '1/4', HALF: '1/2', THREE_QUARTER: '3/4', FULL: 'Penuh'} as any)[item.handoverCondition?.fuelLevel || ''] || '-'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kondisi Fisik Awal</span>
                        <span className={cn(
                          "text-[12px] font-medium",
                          item.handoverCondition?.vehicleCondition === 'GOOD' ? 'text-emerald-600 dark:text-emerald-400' : 'text-warning'
                        )}>
                          {({GOOD: 'Baik', MINOR_DAMAGE: 'Rusak Ringan', NEEDS_REPAIR: 'Rusak Berat'} as any)[item.handoverCondition?.vehicleCondition || ''] || '-'}
                        </span>
                      </div>
                    </div>
                  )}"""

new_tabs = """                  {/* SUB-TABS */}
                  <div className="flex w-full border-b border-border mb-6">
                    <button 
                      onClick={() => setSubTab('RETURN')}
                      className={cn(
                        "text-[13px] font-semibold py-2.5 px-5 transition-all border-b-2 -mb-[1px]", 
                        subTab === 'RETURN' 
                          ? "border-primary text-primary" 
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                      )}
                    >
                      Data Pengembalian
                    </button>
                    <button 
                      onClick={() => setSubTab('HANDOVER')}
                      className={cn(
                        "text-[13px] font-semibold py-2.5 px-5 transition-all border-b-2 -mb-[1px]", 
                        subTab === 'HANDOVER' 
                          ? "border-primary text-primary" 
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                      )}
                    >
                      Data Serah Terima
                    </button>
                  </div>"""

if old_banner in content:
    content = content.replace(old_banner, new_tabs)
else:
    print("Warning: old banner not found")

# 4. Wrap the form in conditional and add handover content
# Find the start of the form
form_start = """                  {isChecked ? ("""
form_end = """                  ) : (
                    <div className="py-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-muted-foreground">Kendaraan ini tidak dipilih untuk dikembalikan saat ini.</p>
                      <p className="text-xs text-muted-foreground mt-1">Centang kotak 'Kembalikan kendaraan ini' untuk memproses.</p>
                    </div>
                  )}"""

# We need to wrap the whole isChecked block? 
# Actually, the user should be able to view Handover info even if it's not checked maybe?
# But if it's not checked, they can't return. Let's just put the logic inside `isChecked ?`
# Wait, let's look at the structure.
import re

pattern = r'(\{\s*isChecked\s*\?\s*\(\s*<div className="flex flex-col gap-4 animate-in fade-in duration-300">)(.*?)(?=\s*\)\s*:\s*\(\s*<div className="py-8 text-center)'
match = re.search(pattern, content, re.DOTALL)

if match:
    prefix = match.group(1)
    return_form_content = match.group(2)
    
    handover_content = """
                        {subTab === 'HANDOVER' ? (
                          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Waktu Serah Terima</span>
                                  <span className="text-[13px] font-semibold">{item.handoverDate ? formatDateTime(item.handoverDate) : '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lokasi Serah Terima</span>
                                  <span className="text-[13px] font-semibold">{item.handoverLocation?.address || '-'}</span>
                                  {item.handoverLocation?.latitude && (
                                    <span className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                                      {item.handoverLocation.latitude}, {item.handoverLocation.longitude}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Odometer Awal</span>
                                  <span className="text-[13px] font-semibold">{item.handoverOdometer ? `${item.handoverOdometer} km` : '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sisa BBM Awal</span>
                                  <span className="text-[13px] font-semibold">
                                    {({EMPTY: 'Kosong', QUARTER: '1/4', HALF: '1/2', THREE_QUARTER: '3/4', FULL: 'Penuh'} as any)[item.handoverCondition?.fuelLevel || ''] || '-'}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Kondisi Fisik Awal</span>
                                  <span className={cn(
                                    "text-[13px] font-semibold",
                                    item.handoverCondition?.vehicleCondition === 'GOOD' ? 'text-emerald-600 dark:text-emerald-400' : 'text-warning'
                                  )}>
                                    {({GOOD: 'Baik', MINOR_DAMAGE: 'Rusak Ringan', NEEDS_REPAIR: 'Rusak Berat'} as any)[item.handoverCondition?.vehicleCondition || ''] || '-'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {item.handoverCondition?.damageNotes && (
                              <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl">
                                <span className="text-[11px] font-semibold text-warning uppercase tracking-wider mb-1 block">Catatan Kerusakan Awal</span>
                                <span className="text-[13px] font-medium text-warning-foreground">{item.handoverCondition.damageNotes}</span>
                              </div>
                            )}

                            <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                              <Label className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-3 block tracking-wide">Kelengkapan Kendaraan Awal</Label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                  { key: 'stnkOriginal', label: 'STNK Original' },
                                  { key: 'spareKey', label: 'Kunci Cadangan' },
                                  { key: 'jackAndTools', label: 'Dongkrak & Toolkit' },
                                  { key: 'spareTire', label: 'Ban Cadangan' },
                                  { key: 'firstAidKit', label: 'P3K' }
                                ].map(({ key, label }) => {
                                  const isChecked = (item.handoverCondition?.equipmentChecklist as any)?.[key] || false;
                                  return (
                                    <div key={key} className="flex items-center gap-2 h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-neutral-900/50 opacity-80 cursor-default">
                                      <InputCheckbox className="m-0" label="" value={isChecked} disabled={true} />
                                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : ("""
    
    # We close it properly
    new_content = prefix + handover_content + return_form_content + "\n                        )}"
    
    content = content[:match.start()] + new_content + content[match.end():]
else:
    print("Could not match the form block")

with open('apps/business/src/features/modules/rental/returns/components/ReturnForm.tsx', 'w') as f:
    f.write(content)
    
