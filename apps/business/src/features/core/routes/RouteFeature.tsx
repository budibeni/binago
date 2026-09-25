'use client';

import React, { useState } from 'react';
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

  const { routes, loading } = useRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(initialRouteId);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleDelete = async (id: string) => {
    if (confirm(t.delete.description)) {
      try {
        await api.delete(`/routes/${id}`);
        window.location.reload();
      } catch (err) {
        console.error('Failed to delete route', err);
        alert('Failed to delete route');
      }
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
        status: route.status,
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
          groups={groupService.getRouteGroups()}
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
          groups={groupService.getRouteGroups()}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          locale={locale}
        />
      )}
    </div>
  );
}
