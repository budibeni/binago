'use client';

import React, { useState } from 'react';
import { Car, Lock, Unlock, ShieldCheck, Loader2 } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { mockVehicles } from '../../tracking/data/mockTrackingData';
import { Vehicle, SecurityStatus } from '../../tracking/types';
import { cn } from '@adatrack/utils';
import { Button, Dialog } from '@adatrack/ui';
import { useNotifications } from '../../notifications/context/NotificationContext';

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.vehicles;
  const sec = t.settings.vehicleSecurity;
  const { addNotification } = useNotifications();

  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>(vehicle.securityStatus || 'normal');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'secure' | 'release'>('secure');

  const handleConfirm = () => {
    setSecurityStatus(actionType === 'secure' ? 'securing' : 'releasing');
    setIsDialogOpen(false);
    
    // Mock simulation
    setTimeout(() => {
      // 90% success rate mock
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setSecurityStatus(actionType === 'secure' ? 'secured' : 'normal');
        addNotification({
          type: 'vehicle_security',
          vehicleId: vehicle.id,
          context: {
            action: actionType,
            status: 'success',
          }
        });
      } else {
        setSecurityStatus('failed');
        addNotification({
          type: 'vehicle_security',
          vehicleId: vehicle.id,
          context: {
            action: actionType,
            status: 'failed',
          }
        });
      }
    }, 2000);
  };

  const handleOpenDialog = (action: 'secure' | 'release') => {
    setActionType(action);
    setIsDialogOpen(true);
  };

  const renderSecurityButton = () => {
    if (vehicle.status === 'driving') {
      return (
        <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
          <Button variant="outline" disabled className="gap-2 w-full sm:w-auto" aria-label={sec.secureVehicle}>
            <Lock className="w-4 h-4" />
            {sec.secureVehicle}
          </Button>
          <p className="text-[11px] text-foreground-muted sm:max-w-[220px] text-right mt-1">
            {sec.vehicleMovingDesc}
          </p>
        </div>
      );
    }

    if (securityStatus === 'securing' || securityStatus === 'releasing') {
      return (
        <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
          <Button variant="outline" disabled className="gap-2 w-full sm:w-auto sm:min-w-[200px]">
            <Loader2 className="w-4 h-4 animate-spin" />
            {securityStatus === 'securing' ? sec.securingVehicle : sec.releasingSecurity}
          </Button>
          <p className="text-[11px] text-foreground-muted mt-1">
            {sec.waitingForGps}
          </p>
        </div>
      );
    }

    if (securityStatus === 'failed') {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col items-center sm:items-end">
            <span className="text-sm font-medium text-red-500 dark:text-red-400">{sec.securityFailed}</span>
            <span className="text-[11px] text-foreground-muted">{sec.securityFailedDesc}</span>
          </div>
          <Button variant="destructive" onClick={() => handleOpenDialog(actionType)} className="gap-2 w-full sm:w-auto">
            {sec.tryAgain}
          </Button>
        </div>
      );
    }

    if (securityStatus === 'secured') {
      return (
        <Button variant="outline" onClick={() => handleOpenDialog('release')} className="gap-2 w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/50">
          <Unlock className="w-4 h-4" />
          {sec.releaseSecurity}
        </Button>
      );
    }

    return (
      <Button variant="destructive" onClick={() => handleOpenDialog('secure')} className="gap-2 w-full sm:w-auto">
        <Lock className="w-4 h-4" />
        {sec.secureVehicle}
      </Button>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-start md:items-center gap-4 flex-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400 shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{vehicle.name}</h3>
            <p className="text-sm text-foreground-muted mt-0.5">{vehicle.plateNumber}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-4 md:items-center">
          <div className="flex flex-col bg-surface-elevated px-3 py-2 rounded-lg">
            <span className="text-xs text-foreground-muted">{s.type}</span>
            <span className="text-sm font-semibold text-foreground mt-0.5">{vehicle.type}</span>
          </div>
          <div className="flex flex-col bg-surface-elevated px-3 py-2 rounded-lg min-w-[140px]">
            <span className="text-xs text-foreground-muted">{s.status}</span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className={cn(
                "text-sm font-semibold capitalize whitespace-nowrap",
                vehicle.status === 'driving' ? "text-green-600 dark:text-green-500" :
                vehicle.status === 'parking' ? "text-blue-600 dark:text-blue-500" :
                vehicle.status === 'idle' ? "text-yellow-600 dark:text-yellow-500" : "text-foreground-muted"
              )}>
                {vehicle.status === 'driving' ? t.tracking?.statusDriving :
                 vehicle.status === 'parking' ? t.tracking?.statusParking :
                 vehicle.status === 'idle' ? t.tracking?.statusIdle :
                 t.tracking?.statusOffline}
                {vehicle.status === 'driving' && vehicle.speed ? ` • ${vehicle.speed} km/h` : ''}
              </span>
              
              {securityStatus === 'secured' && (
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 border-l border-border pl-3">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-semibold">{sec.secured}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-3 mt-1 border-t border-border border-dashed">
        {renderSecurityButton()}
      </div>

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        title={actionType === 'secure' ? sec.secureVehicleTitle : sec.releaseSecurityTitle}
        description={actionType === 'secure' ? sec.secureVehicleDesc : sec.releaseSecurityDesc}
      >
        <div className="py-2">
          <div className="flex items-center gap-3 p-3 bg-surface-elevated rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{vehicle.name}</p>
              <p className="text-sm text-foreground-muted">{vehicle.plateNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            {sec.cancel}
          </Button>
          <Button 
            variant={actionType === 'secure' ? 'destructive' : 'primary'} 
            onClick={handleConfirm}
          >
            {actionType === 'secure' ? sec.secureVehicle : sec.releaseSecurity}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export function VehiclesSection() {
  return (
    <div className="flex flex-col gap-4">
      {mockVehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
