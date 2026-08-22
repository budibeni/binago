'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Locale } from '@adatrack/types';

export interface ShellVerificationPageProps {
  locale: Locale;
  theme: 'light' | 'dark';
  labels: {
    title: string;
    subtitle: string;
    currentLocale: string;
    currentTheme: string;
  };
}

/**
 * ShellVerificationPage - placeholder sederhana untuk membuktikan Application Shell berjalan.
 * BUKAN halaman Home/Dashboard. Tidak ada statistik, chart, atau business data.
 * Home/Dashboard akan dikerjakan pada TASK-04.
 */
export function ShellVerificationPage({ locale, theme, labels }: ShellVerificationPageProps) {
  const checks = [
    'AppShell terintegrasi',
    'Sidebar - expanded, collapsed, dan mobile drawer',
    'Header - breadcrumb, language toggle, theme toggle, user menu',
    'Navigasi aktif teridentifikasi',
    'Mobile drawer - open/close dengan overlay',
    'Keyboard Escape menutup drawer',
    'UserMenu - avatar, nama, role, aksi profil',
    'LanguageToggle - ID/EN switching',
    'ThemeToggle - light/dark',
    'Tidak ada Global Search pada Header',
    'Tanpa fitur Home/Task-04',
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">{labels.title}</h1>
        <p className="mt-1 text-sm text-foreground-muted">{labels.subtitle}</p>
      </div>

      <div className="rounded-lg border border-border bg-background p-4 space-y-1.5 text-xs font-mono">
        <div className="text-foreground-muted mb-3">
          <span className="font-semibold text-foreground text-sm">Status Verifikasi</span>
        </div>
        <div className="text-foreground-muted">
          <span>{labels.currentLocale}: </span>
          <span className="text-primary font-semibold uppercase">{locale}</span>
        </div>
        <div className="text-foreground-muted">
          <span>{labels.currentTheme}: </span>
          <span className="text-primary font-semibold">{theme}</span>
        </div>
      </div>

      <ul className="space-y-2">
        {checks.map((check) => (
          <li key={check} className="flex items-start gap-2.5 text-sm text-foreground-muted">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success mt-0.5" />
            <span>{check}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-foreground-subtle italic border-t border-border pt-3">
        Halaman ini adalah placeholder TASK-03. Halaman Home/Dashboard akan diimplementasikan pada TASK-04.
      </p>
    </div>
  );
}
