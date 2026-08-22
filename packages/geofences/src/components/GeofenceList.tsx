'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Search } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Geofence } from '../types';

interface GeofenceListProps {
  geofences: Geofence[];
  onAdd: () => void;
  onEdit: (geofence: Geofence) => void;
  onDelete: (id: string) => void;
  onSelect: (geofence: Geofence) => void;
  selectedId?: string;
}

export function GeofenceList({
  geofences,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
  selectedId,
}: GeofenceListProps) {
  const [search, setSearch] = useState('');

  const filtered = geofences.filter(
    (gf) =>
      gf.name.toLowerCase().includes(search.toLowerCase()) ||
      (gf.description || '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h1 className="text-base font-bold text-foreground">Daftar Geofence</h1>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Cari geofence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-foreground-muted">
            <MapPin className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">Tidak ada geofence ditemukan</p>
          </div>
        ) : (
          filtered.map((gf) => (
            <div
              key={gf.id}
              className={cn(
                'group flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150',
                selectedId === gf.id
                  ? 'border-primary/50 bg-primary/5 shadow-sm'
                  : 'border-border/60 bg-background hover:border-border hover:bg-surface',
              )}
              onClick={() => onSelect(gf)}
            >
              {/* Color indicator */}
              <div
                className={cn(
                  'mt-0.5 h-3 w-3 shrink-0 rounded-full border-2',
                  gf.status === 'active'
                    ? 'bg-emerald-500 border-emerald-300'
                    : 'bg-neutral-400 border-neutral-300',
                )}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{gf.name}</p>
                {gf.description && (
                  <p className="text-xs text-foreground-muted truncate mt-0.5">{gf.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border',
                      gf.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                        : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
                    )}
                  >
                    {gf.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                  <span className="text-[10px] text-foreground-muted capitalize">
                    {gf.geometry.type === 'circle' ? 'Lingkaran' : 'Poligon'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  type="button"
                  title="Fokus di Peta"
                  onClick={(e) => { e.stopPropagation(); onSelect(gf); }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-100 hover:text-foreground transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(gf); }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-100 hover:text-primary transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Hapus"
                  onClick={(e) => { e.stopPropagation(); onDelete(gf.id); }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      <div className="shrink-0 border-t border-border px-4 py-2">
        <p className="text-xs text-foreground-muted">
          {filtered.length} dari {geofences.length} geofence
        </p>
      </div>
    </div>
  );
}
