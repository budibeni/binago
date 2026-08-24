'use client';

import React, { useState, useEffect } from 'react';
import { Hexagon, Square, Waypoints, MapPin, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@adatrack/ui';
import { geofenceService } from '@/data/services';
import { GeofenceMap } from './GeofenceMap';
import type { Geofence } from '../types';
import type { MapGeometry } from '@adatrack/maps';
import { type GeofenceLocale, getGeofencesTranslation } from '../i18n';

interface GeofenceEditorViewProps {
  geofence: Geofence | null;
  onCancel: () => void;
  onSave: (data: Partial<Geofence>) => void;
  locale?: GeofenceLocale;
}

export function GeofenceEditorView({
  geofence,
  onCancel,
  onSave,
  locale = 'id',
}: GeofenceEditorViewProps) {
  const t = getGeofencesTranslation(locale);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [formData, setFormData] = useState({
    name: geofence?.name || '',
    groupId: geofence?.groupId || '',
    description: geofence?.description || '',
    status: geofence?.status || 'active',
  });

  const [drawMode, setDrawMode] = useState<'polygon' | 'rectangle' | 'multiline'>('polygon');
  const [editorMode, setEditorMode] = useState<'idle' | 'draw_polygon' | 'draw_rectangle' | 'draw_multiline' | 'edit'>('idle');
  const [currentGeometry, setCurrentGeometry] = useState<MapGeometry | null>(geofence?.geometry || null);

  useEffect(() => {
    if (editorMode !== 'idle' || !currentGeometry) {
      setEditorMode(`draw_${drawMode}` as any);
    }
  }, [drawMode]);

  const handleSave = () => {
    onSave({
      ...formData,
      status: formData.status as 'active' | 'inactive',
      geometry: currentGeometry ?? geofence?.geometry,
    });
  };

  const isGeometryValid = !!currentGeometry;
  const isFormValid = !!formData.name && isGeometryValid;

  return (
    <div className="flex h-full w-full flex-col bg-background relative">
      <div className="flex flex-1 overflow-hidden relative">

        {/* Middle Panel - Map */}
        <div className="relative flex-1 bg-neutral-100 dark:bg-neutral-900">
          <GeofenceMap
            geofences={[]}
            editorMode={editorMode}
            editorGeometry={currentGeometry}
            onEditorGeometryChange={(geom) => {
              setCurrentGeometry(geom);
              if (geom) setEditorMode('edit');
            }}
          />
        </div>

        {/* Floating Left Panel - Form */}
        <div className={cn(
          "absolute left-4 top-4 w-[320px] bg-background rounded-xl shadow-lg border border-border flex flex-col z-20 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[calc(100%-32px)]" : "max-h-[44px]"
        )}>
          {/* Header */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface cursor-pointer hover:bg-surface-hover shrink-0"
          >
            <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">{t.geofenceDetail}</h3>
            <button className="text-foreground-muted hover:text-foreground">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">{t.geofenceName} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.geofenceNamePlaceholder}
                  className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">{t.geofenceGroup}</label>
                <Select value={formData.groupId} onValueChange={(val) => setFormData({ ...formData, groupId: val === 'none' ? '' : val })}>
                  <SelectTrigger className="h-8 text-xs px-2.5">
                    <SelectValue placeholder={t.selectGroup} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs text-foreground-muted italic">-- {t.unassigned} --</SelectItem>
                    {geofenceService.getGeofenceGroups().map(group => (
                      <SelectItem key={group.id} value={group.id} className="text-xs">
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground">{t.geofenceType} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-1.5">
                  <div
                    onClick={() => { setDrawMode('polygon'); setEditorMode('draw_polygon'); setCurrentGeometry(null); }}
                    className={cn(
                      "flex flex-col gap-1 rounded-md border p-1.5 cursor-pointer transition-all bg-background",
                      drawMode === 'polygon' ? "border-red-500 ring-1 ring-red-500" : "border-border hover:border-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <Hexagon className={cn("h-3 w-3", drawMode === 'polygon' ? "text-red-500" : "text-neutral-500")} />
                      Polygon
                    </div>
                  </div>
                  <div
                    onClick={() => { setDrawMode('rectangle'); setEditorMode('draw_rectangle'); setCurrentGeometry(null); }}
                    className={cn(
                      "flex flex-col gap-1 rounded-md border p-1.5 cursor-pointer transition-all bg-background",
                      drawMode === 'rectangle' ? "border-blue-500 ring-1 ring-blue-500" : "border-border hover:border-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <Square className={cn("h-3 w-3", drawMode === 'rectangle' ? "text-blue-500" : "text-neutral-500")} />
                      Rectangle
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  <div
                    onClick={() => { setDrawMode('multiline'); setEditorMode('draw_multiline'); setCurrentGeometry(null); }}
                    className={cn(
                      "flex flex-col gap-1 rounded-md border p-1.5 cursor-pointer transition-all bg-background",
                      drawMode === 'multiline' ? "border-emerald-500 ring-1 ring-emerald-500" : "border-border hover:border-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <Waypoints className={cn("h-3 w-3", drawMode === 'multiline' ? "text-emerald-500" : "text-neutral-500")} />
                      Multiline
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground">{t.status} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setFormData({ ...formData, status: 'active' })}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-md border py-1 text-[11px] font-semibold transition-all bg-background",
                      formData.status === 'active' ? "border-red-500 text-red-600 ring-1 ring-red-500" : "border-border text-neutral-500 hover:border-neutral-300"
                    )}
                  >
                    {t.active}
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, status: 'inactive' })}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-md border py-1 text-[11px] font-semibold transition-all bg-background",
                      formData.status === 'inactive' ? "border-foreground text-foreground ring-1 ring-foreground" : "border-border text-neutral-500 hover:border-neutral-300"
                    )}
                  >
                    {t.inactive}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">{t.description}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.descriptionPlaceholder}
                  rows={2}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground">{t.areaInformation}</h3>
                {isGeometryValid && (
                  <button
                    onClick={() => {
                      setCurrentGeometry(null);
                      setEditorMode(`draw_${drawMode}` as any);
                    }}
                    className="flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t.resetImage}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-foreground-muted">{t.pointCount}</span>
                  <span className="font-semibold">{currentGeometry?.type === 'polygon' ? (currentGeometry.coordinates?.length || 0) : '-'}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-foreground-muted">{t.areaSize}</span>
                  <span className="font-semibold">{currentGeometry ? '12.45 km²' : '-'}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-foreground-muted">{t.perimeter}</span>
                  <span className="font-semibold">{currentGeometry ? '8.2 km' : '-'}</span>
                </div>

                {isGeometryValid && currentGeometry?.coordinates && currentGeometry.coordinates.length > 0 && (
                  <div className="pt-2 space-y-1.5 border-t border-border/50">
                    <button
                      onClick={() => setShowCoordinates(!showCoordinates)}
                      className="flex items-center justify-between w-full text-[11px] font-semibold text-foreground hover:text-foreground-muted transition-colors"
                    >
                      <span>{t.coordinatesList}</span>
                      {showCoordinates ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {showCoordinates && (
                      <div className="max-h-32 overflow-y-auto rounded-md border border-border bg-surface p-2 space-y-1">
                        {currentGeometry.coordinates.map((coord, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px]">
                            <span className="text-foreground-muted w-6">P{idx + 1}</span>
                            <span className="font-mono text-foreground">{coord.lat.toFixed(5)}, {coord.lng.toFixed(5)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Full-Width Footer */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4 bg-background border-t border-border/40 z-20">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {geofence ? t.edit : t.addGeofence}
          </span>
          <span className="text-xs text-foreground-muted mt-0.5">
            {t.fillCorrectly}
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
            disabled={!isFormValid}
            className="bg-danger hover:bg-danger/90 text-white min-w-[100px]"
          >
            {t.save}
          </Button>
        </div>
      </div>
    </div>
  );
}
