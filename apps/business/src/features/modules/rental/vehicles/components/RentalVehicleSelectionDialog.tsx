import React from 'react';
import {
  Dialog,
  Button,
  Input,
  Checkbox,
} from '@adatrack/ui';
import { Search } from 'lucide-react';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

interface RentalVehicleSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableCoreVehicles: Vehicle[];
  onRegister: (vehicleIds: string[]) => void;
}

export function RentalVehicleSelectionDialog({
  open,
  onOpenChange,
  availableCoreVehicles,
  onRegister,
}: RentalVehicleSelectionDialogProps) {
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIds([]);
    }
  }, [open]);

  // Filter available vehicles by search
  const filteredVehicles = React.useMemo(() => {
    if (!search) return availableCoreVehicles;
    const query = search.toLowerCase();
    return availableCoreVehicles.filter(
      (v) =>
        v.plateNumber.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query) ||
        v.vehicleName.toLowerCase().includes(query)
    );
  }, [availableCoreVehicles, search]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all currently visible (filtered) vehicles
      const visibleIds = filteredVehicles.map((v) => v.id);
      // Merge with existing selection, keeping unique
      const newSelection = Array.from(new Set([...selectedIds, ...visibleIds]));
      setSelectedIds(newSelection);
    } else {
      // Unselect all currently visible (filtered) vehicles
      const visibleIds = new Set(filteredVehicles.map((v) => v.id));
      const newSelection = selectedIds.filter((id) => !visibleIds.has(id));
      setSelectedIds(newSelection);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((vId) => vId !== id));
    }
  };

  const isAllVisibleSelected =
    filteredVehicles.length > 0 &&
    filteredVehicles.every((v) => selectedIds.includes(v.id));

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    onRegister(selectedIds);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Daftarkan Armada">
      <div className="flex flex-col gap-4 w-[700px] max-w-full max-h-[85vh] p-1">
        <p className="text-sm text-muted-foreground">
          Pilih kendaraan dari Master Armada yang akan dimasukkan ke Armada Rental.
        </p>

        <div className="flex flex-col gap-4 flex-1 min-h-0 py-2">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nomor polisi, merk, atau model..."
              className="pl-9 bg-background h-10 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List Container */}
          <div className="flex-1 overflow-y-auto border border-border rounded-lg relative bg-background min-h-[300px]">
            {availableCoreVehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground absolute inset-0">
                <p className="font-semibold text-foreground mb-1">Semua kendaraan sudah terdaftar</p>
                <p className="text-sm">Semua kendaraan dari Master Armada sudah menjadi bagian dari Armada Rental.</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground absolute inset-0">
                <p className="font-semibold text-foreground mb-1">Kendaraan tidak ditemukan</p>
                <p className="text-sm">Coba gunakan nomor polisi, merk, atau model yang berbeda.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-sm relative">
                <thead className="sticky top-0 bg-muted/95 backdrop-blur z-10">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground w-12 border-b border-border">
                      <Checkbox
                        checked={isAllVisibleSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all visible"
                      />
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground border-b border-border">
                      Armada
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground border-b border-border">
                      Tahun
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground border-b border-border">
                      Merk/Model
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((v) => {
                    const isSelected = selectedIds.includes(v.id);
                    return (
                      <tr
                        key={v.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors group cursor-pointer"
                        onClick={() => handleSelectRow(!isSelected, v.id)}
                      >
                        <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectRow(!!checked, v.id)}
                            aria-label={`Select ${v.plateNumber}`}
                            className="data-[state=checked]:bg-danger data-[state=checked]:border-danger"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="font-semibold whitespace-nowrap">{v.plateNumber}</span>
                        </td>
                        <td className="py-2.5 px-4 text-muted-foreground">
                          {v.year}
                        </td>
                        <td className="py-2.5 px-4 text-muted-foreground">
                          {v.brand} {v.vehicleName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-between mt-4 pt-4 border-t">
          <div className="text-sm font-semibold">
            {selectedIds.length > 0 ? (
              <span className="text-danger">{selectedIds.length} kendaraan dipilih</span>
            ) : (
              <span className="text-muted-foreground">Tidak ada kendaraan dipilih</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={selectedIds.length === 0}
              onClick={handleSubmit}
            >
              Masukkan ke Armada
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
