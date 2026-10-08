const fs = require('fs');
const path = '/Users/beni/Developer/DEV_AJB/binago/apps/business/src/features/modules/rental/handover/components/HandoverForm.tsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const newCode = `  const filteredEligibleContracts = eligibleContracts.filter(c => {
    if (!eligibleSearch) return true;
    const s = eligibleSearch.toLowerCase();
    if (c.contractNumber?.toLowerCase().includes(s)) return true;
    if (c.customerSnapshot?.name?.toLowerCase().includes(s)) return true;
    if (c.items?.some(i =>
      i.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
      i.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
      i.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s)
    )) return true;
    return false;
  });

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={contract ? handleSubmit : (e) => e.preventDefault()}
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      cancelText={labels.btnCancel || 'Batal'}
      saveText={!contract ? labels.btnProcessHandover || 'Proses Serah Terima' : (isSubmitting ? labels.btnSaving || 'Menyimpan...' : labels.btnSave || 'Simpan Serah Terima')}
      saveProps={!contract ? { disabled: true, className: "hidden" } : { disabled: isSubmitting || selectedItemIds.length === 0 }}
      isSubmitting={isSubmitting}
      title={!contract ? (labels.formTitle || 'Proses Serah Terima') : undefined}
    >
      <div className={cn("flex flex-col gap-4", !contract ? "flex-1 w-full max-w-4xl mx-auto" : "")}>

        {/* HEADER: Informasi Kontrak */}
        <FormCard
          title={labels.sectionContract || 'Informasi Kontrak'}
          description={!contract ? "Cari dan pilih kontrak penyewaan yang akan diserahterimakan." : (labels.descContract || "Rincian kontrak penyewaan yang menjadi dasar serah terima.")}
          icon={<FileText className="w-4 h-4 text-primary" />}
          iconWrapperClassName="text-primary"
          headerRight={contract ? (
            <Button variant="outline" size="sm" onClick={() => onSelectContract?.(null as any)} className="h-7 text-xs px-3">Ganti Kontrak</Button>
          ) : undefined}
        >
          {!contract ? (
            <div className="relative" ref={searchContainerRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input 
                  type="text"
                  placeholder="Cari nomor kontrak, nama pelanggan, atau plat nomor..."
                  value={eligibleSearch}
                  onChange={(e) => {
                    setEligibleSearch(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="flex h-11 w-full rounded-xl border border-input bg-white dark:bg-neutral-900 pl-10 pr-4 text-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>

              {isDropdownOpen && (
                <div className="w-full mt-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto z-10 relative">
                  <div className="flex flex-col gap-3 p-2 sm:p-3">
              {filteredEligibleContracts.length > 0 ? (
                filteredEligibleContracts.map(c => {
                  const isExpanded = expandedContracts.has(c.id);
                  const toggleExpand = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    const newSet = new Set(expandedContracts);
                    if (isExpanded) newSet.delete(c.id);
                    else newSet.add(c.id);
                    setExpandedContracts(newSet);
                  };
                  
                  const formatDt = (d?: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
                  const formatShortD = (d?: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
                  const isToday = (d?: string) => {
                    if (!d) return false;
                    const date = new Date(d);
                    const today = new Date();
                    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
                  };
                  
                  const startDate = formatDt(c.startDate);
                  const isStartDateToday = isToday(c.startDate);
                  const endDate = formatDt(c.items && c.items.length > 0 ? getMaxEndDate(c.items) : undefined);
                  const contractDate = formatShortD(c.contractDate || c.createdAt);
                  const custType = c.customerSnapshot?.type || '-';
                  const custPhone = c.customerSnapshot?.phone || '-';
                  
                  const itemsCount = c.items?.length || 0;
                  const handedOverCount = (c.items || []).filter(item => handedOverItemIds.includes(item.id)).length;

                  return (
                    <div 
                      key={c.id} 
                      className="group flex flex-col bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      {/* Bagian Atas: 5 Kolom */}
                      <div className="p-4 sm:p-5 grid grid-cols-2 md:grid-cols-5 gap-5 items-start w-full">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">No Kontrak</span>
                          <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200">{c.contractNumber}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{contractDate}</span>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Nama Pelanggan</span>
                          <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1" title={c.customerSnapshot?.name}>{c.customerSnapshot?.name || '-'}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{custType} - <PhoneLink phone={custPhone} className="text-slate-500 dark:text-slate-400" /></span>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Waktu Ambil</span>
                          <span className={cn("text-[12px] font-semibold", isStartDateToday ? "text-destructive" : "text-slate-800 dark:text-slate-200")}>{startDate}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Selesai: {endDate}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Lokasi Ambil</span>
                          <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-2" title={c.pickupLocation || '-'}>{c.pickupLocation || '-'}</span>
                        </div>
                        
                        <div className="flex md:justify-end md:ml-auto w-full md:w-auto mt-2 md:mt-0">
                          <Button 
                            size="sm"
                            className="h-8 text-[11px] px-6 w-full md:w-auto font-medium rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300" 
                            onClick={() => onSelectContract?.(c)}
                          >
                            Pilih Kontrak
                          </Button>
                        </div>
                      </div>

                      {/* Bagian Bawah: Progress & Daftar Kendaraan */}
                      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
                        <div 
                          className="px-4 sm:px-5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                          onClick={toggleExpand}
                        >
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {handedOverCount}/{itemsCount} Kendaraan
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>

                        {isExpanded && (
                          <div className="px-4 sm:px-5 pb-5 pt-1 flex flex-wrap gap-2 animate-in slide-in-from-top-1 fade-in duration-200">
                            {(c.items || []).map((item, idx) => {
                              const isHandedOver = handedOverItemIds.includes(item.id);
                              return (
                                <div
                                  key={item.id || idx}
                                  className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all",
                                    isHandedOver
                                      ? "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:border-success/30"
                                      : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                                  )}
                                >
                                  {isHandedOver ? <CheckSquare className="w-3.5 h-3.5 shrink-0" /> : <Car className="w-3.5 h-3.5 shrink-0" />}
                                  {item.vehicleSnapshot?.licensePlate}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-neutral-800/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-1">{labels.panelEmpty || 'Tidak ada kontrak tersedia'}</h4>
                  <p className="text-sm text-muted-foreground max-w-sm">{labels.panelEmptyDesc || 'Saat ini tidak ada kontrak yang kendaraannya siap untuk diserahterimakan.'}</p>
                </div>
              )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <p className="text-[13px] font-normal text-neutral-500 mb-1">{labels.fieldContractNumber || 'Nomor Kontrak'}</p>
                  <p className="text-[13px] font-semibold text-foreground">{contract.contractNumber}</p>
                </div>
                <div>
                  <p className="text-[13px] font-normal text-neutral-500 mb-1">{labels.fieldCustomer || 'Pelanggan'}</p>
                  <p className="text-[13px] font-semibold text-foreground">{contract.customerSnapshot?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-[13px] font-normal text-neutral-500 mb-1">{labels.fieldRentPeriod || 'Periode Sewa'}</p>
                  <p className="text-[13px] font-semibold text-foreground">
                    {new Date(contract.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(getMaxEndDate(contract.items || [])).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] font-normal text-neutral-500 mb-1">{labels.fieldService || 'Layanan'}</p>
                  <p className="text-[13px] font-semibold text-foreground">
                    {contract.rentalType === 'SELF_DRIVE' ? labels.typeSelfDrive || 'Lepas Kunci' : labels.typeWithDriver || 'Dgn Sopir'} 
                  </p>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between animate-in fade-in duration-300">
                <div>
                  <p className="text-sm font-semibold text-foreground">Siap Serah Terima</p>
                  <p className="text-xs text-muted-foreground">Centang untuk memproses serah terima kendaraan pada kontrak ini.</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
                  <InputCheckbox
                    label="Proses Serah Terima"
                    value={selectedItemIds.length > 0 && selectedItemIds.length === pendingItems.length}
                    onChange={(checked) => {
                      if (checked) setSelectedItemIds(pendingItems.map(i => i.id));
                      else setSelectedItemIds([]);
                    }}
                    className="m-0 font-medium text-primary"
                  />
                </div>
              </div>
            </>
          )}
        </FormCard>`;

lines.splice(160, 421 - 160 + 1, newCode);
fs.writeFileSync(path, lines.join('\n'));
