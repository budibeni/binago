'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Hexagon, Circle } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { MapGeometry } from '@adatrack/maps';
import { Geofence } from '../types';

interface GeofenceEditorProps {
  geofence: Geofence | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Geofence>) => void;
  currentGeometry: MapGeometry | null;
  onDrawModeChange: (mode: 'idle' | 'draw_polygon' | 'draw_circle') => void;
}

export function GeofenceEditor({
  geofence,
  open,
  onClose,
  onSave,
  currentGeometry,
  onDrawModeChange,
}: GeofenceEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    if (geofence && open) {
      setFormData({
        name: geofence.name,
        description: geofence.description || '',
        status: geofence.status,
      });
    } else if (!geofence && open) {
      setFormData({ name: '', description: '', status: 'active' });
    }
  }, [geofence, open]);

  useEffect(() => {
    if (!open) onDrawModeChange('idle');
  }, [open, onDrawModeChange]);

  const handleSave = () => {
    onSave({
      ...formData,
      status: formData.status as 'active' | 'inactive',
      geometry: currentGeometry ?? geofence?.geometry,
    });
  };

  const canSave = !!formData.name && !!(currentGeometry ?? geofence?.geometry);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={geofence ? 'Edit Geofence' : 'Tambah Geofence Baru'}
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-background shadow-2xl',
          'border-l border-border transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">
            {geofence ? 'Edit Geofence' : 'Tambah Geofence Baru'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-100 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Nama Geofence <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Gudang Utama Jakarta"
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Keterangan singkat area ini..."
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle resize-none focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>

          {/* Draw area */}
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground">Area Geofence</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onDrawModeChange('draw_polygon')}
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-foreground-muted hover:border-primary hover:text-primary transition-colors"
              >
                <Hexagon className="h-6 w-6" />
                <span className="text-xs font-medium">Gambar Poligon</span>
              </button>
              <button
                type="button"
                onClick={() => onDrawModeChange('draw_circle')}
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-foreground-muted hover:border-primary hover:text-primary transition-colors"
              >
                <Circle className="h-6 w-6" />
                <span className="text-xs font-medium">Gambar Lingkaran</span>
              </button>
            </div>

            {/* Current geometry state */}
            {currentGeometry ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  Area {currentGeometry.type === 'circle' ? 'lingkaran' : 'poligon'} berhasil digambar
                </p>
              </div>
            ) : geofence?.geometry ? (
              <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                  Menggunakan area yang sudah ada
                </p>
              </div>
            ) : (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Silakan gambar area di peta sebelum menyimpan.
              </p>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="shrink-0 flex justify-end gap-2 p-4 border-t border-border bg-neutral-50 dark:bg-neutral-900">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-neutral-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            Simpan
          </button>
        </div>
      </aside>
    </>
  );
}
