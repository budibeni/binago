import React from 'react';
import { Button, DetailShell } from '@adatrack/ui';
import type { RentalVehicle } from '../types/rentalVehicle';
import { Edit2, CheckCircle2, AlertCircle, X, Car, Tag, Calendar, User, MapPin, FileText, CreditCard, LogOut } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@adatrack/utils';

interface RentalVehicleViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: RentalVehicle | null;
  labels: Record<string, any>;
  onEdit: (v: RentalVehicle) => void;
  onDelete?: (v: RentalVehicle) => void;
  onDisable?: (v: RentalVehicle) => void;
}

export function RentalVehicleView({
  open,
  onOpenChange,
  data,
  labels,
  onEdit,
  onDelete,
  onDisable,
}: RentalVehicleViewProps) {
  if (!data) return null;

  const core = data.coreVehicle;
  
  
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

  const InfoItem = ({ label, value, highlight = false }: { label: string, value: React.ReactNode, highlight?: boolean }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
      <span className={cn("text-xs font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100")}>
        {value}
      </span>
    </div>
  );

  return (
    <DetailShell
      open={open}
      onOpenChange={onOpenChange}
      title="Detail Kendaraan"
      onEdit={() => onEdit(data)}
      onDelete={onDelete ? () => onDelete(data) : undefined}
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20">
        
        {/* Header Section */}
        <div className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground">{core.brand} {core.vehicleName}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-600 dark:text-neutral-300">
                {core.plateNumber}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-[11px] text-muted-foreground">{core.year}</span>
            </div>
          </div>
          {renderStatus()}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-[11px] font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
            onClick={() => window.location.href = `/tracking/live?vehicleId=${data.vehicleId}`}
            leftIcon={<MapPin className="w-3.5 h-3.5 text-info" />}
          >
            Lacak Posisi
          </Button>
          {onDisable && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-[11px] font-semibold hover:bg-danger/5 hover:text-danger hover:border-danger/30 transition-all"
              onClick={() => onDisable(data)}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Keluarkan
            </Button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-3 flex flex-col gap-3">

          {/* TARIF SEWA CARD */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Informasi Tarif</h3>
            </div>
            
            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Skema Tarif" value={data.categoryId ? 'Kategori Master' : 'Mandiri (Kustom)'} />
                {data.categoryId && (
                  <InfoItem label="Kategori" value={data.categoryName || '-'} />
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/40">
                <InfoItem label="Harian" value={data.dailyRate ? formatCurrency(data.dailyRate) : '-'} />
                <InfoItem label="Mingguan" value={data.rateOverrideWeekly ? formatCurrency(data.rateOverrideWeekly) : '-'} />
                <InfoItem label="Bulanan" value={data.rateOverrideMonthly ? formatCurrency(data.rateOverrideMonthly) : '-'} />
              </div>
            </div>
          </div>
          
          {/* IDENTITAS KENDARAAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Car className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Identitas Fisik</h3>
            </div>
            <div className="p-3.5 grid grid-cols-2 gap-y-3.5 gap-x-3">
              <InfoItem label="Plat Nomor" value={core.plateNumber} />
              <InfoItem label="Merk & Model" value={`${core.brand} ${core.vehicleName}`} />
              <InfoItem label="Warna" value={core.color || '-'} />
              <InfoItem label="Bahan Bakar" value={core.fuelType || '-'} />
              <InfoItem label="Masa Berlaku STNK" value={core.registrationExpiry || '-'} />
            </div>
          </div>

          {/* STATUS OPERASIONAL & KELENGKAPAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden mb-6">
            <div className="px-4 py-3 flex justify-between items-center border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Operasional</h3>
              </div>
              {data.isComplete ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">Lengkap</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-200 dark:border-orange-500/20">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">Tidak Lengkap</span>
                </div>
              )}
            </div>

            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Odometer" value={data.currentOdometer ? `${formatNumber(data.currentOdometer)} km` : '-'} />
                <InfoItem label="Level BBM" value={data.fuelLevelPercent !== null && data.fuelLevelPercent !== undefined ? `${data.fuelLevelPercent}%` : '-'} />
              </div>

              <div className="pt-3 border-t border-border/40">
                <InfoItem 
                  label="Checklist Kelengkapan" 
                  value={(() => {
                    const equips = [];
                    if (data.completenessChecklist?.stnkOriginal) equips.push('STNK');
                    if (data.completenessChecklist?.spareKey) equips.push('Kunci Cadangan');
                    if (data.completenessChecklist?.spareTire) equips.push('Ban Serep');
                    if (data.completenessChecklist?.jackAndTools) equips.push('Dongkrak & Tools');
                    if (data.completenessChecklist?.firstAidKit) equips.push('P3K');
                    return equips.length > 0 ? (
                      <span className="leading-relaxed">{equips.join(' • ')}</span>
                    ) : '-';
                  })()} 
                />
              </div>

              {data.conditionNotes && (
                <div className="pt-3 border-t border-border/40">
                  <InfoItem label="Catatan Kondisi" value={<span className="italic leading-relaxed text-muted-foreground">{data.conditionNotes}</span>} />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DetailShell>
  );
}
