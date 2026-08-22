import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Berbagi Lokasi - ADATRACK',
};

/**
 * Public share layout - intentionally minimal.
 * Does NOT include PersonalShellLayout, navigation, or auth guards.
 * This route is publicly accessible without login.
 */
export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-foreground font-sans antialiased">
      {children}
    </div>
  );
}
