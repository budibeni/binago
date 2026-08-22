'use client';

import React, { useState } from 'react';
import { GeofenceList } from './GeofenceList';
import { GeofenceMap } from './GeofenceMap';
import { GeofenceEditor } from './GeofenceEditor';
import { mockGeofences } from '../data/mockGeofences';
import type { Geofence } from '../types';
import type { MapGeometry } from '@adatrack/maps';

export function GeofenceFeature() {
  const [geofences, setGeofences] = useState<Geofence[]>(mockGeofences);
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | undefined>();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);
  const [editorMode, setEditorMode] = useState<'idle' | 'draw_polygon' | 'draw_circle' | 'edit'>('idle');
  const [editorGeometry, setEditorGeometry] = useState<MapGeometry | null>(null);

  const handleAdd = () => {
    setEditingGeofence(null);
    setEditorGeometry(null);
    setEditorOpen(true);
  };

  const handleEdit = (geofence: Geofence) => {
    setEditingGeofence(geofence);
    setEditorGeometry(geofence.geometry);
    setEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus geofence ini?')) {
      setGeofences((prev) => prev.filter((g) => g.id !== id));
      if (selectedGeofenceId === id) setSelectedGeofenceId(undefined);
    }
  };

  const handleSave = (data: Partial<Geofence>) => {
    if (editingGeofence) {
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
      setGeofences((prev) => [...prev, newGeofence]);
    }
    setEditorOpen(false);
    setEditorMode('idle');
  };

  return (
    // h-[calc(100dvh-52px)]: 100dvh = viewport height, 52px = tinggi header AppShell
    // Ini memastikan peta mengisi seluruh area konten tanpa overflow
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - 52px)' }}>
      {/* Full-screen map */}
      <div className="absolute inset-0 z-0">
        <GeofenceMap
          geofences={geofences}
          selectedGeofenceId={selectedGeofenceId}
          editorMode={editorMode}
          editorGeometry={editorGeometry}
          onEditorGeometryChange={setEditorGeometry}
        />
      </div>

      {/* Floating glassmorphic sidebar */}
      <div className="absolute top-4 left-4 bottom-4 w-[340px] z-10 flex flex-col rounded-2xl border border-white/20 bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <GeofenceList
          geofences={geofences}
          selectedId={selectedGeofenceId}
          onSelect={(gf) => setSelectedGeofenceId(gf.id)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Editor Drawer */}
      <GeofenceEditor
        open={editorOpen}
        geofence={editingGeofence}
        currentGeometry={editorGeometry}
        onClose={() => {
          setEditorOpen(false);
          setEditorMode('idle');
        }}
        onSave={handleSave}
        onDrawModeChange={setEditorMode}
      />
    </div>
  );
}
