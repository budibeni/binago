import React from 'react';
import { Button, Input, DetailShell } from '@adatrack/ui';
import { Users, CarFront, X, Trash2, Search, CreditCard, FileText } from 'lucide-react';
import type { RentalPricingCategory, RentalRate, VehiclePricingAssignment, VehicleRateOverride } from '../types/pricing';
import type { RentalVehicle } from '../../vehicles/types/rentalVehicle';
import { cn, formatCurrency } from '@adatrack/utils';

// ─── Helper Components ──────────────────────────────────────────────────────────

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
  className = "",
  rightAction,
  children 
}: { 
  icon: any; 
  title: string; 
  colorClass?: string;
  bgClass?: string;
  className?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode 
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background overflow-hidden flex flex-col">
      <div className="px-3 py-2 flex items-center justify-between border-b border-border/40 bg-neutral-50/80 dark:bg-neutral-900/40">
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center justify-center rounded-md p-1", bgClass)}>
            <Icon className={cn("w-3.5 h-3.5", colorClass)} />
          </div>
          <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider pt-[2px]">{title}</h3>
        </div>
        {rightAction && (
          <div>{rightAction}</div>
        )}
      </div>
      <div className={cn("p-4", className)}>
        {children}
      </div>
    </div>
  );
}

export interface PricingCategoryViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: RentalPricingCategory;
  rates?: RentalRate[];
  vehicles?: {
    assignment: VehiclePricingAssignment;
    vehicle: RentalVehicle;
    overrides: VehicleRateOverride[];
  }[];
  onEdit?: () => void;
  onDelete?: () => void;
  onAssignVehicle?: () => void;
  onRemoveVehicle?: (vehicleId: string) => void;
  labels?: Record<string, string>;
}

export function PricingCategoryView({ 
  open, 
  onOpenChange, 
  group, 
  rates = [],
  vehicles = [],
  onEdit,
  onDelete,
  onAssignVehicle,
  onRemoveVehicle,
  labels
}: PricingCategoryViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Reset search when drawer opens/closes or group changes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open, group]);

  const filteredVehicles = React.useMemo(() => {
    if (!searchQuery) return vehicles;
    const q = searchQuery.toLowerCase();
    return vehicles.filter(v => 
      v.vehicle.coreVehicle.plateNumber.toLowerCase().includes(q) ||
      v.vehicle.coreVehicle.vehicleName.toLowerCase().includes(q) ||
      v.vehicle.coreVehicle.brand.toLowerCase().includes(q)
    );
  }, [vehicles, searchQuery]);

  if (!group) return null;

  
  const getRate = (type: string) => {
    const rate = rates.find(r => r.rateType === type);
    return rate ? formatCurrency(rate.amount) : '-';
  };

  return (
    <DetailShell
      open={open}
      onOpenChange={onOpenChange}
      onEdit={onEdit}
      onDelete={onDelete}
      title="Detail Kategori Tarif"
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20 pb-8 flex flex-col h-full">
        
        {/* Header Section */}
        <div className="px-4 py-3 bg-background border-b border-border/40 flex flex-col gap-1.5 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="text-[15px] font-bold tracking-tight text-foreground uppercase truncate">
                {group.name}
              </h2>

            </div>
            <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5", group.status === 'ACTIVE' ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400")}>
              <span className={cn('h-1.5 w-1.5 rounded-full', group.status === 'ACTIVE' ? 'bg-green-500' : 'bg-neutral-500')} />
              {group.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
            </div>
          </div>
          {group.description && (
            <p className="text-[11px] text-foreground-subtle leading-relaxed">
              {group.description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4 flex-1">

          {/* Tarif Default */}
          <SectionCard
            icon={CreditCard}
            title={labels?.formRatesInfo || "Tarif Default"}
            colorClass="text-amber-600 dark:text-amber-400"
            bgClass="bg-amber-100 dark:bg-amber-900/40"
            className="grid grid-cols-2 gap-y-4 gap-x-4"
          >
            <InfoItem 
              label={labels?.headerDaily || "Harian"}
              value={getRate('DAILY')}
              highlight
            />
            <InfoItem 
              label={labels?.headerWeekly || "Mingguan"}
              value={getRate('WEEKLY')}
            />
            <InfoItem 
              label={labels?.headerMonthly || "Bulanan"}
              value={getRate('MONTHLY')}
            />
            <InfoItem 
              label={labels?.headerDeposit || "Deposit"}
              value={formatCurrency(group.defaultDeposit || 0)}
              highlight
            />
          </SectionCard>

          {/* Kendaraan */}
          <SectionCard
            icon={Users}
            title={`Kendaraan (${vehicles.length})`}
            colorClass="text-purple-600 dark:text-purple-400"
            bgClass="bg-purple-100 dark:bg-purple-900/40"
            className="flex flex-col p-0 flex-1 min-h-[300px]"
            rightAction={
              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 rounded font-medium" onClick={onAssignVehicle}>
                + Kelola
              </Button>
            }
          >
            <div className="p-3 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/20">
              <div className="relative">
                <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-foreground-muted" />
                <Input 
                  placeholder="Cari kendaraan..." 
                  className="pl-8 h-7 text-xs bg-white dark:bg-neutral-950 border-border/60 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-neutral-50/30 dark:bg-neutral-950/20">
              {filteredVehicles.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-2">
                    <CarFront className="h-4 w-4 text-foreground-muted" />
                  </div>
                  <span className="text-foreground-subtle text-xs">
                    {searchQuery ? 'Kendaraan tidak ditemukan' : 'Belum ada kendaraan di kategori ini'}
                  </span>
                </div>
              ) : filteredVehicles.map((v) => {
                  return (
                    <div key={v.vehicle.id} className="group p-2.5 border border-border/60 rounded-xl flex items-center justify-between bg-background shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 border border-border/50">
                          <CarFront className="h-4 w-4 text-foreground-muted group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-[11px] text-foreground truncate">{v.vehicle.coreVehicle.plateNumber}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-neutral-500 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                              {v.vehicle.coreVehicle.vehicleCategory}
                            </span>
                          </div>
                          <div className="text-[10px] font-medium text-foreground-subtle truncate">
                            {v.vehicle.coreVehicle.vehicleName} • {v.vehicle.coreVehicle.brand}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onRemoveVehicle && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 shrink-0 text-foreground-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                            onClick={() => onRemoveVehicle(v.vehicle.id)}
                            title="Keluarkan dari kategori"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </SectionCard>
        </div>
      </div>
    </DetailShell>
  );
}
