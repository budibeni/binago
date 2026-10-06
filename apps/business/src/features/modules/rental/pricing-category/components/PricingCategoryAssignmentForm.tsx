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
      <div className="flex flex-col h-[60vh] max-h-[500px] bg-gradient-to-b from-neutral-50/50 to-neutral-100/30 dark:from-neutral-900/20 dark:to-neutral-950/40 relative">
        {/* Search */}
        <div className="pb-2  sticky top-0 z-10">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 group-focus-within:text-primary transition-colors" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kendaraan..."
              className="pl-8 h-8 text-xs bg-gray-50 dark:bg-neutral-900 border-border/60 hover:border-primary/40 focus:bg-white dark:focus:bg-neutral-900 transition-all rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-gray-50 dark:bg-neutral-950 border border-border/50 rounded-lg">
          {filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2 border border-border/50">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <span className="text-xs font-bold text-foreground">Tidak ada kendaraan yang cocok</span>
              <span className="text-[10px] text-foreground-muted mt-0.5">Coba gunakan kata kunci pencarian yang lain.</span>
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
                    group flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-300
                    ${isDisabled ? 'opacity-50 bg-neutral-100/50 dark:bg-neutral-900/30 cursor-not-allowed border-dashed border-border/60' : 'cursor-pointer hover:shadow-sm hover:border-primary/40 hover:-translate-y-[0.5px]'}
                    ${isSelected ? 'border-primary/50 bg-primary/[0.04] ' : 'border-border/40 bg-white dark:bg-neutral-950'}
                  `}
                >
                  <div className={`flex items-center justify-center shrink-0 w-3.5 h-3.5 rounded border transition-colors ${isSelected ? 'bg-primary border-primary' : 'bg-transparent border-neutral-300 dark:border-neutral-600 group-hover:border-primary/50'}`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`font-semibold text-[12px] truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {core.plateNumber}
                        </span>
                        <span className="text-[8.5px] font-bold uppercase tracking-wider px-1 py-0.5 rounded text-neutral-500 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0 leading-none">
                          {core.vehicleCategory}
                        </span>
                      </div>
                      {status === 'CURRENT_GROUP' && !isSelected && (
                        <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-danger/10 text-danger border border-danger/20 rounded-full flex-shrink-0 shadow-sm leading-none">
                          Hapus
                        </span>
                      )}
                      {status === 'AVAILABLE' && isSelected && (
                        <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-success/10 text-success border border-success/20 rounded-full flex-shrink-0 shadow-sm leading-none">
                          Tambah
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-foreground-subtle truncate">
                      {core.brand} {core.vehicleName}
                    </div>
                    {isDisabled && otherGroupName && (
                      <div className="mt-1 text-[8.5px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/50 dark:border-amber-900/50 px-1.5 py-0.5 rounded inline-block truncate max-w-full">
                        Kategori lain: <span className="font-bold">{otherGroupName}</span>
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
