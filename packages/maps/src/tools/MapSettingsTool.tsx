'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { BasemapSwitcher } from '../controls/BasemapSwitcher';
import type { BasemapId } from '../basemaps/types';
import { Locale, getMapTranslation } from '../i18n';

export interface MapSettingsToolProps {
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
  className?: string;
  locale?: Locale;
}

export function MapSettingsTool({ basemap, onBasemapChange, className, locale = 'id' }: MapSettingsToolProps) {
  const t = getMapTranslation(locale).settings;
  return (
    <div className={cn('w-64 text-sm space-y-4', className)}>
      {/* Basemap */}
      <div>
        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-2">
          {t.title}
        </p>
        <BasemapSwitcher value={basemap} onChange={onBasemapChange} locale={locale} />
      </div>

      {/* Divider + future settings placeholder */}
      <div className="border-t border-border pt-3">
        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-2">
          {t.others}
        </p>
        <p className="text-xs text-foreground-subtle italic">
          {t.othersDesc}
        </p>
      </div>
    </div>
  );
}
