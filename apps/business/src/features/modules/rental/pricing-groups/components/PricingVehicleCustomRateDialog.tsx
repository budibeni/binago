import React from 'react';
import { Input, Label, FormShell } from '@adatrack/ui';
import type { RateType } from '../../reservations/types/reservation';

export interface PricingVehicleCustomRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  initialRates?: { rateType: RateType; amount: number }[];
  onSave: (vehicleId: string, rates: { rateType: RateType; amount: number }[]) => void;
}

export function PricingVehicleCustomRateDialog({
  open,
  onOpenChange,
  vehicleId,
  initialRates = [],
  onSave
}: PricingVehicleCustomRateDialogProps) {
  const [dailyRate, setDailyRate] = React.useState<number | string>('');
  const [weeklyRate, setWeeklyRate] = React.useState<number | string>('');
  const [monthlyRate, setMonthlyRate] = React.useState<number | string>('');

  React.useEffect(() => {
    if (open) {
      setDailyRate(initialRates.find(r => r.rateType === 'DAILY')?.amount || '');
      setWeeklyRate(initialRates.find(r => r.rateType === 'WEEKLY')?.amount || '');
      setMonthlyRate(initialRates.find(r => r.rateType === 'MONTHLY')?.amount || '');
    }
  }, [open, initialRates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rates: { rateType: RateType; amount: number }[] = [];
    
    if (dailyRate) rates.push({ rateType: 'DAILY', amount: Number(dailyRate) });
    if (weeklyRate) rates.push({ rateType: 'WEEKLY', amount: Number(weeklyRate) });
    if (monthlyRate) rates.push({ rateType: 'MONTHLY', amount: Number(monthlyRate) });

    onSave(vehicleId, rates);
  };

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title="Set Harga Independen"
      subtitle="Kendaraan ini akan menggunakan harga berikut dan dikeluarkan dari grup saat ini."
      onSubmit={handleSubmit}
      layout="dialog"
      onCancel={() => onOpenChange(false)}
      saveText="Simpan Harga"
    >
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Tarif Harian (Rp)</Label>
          <Input
            type="number"
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
            placeholder="Contoh: 350000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Tarif Mingguan (Rp)</Label>
          <Input
            type="number"
            value={weeklyRate}
            onChange={(e) => setWeeklyRate(e.target.value)}
            placeholder="Opsional"
          />
        </div>
        <div className="space-y-2">
          <Label>Tarif Bulanan (Rp)</Label>
          <Input
            type="number"
            value={monthlyRate}
            onChange={(e) => setMonthlyRate(e.target.value)}
            placeholder="Opsional"
          />
        </div>
        <p className="text-xs text-warning mt-2">
          Peringatan: Kendaraan ini otomatis akan terlepas dari grup tarif mana pun jika diberi harga independen.
        </p>
      </div>
    </FormShell>
  );
}
