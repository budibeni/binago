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
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  X,
  Maximize2,
  CheckCircle2,
  Hourglass,
} from 'lucide-react';
import type { TaskAttendanceRecord } from '../types/taskAttendance';
import { getTaskAttendanceTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';

interface TaskAttendanceDetailModalProps {
  record: TaskAttendanceRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: Locale;
}

export function TaskAttendanceDetailModal({
  record,
  open,
  onOpenChange,
  locale = 'id',
}: TaskAttendanceDetailModalProps) {
  const t = getTaskAttendanceTranslation(locale);
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; title: string } | null>(null);

  if (!record) return null;

  const isCompleted = record.status === 'completed';

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title={`${t.detail.title} — ${record.id}`}
        description={t.detail.subtitle}
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-6 pt-2">
          {/* Header Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border border-border">
            {/* Driver Info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-none font-bold text-sm">
                {record.driverName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {t.detail.driverInfo}
                </span>
                <p className="font-bold text-sm text-foreground truncate">{record.driverName}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{record.driverPhone}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-none">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {t.detail.vehicleInfo}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-foreground bg-background px-1.5 py-0.5 rounded border border-border">
                    {record.vehiclePlate}
                  </span>
                  <Badge variant={isCompleted ? 'success' : 'info'} className="text-[11px]">
                    {isCompleted ? t.status.completed : t.status.inProgress}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{record.vehicleModel}</p>
              </div>
            </div>
          </div>

          {/* Timeline / 2-Columns Comparison: Mulai vs Selesai Tugas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MULAI TUGAS (CHECK-IN) */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <h4 className="font-bold text-sm text-foreground">{t.detail.checkInTitle}</h4>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    Check-in
                  </span>
                </div>

                <div className="space-y-3 mt-3">
                  <div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.detail.time}
                    </span>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {formatDateTime(record.startTime)}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.detail.location}
                    </span>
                    <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                      {record.startLocation.address}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {record.startLocation.coordinates.lat.toFixed(5)},{' '}
                      {record.startLocation.coordinates.lng.toFixed(5)}
                    </p>
                  </div>

                  {/* Distance badge */}
                  <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-border text-xs">
                    <span className="text-muted-foreground">{t.detail.distance}:</span>
                    <div className="flex items-center gap-1 font-semibold text-emerald-600">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{record.startLocation.distanceMeters}m ({t.detail.safeDistance})</span>
                    </div>
                  </div>

                  {/* Watermarked Photo Preview */}
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1">
                      Foto Selfie Watermark:
                    </span>
                    <div
                      onClick={() =>
                        setPreviewPhoto({
                          src: record.startPhoto,
                          title: `${t.detail.checkInTitle} - ${record.driverName}`,
                        })
                      }
                      className="group relative cursor-pointer aspect-video bg-black/90 rounded-lg overflow-hidden border border-border flex items-center justify-center hover:ring-2 hover:ring-primary transition-all"
                    >
                      <img
                        src={record.startPhoto}
                        alt="Selfie Mulai Tugas"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium">
                        <Maximize2 className="w-4 h-4" />
                        <span>{t.detail.previewPhoto}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maps Link */}
              <a
                href={`https://www.google.com/maps?q=${record.startLocation.coordinates.lat},${record.startLocation.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t.detail.openInMaps}
              </a>
            </div>

            {/* SELESAI TUGAS (CHECK-OUT) */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isCompleted ? 'bg-green-500' : 'bg-amber-400'
                      }`}
                    />
                    <h4 className="font-bold text-sm text-foreground">{t.detail.checkOutTitle}</h4>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'text-green-600 bg-green-50 dark:bg-green-950'
                        : 'text-amber-600 bg-amber-50 dark:bg-amber-950'
                    }`}
                  >
                    {isCompleted ? 'Check-out' : 'Belum Selesai'}
                  </span>
                </div>

                {isCompleted && record.endLocation && record.endPhoto ? (
                  <div className="space-y-3 mt-3">
                    <div>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {t.detail.time}
                      </span>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {formatDateTime(record.endTime)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {t.detail.location}
                      </span>
                      <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                        {record.endLocation.address}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        {record.endLocation.coordinates.lat.toFixed(5)},{' '}
                        {record.endLocation.coordinates.lng.toFixed(5)}
                      </p>
                    </div>

                    {/* Distance badge */}
                    <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-border text-xs">
                      <span className="text-muted-foreground">{t.detail.distance}:</span>
                      <div className="flex items-center gap-1 font-semibold text-emerald-600">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{record.endLocation.distanceMeters}m ({t.detail.safeDistance})</span>
                      </div>
                    </div>

                    {/* Watermarked Photo Preview */}
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">
                        Foto Selfie Watermark:
                      </span>
                      <div
                        onClick={() =>
                          setPreviewPhoto({
                            src: record.endPhoto!,
                            title: `${t.detail.checkOutTitle} - ${record.driverName}`,
                          })
                        }
                        className="group relative cursor-pointer aspect-video bg-black/90 rounded-lg overflow-hidden border border-border flex items-center justify-center hover:ring-2 hover:ring-primary transition-all"
                      >
                        <img
                          src={record.endPhoto}
                          alt="Selfie Selesai Tugas"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium">
                          <Maximize2 className="w-4 h-4" />
                          <span>{t.detail.previewPhoto}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-muted/20 border border-dashed border-border rounded-lg mt-3">
                    <Hourglass className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                    <p className="text-xs font-semibold text-foreground">Sedang Bertugas</p>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-[220px]">
                      {t.detail.inProgressNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Maps Link if completed */}
              {isCompleted && record.endLocation && (
                <a
                  href={`https://www.google.com/maps?q=${record.endLocation.coordinates.lat},${record.endLocation.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t.detail.openInMaps}
                </a>
              )}
            </div>
          </div>

          {/* Bottom Duration & Notes Card */}
          <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">{t.detail.totalDuration}:</span>
              <span className="font-bold text-sm text-foreground bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                {isCompleted ? formatDuration(record.durationMinutes) : 'Sedang Berjalan...'}
              </span>
            </div>
            {record.notes && (
              <div className="pt-2 border-t border-border">
                <span className="text-[11px] text-muted-foreground block">{t.detail.systemNotes}:</span>
                <p className="text-xs text-foreground mt-0.5">{record.notes}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t.detail.close}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal Fullscreen Foto Watermark */}
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
