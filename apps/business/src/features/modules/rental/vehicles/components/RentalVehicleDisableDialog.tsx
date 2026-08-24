import React from 'react';
import { Dialog, Button } from '@adatrack/ui';
import type { RentalVehicle } from '../types/rentalVehicle';
import { Ban } from 'lucide-react';

interface RentalVehicleDisableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: RentalVehicle | null;
  labels: Record<string, string>;
  onConfirm: () => void;
}

export function RentalVehicleDisableDialog({
  open,
  onOpenChange,
  data,
  labels,
  onConfirm,
}: RentalVehicleDisableDialogProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={labels.confirmDisable}>
      <div className="flex flex-col gap-6 w-[400px]">
        <div className="flex flex-col items-center justify-center text-center space-y-4 pt-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <Ban className="w-6 h-6 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">
              {data.coreVehicle.brand} {data.coreVehicle.vehicleName}
            </h3>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
              {data.coreVehicle.plateNumber}
            </p>
          </div>

          <p className="text-sm text-muted-foreground px-4">
            {labels.confirmDisableDesc}
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {labels.cancel}
          </Button>
          <Button variant="destructive" onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}>
            {labels.confirm}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
