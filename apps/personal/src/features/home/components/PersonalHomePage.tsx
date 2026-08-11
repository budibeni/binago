'use client';

import React, { useEffect, useState } from 'react';
import { PersonalHeroSection } from './PersonalHeroSection';
import { PersonalShortcutGrid } from './PersonalShortcutGrid';
import { PersonalInfoBar } from './PersonalInfoBar';
import { usePersonalLocale } from '../../../components/PersonalShellLayout';
import { getTranslation } from '../../../i18n';
import { FavoriteManager, FavoriteSectionHeader } from '@binago/ui';
import { PERSONAL_SHORTCUTS } from '../data/shortcuts';

const STORAGE_KEY = 'binago.personal.favorites';
const DEFAULT_FAVORITES = ['tracking', 'gpsDevices', 'geofences', 'reports'];

export function PersonalHomePage() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const h = t.home;

  const [favorites, setFavorites] = useState<string[]>([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        setFavorites(DEFAULT_FAVORITES);
      }
    } catch {
      setFavorites(DEFAULT_FAVORITES);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    setIsManagerOpen(false);
  };

  const favoriteItems = PERSONAL_SHORTCUTS.map(s => ({
    id: s.id,
    label: h.shortcuts[s.translationKey].label,
    description: h.shortcuts[s.translationKey].desc,
    icon: s.icon,
  }));

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 leading-tight">{h.pageTitle}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{h.pageSubtitle}</p>
      </div>

      {/* Hero */}
      <PersonalHeroSection />

      {/* Favorite section header */}
      <FavoriteSectionHeader
        title={h.favoritTitle}
        subtitle={h.favoritSubtitle}
        manageLabel={h.manageFavorite}
        addLabel={h.addShortcut}
        onManageClick={() => setIsManagerOpen(true)}
        addButtonVariant="dark"
      />

      {/* Shortcut grid — only rendered after localStorage is read (SSR safe) */}
      {isLoaded && <PersonalShortcutGrid favorites={favorites} />}

      {/* Info bar */}
      <PersonalInfoBar />

      {/* Favorite Manager Dialog */}
      <FavoriteManager
        open={isManagerOpen}
        onOpenChange={setIsManagerOpen}
        title={h.favoriteDialogTitle}
        description={h.favoriteDialogDescription}
        items={favoriteItems}
        selectedIds={favorites}
        onSave={handleSaveFavorites}
        cancelLabel={h.cancel}
        saveLabel={h.save}
      />
    </div>
  );
}
