'use client';

import React from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { pricingService } from '@/data/modules/rental/services/pricingService';

import { buildRentalVehicleContext } from '@/data/modules/rental/services/vehicleContextBuilder';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalVehicle, RentalStatusFilter } from './types/rentalVehicle';
import type { RentalPricingCategory } from '../pricing-category/types/pricing';
import type { DataTableFilterConfig } from '@adatrack/ui';
import { RentalVehicleTable } from './components/RentalVehicleTable';
import { VehicleSelectionDialog } from '@/features/core/vehicles/components/VehicleSelectionDialog';
import { RentalVehicleView } from './components/RentalVehicleView';
import { RentalVehicleDisableDialog } from './components/RentalVehicleDisableDialog';
import { RentalVehicleForm } from './components/RentalVehicleForm';
import { useRouter } from 'next/navigation';
import { Card, Input, Button, Checkbox, PanelShell } from '@adatrack/ui';
import { CarFront, Plus, Search, MapPin, List, CheckCircle2, Calendar, User, Wrench, Ban, RotateCcw, ChevronRight } from 'lucide-react';
import { cn } from '@adatrack/utils';

function StatCard({ label, value, colorClass, icon: Icon }: { label: string, value: number, colorClass: string, icon?: React.ElementType }) {
  const textColorClass = colorClass.replace(/bg-/g, 'text-');
  
  return (
    <div className="flex items-center justify-between p-3 rounded-none border border-border/80 bg-background transition-colors hover:border-border">
      <div className="flex items-center gap-2.5">
        {Icon ? (
          <div className={cn("p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800", textColorClass)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className={cn("w-2 h-2 rounded-full", colorClass)} />
        )}
        <span className="text-[11px] font-semibold text-foreground-muted tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
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
  const [pricingCategorys, setPricingCategory] = React.useState<RentalPricingCategory[]>([]);
  const [pricingRates, setPricingRates] = React.useState<import('@/features/modules/rental/pricing-category/types/pricing').RentalRate[]>([]);
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
    const cats = pricingService.getPricingCategory({ status: 'ACTIVE' });
    setPricingCategory(cats);
    // Load all rates from all active categories
    const allRates = cats.flatMap(c => pricingService.getRatesByGroupId(c.id));
    setPricingRates(allRates);
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
  const [isRefreshing, setIsRefreshing] = React.useState(false);

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
        desc = `${result.success} kendaraan berhasil dimasukkan ke Kendaraan Rental.`;
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
  const [panelSide, setPanelSide] = React.useState<'left' | 'right' | 'top' | 'bottom'>('top');

  const renderStatsPanel = () => {
    if (!showStats) return null;
    
    return (
      <PanelShell
      title="Ringkasan"
      side={panelSide}
      isOpen={showStats}
      onClose={() => setShowStats(false)}
      onOpen={() => setShowStats(true)}
      collapsedTitle="RINGKASAN"
      onSideChange={setPanelSide}
      labels={{
        top: labels.panelTop || 'Atas',
        right: labels.panelRight || 'Kanan',
        bottom: labels.panelBottom || 'Bawah',
        left: labels.panelLeft || 'Kiri',
        hide: labels.hidePanel || 'Sembunyikan',
        layoutToggleTitle: labels.layoutToggleTitle || 'Ubah Posisi Panel',
      }}
      className={cn(
        "shrink-0 bg-white dark:bg-background z-10",
        (panelSide === 'top' || panelSide === 'bottom') ? "w-full" : "w-80 min-w-80 h-full"
      )}
    >
      <div className={cn("gap-2.5 p-3", (panelSide === 'top' || panelSide === 'bottom') ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6" : "flex flex-col h-full")}>
        <StatCard label="Total Kendaraan" value={stats.all} colorClass="bg-foreground" icon={CarFront} />
        <StatCard label={labels.statusReady || 'Siap'} value={stats.ready} colorClass="bg-success" icon={CheckCircle2} />
        <StatCard label={labels.statusReserved || 'Dipesan'} value={stats.reserved} colorClass="bg-warning" icon={Calendar} />
        <StatCard label={labels.statusRented || 'Disewa'} value={stats.rented} colorClass="bg-primary" icon={User} />
        <StatCard label={labels.statusMaintenance || 'Perawatan'} value={stats.maintenance} colorClass="bg-purple-500" icon={Wrench} />
        <StatCard label={labels.statusUnavailable || 'Tidak Tersedia'} value={stats.unavailable} colorClass="bg-neutral-500 dark:bg-neutral-400" icon={Ban} />
      </div>
    </PanelShell>
    );
  };

  return (
    <div className={cn("flex h-full w-full bg-background overflow-hidden relative", (panelSide === 'top' || panelSide === 'bottom') ? 'flex-col' : 'flex-row')}>
      
      {/* Render panel first if top or left */}
      {(panelSide === 'top' || panelSide === 'left') && renderStatsPanel()}


      {/* Main Section (Table + Bottom Action Bar) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">

        {/* Main Table */}
        <div className="flex-1 min-h-0 min-w-0 relative">
          <RentalVehicleTable
            data={vehicles}
            pricingCategorys={pricingCategorys}
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
            className="border-none shadow-none"
            dtLabels={{
              noResultTitle: 'Kendaraan tidak ditemukan',
              noResultDescription: 'Coba sesuaikan kata kunci atau filter pencarian.',
              emptyTitle: 'Belum ada kendaraan',
              emptyDescription: 'Tambahkan kendaraan rental baru',
              searchPlaceholder: 'Cari kendaraan...',
            }}
          />
        </div>

        {/* Bottom Action Bar */}
        {selectedIds.length > 0 && (
          <div className="w-full flex-shrink-0 h-10 bg-card border-t border-border pl-4 md:pl-6 flex items-center justify-between shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] relative z-10 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedIds.length > 0}
                onCheckedChange={() => setSelectedIds([])}
                className="w-4 h-4 data-[state=checked]:bg-muted-foreground data-[state=checked]:border-muted-foreground"
              />
              <span className="text-[12px] font-medium text-muted-foreground">{selectedIds.length} kendaraan terpilih</span>
            </div>
            <Button
              variant="destructive"
              onClick={handleOpenTracking}
              disabled={selectedIds.length === 0}
              className="px-8 md:px-12 h-full rounded-none text-[12px] font-medium gap-1.5 shadow-none hover:bg-danger/90 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Buka Lokasi
            </Button>
          </div>
        )}
      </div>

      {/* Render panel last if bottom or right */}
      {(panelSide === 'bottom' || panelSide === 'right') && renderStatsPanel()}

      <VehicleSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={setSelectionDialogOpen}
        vehicles={availableCores}
        onSubmit={handleRegisterMultiple}
        title="Daftarkan Kendaraan"
        emptyTitle="Semua kendaraan sudah terdaftar"
        emptyDescription="Semua kendaraan dari Master Kendaraan sudah menjadi bagian dari Kendaraan Rental."
        submitLabel="Pilih"
        onRefresh={() => {
          setIsRefreshing(true);
          setTimeout(() => setIsRefreshing(false), 800);
        }}
        isLoading={isRefreshing}
      />

      <RentalVehicleView
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
          title={labels.actionEdit || 'Edit Kendaraan Rental'}
          labels={labels}
          initialData={vehicles.find(v => v.id === editId)}
          availablePricingCategory={pricingCategorys}
          availableRates={pricingRates}
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
