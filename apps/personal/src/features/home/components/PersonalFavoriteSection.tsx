'use client';

import React from 'react';
import { Edit2, Plus } from 'lucide-react';
import { usePersonalLocale } from '../../../components/PersonalShellLayout';
import { getTranslation } from '../../../i18n';

interface PersonalFavoriteSectionProps {
  onManageClick: () => void;
}

export function PersonalFavoriteSection({ onManageClick }: PersonalFavoriteSectionProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const h = t.home;

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      {/* Left: title + subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="text-base font-semibold text-neutral-900">{h.favoritTitle}</h2>
        </div>
        <p className="text-sm text-neutral-500">{h.favoritSubtitle}</p>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onManageClick}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <Edit2 className="h-3.5 w-3.5" />
          {h.manageFavorite}
        </button>
        <button
          type="button"
          onClick={onManageClick}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
        >
          <Plus className="h-3.5 w-3.5" />
          {h.addShortcut}
        </button>
      </div>
    </div>
  );
}
