import React, { useState, useEffect } from 'react';
import { Route, RouteStop, RouteLocation, MapInteractionMode, ActiveLocationTarget } from '../types';
import { Geofence } from '../../geofences/types';
import { Button, Input, Label } from '@adatrack/ui';
import { getRouteTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';
import { MapGeometry } from '@adatrack/maps';
import { PenTool, Trash2, Plus, MapPin } from 'lucide-react';
import { RouteMap } from './RouteMap';

interface RouteEditorViewProps {
  initialData?: Route;
  geofences: Geofence[];
  onSave: (route: Partial<Route>) => void;
  onCancel: () => void;
  locale?: Locale;
}

export function RouteEditorView({
  initialData,
  geofences,
  onSave,
  onCancel,
  locale = 'id'
}: RouteEditorViewProps) {
  const t = getRouteTranslation(locale).editor;
  
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  const [origin, setOrigin] = useState<RouteLocation>(initialData?.origin || { type: 'geofence' });
  const [destination, setDestination] = useState<RouteLocation>(initialData?.destination || { type: 'geofence' });
  const [stops, setStops] = useState<RouteStop[]>(initialData?.stops || []);
  
  const [plannedDistance, setPlannedDistance] = useState<number | undefined>(initialData?.plannedDistance);
  const [estimatedDuration, setEstimatedDuration] = useState<number | undefined>(initialData?.estimatedDuration);
  const [status, setStatus] = useState<'active'|'inactive'>(initialData?.status || 'active');

  const [errors, setErrors] = useState<{name?: string; origin?: string; destination?: string}>({});

  const [editorMode, setEditorMode] = useState<MapInteractionMode>('idle');
  const [editorGeometry, setEditorGeometry] = useState<MapGeometry | null>(initialData?.plannedPath || null);
  
  const [activeLocationTarget, setActiveLocationTarget] = useState<ActiveLocationTarget>(null);

  const handleAddStop = () => {
    setStops([
      ...stops,
      { id: `stop-${Date.now()}`, sequence: stops.length + 1, location: { type: 'geofence' } }
    ]);
  };

  const handleUpdateStopLocation = (id: string, location: RouteLocation) => {
    setStops(stops.map(s => s.id === id ? { ...s, location } : s));
  };

  const handleRemoveStop = (id: string) => {
    const newStops = stops.filter(s => s.id !== id).map((s, index) => ({ ...s, sequence: index + 1 }));
    setStops(newStops);
  };

  const isLocationValid = (loc: RouteLocation) => {
    if (loc.type === 'geofence' && !loc.geofenceId) return false;
    if (loc.type === 'coordinate' && (loc.latitude === undefined || loc.longitude === undefined)) return false;
    return true;
  };

  const validate = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = t.validation.nameRequired;
    if (!isLocationValid(origin)) newErrors.origin = t.validation.locationRequired;
    if (!isLocationValid(destination)) newErrors.destination = t.validation.locationRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    // Filter out stops that have invalid locations
    const validStops = stops.filter(s => isLocationValid(s.location));

    onSave({
      id: initialData?.id,
      name,
      description,
      origin,
      destination,
      stops: validStops,
      plannedDistance,
      estimatedDuration,
      status,
      plannedPath: editorGeometry || undefined
    });
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!activeLocationTarget) return;

    if (activeLocationTarget === 'origin') {
      setOrigin({ ...origin, type: 'coordinate', latitude: lat, longitude: lng, radius: origin.radius || 100 });
    } else if (activeLocationTarget === 'destination') {
      setDestination({ ...destination, type: 'coordinate', latitude: lat, longitude: lng, radius: destination.radius || 100 });
    } else if (activeLocationTarget.startsWith('stop-')) {
      const stopId = activeLocationTarget;
      setStops(stops.map(s => s.id === stopId ? { ...s, location: { ...s.location, type: 'coordinate', latitude: lat, longitude: lng, radius: s.location.radius || 100 } } : s));
    }
    
    // Optional: Return to idle after selection, or keep active to allow re-clicking. 
    // Usually it's better to return to idle so they can continue filling the form.
    setEditorMode('idle');
    setActiveLocationTarget(null);
  };

  const toggleLocationSelectMode = (targetId: ActiveLocationTarget) => {
    if (editorMode === 'select-location' && activeLocationTarget === targetId) {
      // Cancel
      setEditorMode('idle');
      setActiveLocationTarget(null);
    } else {
      // Activate
      setEditorMode('select-location');
      setActiveLocationTarget(targetId);
    }
  };

  const selectClass = "flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:focus-visible:ring-primary-300";

  const renderLocationPicker = (targetId: ActiveLocationTarget, loc: RouteLocation, onChange: (val: RouteLocation) => void, error?: string) => {
    const isSelecting = editorMode === 'select-location' && activeLocationTarget === targetId;

    return (
      <div className="space-y-2 mt-1">
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
            <input 
              type="radio" 
              name={`loc-type-${Math.random()}`}
              checked={loc.type === 'geofence'} 
              onChange={() => onChange({ type: 'geofence' })}
              className="accent-primary-600"
            />
            {t.locationType.geofence}
          </label>
          <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
            <input 
              type="radio" 
              checked={loc.type === 'coordinate'} 
              onChange={() => onChange({ type: 'coordinate', address: loc.address, radius: loc.radius || 100 })}
              className="accent-primary-600"
            />
            {t.locationType.coordinate}
          </label>
        </div>

        {loc.type === 'geofence' ? (
          <select 
            className={`${selectClass} ${error ? 'border-red-500' : ''}`}
            value={loc.geofenceId || ''}
            onChange={(e) => onChange({ ...loc, geofenceId: e.target.value })}
          >
            <option value="" disabled>{t.geofencePlaceholder}</option>
            {geofences.map(gf => (
              <option key={gf.id} value={gf.id}>{gf.name}</option>
            ))}
          </select>
        ) : (
          <div className="space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-md p-3 bg-white dark:bg-neutral-900 shadow-sm">
            <Input 
              placeholder={t.addressPlaceholder} 
              value={loc.address || ''} 
              onChange={(e) => onChange({ ...loc, address: e.target.value })}
              className="h-8 text-xs"
            />
            <div className="flex gap-2 items-center">
              <Button 
                variant={isSelecting ? "primary" : "outline"} 
                size="sm" 
                onClick={() => toggleLocationSelectMode(targetId)}
                className={`h-8 w-8 p-0 shrink-0 ${isSelecting ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                title={isSelecting ? "Batal Pilih (Kembali ke Normal)" : "Pilih dari Peta"}
              >
                <MapPin className="w-4 h-4" />
              </Button>
              <div className="flex gap-2 flex-1">
                <Input 
                  type="number" 
                  placeholder={t.latPlaceholder} 
                  value={loc.latitude || ''} 
                  onChange={(e) => onChange({ ...loc, latitude: e.target.value ? Number(e.target.value) : undefined })}
                  className={`h-8 text-xs w-full ${error ? 'border-red-500' : ''}`}
                />
                <Input 
                  type="number" 
                  placeholder={t.lngPlaceholder} 
                  value={loc.longitude || ''} 
                  onChange={(e) => onChange({ ...loc, longitude: e.target.value ? Number(e.target.value) : undefined })}
                  className={`h-8 text-xs w-full ${error ? 'border-red-500' : ''}`}
                />
                <Input 
                  type="number" 
                  placeholder="Rad (m)" 
                  title="Radius Toleransi (meter)"
                  value={loc.radius || ''} 
                  onChange={(e) => onChange({ ...loc, radius: e.target.value ? Number(e.target.value) : undefined })}
                  className={`h-8 text-xs w-[65px] shrink-0 ${error ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
      </div>
    );
  };

  // Create a temporary route object to pass to the Map so it can preview current state
  const tempRoute: Route = {
    id: initialData?.id || 'temp',
    name,
    origin,
    destination,
    stops,
    status,
    createdAt: '',
    updatedAt: '',
    plannedPath: editorGeometry || undefined
  };

  return (
    <div className="flex h-full w-full flex-col bg-background relative">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Side: Map Preview */}
        <div className="flex-1 relative z-0">
          <RouteMap
            geofences={geofences}
            selectedRoute={tempRoute}
            editorMode={editorMode}
            editorGeometry={editorGeometry}
            onEditorGeometryChange={setEditorGeometry}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Right Side: Editor Panel */}
        <div className="w-[380px] lg:w-[420px] h-full flex flex-col bg-white dark:bg-neutral-950 border-l border-border z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-3 border-b border-border flex justify-between items-center bg-white dark:bg-neutral-900 shrink-0">
            <h3 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              {initialData ? t.editTitle : t.createTitle}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#fafafa] dark:bg-neutral-950">
            {/* Basic Info */}
            <div className="space-y-2.5 bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-border">
              <div>
                <Label className="text-xs font-semibold">{t.name} <span className="text-red-500">*</span></Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder={t.namePlaceholder}
                  className={`mt-1.5 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label className="text-xs font-semibold">{t.description}</Label>
                <Input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder={t.descriptionPlaceholder}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Route Points */}
            <div className="space-y-3 p-2.5 rounded-lg border border-border bg-white dark:bg-neutral-900 relative">
              <div className="absolute left-[19px] top-[26px] bottom-[26px] w-0.5 bg-neutral-200 dark:bg-neutral-800" />
              
              <div className="relative z-10 bg-white dark:bg-neutral-900">
                <Label className="font-semibold text-xs text-blue-600 dark:text-blue-400">{t.origin}</Label>
                {renderLocationPicker('origin', origin, setOrigin, errors.origin)}
              </div>

              {/* Stops */}
              <div className="space-y-2.5 relative z-10">
                <div className="flex justify-between items-center bg-white dark:bg-neutral-900">
                  <Label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">{t.stops}</Label>
                </div>
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex gap-2 items-start p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-[#fafafa] dark:bg-neutral-950 relative">
                    <div className="w-5 pt-1 text-[10px] font-bold text-neutral-400 text-center shrink-0">{index + 1}</div>
                    <div className="flex-1">
                      {renderLocationPicker(stop.id as any, stop.location, (loc) => handleUpdateStopLocation(stop.id, loc))}
                    </div>
                    <Button variant="ghost" onClick={() => handleRemoveStop(stop.id)} className="h-6 w-6 p-0 text-neutral-400 hover:text-red-500 absolute top-1.5 right-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddStop} className="mt-2 text-[10px] h-7 bg-white">
                  <Plus className="w-3 h-3 mr-1" />
                  {t.addStop}
                </Button>
              </div>

              <div className="relative z-10 bg-white dark:bg-neutral-900 pt-2">
                <Label className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">{t.destination}</Label>
                {renderLocationPicker('destination', destination, setDestination, errors.destination)}
              </div>
            </div>

            {/* Path Drawing */}
            <div className="space-y-2 p-2.5 rounded-lg border border-border bg-white dark:bg-neutral-900">
              <Label className="text-[11px] font-semibold">{t.drawPath}</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant={editorMode === 'draw_multiline' ? 'primary' : 'outline'} 
                  onClick={() => {
                    setEditorMode(editorMode === 'draw_multiline' ? 'idle' : 'draw_multiline');
                    setActiveLocationTarget(null);
                  }} 
                  className="w-full justify-center"
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  {editorMode === 'draw_multiline' ? 'Selesai Menggambar' : (editorGeometry ? 'Ubah Jalur' : 'Gambar Jalur (Multiline)')}
                </Button>
                {editorGeometry && (
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 px-3" onClick={() => { setEditorGeometry(null); setEditorMode('idle'); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-neutral-500">{t.pathInstructions}</p>
            </div>

            {/* Estimations & Status */}
            <div className="space-y-2.5 p-2.5 rounded-lg border border-border bg-white dark:bg-neutral-900">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <Label className="text-xs font-semibold">{t.estimatedDistance}</Label>
                  <Input 
                    type="number" 
                    value={plannedDistance || ''} 
                    onChange={(e) => setPlannedDistance(e.target.value ? Number(e.target.value) : undefined)} 
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">{t.estimatedDuration}</Label>
                  <Input 
                    type="number" 
                    value={estimatedDuration || ''} 
                    onChange={(e) => setEstimatedDuration(e.target.value ? Number(e.target.value) : undefined)} 
                    className="mt-1.5"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Label className="text-xs font-semibold">Status</Label>
                <select 
                  className={`${selectClass} mt-1.5`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active'|'inactive')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Full-Width Footer */}
      <div className="flex shrink-0 items-center justify-between px-6 py-3 bg-background border-t border-border/40 z-20">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {initialData ? t.editTitle : t.createTitle}
          </span>
          <span className="text-xs text-foreground-muted mt-0.5">
            Mohon isi data dengan benar.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} className="bg-background">
            {t.cancel}
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            size="sm" 
            onClick={handleSave} 
            className="min-w-[100px]"
          >
            {t.save}
          </Button>
        </div>
      </div>
    </div>
  );
}
