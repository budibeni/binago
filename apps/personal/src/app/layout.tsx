import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import '@adatrack/maps/styles.css';
import { PersonalShellLayout } from '../components/PersonalShellLayout';

export const metadata: Metadata = {
  title: 'ADATRACK Personal',
  description: 'ADATRACK Personal â€” Aplikasi Pelacakan Kendaraan Pribadi',
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
        <PersonalShellLayout>
          {children}
        </PersonalShellLayout>
      </body>
    </html>
  );
}
