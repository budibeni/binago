'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { mockGeofences, GeofenceData } from '../data/mockSettingsData';
import { cn } from '@adatrack/utils';
import { Switch, Button, Dialog, Input, Label } from '@adatrack/ui';
import { MapContainer } from '@adatrack/maps';
import { EmptyState } from '@/components/EmptyState';

// --- Inline feedback hook ---
function useFeedback() {
  const [message, setMessage] = useState<string | null>(null);
  
  const show = (msg: string) => {
    setMessage(msg);
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return { message, show };
}

export function GeofenceSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.geofences;

  const [geofences, setGeofences] = useState<GeofenceData[]>(mockGeofences);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GeofenceData>>({});

  const feedback = useFeedback();

  const handleToggleStatus = (id: string, active: boolean) => {
    setGeofences(prev => prev.map(g => 
      g.id === id ? { ...g, status: active ? 'active' : 'inactive' } : g
    ));
  };

  const handleAdd = () => {
    setEditingId(null);
    setNameError(null);
    setFormData({
      name: '',
      latitude: -6.2,
      longitude: 106.816667,
      radius: 100,
      status: 'active'
    });
    setFormOpen(true);
  };

  const handleEdit = (geo: GeofenceData) => {
    setEditingId(geo.id);
    setNameError(null);
    setFormData(geo);
    setFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    if (!open) {
      setNameError(null);
    }
    setFormOpen(open);
  };

  const confirmDelete = () => {
    if (editingId) {
      setGeofences(prev => prev.filter(g => g.id !== editingId));
      feedback.show(s.deletedSuccess);
    }
    setDeleteConfirmOpen(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit name validation with visible error
    if (!formData.name || formData.name.trim() === '') {
      setNameError(s.nameRequired);
      return;
    }

    if (editingId) {
      setGeofences(prev => prev.map(g => g.id === editingId ? { ...g, ...formData } as GeofenceData : g));
    } else {
      const newGeo: GeofenceData = {
        ...formData,
        id: `geo-${Date.now()}`,
      } as GeofenceData;
      setGeofences(prev => [...prev, newGeo]);
    }
    feedback.show(s.savedSuccess);
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Inline Feedback */}
      {feedback.message && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 text-sm font-medium"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          {feedback.message}
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={handleAdd} className="gap-1.5 bg-red-600 hover:bg-red-700 text-white border-transparent rounded-lg h-10 px-4 shadow-sm w-full md:w-auto">
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span className="font-medium text-sm">{s.addGeofence}</span>
        </Button>
      </div>

      {/* Geofence List or Empty State */}
      {geofences.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl">
          <EmptyState
            icon={ShieldAlert}
            title={s.emptyTitle}
            description={s.emptyDesc}
            actionLabel={s.addGeofence}
            onAction={handleAdd}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {geofences.map((geo) => (
            <div 
              key={geo.id} 
              onClick={() => handleEdit(geo)}
              className="group flex items-center justify-between bg-surface border border-border rounded-xl p-3 md:p-4 hover:border-border active:bg-surface-elevated cursor-pointer transition-all"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEdit(geo); } }}
              aria-label={geo.name}
            >
              <div className="flex items-start gap-3.5">
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
                  geo.status === 'active' 
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-500' 
                    : 'bg-surface-elevated text-foreground-subtle'
                )}>
                  <ShieldAlert className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1 mt-0.5">
                  <span className="text-base font-bold text-foreground leading-none">{geo.name}</span>
                  <span className="text-sm text-foreground-muted leading-none">{s.radius} {geo.radius} m</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5" onClick={e => e.stopPropagation()}>
                <Switch 
                  checked={geo.status === 'active'}
                  onCheckedChange={(checked) => handleToggleStatus(geo.id, checked)}
                  className="data-[state=checked]:bg-green-500"
                  aria-label={`${geo.name} â€” ${geo.status === 'active' ? s.active : s.inactive}`}
                />
                <span className={cn(
                  "text-xs font-semibold",
                  geo.status === 'active' ? "text-green-500" : "text-foreground-subtle"
                )}>
                  {geo.status === 'active' ? s.active : s.inactive}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog 
        open={formOpen} 
        onOpenChange={handleFormClose} 
        title={editingId ? s.editGeofence : s.addGeofence}
        description={s.geofenceFormDesc}
        className="max-md:top-auto max-md:bottom-0 max-md:translate-y-0 max-md:rounded-b-none max-md:rounded-t-[1.5rem] max-md:p-5 max-md:max-h-[90vh] max-md:overflow-y-auto"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-5 mt-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="geo-name">{s.areaName}</Label>
            <Input 
              id="geo-name"
              placeholder={s.areaNamePlaceholder}
              className={cn('h-12', nameError && 'border-red-500 focus-visible:ring-red-500')}
              value={formData.name || ''} 
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (nameError) setNameError(null);
              }}
              aria-describedby={nameError ? 'geo-name-error' : undefined}
              aria-invalid={!!nameError}
            />
            {nameError && (
              <p id="geo-name-error" className="text-xs text-red-600 mt-1" role="alert">
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="h-[180px] md:h-[220px] rounded-2xl overflow-hidden relative border border-border [&_.font-mono]:hidden">
              <MapContainer 
                viewport={{
                  center: { lat: formData.latitude || -6.2, lng: formData.longitude || 106.816667 },
                  zoom: 14
                }}
                placeholderText=""
              >
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-foreground shadow-sm border border-border pointer-events-none z-10">
                  {formData.latitude || '-6.2000'}, {formData.longitude || '106.8167'}
                </div>
              </MapContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="geo-lat" className="text-xs text-foreground-muted">{s.latitude}</Label>
                <Input 
                  id="geo-lat"
                  type="number" 
                  step="any"
                  className="bg-surface-elevated h-10"
                  value={formData.latitude || ''} 
                  onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  required
                  aria-label={s.latitude}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="geo-lng" className="text-xs text-foreground-muted">{s.longitude}</Label>
                <Input 
                  id="geo-lng"
                  type="number"
                  step="any" 
                  className="bg-surface-elevated h-10"
                  value={formData.longitude || ''} 
                  onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  required
                  aria-label={s.longitude}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div className="space-y-1.5">
              <Label htmlFor="geo-radius">{s.radius}</Label>
              <div className="relative">
                <Input 
                  id="geo-radius"
                  type="number"
                  min={10}
                  className="pr-10 h-12"
                  value={formData.radius || ''} 
                  onChange={e => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                  required
                  aria-label={s.radius}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm font-medium" aria-hidden="true">m</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{s.geofenceStatus}</Label>
              <div className="flex items-center justify-between p-3 h-12 rounded-xl border border-border bg-surface">
                <span className={cn(
                  "text-sm font-medium",
                  formData.status === 'active' ? "text-foreground" : "text-foreground-muted"
                )}>
                  {formData.status === 'active' ? s.active : s.inactive}
                </span>
                <div className="flex items-center gap-2">
                  {formData.status === 'active' && (
                    <span className="text-xs font-bold text-green-500" aria-hidden="true">[{s.statusOn}]</span>
                  )}
                  <Switch 
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                    className="data-[state=checked]:bg-green-500"
                    aria-label={s.geofenceStatus}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-3 mt-4 pt-4 border-t border-border">
            {editingId && (
              <Button 
                type="button" 
                variant="outline" 
                className="md:mr-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-950/20 w-full md:w-auto h-11 md:order-1 order-3"
                onClick={() => {
                  setFormOpen(false);
                  setDeleteConfirmOpen(true);
                }}
              >
                {s.delete}
              </Button>
            )}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full md:w-auto bg-surface border-border text-foreground h-11 md:order-2 order-2"
              onClick={() => setFormOpen(false)}
            >
              {s.cancel}
            </Button>
            <Button 
              type="submit"
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white border-transparent h-11 md:order-3 order-1"
            >
              {editingId ? s.saveChanges : s.save}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={s.deleteConfirmTitle}
        description={s.deleteConfirmDesc}
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
            {s.cancel}
          </Button>
          <Button type="button" className="bg-red-600 hover:bg-red-700 text-white border-transparent" onClick={confirmDelete}>
            {s.delete}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
