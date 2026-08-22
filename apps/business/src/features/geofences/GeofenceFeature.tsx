'use client';

import React, { useState } from 'react';
import { GeofenceListView } from './components/GeofenceListView';
import { GeofenceEditorView } from './components/GeofenceEditorView';
import { mockGeofences, mockGeofenceGroups } from './data/mockGeofences';
import type { Geofence } from './types';
import { type GeofenceLocale, getGeofencesTranslation } from './i18n';

type GeofenceView = 'list' | 'create' | 'edit';

interface GeofenceFeatureProps {
  locale?: GeofenceLocale;
}

export function GeofenceFeature({ locale = 'id' }: GeofenceFeatureProps) {
  const t = getGeofencesTranslation(locale);
  const [view, setView] = useState<GeofenceView>('list');
  const [geofences, setGeofences] = useState<Geofence[]>(mockGeofences);
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);

  const handleAdd = () => {
    setEditingGeofence(null);
    setView('create');
  };

  const handleEdit = (geofence: Geofence) => {
    setEditingGeofence(geofence);
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm(t.confirmDelete)) {
      setGeofences((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleSave = (data: Partial<Geofence>) => {
    if (view === 'edit' && editingGeofence) {
      setGeofences((prev) =>
        prev.map((g) =>
          g.id === editingGeofence.id
            ? ({ ...g, ...data, updatedAt: new Date().toISOString() } as Geofence)
            : g,
        ),
      );
    } else {
      const newGeofence: Geofence = {
        id: `gf-${Date.now()}`,
        name: data.name || '',
        description: data.description,
        status: (data.status as 'active' | 'inactive') ?? 'active',
        geometry: data.geometry!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGeofences((prev) => [newGeofence, ...prev]);
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
      <GeofenceListView
        geofences={geofences}
        groups={mockGeofenceGroups}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        locale={locale}
      />
    </div>
  );
}
