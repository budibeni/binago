'use client';

import React from 'react';
import { User } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';

// Using the same DUMMY_USER as PersonalShellLayout
const DUMMY_USER = {
  name: 'Andi Pratama',
  email: 'andi.pratama@gmail.com',
  phone: '+62 812-3456-7890',
  role: 'Pengguna Personal',
  initials: 'AP',
};

export function AccountSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.account;

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-600 font-bold text-xl shrink-0">
          {DUMMY_USER.initials}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{DUMMY_USER.name}</h3>
          <p className="text-sm text-foreground-muted mt-0.5">{DUMMY_USER.role}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0 gap-1 md:gap-4">
          <span className="text-sm font-medium text-foreground-muted w-32">{s.name}</span>
          <span className="text-sm font-semibold text-foreground">{DUMMY_USER.name}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0 gap-1 md:gap-4">
          <span className="text-sm font-medium text-foreground-muted w-32">{s.email}</span>
          <span className="text-sm font-semibold text-foreground">{DUMMY_USER.email}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0 gap-1 md:gap-4">
          <span className="text-sm font-medium text-foreground-muted w-32">{s.phone}</span>
          <span className="text-sm font-semibold text-foreground">{DUMMY_USER.phone}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0 gap-1 md:gap-4">
          <span className="text-sm font-medium text-foreground-muted w-32">{s.role}</span>
          <span className="text-sm font-semibold text-foreground">{DUMMY_USER.role}</span>
        </div>
      </div>
    </div>
  );
}
