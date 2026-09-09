'use client';

import React from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';

import { buildRentalVehicleContext } from '@/data/modules/rental/services/vehicleContextBuilder';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalVehicle, RentalStatusFilter } from './types/rentalVehicle';
import type { DataTableFilterConfig } from '@adatrack/ui';
import { RentalVehicleTable } from './components/RentalVehicleTable';
import { RentalVehicleSelectionDialog } from './components/RentalVehicleSelectionDialog';
import { RentalVehicleDetailDrawer } from './components/RentalVehicleDetailDrawer';
import { RentalVehicleDisableDialog } from './components/RentalVehicleDisableDialog';
import { RentalVehicleForm } from './components/RentalVehicleForm';
import { useRouter } from 'next/navigation';
import { Card, Input, Button, Checkbox } from '@adatrack/ui';
import { CarFront, Plus, Search, MapPin, List, CheckCircle2, Calendar, User, Wrench, Ban, RotateCcw, ChevronRight } from 'lucide-react';
import { cn } from '@adatrack/utils';

function StatCard({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
  return (
    <div className="flex flex-col p-2.5 rounded-md border border-border bg-card shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", colorClass)} />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">{label}</span>
      <span className="text-lg font-black mt-0.5 ml-1">{value}</span>
    </div>
  );
}

