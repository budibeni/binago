'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

export type TrackingViewMode = 'map' | 'table' | 'notification';
export type TrackingMapMode = 'live' | 'playback' | 'heatmap' | 'parking' | 'mileage' | 'speed';

export interface TrackingTourState {
  view: TrackingViewMode;
  mode: TrackingMapMode;
}

export interface TrackingTourContextValue {
  trackingState: TrackingTourState;
  setTrackingState: (state: TrackingTourState) => void;
  setView: (view: TrackingViewMode) => void;
  setMode: (mode: TrackingMapMode) => void;
}

const TrackingTourContext = createContext<TrackingTourContextValue | null>(null);

export function TrackingTourProvider({ children }: { children: React.ReactNode }) {
  const [trackingState, setTrackingStateInternal] = useState<TrackingTourState>({
    view: 'map',
    mode: 'live',
  });

  const setTrackingState = React.useCallback((newState: TrackingTourState) => {
    setTrackingStateInternal((prev) => {
      if (prev.view === newState.view && prev.mode === newState.mode) {
        return prev;
      }
      return newState;
    });
  }, []);

  const setView = React.useCallback((view: TrackingViewMode) => {
    setTrackingStateInternal((prev) => {
      if (prev.view === view) return prev;
      return { ...prev, view };
    });
  }, []);

  const setMode = React.useCallback((mode: TrackingMapMode) => {
    setTrackingStateInternal((prev) => {
      if (prev.mode === mode) return prev;
      return { ...prev, mode };
    });
  }, []);

  const value = useMemo<TrackingTourContextValue>(() => ({
    trackingState,
    setTrackingState,
    setView,
    setMode,
  }), [trackingState, setTrackingState, setView, setMode]);

  return (
    <TrackingTourContext.Provider value={value}>
      {children}
    </TrackingTourContext.Provider>
  );
}

export function useTrackingTour() {
  return useContext(TrackingTourContext);
}
