'use client';

import React from 'react';
import { Truck, Users, Package, Cpu } from 'lucide-react';
import { Card, Badge } from '@binago/ui';
import { mockMetricSummary } from '../data/mockHomeData';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTranslation } from '../../../i18n';

export function HomeMetricCards() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Armada */}
      <Card variant="bordered" className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-foreground-muted">
          <span className="text-sm font-medium">{t.home.metrics.totalVehicles}</span>
          <Truck className="h-4 w-4" />
        </div>
        <div className="flex items-end justify-between mt-1">
          <span className="text-3xl font-bold text-foreground">{mockMetricSummary.totalVehicles}</span>
          <div className="flex items-center gap-1.5">
            <Badge variant="success" dot className="text-[10px] px-1.5 py-0">
              {mockMetricSummary.activeVehicles}
            </Badge>
            <Badge variant="warning" className="text-[10px] px-1.5 py-0">
              {mockMetricSummary.idleVehicles}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Pengemudi Bertugas */}
      <Card variant="bordered" className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-foreground-muted">
          <span className="text-sm font-medium">{t.home.metrics.activeDrivers}</span>
          <Users className="h-4 w-4" />
        </div>
        <div className="flex items-end justify-between mt-1">
          <span className="text-3xl font-bold text-foreground">{mockMetricSummary.activeDrivers}</span>
        </div>
      </Card>

      {/* Pengiriman Berjalan */}
      <Card variant="bordered" className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-foreground-muted">
          <span className="text-sm font-medium">{t.home.metrics.ongoingDeliveries}</span>
          <Package className="h-4 w-4" />
        </div>
        <div className="flex items-end justify-between mt-1">
          <span className="text-3xl font-bold text-foreground">{mockMetricSummary.ongoingDeliveries}</span>
        </div>
      </Card>

      {/* Perangkat Online */}
      <Card variant="bordered" className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-foreground-muted">
          <span className="text-sm font-medium">{t.home.metrics.onlineDevices}</span>
          <Cpu className="h-4 w-4" />
        </div>
        <div className="flex items-end justify-between mt-1">
          <span className="text-3xl font-bold text-foreground">{mockMetricSummary.onlineDevices}</span>
        </div>
      </Card>
    </div>
  );
}
