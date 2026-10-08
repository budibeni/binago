import React from 'react';
import { Card, Button, FormShell, FormCard, InputNumber, InputTextarea, Label, InputSelect, InputCheckbox, InputDateTimeGps, PhoneLink } from '@adatrack/ui';
import { MapPin, Car, Fuel, Wrench, CheckSquare, Clock, FileText, StickyNote, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalContract } from '../../contracts/types/contract';
import type { RentalHandover } from '../types/handover';
import type { BookingItem } from '../../bookings/types/booking';

interface HandoverFormProps {
  contract: RentalContract | null;
  eligibleContracts?: RentalContract[];
  onSelectContract?: (contract: RentalContract) => void;
  handedOverItemIds?: string[];
  labels?: Record<string, string>;
  onSubmit: (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}


const getMaxEndDate = (items: any[]) => {
  if (!items || items.length === 0) return "";
  let max = new Date(items[0].startDate || "");
  for (const item of items) {
    if (!item.startDate) continue;
    const d = new Date(item.startDate);
    if (item.rateType === "HOURLY") d.setHours(d.getHours() + (item.duration || 1));
    else d.setDate(d.getDate() + (item.duration || 1));
    if (d > max) max = d;
  }
  return max.toISOString();
};
export function HandoverForm({ contract, eligibleContracts = [], onSelectContract, handedOverItemIds = [], labels = {}, onSubmit, onCancel, isSubmitting, layout = 'default', open, onOpenChange }: HandoverFormProps) {
  const [selectedItemIds, setSelectedItemIds] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>('');
  const [eligibleSearch, setEligibleSearch] = React.useState('');
  const [expandedContracts, setExpandedContracts] = React.useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pendingItems = contract?.items?.filter(i => !handedOverItemIds.includes(i.id)) || [];
  const isSingleVehicle = pendingItems.length === 1;

  React.useEffect(() => {
    if (!open) {
      setSelectedItemIds([]);
      setActiveTab('');
      setEligibleSearch('');
      setExpandedContracts(new Set());
      setIsDropdownOpen(false);
    }
  }, [open]);

  React.useEffect(() => {
    const pItems = contract?.items?.filter(i => !handedOverItemIds.includes(i.id)) || [];
    if (pItems.length > 0 && !activeTab && selectedItemIds.length === 0) {
      setActiveTab(pItems[0].id);
      setSelectedItemIds(pItems.map(i => i.id));
    }
  }, [contract, handedOverItemIds, activeTab, selectedItemIds]);

  const [vehicleData, setVehicleData] = React.useState<Record<string, {
    handoverAt: string,
    latitude: number | null,
    longitude: number | null,
    address: string,
    odometer: number | null,
    fuelLevel: RentalHandover['fuelLevel'] | '',
    vehicleCondition: RentalHandover['vehicleCondition'] | '',
    equipment: RentalHandover['equipmentChecklist']
  }>>({});

  React.useEffect(() => {
    setVehicleData(prev => {
      const newData = { ...prev };
      const pItems = contract?.items?.filter(i => !handedOverItemIds.includes(i.id)) || [];
      pItems.forEach(item => {
        if (!newData[item.id]) {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          const defaultHandoverAt = now.toISOString().slice(0, 16);

          newData[item.id] = {
            handoverAt: defaultHandoverAt,
            latitude: null,
            longitude: null,
            address: '',
            odometer: null,
            fuelLevel: '',
            vehicleCondition: '',
            equipment: {
              stnk: false,
              spareTire: false,
              jack: false,
              toolkit: false,
              triangle: false,
              fireExtinguisher: false,
            }
          };
        }
      });
      return newData;
    });
  }, [contract, handedOverItemIds]);

  const [odometerSource, setOdometerSource] = React.useState<'VEHICLE' | 'TRACKING' | 'MANUAL'>('VEHICLE');
  const [notes, setNotes] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const id of selectedItemIds) {
      const data = vehicleData[id];
      if (data.odometer === null || data.fuelLevel === '' || data.vehicleCondition === '') {
        alert('Mohon lengkapi data Odometer, BBM, dan Kondisi untuk semua kendaraan yang dipilih.');
        return;
      }
      if (!data.latitude || !data.longitude) {
        alert('Lokasi serah terima wajib diambil untuk semua kendaraan yang dipilih.');
        return;
      }
    }

    if (!contract) return;

