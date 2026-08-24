'use client';

import React, { useState } from 'react';
import { Share2, CheckCircle2, Copy, Car, Clock } from 'lucide-react';
import { Button, Dialog } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { TrackingVehicle } from '../../tracking/types/tracking';
import { ShareSession } from '../types';
import { useShareLocation } from '../context/ShareLocationContext';
import { getTranslation } from '../../../../i18n';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';

const DURATION_OPTIONS = [1, 2, 4, 8, 24] as const;
type Duration = (typeof DURATION_OPTIONS)[number];

const PUBLIC_BASE_URL = typeof window !== 'undefined' ? `${window.location.origin}/share` : '/share';

interface ShareLocationDialogProps {
  vehicle: TrackingVehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'select' | 'success' | 'manage';

export function ShareLocationDialog({ vehicle, open, onOpenChange }: ShareLocationDialogProps) {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const ls = t.locationSharing;

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
          title: `${vehicle.vehicleType} - ADATRACK`,
          text: ls.sharedBy,
          url: shareUrl,
        });
      } catch {
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
      handleOpen(false); // Close dialog completely
    }
  };

  const formatCountdown = (expiresAt: string): string => {
    const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h} ${locale === 'id' ? 'jam' : 'hrs'} ${m} ${locale === 'id' ? 'mnt' : 'mins'}`;
  };

  const renderVehicleHeader = () => (
    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
      <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
        <Share2 className="w-5 h-5" />
      </div>
      <div>
        <p className="font-bold text-foreground text-[14px] leading-tight">{vehicle.vehicleType}</p>
        <p className="text-[12px] font-medium text-foreground-muted mt-0.5">{vehicle.plateNumber}</p>
      </div>
    </div>
  );

  const renderLinkBox = () => (
    <div className="flex items-center gap-2 p-2 pl-3 bg-surface-elevated rounded-xl border border-border">
      <span className="text-[12px] text-foreground-muted font-mono flex-1 min-w-0 truncate select-all">{shareUrl}</span>
      <button
        type="button"
        onClick={handleCopyLink}
        className={cn(
          "shrink-0 h-8 px-2.5 rounded-lg flex items-center justify-center transition-colors text-[11px] font-bold uppercase",
          copied ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-neutral-100 dark:bg-neutral-800 text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700"
        )}
      >
        {copied ? ls.linkCopied || 'Tersalin' : ls.copyLink || 'Salin'}
      </button>
    </div>
  );

  if (showStopConfirm) {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpen}
        title={ls.stopSharingTitle}
      >
        <div className="pt-2 flex flex-col gap-4">
          <p className="text-[13px] text-foreground">
            {ls.stopSharingDesc} <strong>{vehicle.vehicleType}</strong>
          </p>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" className="rounded-xl px-5 py-2 h-auto text-[13px]" onClick={() => setShowStopConfirm(false)}>{ls.cancel}</Button>
            <Button variant="destructive" className="rounded-xl px-5 py-2 h-auto text-[13px]" onClick={handleStopSharing}>{ls.confirmStop}</Button>
          </div>
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
        <div className="pt-2">
          {renderVehicleHeader()}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-foreground">{ls.chooseDuration}</span>
              <span className="text-[12px] font-semibold text-red-600 dark:text-red-400">{selectedDuration} {locale === 'id' ? 'Jam' : 'Hrs'}</span>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-[12px] border border-neutral-200 dark:border-neutral-800">
              {DURATION_OPTIONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelectedDuration(h)}
                  className={cn(
                    'flex-1 py-1.5 text-[13px] font-semibold rounded-[8px] transition-all duration-200',
                    selectedDuration === h
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                  )}
                >
                  {h}{locale === 'id' ? 'j' : 'h'}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full rounded-xl font-bold py-3 h-auto text-[14px] shadow-sm bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700" onClick={handleCreate}>
            {ls.create}
          </Button>
        </div>
      </Dialog>
    );
  }

  if (step === 'success' && currentSession) {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpen}
        title={ls.shareLocationTitle}
      >
        <div className="pt-2">
          {renderVehicleHeader()}

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 text-green-800 dark:text-green-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500 mt-0.5" />
              <div>
                <p className="text-[13px] font-bold">{ls.locationShared}</p>
                <p className="text-[12px] mt-0.5 opacity-90 leading-snug">{ls.linkActive} {currentSession.durationHours} {locale === 'id' ? 'jam' : 'hrs'}</p>
              </div>
            </div>

            {renderLinkBox()}
          </div>

          <Button className="w-full rounded-xl font-bold py-3 h-auto text-[14px] gap-2 shadow-sm bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
            {ls.share}
          </Button>
        </div>
      </Dialog>
    );
  }

  if (step === 'manage' && activeSession) {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpen}
        title={ls.manageSharing}
      >
        <div className="pt-2">
          {renderVehicleHeader()}

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-blue-800 dark:text-blue-300">
              <Clock className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
              <div>
                <p className="text-[13px] font-bold">{ls.activeSharing}</p>
                <p className="text-[12px] mt-0.5 opacity-90 leading-snug">{ls.expiresIn}: {formatCountdown(activeSession.expiresAt)}</p>
              </div>
            </div>

            {renderLinkBox()}
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full rounded-xl font-bold py-3 h-auto text-[14px] gap-2 shadow-sm bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              {ls.share}
            </Button>
            <Button variant="ghost" className="w-full rounded-xl font-bold py-3 h-auto text-[14px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => setShowStopConfirm(true)}>
              {ls.stopSharing}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  return null;
}
