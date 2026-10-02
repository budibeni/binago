'use client';

import React, { useState } from 'react';
import { ConfirmDialog, toast } from '@adatrack/ui';
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
  const { geofences, loading, refetch } = useGeofences();
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);
  const [geofenceToDelete, setGeofenceToDelete] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingGeofence(null);
    setView('create');
  };

  const handleEdit = (geofence: Geofence) => {
    setEditingGeofence(geofence);
    setView('edit');
  };

  const handleDelete = (id: string) => {
    setGeofenceToDelete(id);
  };

  const confirmDelete = async () => {
    if (!geofenceToDelete) return;
    try {
      await api.delete(`/geofences/${geofenceToDelete}`);
      toast.success('Geofence deleted successfully');
      refetch();
    } catch (err) {
      console.error('Failed to delete geofence', err);
      toast.error('Failed to delete geofence');
    }
  };



  const handleSave = async (data: Partial<Geofence>) => {
    try {
      let areaType = 'polygon';
      let boundaryPoints: any[] = [];
      
      if (data.geometry?.type === 'polygon' || data.geometry?.type === 'rectangle' || data.geometry?.type === 'multiline') {
          boundaryPoints = data.geometry.coordinates;
      }
      
      const payload = {
        name: data.name,
        area_type: areaType,
        boundary_points: boundaryPoints,
      };
      
      if (view === 'edit' && editingGeofence) {
        await api.put(`/geofences/${editingGeofence.id}`, payload);
        toast.success('Geofence updated successfully');
      } else {
        await api.post('/geofences', payload);
        toast.success('Geofence created successfully');
      }

      refetch();
      setView('list');
    } catch (err) {
      console.error('Failed to save geofence', err);
      toast.error('Failed to save geofence');
      throw err;
    }
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
          groups={[]}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          locale={locale}
        />
      )}
      <ConfirmDialog
        open={!!geofenceToDelete}
        onOpenChange={(open) => !open && setGeofenceToDelete(null)}
        title="Delete Geofence"
        description="Are you sure you want to delete this geofence? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </div>
  );
}