    const payload = selectedItemIds.map(id => {
      const item = contract.items?.find(i => i.id === id);
      const data = vehicleData[id];
      return {
        contractId: contract.id,
        bookingItemId: id,
        customerId: contract.customerId,
        vehicleId: item!.vehicleId,
        handoverAt: new Date(data.handoverAt).toISOString(),
        handoverLatitude: data.latitude!,
        handoverLongitude: data.longitude!,
        handoverAddress: data.address || '-',
        odometerStart: Number(data.odometer),
        odometerSource,
        fuelLevel: data.fuelLevel as RentalHandover['fuelLevel'],
        vehicleCondition: data.vehicleCondition as RentalHandover['vehicleCondition'],
        equipmentChecklist: data.equipment,
        notes: notes,
        staffId: 'usr-budi',
        staffName: 'Budi Beni'
      };
    });

    onSubmit(payload);
  };

  const filteredEligibleContracts = eligibleContracts.filter(c => {
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

        {!contract ? (
          <div className={cn(
            "flex flex-col transition-all duration-500 ease-in-out w-full",
            isDropdownOpen ? "justify-start mt-4" : "justify-center min-h-[50vh]"
          )}>
            {!isDropdownOpen && (
              <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-primary/5 dark:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{labels.formTitle || 'Proses Serah Terima'}</h3>
                <p className="text-[14px] text-muted-foreground mt-2 max-w-sm mx-auto">Cari nomor kontrak, nama pelanggan, atau plat nomor kendaraan untuk memulai proses serah terima.</p>
              </div>
            )}

            <div className="relative w-full max-w-4xl mx-auto transition-all duration-500" ref={searchContainerRef}>
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
                  className="flex h-11 w-full rounded-xl border border-input bg-white dark:bg-neutral-900 pl-10 pr-4 text-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm hover:shadow focus:shadow"
                />
              </div>

              {isDropdownOpen && (
                <div className="w-full mt-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto z-10 relative animate-in fade-in slide-in-from-top-2 duration-300">
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
                            className="group flex flex-col bg-slate-50/70 dark:bg-neutral-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-neutral-800/60"
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
                            <div className="border-t border-slate-200/50 dark:border-slate-700/50 bg-transparent">
                              <div
                                className="px-4 sm:px-5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-neutral-800/50 transition-colors"
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
          </div>
        ) : (
          <FormCard
            title={labels.sectionContract || 'Informasi Kontrak'}
            description={labels.descContract || "Rincian kontrak penyewaan yang menjadi dasar serah terima."}
            icon={<FileText className="w-4 h-4 text-primary" />}
            iconWrapperClassName="text-primary"
            action={
              <Button variant="outline" size="sm" onClick={() => onSelectContract && onSelectContract(null as any)} className="h-7 text-xs px-3">Ganti Kontrak</Button>
            }
          >
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
          </FormCard>
        )}
        {contract && (
          <>
            <FormCard
              title={isSingleVehicle ? labels.sectionVehicles || "Detail Kendaraan" : labels.descVehiclesTabs || "Detail Kendaraan (Pilih Tab)"}
              description={labels.descVehicles || "Lengkapi data serah terima untuk kendaraan di bawah ini."}
              icon={<Car className="w-5 h-5" />}
              iconWrapperClassName="text-sky-500"
            >
              <div className="space-y-3">
                {!isSingleVehicle && (
                  <div className="shrink-0 bg-background border-b border-border mb-3">
                    <div className="flex items-center overflow-x-auto hide-scrollbar">
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
                              "px-4 h-[34px] text-xs font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-2 pt-[2px] whitespace-nowrap",
                              isSelected ? 'border-b-danger text-foreground' : 'border-b-transparent text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <div className={cn("w-2 h-2 rounded-full", isChecked ? "bg-primary" : "bg-neutral-300")} />
                            <Car className={cn("h-3.5 w-3.5", isSelected ? "text-sky-500 dark:text-sky-400" : "opacity-70")} />
                            {item.vehicleSnapshot?.licensePlate}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab && (() => {
                  const item = contract.items?.find(i => i.id === activeTab);
                  const isChecked = selectedItemIds.includes(activeTab);

                  return (
                    <div className="flex flex-col gap-4 pt-1">

                      {/* Header Kendaraan */}
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div>
                          <h5 className="font-bold text-sm">{item?.vehicle?.coreVehicle?.plateNumber}</h5>
                          <p className="text-xs text-muted-foreground">{item?.vehicle?.coreVehicle?.brand} {item?.vehicle?.coreVehicle?.vehicleName}</p>
                        </div>
                      </div>

                      {isChecked ? (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <InputDateTimeGps
                              label={labels.fieldHandoverTime || "Waktu Serah Terima"}
                              value={vehicleData[activeTab]?.handoverAt}
                              onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], handoverAt: v } })}
                              latitude={vehicleData[activeTab]?.latitude}
                              longitude={vehicleData[activeTab]?.longitude}
                              onCoordinates={(lat, lng) => setVehicleData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], latitude: lat, longitude: lng } }))}
                              showAddress={false}
                              required
                            />
                            <InputTextarea
                              id={`addr-${activeTab}`}
                              label={labels.fieldAddress || "Detail Alamat (Opsional)"}
                              value={vehicleData[activeTab]?.address}
                              onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], address: v } })}
                              placeholder={labels.fieldAddressPlaceholder || "Cth: Area lobi..."}
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/50 pt-3">
                            <InputNumber
                              label={labels.fieldOdometer || "Odometer (km)"}
                              value={vehicleData[activeTab]?.odometer ?? null}
                              onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], odometer: val } })}
                              placeholder={labels.fieldOdometerPlaceholder || "Contoh: 15000"}
                            />
                            <InputSelect
                              label={labels.fieldFuelLevel || "BBM"}
                              value={vehicleData[activeTab]?.fuelLevel}
                              onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], fuelLevel: val as any } })}
                              placeholder={labels.fieldFuelPlaceholder || "Pilih Kondisi BBM"}
                              options={[
                                { value: 'EMPTY', label: labels.fuelEmpty || 'Kosong' },
                                { value: 'QUARTER', label: labels.fuelQuarter || '1/4' },
                                { value: 'HALF', label: labels.fuelHalf || '1/2' },
                                { value: 'THREE_QUARTER', label: labels.fuelThreeQuarter || '3/4' },
                                { value: 'FULL', label: labels.fuelFull || 'Penuh' },
                              ]}
                            />
                            <InputSelect
                              label={labels.fieldCondition || "Kondisi"}
                              value={vehicleData[activeTab]?.vehicleCondition}
                              onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], vehicleCondition: val as any } })}
                              placeholder={labels.fieldConditionPlaceholder || "Pilih Kondisi Kendaraan"}
                              options={[
                                { value: 'GOOD', label: labels.condGood || 'Baik' },
                                { value: 'MINOR_DAMAGE', label: labels.condMinorDamage || 'Kerusakan Ringan' },
                                { value: 'NEEDS_REPAIR', label: labels.condNeedsRepair || 'Perlu Perbaikan' },
                              ]}
                            />
                          </div>

                          <div className="border-t border-border/50 pt-3">
                            <Label className="text-[11px] uppercase font-semibold text-muted-foreground mb-2 block">{labels.fieldEquipment || 'Kelengkapan Kendaraan'}</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {Object.keys(vehicleData[activeTab]?.equipment || {}).map((key) => {
                                if (key === 'other') return null;
                                return (
                                  <div key={key} className="flex items-center">
                                    <InputCheckbox
                                      id={`eq-${activeTab}-${key}`}
                                      label={key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
                                      value={(vehicleData[activeTab]?.equipment as any)?.[key] || false}
                                      onChange={(checked) => setVehicleData({
                                        ...vehicleData,
                                        [activeTab]: {
                                          ...vehicleData[activeTab],
                                          equipment: { ...vehicleData[activeTab].equipment, [key]: checked === true }
                                        }
                                      })}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700">
                          <p className="text-sm text-muted-foreground">{labels.emptyVehicleDesc || 'Kendaraan ini tidak dipilih untuk diserahterimakan saat ini.'}</p>
                          <p className="text-xs text-muted-foreground mt-1">{labels.emptyVehicleSub || 'Centang opsi Siap Serah Terima pada bagian Informasi Kontrak untuk mengisi detail kondisinya.'}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </FormCard>

            {/* FOOTER: Catatan */}
            <FormCard
              title={labels.sectionNotes || 'Catatan Tambahan'}
              description={labels.descNotes || "Catatan tambahan secara keseluruhan jika ada."}
              icon={<StickyNote className="w-4 h-4 text-neutral-500" />}
              iconWrapperClassName="text-neutral-500"
            >
              <InputTextarea
                id="notes"
                value={notes}
                onChange={setNotes}
                placeholder={labels.placeholderNotes || "Catatan tambahan terkait serah terima keseluruhan (Opsional)..."}
                rows={3}
              />
            </FormCard>
          </>
        )}
      </div>
    </FormShell>
  );
}
