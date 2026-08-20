import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import '@adatrack/maps/styles.css';
import { BusinessShellLayout } from '../components/BusinessShellLayout';

export const metadata: Metadata = {
  title: 'ADATRACK Business',
  description: 'ADATRACK Business â€” Platform Manajemen Armada dan Logistik',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-foreground font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('adatrack.theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <BusinessShellLayout>
          {children}
        </BusinessShellLayout>
      </body>
    </html>
  );
}
