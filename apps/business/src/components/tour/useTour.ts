'use client';

import { useCallback, useEffect, useRef } from 'react';
import { driver, type Driver, type DriveStep, type Config } from 'driver.js';
import './tour-theme.css';
import type { Locale } from '@adatrack/types';

export interface UseTourOptions {
  tourId: string;
  steps: DriveStep[];
  locale?: Locale;
  autoStart?: boolean;
  autoStartDelay?: number;
  onComplete?: () => void;
}

const STORAGE_PREFIX = 'adatrack_tour_seen_';

export function useTour({
  tourId,
  steps,
  locale = 'id',
  autoStart = false,
  autoStartDelay = 1000,
  onComplete,
}: UseTourOptions) {
  const driverInstanceRef = useRef<Driver | null>(null);
  const isEn = locale === 'en';

  const storageKey = `${STORAGE_PREFIX}${tourId}`;

  const isTourSeen = useCallback((): boolean => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  }, [storageKey]);

  const setTourSeen = useCallback((seen: boolean = true) => {
    if (typeof window === 'undefined') return;
    try {
      if (seen) {
        localStorage.setItem(storageKey, 'true');
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const startTour = useCallback((customSteps?: DriveStep[], fromIndex: number = 0) => {
    if (typeof window === 'undefined') return;

    if (driverInstanceRef.current) {
      driverInstanceRef.current.destroy();
    }

    const activeSteps = customSteps || steps;

    const config: Config = {
      steps: activeSteps,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      stagePadding: 6,
      stageRadius: 8,
      showProgress: true,
      progressText: isEn ? '{{current}} of {{total}}' : '{{current}} dari {{total}}',
      nextBtnText: isEn ? 'Next' : 'Lanjut',
      prevBtnText: isEn ? 'Back' : 'Kembali',
      doneBtnText: isEn ? 'Finish' : 'Selesai',
      onDestroyed: () => {
        // Only mark the main tour seen if it was the main steps
        if (!customSteps) {
          setTourSeen(true);
        }
        onComplete?.();
      },
    };

    const d = driver(config);
    driverInstanceRef.current = d;
    d.drive(fromIndex);
  }, [steps, isEn, setTourSeen, onComplete]);

  // Handle auto-start on first visit
  useEffect(() => {
    if (!autoStart) return;

    const seen = isTourSeen();
    if (seen) return;

    const timer = setTimeout(() => {
      startTour();
    }, autoStartDelay);

    return () => clearTimeout(timer);
  }, [autoStart, autoStartDelay, isTourSeen, startTour]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (driverInstanceRef.current) {
        driverInstanceRef.current.destroy();
      }
    };
  }, []);

  return {
    startTour,
    isTourSeen,
    resetTour: () => setTourSeen(false),
  };
}
