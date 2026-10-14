import type { Tenant } from '../types';

export const MOCK_TENANTS_MULTI: Tenant[] = [
  { id: 't-nusantara', name: 'PT Nusantara Logistik Prima' },
  { id: 't-sumber-trans', name: 'PT Sumber Trans Mandiri' },
  { id: 't-sentosa', name: 'CV Sentosa Fleet Rent' },
];

export const MOCK_TENANT_SINGLE: Tenant = {
  id: 't-adaptif',
  name: 'PT Adaptif Jaya Binary',
};

/**
 * Resolves list of tenants based on user credentials.
 * If user identifier contains "multi", returns 3 tenants.
 * Otherwise returns a single tenant.
 */
export function resolveUserTenants(identifier: string): Tenant[] {
  const normalized = identifier.trim().toLowerCase();
  if (normalized.includes('multi')) {
    return MOCK_TENANTS_MULTI;
  }
  return [MOCK_TENANT_SINGLE];
}
