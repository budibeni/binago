'use client';

import React from 'react';
import { ContentHeader } from '@binago/ui';
import { HomeMetricCards } from './HomeMetricCards';
import { HomeShortcutGrid } from './HomeShortcutGrid';
import { HomeActivityWidget } from './HomeActivityWidget';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTranslation } from '../../../i18n';

export function BusinessHomePage() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const greeting = t.home.greeting;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6 w-full">
      <ContentHeader
        title={`${greeting}, Budi Beni`}
        subtitle={t.home.subtitle}
      />

      <section aria-label={t.home.title}>
        <HomeMetricCards />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 flex flex-col gap-4" aria-label={t.home.shortcuts}>
          <h2 className="text-lg font-semibold text-foreground">{t.home.shortcuts}</h2>
          <HomeShortcutGrid />
        </section>

        <section className="flex flex-col gap-4" aria-label={t.home.attention}>
          <h2 className="text-lg font-semibold text-foreground">{t.home.attention}</h2>
          <HomeActivityWidget />
        </section>
      </div>
    </div>
  );
}
