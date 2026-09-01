'use client';

import React from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';

import { buildRentalVehicleContext } from '@/data/modules/rental/services/vehicleContextBuilder';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalVehicle, RentalStatusFilter } from './types/rentalVehicle';
import { RentalVehicleTable } from './components/RentalVehicleTable';
import { RentalVehicleSelectionDialog } from './components/RentalVehicleSelectionDialog';
import { RentalVehicleDetailDrawer } from './components/RentalVehicleDetailDrawer';
import { RentalVehicleDisableDialog } from './components/RentalVehicleDisableDialog';
import { useRouter } from 'next/navigation';
import { Card, Input, Button, Checkbox } from '@adatrack/ui';
import { CarFront, Plus, Search, MapPin, List, CheckCircle2, Calendar, User, Wrench, Ban, RotateCcw, ChevronRight } from 'lucide-react';
import { cn } from '@adatrack/utils';

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
    router.push(`/rental/vehicles/${v.id}/edit`);
  };

  const handleCompleteClick = (v: RentalVehicle) => {
    router.push(`/rental/vehicles/${v.id}/edit`);
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

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 items-center overflow-hidden relative">
      <div className="w-full h-full flex flex-col min-h-0 space-y-4 pb-16">

        {/* Summary Cards */}
        <div className="grid grid-cols-6 gap-3">
          <button onClick={() => setStatusFilter('all')} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", statusFilter === 'all' ? "border-b-4 border-b-danger border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 shrink-0">
               <List className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.filterAll}</p>
               <p className="text-lg font-bold leading-none my-0.5">{stats.all}</p>
               <p className="text-[9px] text-muted-foreground truncate">Total Armada</p>
            </div>
          </button>
          
          <button onClick={() => setStatusFilter('READY')} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", statusFilter === 'READY' ? "border-b-4 border-b-success border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
               <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusReady}</p>
               <p className="text-lg font-bold leading-none my-0.5">{stats.ready}</p>
               <p className="text-[9px] text-muted-foreground truncate">Kendaraan siap</p>
            </div>
          </button>
          
          <button onClick={() => setStatusFilter('RESERVED')} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", statusFilter === 'RESERVED' ? "border-b-4 border-b-warning border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
               <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusReserved}</p>
               <p className="text-lg font-bold leading-none my-0.5">{stats.reserved}</p>
               <p className="text-[9px] text-muted-foreground truncate">Sedang dipesan</p>
            </div>
          </button>
          
          <button onClick={() => setStatusFilter('RENTED')} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", statusFilter === 'RENTED' ? "border-b-4 border-b-primary border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusRented}</p>
               <p className="text-lg font-bold leading-none my-0.5">{stats.rented}</p>
               <p className="text-[9px] text-muted-foreground truncate">Sedang dalam sewa</p>
            </div>
          </button>
          
          <button onClick={() => setStatusFilter('MAINTENANCE')} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", statusFilter === 'MAINTENANCE' ? "border-b-4 border-b-purple-500 border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
               <Wrench className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusMaintenance}</p>
               <p className="text-lg font-bold leading-none my-0.5">{stats.maintenance}</p>
               <p className="text-[9px] text-muted-foreground truncate">Dalam perawatan</p>
            </div>
          </button>
          
          <button onClick={() => setStatusFilter('UNAVAILABLE')} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", statusFilter === 'UNAVAILABLE' ? "border-b-4 border-b-neutral-400 border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
               <Ban className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusUnavailable}</p>
               <p className="text-lg font-bold leading-none my-0.5">{stats.unavailable}</p>
               <p className="text-[9px] text-muted-foreground truncate">Tidak tersedia</p>
            </div>
          </button>
        </div>

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
          />
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-card border-t border-border py-3 px-6 flex items-center justify-between shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
           <Checkbox 
              checked={selectedIds.length > 0}
              onCheckedChange={() => setSelectedIds([])}
              className="w-4 h-4 data-[state=checked]:bg-danger data-[state=checked]:border-danger"
           />
           <div className="flex items-center gap-4 border-l border-border pl-4">
             <span className="text-sm font-semibold">{selectedIds.length} armada dipilih</span>
             {selectedIds.length > 0 && (
               <button onClick={() => setSelectedIds([])} className="text-xs font-semibold text-danger hover:underline">Batal Pilih</button>
             )}
           </div>
        </div>
        <Button 
           variant="destructive" 
           size="sm" 
           onClick={handleOpenTracking} 
           disabled={selectedIds.length === 0}
           className="px-5 rounded-md h-9 font-semibold shadow-sm shadow-danger/20 hover:shadow-md hover:shadow-danger/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <MapPin className="w-3.5 h-3.5 mr-2" />
           Buka Lokasi ({selectedIds.length})
           <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
          router.push(`/rental/vehicles/${v.id}/edit`);
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
    </div>
  );
}
