'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Locale } from '@adatrack/types';
import { toast } from '@adatrack/ui';
import type { Route } from './types';
import { routeService, geofenceService, groupService } from '@/data/services';
import { RouteListView } from './components/RouteListView';
import { RouteEditorView } from './components/RouteEditorView';
import { getRouteTranslation } from './i18n';
import { useSearchParams } from 'next/navigation';

export interface RouteFeatureProps {
  locale?: Locale;
  initialView?: 'list' | 'create' | 'edit';
  initialRouteId?: string;
}

export function RouteFeature({
  locale = 'id',
  initialView = 'list',
  initialRouteId,
}: RouteFeatureProps) {
  const t = getRouteTranslation(locale);
  const searchParams = useSearchParams();
  const queryRouteId = searchParams?.get('routeId') || undefined;

  const [routes, setRoutes] = useState<Route[]>(() => routeService.getRoutes());
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(
    initialRouteId || queryRouteId,
  );
  const [isEditing, setIsEditing] = useState(initialView === 'create' || initialView === 'edit');
  const [draftRouteData, setDraftRouteData] = useState<Route | undefined>(undefined);

  // Reactive subscription: synchronize UI whenever repository data mutates
  useEffect(() => {
    return routeService.subscribe(() => {
      setRoutes(routeService.getRoutes());
    });
  }, []);

  // Sync initial props if navigated via direct link/deep link
  useEffect(() => {
    if (initialView === 'create') {
      setIsEditing(true);
      setSelectedRouteId(undefined);
    } else if (initialView === 'edit' && initialRouteId) {
      setIsEditing(true);
      setSelectedRouteId(initialRouteId);
    }
  }, [initialView, initialRouteId]);

  // Load draft route from playback if present in sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('adatrack_draft_route');
      if (raw) {
        const draft = JSON.parse(raw) as Route;
        setDraftRouteData(draft);
        setSelectedRouteId(undefined);
        setIsEditing(true);
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '/routes/create');
        }
      }
    } catch (err) {
      console.error('Failed to parse draft route from playback:', err);
    }
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/routes/create')) {
        setDraftRouteData(undefined);
        setSelectedRouteId(undefined);
        setIsEditing(true);
      } else if (path.includes('/routes/edit/')) {
        const id = path.split('/routes/edit/')[1];
        setSelectedRouteId(id);
        setDraftRouteData(undefined);
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectRoute = useCallback((id: string | undefined) => {
    setSelectedRouteId(id);
  }, []);

  const handleCreateNew = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/routes/create');
    }
    setDraftRouteData(undefined);
    setSelectedRouteId(undefined);
    setIsEditing(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/routes/edit/${id}`);
    }
    setDraftRouteData(undefined);
    setSelectedRouteId(id);
    setIsEditing(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm(t.delete.description)) {
        const deleted = routeService.deleteRoute(id);
        if (deleted) {
          toast.success(t.toast.deleteSuccess);
          if (selectedRouteId === id) {
            setSelectedRouteId(undefined);
            setIsEditing(false);
          }
        } else {
          toast.error(t.toast.deleteFailed);
        }
      }
    },
    [selectedRouteId, t],
  );

  const handleSave = useCallback(
    (route: Partial<Route>) => {
      if (route.id) {
        const updated = routeService.updateRoute(route.id, route);
        if (updated) {
          toast.success(t.toast.updateSuccess);
        }
      } else {
        const created = routeService.createRoute(route);
        toast.success(t.toast.createSuccess);
        setSelectedRouteId(created.id);
      }

      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/routes');
      }
      setDraftRouteData(undefined);
      sessionStorage.removeItem('adatrack_draft_route');
      setIsEditing(false);
    },
    [t],
  );

  const handleCancelEdit = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/routes');
    }
    setDraftRouteData(undefined);
    sessionStorage.removeItem('adatrack_draft_route');
    setIsEditing(false);
  }, []);

  // Interactive Tour Event Bridge
  useEffect(() => {
    const handleTourCreate = () => {
      handleCreateNew();
    };
    const handleTourClose = () => {
      handleCancelEdit();
    };

    window.addEventListener('adatrack:tour-open-route-create', handleTourCreate);
    window.addEventListener('adatrack:tour-close-route-editor', handleTourClose);

    return () => {
      window.removeEventListener('adatrack:tour-open-route-create', handleTourCreate);
      window.removeEventListener('adatrack:tour-close-route-editor', handleTourClose);
    };
  }, [handleCreateNew, handleCancelEdit]);

  if (isEditing) {
    const selectedRoute = routes.find((r) => r.id === selectedRouteId) || undefined;
    const initialData = draftRouteData || selectedRoute;
    return (
      <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
        <RouteEditorView
          initialData={initialData}
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
    </div>
  );
}

// Named alias per ADATRACK guidelines
export const RoutesFeature = RouteFeature;
