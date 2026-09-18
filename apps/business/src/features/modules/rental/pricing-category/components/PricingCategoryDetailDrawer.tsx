import React from 'react';
import { Button, Input, DetailShell } from '@adatrack/ui';
import { Tag, Users, CarFront, X, Trash2, Search } from 'lucide-react';
import type { RentalPricingCategory, RentalRate, VehiclePricingAssignment, VehicleRateOverride } from '../types/pricing';
import type { RentalVehicle } from '../../vehicles/types/rentalVehicle';
import { cn } from '@adatrack/utils';

export interface PricingCategoryDetailDrawerProps {
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
}

export function PricingCategoryDetailDrawer({ 
  open, 
  onOpenChange, 
  group, 
  rates = [],
  vehicles = [],
  onEdit,
  onDelete,
  onAssignVehicle,
  onRemoveVehicle
}: PricingCategoryDetailDrawerProps) {
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

  const formatCurrency = (value: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

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
      title={group.name}
    >
        <div className="flex flex-col h-full">
          {/* Top Section with subtle background */}
          <div className="bg-neutral-50/80 dark:bg-neutral-900/30 p-4 border-b border-border space-y-4 shrink-0">
            {/* Info Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", group.status === 'ACTIVE' ? "bg-success/10 text-success border-success/20" : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700")}>
                    {group.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                  </div>
                </div>
                {group.description && (
                  <p className="text-xs text-foreground-subtle leading-relaxed mt-1.5">{group.description}</p>
                )}
              </div>
            </div>

            {/* Default Rates */}
            <div className="pt-2">
              <h3 className="text-[10px] font-medium text-foreground-muted uppercase tracking-wider mb-2">Tarif Default</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white dark:bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-200/60 dark:border-neutral-800 flex flex-col justify-center">
                  <span className="text-[10px] text-foreground-muted mb-0.5">Harian</span>
                  <span className="font-semibold text-xs text-danger">{getRate('DAILY')}</span>
                </div>
                <div className="bg-white dark:bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-200/60 dark:border-neutral-800 flex flex-col justify-center">
                  <span className="text-[10px] text-foreground-muted mb-0.5">Mingguan</span>
                  <span className="font-semibold text-xs text-danger">{getRate('WEEKLY')}</span>
                </div>
                <div className="bg-white dark:bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-200/60 dark:border-neutral-800 flex flex-col justify-center">
                  <span className="text-[10px] text-foreground-muted mb-0.5">Bulanan</span>
                  <span className="font-semibold text-xs text-danger">{getRate('MONTHLY')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Vehicles */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-semibold text-xs text-foreground">Kendaraan ({vehicles.length})</h3>
              </div>
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-2.5 rounded-full" onClick={onAssignVehicle}>
                + Kelola
              </Button>
            </div>
            
            <div className="mb-3 relative shrink-0">
              <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-foreground-muted" />
              <Input 
                placeholder="Cari kendaraan..." 
                className="pl-8 h-7 text-xs bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-950 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 flex-1 pb-2">
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
                  const hasOverride = v.overrides.length > 0;
                  return (
                    <div key={v.vehicle.id} className="group p-2.5 border border-border/40 rounded-lg flex items-center justify-between bg-white dark:bg-neutral-950 hover:border-primary/30 transition-all duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0">
                          <CarFront className="h-4 w-4 text-foreground-muted group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-semibold text-xs text-foreground truncate">{v.vehicle.coreVehicle.plateNumber}</span>
                            <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-foreground-subtle shrink-0">
                              {v.vehicle.coreVehicle.vehicleCategory}
                            </span>
                          </div>
                          <div className="text-[11px] text-foreground-subtle truncate">
                            {v.vehicle.coreVehicle.vehicleName} • {v.vehicle.coreVehicle.brand}
                          </div>
                        </div>
                      </div>
                      {onRemoveVehicle && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 shrink-0 text-foreground-muted hover:text-danger hover:bg-danger/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onRemoveVehicle(v.vehicle.id)}
                          title="Keluarkan dari kategori"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
    </DetailShell>
  );
}
