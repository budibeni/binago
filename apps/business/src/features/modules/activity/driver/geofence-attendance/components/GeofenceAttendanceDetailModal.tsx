'use client';

import React, { useState } from 'react';
import {
  Dialog,
  Badge,
  Button,
} from '@adatrack/ui';
import {
  User,
  Truck,
  Phone,
  Clock,
  MapPin,
  MapPinned,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Maximize2,
  Building2,
} from 'lucide-react';
import type { GeofenceAttendanceRecord } from '../types/geofenceAttendance';
import { getGeofenceAttendanceTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';

interface GeofenceAttendanceDetailModalProps {
  record: GeofenceAttendanceRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: Locale;
}

export function GeofenceAttendanceDetailModal({
  record,
  open,
  onOpenChange,
  locale = 'id',
}: GeofenceAttendanceDetailModalProps) {
  const t = getGeofenceAttendanceTranslation(locale);
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; title: string } | null>(null);

  if (!record) return null;

  const isInside = record.isWithinGeofence;

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return (
      d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title={`${t.detail.title} — ${record.id}`}
        description={t.detail.subtitle}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-5 pt-2">
          {/* Header Summary Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/40 p-3.5 rounded-xl border border-border">
            {/* Driver Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-none font-bold text-xs">
                {record.driverName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {t.detail.driverInfo}
                </span>
                <p className="font-bold text-sm text-foreground truncate">{record.driverName}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{record.driverPhone}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-none">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {t.detail.vehicleInfo}
                </span>
                <span className="font-mono font-bold text-xs text-foreground bg-background px-1.5 py-0.5 rounded border border-border inline-block">
                  {record.vehiclePlate}
                </span>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {record.vehicleModel || 'Armada Logistik'}
                </p>
              </div>
            </div>
          </div>

          {/* Geofence & Location Card */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-none">
                  <MapPinned className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{record.geofenceName}</h4>
                  <span className="text-[11px] text-muted-foreground">
                    Kategori: {record.geofenceCategory}
                  </span>
                </div>
              </div>
              <Badge variant={isInside ? 'success' : 'warning'} dot className="text-xs self-start sm:self-auto">
                {isInside ? t.status.inside : t.status.warning}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t.detail.time}
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  {formatDateTime(record.timestamp)}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {t.detail.distance}
                </span>
                <div className="flex items-center gap-1.5 font-bold mt-0.5">
                  <span className={isInside ? 'text-emerald-600' : 'text-amber-600'}>
                    {record.distanceMeters} Meter
                  </span>
                  <span className="text-[10px] font-normal text-muted-foreground">
                    ({isInside ? t.detail.safeDistance : t.detail.warningDistance})
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {t.detail.location}
                </span>
                <p className="text-foreground mt-0.5 leading-relaxed">
                  {record.locationAddress}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  {record.coordinates.lat.toFixed(5)}, {record.coordinates.lng.toFixed(5)}
                </p>
              </div>
            </div>

            {/* Google Maps External Link */}
            <a
              href={`https://www.google.com/maps?q=${record.coordinates.lat},${record.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t.detail.openInMaps}
            </a>
          </div>

          {/* Watermarked Photo Section */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Foto Selfie Presensi Watermark
            </span>
            <div
              onClick={() =>
                setPreviewPhoto({
                  src: record.photo,
                  title: `${record.geofenceName} — ${record.driverName}`,
                })
              }
              className="group relative cursor-pointer aspect-video max-h-60 bg-black/90 rounded-lg overflow-hidden border border-border flex items-center justify-center hover:ring-2 hover:ring-primary transition-all"
            >
              <img
                src={record.photo}
                alt="Selfie Absen Geofence"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium">
                <Maximize2 className="w-4 h-4" />
                <span>{t.detail.previewPhoto}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="bg-muted/30 border border-border rounded-xl p-3.5 text-xs">
              <span className="font-semibold text-muted-foreground block mb-0.5">
                {t.detail.notes}:
              </span>
              <p className="text-foreground leading-relaxed">{record.notes}</p>
            </div>
          )}

          {/* Footer Close */}
          <div className="flex justify-end pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t.detail.close}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Fullscreen Photo Modal */}
      {previewPhoto && (
        <Dialog
          open={!!previewPhoto}
          onOpenChange={(open) => !open && setPreviewPhoto(null)}
          title={previewPhoto.title}
          className="max-w-xl p-4"
        >
          <div className="space-y-4 pt-2">
            <div className="bg-black rounded-lg overflow-hidden border border-border flex items-center justify-center">
              <img
                src={previewPhoto.src}
                alt={previewPhoto.title}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setPreviewPhoto(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
