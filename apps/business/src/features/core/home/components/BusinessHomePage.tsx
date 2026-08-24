'use client';

import React, { useEffect, useState } from 'react';
import { BusinessHeroSection } from './BusinessHeroSection';
import { HomeShortcutGrid } from './HomeShortcutGrid';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';
import { getTranslation } from '../../../../i18n';
import { FavoriteManager, FavoriteSectionHeader, FavoriteEmptyState } from '@adatrack/ui';
import { BUSINESS_SHORTCUTS } from '../data/shortcuts';

const STORAGE_KEY = 'adatrack.business.favorites';
const DEFAULT_FAVORITES = ['tracking', 'vehicles', 'drivers', 'deliveries', 'maintenance', 'gpsDevices'];

export function BusinessHomePage() {
  const locale = useBusinessLocale();
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

  const favoriteItems = BUSINESS_SHORTCUTS.map(s => ({
    id: s.id,
    label: h.shortcuts[s.translationKey].label,
    description: h.shortcuts[s.translationKey].desc,
    icon: s.icon,
  }));

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-6">

      {/* Hero */}
      <BusinessHeroSection />

      {/* Favorite section header - single "+ Tambah Shortcut" button */}
      <FavoriteSectionHeader
        title={h.favoritTitle}
        subtitle={h.favoritSubtitle}
        addLabel={h.addShortcut}
        onAddClick={() => setIsManagerOpen(true)}
        addButtonVariant="accent"
      />

      {/* Shortcut grid or empty state - only rendered after localStorage is read (SSR safe) */}
      {isLoaded && (
        favorites.length > 0
          ? <HomeShortcutGrid favorites={favorites} />
          : (
            <FavoriteEmptyState
              title={h.emptyFavoriteTitle}
              description={h.emptyFavoriteDescription}
              addLabel={h.addShortcut}
              onAddClick={() => setIsManagerOpen(true)}
              addButtonVariant="accent"
            />
          )
      )}


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
