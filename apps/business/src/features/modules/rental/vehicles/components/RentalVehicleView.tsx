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
  onTrack?: (v: RentalVehicle) => void;
}

export function RentalVehicleView({
  open,
  onOpenChange,
  data,
  labels,
  onEdit,
  onDelete,
  onDisable,
  onTrack,
}: RentalVehicleViewProps) {
  if (!data) return null;

  const core = data.coreVehicle;
  
  
  const renderStatus = () => {
    const s = data.status;
    let label = '';
    let colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    let dotClass = 'bg-neutral-400 dark:bg-neutral-600';
    
    if (s === 'READY') { 
      label = labels.statusReady; 
      colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
      dotClass = 'bg-success'; 
    }
    else if (s === 'RESERVED') { 
      label = labels.statusReserved; 
      colorClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
      dotClass = 'bg-warning';
    }
    else if (s === 'RENTED') { 
      label = labels.statusRented; 
      colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      dotClass = 'bg-blue-500';
    }
    else if (s === 'MAINTENANCE') { 
      label = labels.statusMaintenance; 
      colorClass = 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
      dotClass = 'bg-purple-500';
    }
    else if (s === 'UNAVAILABLE') { 
      label = labels.statusUnavailable || 'Tidak Tersedia'; 
      colorClass = 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
      dotClass = 'bg-neutral-400 dark:bg-neutral-600';
    }
    
    return (
      <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5", colorClass)}>
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
        {label}
      </div>
    );
  };

  const InfoItem = ({ label, value, highlight = false, valueClassName, colSpan = 1 }: { 
    label: string; 
    value: React.ReactNode; 
    highlight?: boolean; 
    valueClassName?: string;
    colSpan?: 1 | 2;
  }) => (
    <div className={cn("flex flex-col gap-0.5", colSpan === 2 && "col-span-2")}>
      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
      <span className={cn("text-[11px] font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100", valueClassName)}>
        {value}
      </span>
    </div>
  );

  function SectionCard({ 
    icon: Icon, 
    title, 
    colorClass = "text-muted-foreground",
    bgClass = "",
    children,
    extraHeader
  }: { 
    icon: any; 
    title: string; 
    colorClass?: string;
    bgClass?: string;
    children: React.ReactNode;
    extraHeader?: React.ReactNode;
  }) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
        <div className="px-3 py-2 flex items-center justify-between border-b border-border/40 bg-neutral-50/80 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            <div className={cn("flex items-center justify-center rounded-md p-1", bgClass)}>
              <Icon className={cn("w-3.5 h-3.5", colorClass)} />
            </div>
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider pt-[2px]">{title}</h3>
          </div>
          {extraHeader && <div>{extraHeader}</div>}
        </div>
        <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-4">
          {children}
        </div>
      </div>
    );
  }

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
          {onTrack && (
            <Button 
              variant="outline" 
              size="sm" 
              className="group flex-1 h-8 text-[11px] font-semibold bg-neutral-100 text-neutral-700 border-neutral-200/60 hover:bg-red-50 hover:border-red-200/60 hover:text-red-600 dark:bg-neutral-800/40 dark:text-neutral-300 dark:border-neutral-700/60 dark:hover:bg-red-900/40 dark:hover:text-red-400 transition-all shadow-sm"
              onClick={() => onTrack(data)}
              leftIcon={<MapPin className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:text-red-500 transition-colors" />}
            >
              Lacak Posisi
            </Button>
          )}
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
        <div className="p-4 flex flex-col gap-4">

          {/* TARIF SEWA CARD */}
          <SectionCard 
            icon={CreditCard} 
            title="Informasi Tarif"
            colorClass="text-amber-600 dark:text-amber-400"
            bgClass="bg-amber-100 dark:bg-amber-900/40"
          >
            <InfoItem label="Kategori" value={data.categoryName || '-'} colSpan={2} />
            <InfoItem label="Per Jam" value={data.hourlyRate ? formatCurrency(data.hourlyRate) : '-'} />
            <InfoItem label="Harian" value={data.dailyRate ? formatCurrency(data.dailyRate) : '-'} />
            
            {data.packages && data.packages.length > 0 && (
              <div className="col-span-2 mt-1 pt-3 border-t border-border/40">
                <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 block">Paket Tersedia</span>
                <div className="flex flex-col gap-1.5">
                  {data.packages.map((pkg: any) => (
                    <div key={pkg.id} className="flex justify-between items-center bg-background px-2.5 py-1.5 rounded-md border border-border/60">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100">{pkg.name}</span>
                        <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded">{pkg.durationDays} Hari</span>
                      </div>
                      <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(pkg.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
          
          {/* IDENTITAS KENDARAAN */}
          <SectionCard 
            icon={Car} 
            title="Identitas Fisik"
            colorClass="text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-100 dark:bg-blue-900/40"
          >
            <InfoItem label="Plat Nomor" value={core.plateNumber} />
            <InfoItem label="Merk & Model" value={`${core.brand} ${core.vehicleName}`} />
            <InfoItem label="Warna" value={core.color || '-'} />
            <InfoItem label="Bahan Bakar" value={core.fuelType || '-'} />
            <InfoItem label="Masa Berlaku STNK" value={core.registrationExpiry || '-'} colSpan={2} />
          </SectionCard>

          {/* STATUS OPERASIONAL & KELENGKAPAN */}
          <SectionCard 
            icon={FileText} 
            title="Operasional"
            colorClass="text-purple-600 dark:text-purple-400"
            bgClass="bg-purple-100 dark:bg-purple-900/40"
            extraHeader={
              (() => {
                const checklist = data.completenessChecklist || {};
                const presentCount = [
                  checklist.stnkOriginal,
                  checklist.spareKey,
                  checklist.jackAndTools,
                  checklist.spareTire,
                  checklist.firstAidKit
                ].filter(Boolean).length;
                
                const isChecklistComplete = presentCount === 5;
                
                if (isChecklistComplete) {
                  return (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-[9px] font-bold tracking-wide uppercase">{labels.dataCompleteShort || 'Lengkap'}</span>
                    </div>
                  );
                }
                return (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-200 dark:border-orange-500/20">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-[9px] font-bold tracking-wide uppercase">{presentCount}/5 Kelengkapan</span>
                  </div>
                );
              })()
            }
          >
            <InfoItem label="Odometer" value={data.currentOdometer ? `${formatNumber(data.currentOdometer)} km` : '-'} />
            <InfoItem label="Level BBM" value={data.fuelLevelPercent !== null && data.fuelLevelPercent !== undefined ? `${data.fuelLevelPercent}%` : '-'} />
            <InfoItem label="Kondisi Fisik" value={
              data.condition === 'GOOD' ? 'Baik' :
              data.condition === 'MINOR_DAMAGE' ? 'Lecet Minor' :
              data.condition === 'NEEDS_REPAIR' ? 'Perlu Perbaikan' : '-'
            } />
            {data.currentBookingId && (
              <InfoItem label="Booking Aktif" value={<span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">{data.currentBookingId}</span>} />
            )}
            {data.currentContractId && (
              <InfoItem label="Kontrak Aktif" value={<span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">{data.currentContractId}</span>} />
            )}
            
            <div className="col-span-2 pt-2">
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
                colSpan={2}
              />
            </div>

            {data.conditionNotes && (
              <div className="col-span-2 pt-1">
                <InfoItem label="Catatan Kondisi" value={<span className="italic leading-relaxed text-muted-foreground">{data.conditionNotes}</span>} colSpan={2} />
              </div>
            )}
          </SectionCard>

        </div>
      </div>
    </DetailShell>
  );
}
