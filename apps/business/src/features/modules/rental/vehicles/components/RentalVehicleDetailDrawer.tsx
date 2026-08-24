import React from 'react';
import { Button } from '@adatrack/ui';
import type { RentalVehicle } from '../types/rentalVehicle';
import { Edit2, CheckCircle2, AlertCircle, X, Car, Tag, Calendar, User, MapPin, FileText, CreditCard } from 'lucide-react';
import { cn } from '@adatrack/utils';

interface RentalVehicleDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: RentalVehicle | null;
  labels: Record<string, string>;
  onEdit: (v: RentalVehicle) => void;
}

export function RentalVehicleDetailDrawer({
  open,
  onOpenChange,
  data,
  labels,
  onEdit,
}: RentalVehicleDetailDrawerProps) {
  if (!data) return null;

  const core = data.coreVehicle;
  
  const formatCurrency = (value: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const renderStatus = () => {
    const s = data.status;
    let label = '';
    if (s === 'READY') { label = labels.statusReady; }
    else if (s === 'RESERVED') { label = labels.statusReserved; }
    else if (s === 'RENTED') { label = labels.statusRented; }
    else if (s === 'MAINTENANCE') { label = labels.statusMaintenance; }
    else if (s === 'UNAVAILABLE') { label = labels.statusUnavailable || 'Tidak Tersedia'; }
    
    // Grey badge as in the image "Tidak Tersedia"
    return <div className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 rounded text-[11px] font-semibold">{label}</div>;
  };

  return (
    <>
      <div 
        className={cn("fixed inset-0 bg-black/40 z-50 transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={() => onOpenChange(false)} 
      />
      <aside 
        className={cn("fixed top-0 right-0 h-full w-[300px] sm:w-[360px] bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300", open ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold">Detail Armada</h2>
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-7 w-7 rounded-full p-0 flex items-center justify-center text-muted-foreground hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Main Title Area */}
          <div className="px-4 py-3.5 border-b border-border/40 flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[15px] font-bold">{core.brand} {core.vehicleName}</h2>
              <p className="text-xs text-muted-foreground">{core.plateNumber}</p>
            </div>
            {renderStatus()}
          </div>

          <div className="p-4 flex flex-col gap-4">
            
            {/* DATA KENDARAAN CARD */}
            <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="p-3.5 flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-danger" />
                <h3 className="text-[11px] font-bold text-danger uppercase tracking-wide">DATA KENDARAAN</h3>
              </div>

              <div className="px-3.5 pb-3.5 flex flex-col">
                {/* Row 1 */}
                <div className="grid grid-cols-2 py-2 border-b border-border/40">
                  <div className="flex gap-2.5">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground">Plat Nomor</span>
                      <span className="text-xs font-semibold">{core.plateNumber}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground">Merk</span>
                      <span className="text-xs font-semibold">{core.brand}</span>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 py-2">
                  <div className="flex gap-2.5">
                    <Car className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground">Model</span>
                      <span className="text-xs font-semibold">{core.vehicleName}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground">Tahun</span>
                      <span className="text-xs font-semibold">{core.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DATA RENTAL CARD */}
            <div className="border border-border/60 rounded-xl bg-transparent">
              <div className="p-3.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-danger" />
                  <h3 className="text-[11px] font-bold text-danger uppercase tracking-wide">DATA RENTAL</h3>
                </div>
                {data.isComplete ? (
                  <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold">Lengkap</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-orange-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold">Belum Lengkap</span>
                  </div>
                )}
              </div>

              <div className="px-3.5 pb-3.5 flex flex-col">
                
                {/* Row 1 */}
                <div className="grid grid-cols-2 py-2 border-b border-border/40">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Tarif Harian</span>
                    <span className="text-xs font-semibold">{data.dailyRate ? formatCurrency(data.dailyRate) : '-'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Deposit</span>
                    <span className="text-xs font-semibold">{data.deposit ? formatCurrency(data.deposit) : '-'}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 py-2 border-b border-border/40">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Tarif Mingguan</span>
                    <span className="text-xs font-semibold">{data.weeklyRate ? formatCurrency(data.weeklyRate) : '-'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Tarif Bulanan</span>
                    <span className="text-xs font-semibold">{data.monthlyRate ? formatCurrency(data.monthlyRate) : '-'}</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 py-2 border-b border-border/40">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Kondisi</span>
                    <span className="text-xs font-semibold">
                      {data.condition === 'GOOD' ? 'Baik' :
                       data.condition === 'MINOR_DAMAGE' ? 'Kerusakan Ringan' :
                       data.condition === 'NEEDS_REPAIR' ? 'Perlu Perbaikan' : '-'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Kilometer Terakhir</span>
                    <span className="text-xs font-semibold">{data.currentOdometer ? `${data.currentOdometer.toLocaleString('id-ID')} km` : '-'}</span>
                  </div>
                </div>

                {/* Row 4 (Kelengkapan) */}
                <div className="py-2 border-b border-border/40">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Kelengkapan</span>
                    <span className="text-xs font-semibold">
                      {(() => {
                        const equips = [];
                        if (data.equipment.stnk) equips.push('STNK');
                        if (data.equipment.bpkb) equips.push('BPKB');
                        if (data.equipment.spareTire) equips.push('Ban Cadangan');
                        if (data.equipment.jack) equips.push('Dongkrak');
                        if (data.equipment.toolkit) equips.push('Toolkit');
                        if (data.equipment.firstAidKit) equips.push('P3K');
                        if (data.equipment.fireExtinguisher) equips.push('APAR');
                        if (data.equipment.audio) equips.push('Radio / Audio');
                        return equips.length > 0 ? equips.join(', ') : '-';
                      })()}
                    </span>
                  </div>
                </div>

                {/* Row 4.5 (Catatan) */}
                <div className="py-2 border-b border-border/40">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Catatan</span>
                    <span className="text-xs font-semibold leading-relaxed">{data.notes || '-'}</span>
                  </div>
                </div>

                {/* Dokumen Legal Header */}
                <div className="pt-3 pb-1.5">
                  <h4 className="text-xs font-semibold text-muted-foreground">Dokumen Legal</h4>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-2 py-1.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Masa Berlaku STNK</span>
                    <span className="text-xs font-semibold">{data.stnkExpiredAt || '-'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Masa Berlaku Pajak</span>
                    <span className="text-xs font-semibold">{data.taxExpiredAt || '-'}</span>
                  </div>
                </div>

                {/* Row 6 */}
                <div className="grid grid-cols-2 py-1.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Masa Berlaku Asuransi</span>
                    <span className="text-xs font-semibold">{data.insuranceExpiredAt || '-'}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-3.5 border-t border-border/40 flex justify-between gap-2.5 bg-background">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="flex-1 bg-white text-foreground">
            Batal
          </Button>
          <Button variant="primary" size="sm" className="flex-1 bg-danger hover:bg-danger/90 text-white" onClick={() => { onOpenChange(false); onEdit(data); }}>
            <Edit2 className="w-3 h-3 mr-2" />
            Edit Data Rental
          </Button>
        </div>
      </aside>
    </>
  );
}
