'use client';

import React, { useState } from 'react';
import { Share2, Car, Clock, CheckCircle2, Copy, X } from 'lucide-react';
import { Button, Dialog } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { Vehicle } from '../../tracking/types';
import { ShareSession } from '../types';
import { useShareLocation } from '../context/ShareLocationContext';
import { getTranslation } from '@/i18n';
import { usePersonalLocale } from '@/components/PersonalShellLayout';

const DURATION_OPTIONS = [1, 2, 4, 8, 24] as const;
type Duration = (typeof DURATION_OPTIONS)[number];

const PUBLIC_BASE_URL = typeof window !== 'undefined' ? `${window.location.origin}/share` : '/share';

interface ShareLocationDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'select' | 'success' | 'manage';

export function ShareLocationDialog({ vehicle, open, onOpenChange }: ShareLocationDialogProps) {
  const locale = usePersonalLocale();
  const ls = getTranslation(locale).locationSharing;
  const t = getTranslation(locale);

  const { getActiveSession, createSession, revokeSession } = useShareLocation();

  const [step, setStep] = useState<Step>(() => {
    const active = getActiveSession(vehicle.id);
    return active ? 'manage' : 'select';
  });

  const [selectedDuration, setSelectedDuration] = useState<Duration>(4);
  const [createdSession, setCreatedSession] = useState<ShareSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const activeSession = getActiveSession(vehicle.id);
  const currentSession = createdSession || activeSession;

  const shareUrl = currentSession ? `${PUBLIC_BASE_URL}/${currentSession.token}` : '';

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setCopied(false);
      setShowStopConfirm(false);
      const active = getActiveSession(vehicle.id);
      setStep(active ? 'manage' : 'select');
    }
    onOpenChange(isOpen);
  };

  const handleCreate = () => {
    const session = createSession(vehicle.id, selectedDuration);
    setCreatedSession(session);
    setStep('success');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select text
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name || vehicle.type} — ADATRACK`,
          text: ls.sharedBy,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed — fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleStopSharing = () => {
    const session = activeSession || createdSession;
    if (session) {
      revokeSession(session.id);
      setCreatedSession(null);
      setShowStopConfirm(false);
      setStep('select');
    }
  };

  const getDurationLabel = (h: Duration): string => {
    const labels: Record<Duration, string> = {
      1: ls.duration1h,
      2: ls.duration2h,
      4: ls.duration4h,
      8: ls.duration8h,
      24: ls.duration24h,
    };
    return labels[h];
  };

  const formatCountdown = (expiresAt: string): string => {
    const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const renderVehicleChip = () => (
    <div className="flex items-center gap-3 p-3 bg-surface-elevated rounded-xl border border-border">
      <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0">
        <Car className="w-5 h-5" />
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm leading-none">{vehicle.name || vehicle.type}</p>
        <p className="text-xs text-foreground-muted mt-1">{vehicle.plateNumber}</p>
      </div>
    </div>
  );

  if (showStopConfirm) {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpen}
        title={ls.stopSharingTitle}
        description={ls.stopSharingDesc}
      >
        {renderVehicleChip()}
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setShowStopConfirm(false)}>{ls.cancel}</Button>
          <Button variant="destructive" onClick={handleStopSharing}>{ls.confirmStop}</Button>
        </div>
      </Dialog>
    );
  }

  if (step === 'select') {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpen}
        title={ls.shareLocationTitle}
      >
        <div className="flex flex-col gap-4">
          {renderVehicleChip()}

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">{ls.chooseDuration}</p>
            <div className="grid grid-cols-5 gap-2">
              {DURATION_OPTIONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelectedDuration(h)}
                  className={cn(
                    'flex flex-col items-center justify-center py-3 px-1 rounded-xl border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                    selectedDuration === h
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                      : 'border-border bg-surface-elevated text-foreground hover:border-red-200 dark:hover:border-red-800',
                  )}
                  aria-pressed={selectedDuration === h}
                  aria-label={getDurationLabel(h)}
                >
                  <Clock className="w-4 h-4 mb-1 opacity-70" />
                  <span className="text-xs font-bold">{h}j</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-foreground-muted mt-2">{ls.duration1h} — {ls.duration24h}</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => handleOpen(false)}>{ls.cancel}</Button>
            <Button variant="primary" onClick={handleCreate} className="gap-2">
              <Share2 className="w-4 h-4" />
              {ls.create}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  if (step === 'success' && currentSession) {
    const expiresInLabel = `${currentSession.durationHours} ${currentSession.durationHours === 1 ? getDurationLabel(1) : getDurationLabel(currentSession.durationHours as Duration)}`;

    return (
      <Dialog
        open={open}
        onOpenChange={handleOpen}
        title={ls.locationShared}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{ls.locationShared}</p>
              <p className="text-xs mt-0.5">{ls.linkActive} {expiresInLabel}</p>
            </div>
          </div>

          {renderVehicleChip()}

          {/* URL Display */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-elevated border border-border">
            <span className="text-xs text-foreground-muted font-mono break-all flex-1 min-w-0 truncate">{shareUrl}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="shrink-0 p-1.5 rounded-md hover:bg-surface transition-colors"
              aria-label={ls.copyLink}
            >
              {copied
                ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                : <Copy className="w-4 h-4 text-foreground-muted" />
              }
            </button>
          </div>
          {copied && <p className="text-xs text-green-600 dark:text-green-400 -mt-2">{ls.linkCopied}</p>}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCopyLink} className="flex-1 gap-2">
              <Copy className="w-4 h-4" />
              {ls.copyLink}
            </Button>
            <Button variant="primary" onClick={handleShare} className="flex-1 gap-2">
              <Share2 className="w-4 h-4" />
              {ls.share}
            </Button>
          </div>

          <Button variant="ghost" onClick={() => handleOpen(false)} className="gap-2 text-foreground-muted">
            <X className="w-4 h-4" />
            {ls.close}
          </Button>
        </div>
      </Dialog>
    );
  }

  // step === 'manage' — active sharing already exists
  if (step === 'manage' && activeSession) {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpen}
        title={ls.manageSharing}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400">
            <Share2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{ls.activeSharing}</p>
              <p className="text-xs mt-0.5">{ls.expiresIn}: {formatCountdown(activeSession.expiresAt)}</p>
            </div>
          </div>

          {renderVehicleChip()}

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-elevated border border-border">
            <span className="text-xs text-foreground-muted font-mono flex-1 min-w-0 truncate">
              {`${PUBLIC_BASE_URL}/${activeSession.token}`}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="shrink-0 p-1.5 rounded-md hover:bg-surface transition-colors"
              aria-label={ls.copyLink}
            >
              {copied
                ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                : <Copy className="w-4 h-4 text-foreground-muted" />
              }
            </button>
          </div>
          {copied && <p className="text-xs text-green-600 dark:text-green-400 -mt-2">{ls.linkCopied}</p>}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCopyLink} className="flex-1 gap-2">
              <Copy className="w-4 h-4" />
              {ls.copyLink}
            </Button>
            <Button variant="primary" onClick={handleShare} className="flex-1 gap-2">
              <Share2 className="w-4 h-4" />
              {ls.share}
            </Button>
          </div>

          <Button
            variant="destructive"
            onClick={() => setShowStopConfirm(true)}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            {ls.stopSharing}
          </Button>

          <Button variant="ghost" onClick={() => handleOpen(false)} className="text-foreground-muted">
            {t.common.back}
          </Button>
        </div>
      </Dialog>
    );
  }

  return null;
}
