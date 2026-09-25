import React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import '@adatrack/maps/styles.css';
import { BusinessShellLayout } from '../components/BusinessShellLayout';

const roboto = Roboto({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'ADATRACK Business',
  description: 'ADATRACK Business - Platform Manajemen Armada dan Logistik',
};

import { cookies } from 'next/headers';
import type { UserInfo } from '@adatrack/types';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userProfileCookie = cookieStore.get('user_profile')?.value;
  let user: UserInfo | undefined = undefined;

  if (userProfileCookie) {
    try {
      const parsed = JSON.parse(userProfileCookie);
      user = {
        name: parsed.name || parsed.email || 'User',
        email: parsed.email || '',
        role: parsed.role || 'User',
        initials: (parsed.name || parsed.email || 'U').substring(0, 2).toUpperCase(),
      };
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
  }

  const tokenCookie = cookieStore.get('access_token')?.value;

  return (
    <html lang="id" suppressHydrationWarning className={roboto.variable}>
      <body className="min-h-screen bg-surface text-foreground font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('adatrack.theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
                ${tokenCookie ? `window.__WS_TOKEN__ = "${tokenCookie}";` : ''}
              } catch (e) {}
            `,
          }}
        />
        <BusinessShellLayout user={user}>
          {children}
        </BusinessShellLayout>
      </body>
    </html>
  );
}
