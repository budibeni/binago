'use client';

import React from 'react';
import Link from 'next/link';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTranslation } from '../../../i18n';
import { BUSINESS_SHORTCUTS } from '../data/shortcuts';

interface HomeShortcutGridProps {
  favorites: string[];
}

export function HomeShortcutGrid({ favorites }: HomeShortcutGridProps) {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const shortcuts = t.home.shortcuts;

  // Render shortcuts in the order they appear in BUSINESS_SHORTCUTS to maintain a consistent order
  const filteredShortcuts = BUSINESS_SHORTCUTS.filter(s => favorites.includes(s.id));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {filteredShortcuts.map((s) => {
        const { label, desc } = shortcuts[s.translationKey];
        const Icon = s.icon;
        
        return (
          <Link
            key={s.id}
            href={s.href}
            className="group relative block rounded-xl border border-border bg-background dark:bg-neutral-900 dark:border-neutral-800 p-4 hover:border-border-strong hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {/* Icon */}
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${s.color.bg}`}>
              <Icon className={`h-5 w-5 ${s.color.text}`} />
            </div>

            {/* Title + description */}
            <p className="text-[13px] font-semibold text-foreground leading-tight">{label}</p>
            <p className="mt-1 text-[11px] text-foreground-muted leading-snug line-clamp-2">{desc}</p>
          </Link>
        );
      })}
    </div>
  );
}
