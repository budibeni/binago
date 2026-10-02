'use client';

import React, { useState } from 'react';
import { ConfirmDialog, toast } from '@adatrack/ui';
import type { Locale } from '@adatrack/types';
import { Route } from './types';
import { geofenceService, groupService } from '@/data/services';
import { RouteListView } from './components/RouteListView';
import { RouteEditorView } from './components/RouteEditorView';
import { getRouteTranslation } from './i18n';
import { useRoutes } from './hooks/useRoutes';
import { api } from '@adatrack/utils';
import { useSearchParams } from 'next/navigation';

interface RouteFeatureProps {
  locale?: Locale;
}

export function RouteFeature({ locale = 'id' }: RouteFeatureProps) {
  const t = getRouteTranslation(locale);
  const searchParams = useSearchParams();
  const initialRouteId = searchParams?.get('routeId') || undefined;

  const { routes, loading, refetch } = useRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(initialRouteId);
  const [isEditing, setIsEditing] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
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
        planned_distance: route.plannedDistance,
        estimated_duration: route.estimatedDuration,
      };

      if (route.id) {
        await api.put(`/routes/${route.id}`, payload);
      } else {
        await api.post('/routes', payload);
      }

      window.location.reload();
    } catch (err) {
      console.error('Failed to save route', err);
      alert('Failed to save route');
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
          geofences={geofenceService.getGeofences()}
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
          geofences={geofenceService.getGeofences()}
          groups={routeGroups}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
    </div>
  );
}
