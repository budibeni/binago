import React from 'react';
import { Button, Input, FormShell } from '@adatrack/ui';
import { Search } from 'lucide-react';
import type { VehiclePricingSelection } from '@/data/modules/rental/services/pricingService';

export interface PricingCategoryAssignmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  availableVehicles: VehiclePricingSelection[];
  onSave: (vehicleIds: string[]) => void;
}

export function PricingCategoryAssignmentForm({
  open,
  onOpenChange,
  groupName,
  availableVehicles,
  onSave
}: PricingCategoryAssignmentFormProps) {
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Reset state when opened
  React.useEffect(() => {
    if (open) {
      const initialSelected = new Set(
        availableVehicles
          .filter(v => v.status === 'CURRENT_GROUP')
          .map(v => v.vehicle.id)
      );
      setSelectedIds(initialSelected);
      setSearch('');
    }
  }, [open, availableVehicles]);

  const filteredVehicles = React.useMemo(() => {
    if (!search.trim()) return availableVehicles;
    const lowerSearch = search.toLowerCase();
    return availableVehicles.filter(item => {
      const core = item.vehicle.coreVehicle;
      return (
        core.plateNumber.toLowerCase().includes(lowerSearch) ||
        core.brand.toLowerCase().includes(lowerSearch) ||
        core.vehicleName.toLowerCase().includes(lowerSearch)
      );
    });
  }, [availableVehicles, search]);

  const toggleSelection = (vehicleId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(vehicleId)) {
        next.delete(vehicleId);
      } else {
        next.add(vehicleId);
      }
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Array.from(selectedIds));
  };

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title="Kelola Kendaraan"
      subtitle={groupName}
      onSubmit={handleSave}
      layout="dialog"
      onCancel={() => onOpenChange(false)}
      saveText="Simpan"
    >
      <div className="flex flex-col h-[60vh] max-h-[500px]">
        {/* Search */}
        <div className="p-2 border-b shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kendaraan..."
              className="pl-8 h-8 text-xs bg-white dark:bg-neutral-950 border-border/60"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-6 text-xs text-foreground-muted">
              Tidak ada kendaraan yang cocok.
            </div>
          ) : (
            filteredVehicles.map(item => {
              const { vehicle, status, otherGroupName } = item;
              const core = vehicle.coreVehicle;
              const isSelected = selectedIds.has(vehicle.id);
              const isDisabled = status === 'OTHER_GROUP';

              return (
                <div
                  key={vehicle.id}
                  onClick={() => {
                    if (!isDisabled) {
                      toggleSelection(vehicle.id);
                    }
                  }}
                  className={`
                    flex items-center gap-2.5 p-2 rounded-md border transition-colors
                    ${isDisabled ? 'opacity-60 bg-neutral-50/50 dark:bg-neutral-900/30 cursor-not-allowed border-dashed border-border/50' : 'cursor-pointer hover:border-primary/40'}
                    ${isSelected ? 'border-primary/60 bg-primary/5' : 'border-border/40 bg-card'}
                  `}
                >
                  <div className="flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
                      checked={isSelected}
                      disabled={isDisabled}
                      readOnly
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[11px] text-foreground truncate">
                        {core.plateNumber}
                      </span>
                      {status === 'CURRENT_GROUP' && !isSelected && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-danger/10 text-danger rounded flex-shrink-0">
                          Hapus
                        </span>
                      )}
                      {status === 'AVAILABLE' && isSelected && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-success/10 text-success rounded flex-shrink-0">
                          Tambah
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-foreground-subtle truncate leading-tight">
                      {core.brand} {core.vehicleName}
                    </div>
                    {isDisabled && otherGroupName && (
                      <div className="mt-0.5 text-[9px] text-foreground-muted truncate">
                        Terdaftar di: <span className="font-medium">{otherGroupName}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </FormShell>
  );
}
