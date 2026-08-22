'use client';

import React, { useState } from 'react';
import type { Locale } from '@adatrack/types';
import { Route } from './types';
import { mockRoutes } from './data/mockRoutes';
// IMPORTANT: We import mockGeofences to reuse Master Data without duplication.
import { mockGeofences } from '../geofences/data/mockGeofences'; 
import { RouteListView } from './components/RouteListView';
import { RouteEditorView } from './components/RouteEditorView';
import { getRouteTranslation } from './i18n';

interface RouteFeatureProps {
  locale?: Locale;
}

export function RouteFeature({ locale = 'id' }: RouteFeatureProps) {
  const t = getRouteTranslation(locale);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(undefined);
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

  const handleDelete = (id: string) => {
    if (confirm(t.delete.description)) {
      setRoutes(routes.filter((r) => r.id !== id));
      if (selectedRouteId === id) {
        setSelectedRouteId(undefined);
        setIsEditing(false);
      }
    }
  };

  const handleSave = (route: Partial<Route>) => {
    const now = new Date().toISOString();
    
    if (route.id) {
      setRoutes(routes.map((r) => (r.id === route.id ? { ...r, ...route, updatedAt: now } as Route : r)));
    } else {
      const newRoute: Route = {
        ...route as Route,
        id: `rt-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setRoutes([newRoute, ...routes]);
      setSelectedRouteId(newRoute.id);
    }
    
    setIsEditing(false);
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
          geofences={mockGeofences}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
      <RouteListView
        routes={routes}
        geofences={mockGeofences}
        selectedRouteId={selectedRouteId}
        onSelectRoute={handleSelectRoute}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        locale={locale}
      />
    </div>
  );
}
