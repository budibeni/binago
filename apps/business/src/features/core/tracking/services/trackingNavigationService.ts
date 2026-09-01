import type { TrackingNavigationState } from '../types/tracking';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const STORAGE_KEY = 'adatrack_tracking_nav_state';

export const trackingNavigationService = {
  /**
   * Set navigation state into sessionStorage
   */
  setState: (state: TrackingNavigationState) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.error('Failed to set tracking navigation state', e);
    }
  },

  /**
   * Get navigation state from sessionStorage
   */
  getState: (): TrackingNavigationState | null => {
    try {
      if (typeof window !== 'undefined') {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw) as TrackingNavigationState;
        }
      }
    } catch (e) {
      console.error('Failed to get tracking navigation state', e);
    }
    return null;
  },

  /**
   * Clear navigation state from sessionStorage
   */
  clearState: () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to clear tracking navigation state', e);
    }
  },

  /**
   * Helper to set state and navigate to tracking page
   */
  navigateToTracking: (router: AppRouterInstance, state: TrackingNavigationState) => {
    trackingNavigationService.setState(state);
    router.push('/tracking');
  }
};
