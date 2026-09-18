import React from 'react';
import { Button, Input, FormShell } from '@adatrack/ui';
import { Search } from 'lucide-react';
import type { VehiclePricingSelection } from '@/data/modules/rental/services/pricingService';

export interface PricingVehicleAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  availableVehicles: VehiclePricingSelection[];
  onSave: (vehicleIds: string[]) => void;
}

export function PricingVehicleAssignmentDialog({
  open,
  onOpenChange,
  groupName,
  availableVehicles,
  onSave
}: PricingVehicleAssignmentDialogProps) {
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
        <div className="p-4 border-b shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kendaraan..."
              className="pl-9"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8 text-sm text-foreground-muted">
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
                    flex items-start gap-3 p-3 rounded-md border transition-colors
                    ${isDisabled ? 'opacity-60 bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
                    ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'}
                  `}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
                      checked={isSelected}
                      disabled={isDisabled}
                      readOnly
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {core.plateNumber}
                      </span>
                      {status === 'CURRENT_GROUP' && !isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-danger/10 text-danger rounded font-medium">
                          Akan Dihapus
                        </span>
                      )}
                      {status === 'AVAILABLE' && isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-success/10 text-success rounded font-medium">
                          Akan Ditambah
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-foreground-subtle mt-0.5">
                      {core.brand} {core.vehicleName}
                    </div>
                    {isDisabled && otherGroupName && (
                      <div className="mt-2 text-[11px] text-foreground-muted">
                        Sudah berada di Kategori Tarif: <span className="font-medium text-foreground">{otherGroupName}</span>
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
