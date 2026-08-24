import { ShareSession } from '../types';

/** Pre-seeded mock sessions for demo purposes.
 *  'valid-token' → v-002 (active session, 4h from now)
 *  'expired-token' → v-003 (already expired)
 *  'revoked-token' → v-004 (revoked by owner)
 */

const nowMs = Date.now();

export const mockShareSessions: ShareSession[] = [
  {
    id: 'share-001',
    vehicleId: 'veh-002',
    token: 'valid-token',
    durationHours: 4,
    createdAt: new Date(nowMs - 1000 * 60 * 15).toISOString(), // 15 min ago
    expiresAt: new Date(nowMs + 1000 * 60 * 60 * 3 + 1000 * 60 * 45).toISOString(), // 3h 45m from now
    status: 'active',
  },
  {
    id: 'share-002',
    vehicleId: 'veh-003',
    token: 'expired-token',
    durationHours: 1,
    createdAt: new Date(nowMs - 1000 * 60 * 90).toISOString(), // 1.5h ago
    expiresAt: new Date(nowMs - 1000 * 60 * 30).toISOString(),  // expired 30 min ago
    status: 'expired',
  },
  {
    id: 'share-003',
    vehicleId: 'veh-004',
    token: 'revoked-token',
    durationHours: 2,
    createdAt: new Date(nowMs - 1000 * 60 * 60).toISOString(),
    expiresAt: new Date(nowMs + 1000 * 60 * 60).toISOString(),
    status: 'revoked',
  },
];

/** Generate a mock random token (frontend mock only - not cryptographic) */
export function generateMockToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
