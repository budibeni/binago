'use client';

import React, { useState } from 'react';
import { ConfirmDialog, toast, Dialog, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button, Popover, PopoverTrigger, PopoverContent } from '@adatrack/ui';
import type { Locale } from '@adatrack/types';
import { Route } from './types';
import { groupService } from '@/data/services';
import { useGeofences } from '../geofences/hooks/useGeofences';
import { RouteListView } from './components/RouteListView';
import { RouteEditorView } from './components/RouteEditorView';
import { getRouteTranslation } from './i18n';
import { useRoutes } from './hooks/useRoutes';
import { useVehicles } from '../vehicles/hooks/useVehicles';
import { api, cn } from '@adatrack/utils';
import { Search, Check, ChevronsUpDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface RouteFeatureProps {
  locale?: Locale;
}

export function RouteFeature({ locale = 'id' }: RouteFeatureProps) {
  const t = getRouteTranslation(locale);
  const searchParams = useSearchParams();
  const initialRouteId = searchParams?.get('routeId') || undefined;
  const { geofences } = useGeofences();

  const { routes, loading, refetch } = useRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(initialRouteId);
  const [isEditing, setIsEditing] = useState(false);
const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const [assigningRouteId, setAssigningRouteId] = useState<string | null>(null);
  const [completingRouteId, setCompletingRouteId] = useState<string | null>(null);
  const [assignmentToComplete, setAssignmentToComplete] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [endDate, setEndDate] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { vehicles } = useVehicles();
  const [routeGroups, setRouteGroups] = useState<any[]>([]);

  const filteredVehicles = vehicles?.filter(v => 
    !v.currentRouteId && 
    (v.vehicleName?.toLowerCase().includes(vehicleSearch.toLowerCase()) || 
     v.plateNumber?.toLowerCase().includes(vehicleSearch.toLowerCase()))
  ) || [];

  React.useEffect(() => {
    groupService.getRouteGroups().then(setRouteGroups).catch(console.error);
  }, []);

  const handleSelectRoute = (id: string | undefined) => {
    setSelectedRouteId(id);
  };

  const handleCreateNew = () => {
    setSelectedRouteId(undefined);
    setIsEditing(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRouteId(id);
    setIsEditing(true);
  };

const handleDelete = (id: string) => {
    setRouteToDelete(id);
  };

  const handleAssign = (id: string) => {
    setAssigningRouteId(id);
    setSelectedVehicleId('');
  };

  const handleCompleteAssignment = (id: string) => {
    setCompletingRouteId(id);
  };

  const submitCompleteAssignment = async () => {
    if (!assignmentToComplete) return;
    try {
      await api.put(`/routes/assignments/${assignmentToComplete}/status`, { status: 'completed' });
      toast.success(t.assignment?.successUnassign || 'Penugasan kendaraan berhasil diakhiri');
      refetch();
    } catch (err: any) {
      toast.error(err.message || t.assignment?.errorUnassign || 'Gagal mengakhiri penugasan');
    } finally {
      setAssignmentToComplete(null);
    }
  };

  const submitAssign = async () => {
    if (!assigningRouteId || !selectedVehicleId) return;
    setIsAssigning(true);
    try {
      await api.post(`/routes/${assigningRouteId}/assignments`, {
        vehicle_id: parseInt(selectedVehicleId, 10),
        ...(endDate ? { end_date: endDate } : {})
      });
      toast.success(t.assignment?.successAssign || 'Rute berhasil ditugaskan ke kendaraan');
      setAssigningRouteId(null);
      setEndDate('');
    } catch (err) {
      console.error('Failed to assign route', err);
      toast.error(t.assignment?.errorAssign || 'Gagal menugaskan rute');
    } finally {
      setIsAssigning(false);
    }
  };

  const confirmDelete = async () => {
    if (!routeToDelete) return;
    try {
      await api.delete(`/routes/${routeToDelete}`);
      toast.success('Route deleted successfully');
      refetch();
    } catch (err) {
      console.error('Failed to delete route', err);
      toast.error('Failed to delete route');
    }
  };


  const handleSave = async (route: Partial<Route>) => {
    try {
      const waypoints = [];
      if (route.origin) waypoints.push({ lat: route.origin.latitude, lon: route.origin.longitude, address: route.origin.address });
      if (route.stops) {
          route.stops.forEach(s => {
              waypoints.push({ lat: s.location.latitude, lon: s.location.longitude, address: s.location.address });
          });
      }
      if (route.destination) waypoints.push({ lat: route.destination.latitude, lon: route.destination.longitude, address: route.destination.address });
      
      const payload = {
        name: route.name,
        waypoints: waypoints,
        status: route.status || 'active',
        description: route.description || '',
        group_id: route.groupId ? parseInt(route.groupId.toString(), 10) : undefined,
        planned_distance: route.plannedDistance !== undefined ? parseFloat(route.plannedDistance.toString()) : null,
        estimated_duration: route.estimatedDuration !== undefined ? parseFloat(route.estimatedDuration.toString()) : null,
        planned_path: route.plannedPath || undefined,
      };

      if (route.id) {
        await api.put(`/routes/${route.id}`, payload);
        toast.success('Rute berhasil diperbarui');
      } else {
        await api.post('/routes', payload);
        toast.success('Rute berhasil ditambahkan');
      }

      refetch();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save route', err);
      toast.error('Gagal menyimpan rute');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    const selectedRoute = routes.find(r => r.id === selectedRouteId) || undefined;
    return (
      <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
        <RouteEditorView
          initialData={selectedRoute}
          geofences={geofences}
          groups={routeGroups}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
      {loading ? (
        <div className="p-4">Loading routes...</div>
      ) : (
        <RouteListView
          routes={routes}
          geofences={geofences}
          groups={routeGroups}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssign={handleAssign}
          onCompleteAssignment={handleCompleteAssignment}
          locale={locale}
        />
      )}
<ConfirmDialog
        open={!!routeToDelete}
        onOpenChange={(open) => !open && setRouteToDelete(null)}
        title="Delete Route"
        description="Are you sure you want to delete this route? This action cannot be undone."
        onConfirm={confirmDelete}
      />
      <Dialog 
        open={!!assigningRouteId} 
        onOpenChange={(isOpen) => { if (!isOpen) { setAssigningRouteId(null); setEndDate(''); setVehicleSearch(''); setIsVehicleOpen(false); } }}
        title={t.assignment?.title || "Tugaskan Rute ke Kendaraan"}
        description={t.assignment?.description || "Pilih kendaraan yang akan ditugaskan untuk rute ini."}
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.assignment?.selectVehicle || "Pilih Kendaraan"}</label>
            <Popover open={isVehicleOpen} onOpenChange={setIsVehicleOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={isVehicleOpen} className="w-full justify-between font-normal">
                  {selectedVehicleId 
                    ? vehicles?.find(v => String(v.id) === selectedVehicleId)?.vehicleName || vehicles?.find(v => String(v.id) === selectedVehicleId)?.plateNumber 
                    : (t.assignment?.selectVehicle || "Pilih Kendaraan...")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input 
                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder={t.assignment?.searchPlaceholder || "Cari kendaraan berdasarkan nama atau plat..."} 
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {filteredVehicles.length === 0 ? (
                    <div className="py-6 text-center text-sm">{t.assignment?.noVehicles || "Tidak ada kendaraan."}</div>
                  ) : (
                    filteredVehicles.map((v) => (
                      <div 
                        key={v.id}
                        className={cn(
                          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-neutral-100",
                          selectedVehicleId === String(v.id) ? "bg-neutral-100 font-medium" : ""
                        )}
                        onClick={() => {
                          setSelectedVehicleId(String(v.id));
                          setIsVehicleOpen(false);
                          setVehicleSearch('');
                        }}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {selectedVehicleId === String(v.id) && <Check className="h-4 w-4" />}
                        </span>
                        {v.vehicleName || v.plateNumber}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.assignment?.endDateLabel || "Batas Waktu (Opsional)"}</label>
            <input 
              type="date" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setAssigningRouteId(null); setEndDate(''); }} disabled={isAssigning}>{t.assignment?.cancelBtn || "Batal"}</Button>
            <Button variant="primary" onClick={submitAssign} disabled={!selectedVehicleId || isAssigning} loading={isAssigning}>{t.assignment?.assignBtn || "Tugaskan"}</Button>
          </div>
        </div>
      </Dialog>
      <Dialog 
        open={!!completingRouteId} 
        onOpenChange={(isOpen) => { if (!isOpen) setCompletingRouteId(null); }}
        title={t.assignment?.unassignTitle || "Akhiri Tugas Kendaraan"}
        description={t.assignment?.unassignDesc || "Pilih kendaraan yang ingin diakhiri penugasannya dari rute ini."}
      >
        <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
          {(() => {
            const route = routes.find(r => r.id === completingRouteId);
            const assignments = route?.activeAssignments || [];
            if (assignments.length === 0) {
              return <div className="text-sm text-neutral-500 text-center py-4">{t.assignment?.noActiveVehicles || "Tidak ada kendaraan yang sedang ditugaskan di rute ini."}</div>;
            }
            return (
              <div className="space-y-2">
                {assignments.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                    <div>
                      <div className="font-medium text-sm text-foreground">{a.vehicleName || a.plateNumber}</div>
                      <div className="text-xs text-foreground-muted">{a.plateNumber}</div>
                    </div>
                    <Button variant="destructive" onClick={() => setAssignmentToComplete(a.id)}>
                      {t.assignment?.unassignBtn || "Akhiri"}
                    </Button>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </Dialog>
      <ConfirmDialog
        open={!!assignmentToComplete}
        onOpenChange={(open) => !open && setAssignmentToComplete(null)}
        title={t.assignment?.confirmUnassignTitle || "Konfirmasi Akhiri Tugas"}
        description={t.assignment?.confirmUnassignDesc || "Apakah Anda yakin ingin mengakhiri tugas untuk kendaraan ini?"}
        onConfirm={submitCompleteAssignment}
      />
    </div>
  );
}
