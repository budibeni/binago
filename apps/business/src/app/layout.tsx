import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { BusinessShellLayout } from '../components/BusinessShellLayout';

export const metadata: Metadata = {
  title: 'BINAGO Business',
  description: 'BINAGO Business — Platform Manajemen Armada dan Logistik',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-foreground font-sans antialiased">
        <BusinessShellLayout>
          {children}
        </BusinessShellLayout>
      </body>
    </html>
  );
}
