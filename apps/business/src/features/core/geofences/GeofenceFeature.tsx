'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast, ConfirmDialog } from '@adatrack/ui';
import { GeofenceListView } from './components/GeofenceListView';
import { GeofenceEditorView } from './components/GeofenceEditorView';
import { geofenceService } from '@/data/services';
import type { Geofence } from './types';
import { type GeofenceLocale, getGeofencesTranslation } from './i18n';

export type GeofenceView = 'list' | 'create' | 'edit';

export interface GeofenceFeatureProps {
  locale?: GeofenceLocale;
  initialView?: GeofenceView;
  initialGeofenceId?: string;
}

export function GeofenceFeature({
  locale = 'id',
  initialView = 'list',
  initialGeofenceId,
}: GeofenceFeatureProps) {
  const t = getGeofencesTranslation(locale);
  const [view, setView] = useState<GeofenceView>(initialView);
  const [geofences, setGeofences] = useState<Geofence[]>(() => geofenceService.getGeofences());
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(() => {
    if (initialGeofenceId) {
      return geofenceService.getGeofenceById(initialGeofenceId) || null;
    }
    return null;
  });
  const [deleteGeofenceId, setDeleteGeofenceId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Reactive subscription: synchronize UI whenever repository data mutates
  useEffect(() => {
    return geofenceService.subscribe(() => {
      setGeofences(geofenceService.getGeofences());
    });
  }, []);

  // Sync initial props if navigated via direct link/deep link
  useEffect(() => {
    if (initialView && initialView !== 'list') {
      setView(initialView);
      if (initialGeofenceId) {
        const found = geofenceService.getGeofenceById(initialGeofenceId);
        if (found) setEditingGeofence(found);
      }
    }
  }, [initialView, initialGeofenceId]);

  // Load draft geofence from playback / parking spot if present in sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('adatrack_draft_geofence');
      if (raw) {
        const draft = JSON.parse(raw);
        sessionStorage.removeItem('adatrack_draft_geofence');
        setEditingGeofence({
          id: `gf-draft-${Date.now()}`,
          name: draft.name || 'Geofence Baru',
          description: draft.description || '',
          status: 'active',
          geometry: draft.geometry,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setView('create');
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '/geofences/create');
        }
      }
    } catch (err) {
      console.error('Failed to load draft geofence from sessionStorage:', err);
    }
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/geofences/create')) {
        setEditingGeofence(null);
        setView('create');
      } else if (path.includes('/geofences/edit/')) {
        const id = path.split('/geofences/edit/')[1];
        const found = geofenceService.getGeofenceById(id);
        if (found) {
          setEditingGeofence(found);
          setView('edit');
        } else {
          setView('list');
        }
      } else {
        setView('list');
        setEditingGeofence(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAdd = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/geofences/create');
    }
    setEditingGeofence(null);
    setView('create');
  }, []);

  const handleEdit = useCallback((geofence: Geofence) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/geofences/edit');
    }
    setEditingGeofence(geofence);
    setView('edit');
  }, []);

  const handleCancel = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/geofences');
    }
    setEditingGeofence(null);
    setView('list');
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeleteGeofenceId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteGeofenceId) return;
    const deleted = geofenceService.deleteGeofence(deleteGeofenceId);
    if (deleted) {
      toast.success(t.deleteSuccess);
    } else {
      toast.error(t.deleteFailed);
    }
    setIsDeleteDialogOpen(false);
    setDeleteGeofenceId(null);
  }, [deleteGeofenceId, t]);

  const handleSave = useCallback(
    (data: Partial<Geofence>) => {
      if (view === 'edit' && editingGeofence) {
        const updated = geofenceService.updateGeofence(editingGeofence.id, data);
        if (updated) {
          toast.success(t.updateSuccess);
        }
      } else {
        geofenceService.createGeofence(data);
        toast.success(t.createSuccess);
      }

      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/geofences');
      }
      setEditingGeofence(null);
      setView('list');
    },
    [view, editingGeofence, t],
  );

  // Interactive Tour Event Bridge
  useEffect(() => {
    const handleTourCreate = () => {
      handleAdd();
    };
    const handleTourClose = () => {
      handleCancel();
    };

    window.addEventListener('adatrack:tour-open-geofence-create', handleTourCreate);
    window.addEventListener('adatrack:tour-close-geofence-editor', handleTourClose);

    return () => {
      window.removeEventListener('adatrack:tour-open-geofence-create', handleTourCreate);
      window.removeEventListener('adatrack:tour-close-geofence-editor', handleTourClose);
    };
  }, [handleAdd, handleCancel]);

  if (view === 'create' || view === 'edit') {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
        <GeofenceEditorView
          geofence={editingGeofence}
          onCancel={handleCancel}
          onSave={handleSave}
          locale={locale}
        />
      </div>
    );
  }

  const targetGeofence = geofences.find((g) => g.id === deleteGeofenceId);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
      <GeofenceListView
        geofences={geofences}
        groups={geofenceService.getGeofenceGroups()}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        locale={locale}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t.delete}
        description={
          <div className="flex flex-col gap-1 text-center">
            <span>{t.confirmDelete}</span>
            {targetGeofence && (
              <div className="mt-2 text-center">
                <strong className="text-danger text-[14px]">{targetGeofence.name}</strong>
              </div>
            )}
          </div>
        }
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

// Named alias per ADATRACK guidelines
export const GeofencesFeature = GeofenceFeature;
