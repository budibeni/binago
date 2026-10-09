'use client';

import React, { useState } from 'react';
import { ConfirmDialog, toast, Dialog, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button } from '@adatrack/ui';
import type { Locale } from '@adatrack/types';
import { Route } from './types';
import { groupService } from '@/data/services';
import { useGeofences } from '../geofences/hooks/useGeofences';
import { RouteListView } from './components/RouteListView';
import { RouteEditorView } from './components/RouteEditorView';
import { getRouteTranslation } from './i18n';
import { useRoutes } from './hooks/useRoutes';
import { useVehicles } from '../vehicles/hooks/useVehicles';
import { api } from '@adatrack/utils';
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
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { vehicles } = useVehicles();
  const [routeGroups, setRouteGroups] = useState<any[]>([]);

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

  const handleCompleteAssignment = async (id: string) => {
    if (!confirm('Akhiri penugasan aktif untuk rute ini (Ubah status menjadi Selesai)?')) return;
    try {
      await api.put(`/routes/${id}/status`, { status: 'completed' });
      toast.success('Penugasan rute berhasil diakhiri');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengakhiri penugasan');
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
      toast.success('Rute berhasil ditugaskan ke kendaraan');
      setAssigningRouteId(null);
      setEndDate('');
    } catch (err) {
      console.error('Failed to assign route', err);
      toast.error('Gagal menugaskan rute');
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
        onOpenChange={(isOpen) => { if (!isOpen) { setAssigningRouteId(null); setEndDate(''); } }}
        title="Tugaskan Rute ke Kendaraan"
        description="Pilih kendaraan yang akan ditugaskan untuk rute ini."
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih Kendaraan</label>
            <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kendaraan..." />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.filter(v => !v.currentRouteId).map(v => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.vehicleName || v.plateNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Batas Waktu (Opsional)</label>
            <input 
              type="date" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setAssigningRouteId(null); setEndDate(''); }} disabled={isAssigning}>Batal</Button>
            <Button variant="primary" onClick={submitAssign} disabled={!selectedVehicleId || isAssigning} loading={isAssigning}>Tugaskan</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
