'use client';

import React, { useState } from 'react';
import { GeofenceListView } from './components/GeofenceListView';
import { GeofenceEditorView } from './components/GeofenceEditorView';
import { geofenceService } from '@/data/services';
import type { Geofence } from './types';
import { type GeofenceLocale, getGeofencesTranslation } from './i18n';
import { useGeofences } from './hooks/useGeofences';
import { api } from '@adatrack/utils';

type GeofenceView = 'list' | 'create' | 'edit';

interface GeofenceFeatureProps {
  locale?: GeofenceLocale;
}

export function GeofenceFeature({ locale = 'id' }: GeofenceFeatureProps) {
  const t = getGeofencesTranslation(locale);
  const [view, setView] = useState<GeofenceView>('list');
  const { geofences, loading } = useGeofences();
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);

  const handleAdd = () => {
    setEditingGeofence(null);
    setView('create');
  };

  const handleEdit = (geofence: Geofence) => {
    setEditingGeofence(geofence);
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm(t.confirmDelete)) {
      try {
        await api.delete(`/geofences/${id}`);
        window.location.reload();
      } catch (err) {
        console.error('Failed to delete geofence', err);
        alert('Failed to delete geofence');
      }
    }
  };

  const handleSave = async (data: Partial<Geofence>) => {
    try {
      if (view === 'edit' && editingGeofence) {
        await api.put(`/geofences/${editingGeofence.id}`, data);
      } else {
        await api.post('/geofences', data);
      }
      window.location.reload();
    } catch (err) {
      console.error('Failed to save geofence', err);
      alert('Failed to save geofence');
    }
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
        <GeofenceEditorView
          geofence={editingGeofence}
          onCancel={() => setView('list')}
          onSave={handleSave}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
      {loading ? (
        <div className="p-4">Loading geofences...</div>
      ) : (
        <GeofenceListView
          geofences={geofences}
          groups={geofenceService.getGeofenceGroups()}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          locale={locale}
        />
      )}
    </div>
  );
}
