'use client';

import React, { useState } from 'react';
import { GeofenceListView } from './GeofenceListView';
import { GeofenceEditorView } from './GeofenceEditorView';
import { mockGeofences, mockGeofenceGroups } from '../data/mockGeofences';
import type { Geofence } from '../types';

type GeofenceView = 'list' | 'create' | 'edit';

export function GeofenceFeature() {
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
    if (confirm('Apakah Anda yakin ingin menghapus geofence ini?')) {
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
          onClose={() => setView('list')}
          onSave={handleSave}
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
      />
    </div>
  );
}
