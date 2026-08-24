/**
 * Share Repository
 */

import type { ShareSession } from '@/features/core/sharing/types';
import { mockShareSessions } from '@/features/core/sharing/data/mockLocationSharing';

// --- Helpers -------------------------------------------------------------------

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// --- Repository Interface ------------------------------------------------------

export interface ShareRepository {
  getSessions(): ShareSession[];
  getByToken(token: string): ShareSession | undefined;
  getInitialSessions(): ShareSession[];
}

// --- Mock Repository Implementation -------------------------------------------

class MockShareRepository implements ShareRepository {
  private sessions: ShareSession[];

  constructor() {
    this.sessions = [...mockShareSessions];
  }

  getSessions(): ShareSession[] {
    return this.sessions;
  }

  getByToken(token: string): ShareSession | undefined {
    return this.sessions.find((s) => s.token === token);
  }

  getInitialSessions(): ShareSession[] {
    return this.sessions;
  }
}

// --- Singleton Export ----------------------------------------------------------

export const shareRepository: ShareRepository = new MockShareRepository();
