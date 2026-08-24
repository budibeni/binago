'use client';

import React, { createContext, useContext, useState } from 'react';
import { ShareSession, ShareSessionStatus } from '../types';
import { shareService } from '@/data/services/shareService';

interface ShareLocationContextValue {
  sessions: ShareSession[];
  /** Get the active session for a vehicle (if any) */
  getActiveSession: (vehicleId: string) => ShareSession | undefined;
  /** Create a new sharing session for a vehicle */
  createSession: (vehicleId: string, durationHours: number) => ShareSession;
  /** Revoke an active session */
  revokeSession: (sessionId: string) => void;
  /** Resolve a public token to a session (used by public page) */
  resolveToken: (token: string) => ShareSession | undefined;
}

const ShareLocationContext = createContext<ShareLocationContextValue | undefined>(undefined);

export function ShareLocationProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ShareSession[]>(shareService.getInitialSessions());

  const getActiveSession = (vehicleId: string): ShareSession | undefined => {
    const now = Date.now();
    return sessions.find(
      (s) =>
        s.vehicleId === vehicleId &&
        s.status === 'active' &&
        new Date(s.expiresAt).getTime() > now,
    );
  };

  const createSession = (vehicleId: string, durationHours: number): ShareSession => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
    const newSession: ShareSession = {
      id: `share-${Date.now()}`,
      vehicleId,
      token: shareService.generateToken(),
      durationHours,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'active',
    };
    setSessions((prev) => [...prev, newSession]);
    return newSession;
  };

  const revokeSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'revoked' as ShareSessionStatus } : s)),
    );
  };

  const resolveToken = (token: string): ShareSession | undefined => {
    return sessions.find((s) => s.token === token);
  };

  return (
    <ShareLocationContext.Provider
      value={{ sessions, getActiveSession, createSession, revokeSession, resolveToken }}
    >
      {children}
    </ShareLocationContext.Provider>
  );
}

export function useShareLocation() {
  const ctx = useContext(ShareLocationContext);
  if (!ctx) throw new Error('useShareLocation must be used within ShareLocationProvider');
  return ctx;
}
