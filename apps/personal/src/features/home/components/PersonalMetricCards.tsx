'use client';

import React from 'react';
import { Car, Cpu, MapPin } from 'lucide-react';
import { Card, Badge } from '@binago/ui';
import { mockPersonalMetricSummary } from '../data/mockHomeData';
import { usePersonalLocale } from '../../../components/PersonalShellLayout';
import { getTranslation } from '../../../i18n';

export function PersonalMetricCards() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Kendaraan Terdaftar */}
      <Card variant="bordered" className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-foreground-muted">
          <span className="text-sm font-medium">{t.home.metrics.registeredVehicles}</span>
          <Car className="h-4 w-4" />
        </div>
        <div className="flex items-end justify-between mt-1">
          <span className="text-3xl font-bold text-foreground">{mockPersonalMetricSummary.registeredVehicles}</span>
        </div>
      </Card>

      {/* Status GPS */}
      <Card variant="bordered" className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-foreground-muted">
          <span className="text-sm font-medium">{t.home.metrics.gpsStatus}</span>
          <Cpu className="h-4 w-4" />
        </div>
        <div className="flex items-end justify-between mt-1">
          <span className="text-3xl font-bold text-foreground">{mockPersonalMetricSummary.gpsOnline + mockPersonalMetricSummary.gpsOffline}</span>
          <div className="flex items-center gap-1.5">
            <Badge variant="success" dot className="text-[10px] px-1.5 py-0">
              {mockPersonalMetricSummary.gpsOnline} Online
            </Badge>
          </div>
        </div>
      </Card>

      {/* Geofence Aktif */}
      <Card variant="bordered" className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-foreground-muted">
          <span className="text-sm font-medium">{t.home.metrics.activeGeofences}</span>
          <MapPin className="h-4 w-4" />
        </div>
        <div className="flex items-end justify-between mt-1">
          <span className="text-3xl font-bold text-foreground">{mockPersonalMetricSummary.activeGeofences}</span>
        </div>
      </Card>
    </div>
  );
}