export function RentalVehiclesFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = t.rentalVehicles;

  // State
  const [dataVersion, setDataVersion] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<RentalStatusFilter>('all');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const [vehicles, setVehicles] = React.useState<RentalVehicle[]>([]);
  const [availableCores, setAvailableCores] = React.useState(rentalVehicleService.getAvailableCoreVehicles());

  // UI State
  const [selectionDialogOpen, setSelectionDialogOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [disableOpen, setDisableOpen] = React.useState(false);

  const [editId, setEditId] = React.useState<string | null>(null);

  const [selectedVehicle, setSelectedVehicle] = React.useState<RentalVehicle | null>(null);

  const router = useRouter();

  const showToast = (title: string, desc: string, type: 'success' | 'error' = 'success') => {
    // Fallback to simple alert since Toast is not available
    alert(`${type === 'success' ? 'Sukses' : 'Error'}: ${title} ${desc ? '- ' + desc : ''}`);
  };

  // Fetch data
  React.useEffect(() => {
    const data = rentalVehicleService.getRentalVehicles({ search, status: statusFilter });
    setVehicles(data);
    setAvailableCores(rentalVehicleService.getAvailableCoreVehicles());
  }, [search, statusFilter, dataVersion]);

  // Derived stats
  const baseData = rentalVehicleService.getRentalVehicles();
  const stats = {
    all: baseData.length,
    ready: baseData.filter(v => v.status === 'READY').length,
    reserved: baseData.filter(v => v.status === 'RESERVED').length,
    rented: baseData.filter(v => v.status === 'RENTED').length,
    maintenance: baseData.filter(v => v.status === 'MAINTENANCE').length,
    unavailable: baseData.filter(v => v.status === 'UNAVAILABLE').length,
  };

  // Handlers
  const handleAddClick = () => {
    setSelectionDialogOpen(true);
  };

  const handleRegisterMultiple = (vehicleIds: string[]) => {
    try {
      const result = rentalVehicleService.registerVehicles(vehicleIds);
      let desc = '';
      if (result.success > 0 && result.duplicate > 0) {
        desc = `${result.success} berhasil dimasukkan. ${result.duplicate} sudah terdaftar.`;
      } else if (result.success > 0) {
        desc = `${result.success} kendaraan berhasil dimasukkan ke Armada Rental.`;
      } else if (result.duplicate > 0) {
        desc = `Gagal: ${result.duplicate} kendaraan sudah terdaftar.`;
      }

      showToast(result.success > 0 ? 'Berhasil' : 'Gagal', desc, result.success > 0 ? 'success' : 'error');

      setDataVersion(prev => prev + 1);
      setSelectionDialogOpen(false);
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  const handleEditClick = (v: RentalVehicle) => {
    setEditId(v.id);
  };

  const handleCompleteClick = (v: RentalVehicle) => {
    setEditId(v.id);
  };

  const handleViewClick = (v: RentalVehicle) => {
    setSelectedVehicle(v);
    setDetailOpen(true);
  };

  const handleDisableClick = (v: RentalVehicle) => {
    setSelectedVehicle(v);
    setDisableOpen(true);
  };



  const handleConfirmDisable = () => {
    if (selectedVehicle) {
      try {
        rentalVehicleService.removeFromRental(selectedVehicle.id);
        alert(labels.deleteSuccess);
        setDataVersion(prev => prev + 1);
      } catch (e: any) {
        alert(`Error: ${e.message}`);
      }
    }
  };

  const handleOpenTracking = async () => {
    if (selectedIds.length > 0) {
      if (selectedIds.length === 1) {
        const vehicleId = selectedIds[0];
        try {
          const ctx = await buildRentalVehicleContext(vehicleId, locale);
          if (ctx) {
            sessionStorage.setItem(`adatrack_vehicle_context_${locale}_${vehicleId}`, JSON.stringify(ctx));
          }
        } catch (e) {
          console.error('Failed to build context', e);
        }
        trackingNavigationService.navigateToTracking(router, {
          mode: 'live',
          vehicleId: vehicleId
        });
      } else {
        trackingNavigationService.navigateToTracking(router, {
          mode: 'live',
          vehicleIds: selectedIds
        });
      }
    }
  };

  // Filter config
  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: { status: statusFilter === 'all' ? '' : statusFilter },
    onStateChange: (state) => setStatusFilter((state.status as RentalStatusFilter) || 'all'),
    onClearAll: () => setStatusFilter('all'),
    labels: {
      title: 'Filter',
      clearAll: 'Hapus Filter',
    },
    fields: [
      {
        id: 'status',
        label: labels.filterStatus || 'Status',
        type: 'pills-single',
        options: [
          { value: 'READY', label: labels.statusReady || 'Siap', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'RESERVED', label: labels.statusReserved || 'Dipesan', colorClass: 'bg-warning', activeClass: 'bg-warning/15 border-warning/40 text-warning' },
          { value: 'RENTED', label: labels.statusRented || 'Disewa', colorClass: 'bg-primary', activeClass: 'bg-primary/15 border-primary/40 text-primary' },
          { value: 'MAINTENANCE', label: labels.statusMaintenance || 'Perawatan', colorClass: 'bg-purple-500', activeClass: 'bg-purple-500/15 border-purple-500/40 text-purple-500' },
          { value: 'UNAVAILABLE', label: labels.statusUnavailable || 'Tidak Tersedia', colorClass: 'bg-neutral-400', activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground' },
        ],
      },
    ],
  }), [statusFilter, labels]);

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [showStats, setShowStats] = React.useState(true);

  return (
    <div className="flex flex-col h-full w-full bg-background p-0 items-center overflow-hidden">
      <div className="w-full flex-1 flex flex-col min-h-0 space-y-0 pb-4">

        {/* Elegant Stats Ribbon */}
        {showStats && (
          <div className="w-full px-4 pt-4 md:px-6 md:pt-6 bg-background animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatCard label="Total Armada" value={stats.all} colorClass="bg-foreground" />
              <StatCard label={labels.statusReady || 'Siap'} value={stats.ready} colorClass="bg-success" />
              <StatCard label={labels.statusReserved || 'Dipesan'} value={stats.reserved} colorClass="bg-warning" />
              <StatCard label={labels.statusRented || 'Disewa'} value={stats.rented} colorClass="bg-primary" />
              <StatCard label={labels.statusMaintenance || 'Perawatan'} value={stats.maintenance} colorClass="bg-purple-500" />
              <StatCard label={labels.statusUnavailable || 'Tidak Tersedia'} value={stats.unavailable} colorClass="bg-neutral-500 dark:bg-neutral-400" />
            </div>
          </div>
        )}

        {/* Main Table */}

        <div className="flex-1 min-h-0 w-full relative">
          <RentalVehicleTable
            data={vehicles}
            labels={labels}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onComplete={handleCompleteClick}
            onDisable={handleDisableClick}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            searchValue={search}
            onSearchChange={setSearch}
            onAdd={handleAddClick}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
            showStats={showStats}
            onToggleStats={() => setShowStats(!showStats)}
            className="border-none shadow-none"
            dtLabels={{
              noResultTitle: 'Armada tidak ditemukan',
              noResultDescription: 'Coba sesuaikan kata kunci atau filter pencarian.',
              emptyTitle: 'Belum ada armada',
              emptyDescription: 'Tambahkan armada rental baru',
              searchPlaceholder: 'Cari armada...',
            }}
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full flex-shrink-0 h-10 bg-card border-t border-border pl-4 md:pl-6 flex items-center justify-between shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] relative z-10">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedIds.length > 0}
            onCheckedChange={() => setSelectedIds([])}
            className="w-4 h-4 data-[state=checked]:bg-muted-foreground data-[state=checked]:border-muted-foreground"
          />
          <span className="text-[13px] font-medium text-muted-foreground">{selectedIds.length} armada terpilih</span>
        </div>
        <Button
          variant="destructive"
          onClick={handleOpenTracking}
          disabled={selectedIds.length === 0}
          className="px-8 md:px-12 h-full rounded-none text-[13px] font-medium gap-1.5 shadow-none hover:bg-danger/90 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          Buka Lokasi
        </Button>
      </div>



      <RentalVehicleSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={setSelectionDialogOpen}
        availableCoreVehicles={availableCores}
        onRegister={handleRegisterMultiple}
      />

      <RentalVehicleDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        data={selectedVehicle}
        labels={labels}
        onEdit={(v) => {
          setDetailOpen(false);
          setEditId(v.id);
        }}
        onDelete={handleDisableClick}
      />

      <RentalVehicleDisableDialog
        open={disableOpen}
        onOpenChange={setDisableOpen}
        data={selectedVehicle}
        labels={labels}
        onConfirm={handleConfirmDisable}
      />

      {editId && (
        <RentalVehicleForm
          layout="default"
          open={!!editId}
          onOpenChange={(open) => {
            if (!open) setEditId(null);
          }}
          title={labels.actionEdit || 'Edit Armada Rental'}
          labels={labels}
          initialData={vehicles.find(v => v.id === editId)}
          onCancel={() => setEditId(null)}
          onSave={(data) => {
            // TODO: dispatch edit save
            setEditId(null);
            setDataVersion(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}
