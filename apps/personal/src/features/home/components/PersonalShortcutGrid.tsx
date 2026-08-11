'use client';

import React from 'react';
import Link from 'next/link';
import { usePersonalLocale } from '../../../components/PersonalShellLayout';
import { getTranslation } from '../../../i18n';
import { PERSONAL_SHORTCUTS } from '../data/shortcuts';

interface PersonalShortcutGridProps {
  favorites: string[];
}

export function PersonalShortcutGrid({ favorites }: PersonalShortcutGridProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const shortcuts = t.home.shortcuts;

  // Filter to only show favorites, maintaining PERSONAL_SHORTCUTS order
  const filteredShortcuts = PERSONAL_SHORTCUTS.filter(s => favorites.includes(s.id));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {filteredShortcuts.map((s) => {
        const { label, desc } = shortcuts[s.translationKey];
        const Icon = s.icon;

        return (
          <Link
            key={s.id}
            href={s.href}
            className="group relative block rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {/* Icon */}
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${s.color.bg}`}>
              <Icon className={`h-5 w-5 ${s.color.text}`} />
            </div>

            {/* Title + description */}
            <p className="text-[13px] font-semibold text-neutral-800 leading-tight">{label}</p>
            <p className="mt-1 text-[11px] text-neutral-400 leading-snug line-clamp-2">{desc}</p>
          </Link>
        );
      })}
    </div>
  );
}
