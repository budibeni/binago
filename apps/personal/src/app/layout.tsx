import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { PersonalShellLayout } from '../components/PersonalShellLayout';

export const metadata: Metadata = {
  title: 'BINAGO Personal',
  description: 'BINAGO Personal — Aplikasi Pelacakan Kendaraan Pribadi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-foreground font-sans antialiased">
        <PersonalShellLayout>
          {children}
        </PersonalShellLayout>
      </body>
    </html>
  );
}
