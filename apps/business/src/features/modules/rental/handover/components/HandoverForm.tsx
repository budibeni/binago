import React from 'react';
import { Card, Input, Button, Checkbox, Textarea, Label } from '@adatrack/ui';
import { MapPin, Car, Fuel, Wrench, CheckSquare, Clock } from 'lucide-react';
import type { RentalContract } from '../../contracts/types/contract';
import type { RentalHandover } from '../types/handover';

interface HandoverFormProps {
  contract: RentalContract;
  labels: Record<string, string>;
  onSubmit: (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function HandoverForm({ contract, labels, onSubmit, onCancel, isSubmitting }: HandoverFormProps) {
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [address, setAddress] = React.useState('');
  
  const defaultOdometer = contract.vehicle?.currentOdometer || 0;
  const [odometer, setOdometer] = React.useState<number>(defaultOdometer);
  const [odometerSource, setOdometerSource] = React.useState<'VEHICLE' | 'TRACKING' | 'MANUAL'>('VEHICLE');
  
  const [fuelLevel, setFuelLevel] = React.useState<RentalHandover['fuelLevel']>('HALF');
  const [condition, setCondition] = React.useState<RentalHandover['vehicleCondition']>('GOOD');
  const [notes, setNotes] = React.useState('');
  
  const [equipment, setEquipment] = React.useState<RentalHandover['equipmentChecklist']>({
    stnk: true,
    spareTire: true,
    jack: true,
    toolkit: true,
    triangle: true,
    fireExtinguisher: true,
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda.');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        alert('Tidak dapat mengambil lokasi. Pastikan izin lokasi browser telah diberikan.');
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      alert(labels.errorLocationRequired || 'Lokasi serah terima wajib diambil.');
      return;
    }
    if (odometer == null || isNaN(odometer)) {
      alert(labels.errorOdometerRequired || 'Odometer wajib diisi.');
      return;
    }
    
    onSubmit({
      contractId: contract.id,
      customerId: contract.customerId,
      vehicleId: contract.vehicleId,
      handoverAt: new Date().toISOString(),
      handoverLatitude: latitude,
      handoverLongitude: longitude,
      handoverAddress: address,
      odometerStart: odometer,
      odometerSource,
      fuelLevel,
      vehicleCondition: condition,
      equipmentChecklist: equipment,
      notes,
      staffId: 'usr-budi',
      staffName: 'Budi Setiawan',
      status: 'COMPLETED'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      
      {/* Contract & Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-4 px-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              {labels.sectionContract}
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-1">Nomor Kontrak</p>
                <p className="text-sm font-bold">{contract.contractNumber}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-1">Pelanggan</p>
                <p className="text-sm font-bold">{contract.customer?.name}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-4 px-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              {labels.sectionVehicleInfo}
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-1">Nomor Polisi</p>
                <p className="text-sm font-bold">{contract.vehicle?.coreVehicle?.plateNumber}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-1">Kendaraan</p>
                <p className="text-sm font-bold">{contract.vehicle?.coreVehicle?.brand} {contract.vehicle?.coreVehicle?.vehicleName}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Location */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-4 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {labels.sectionLocation}
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full sm:w-auto">
            {labels.btnGetLocation}
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[11px] uppercase font-semibold text-muted-foreground">{labels.latitude}</Label>
              <Input 
                value={latitude || ''} 
                readOnly 
                className="bg-neutral-100" 
                placeholder="-" 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] uppercase font-semibold text-muted-foreground">{labels.longitude}</Label>
              <Input 
                value={longitude || ''} 
                readOnly 
                className="bg-neutral-100" 
                placeholder="-" 
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Vehicle Condition */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-4 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            {labels.sectionVehicleCondition}
          </h3>
        </div>
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Odometer */}
            <div className="space-y-3">
              <Label className="text-[11px] uppercase font-semibold text-muted-foreground">{labels.startOdometer} (KM)</Label>
              <Input 
                type="number"
                min={defaultOdometer}
                value={odometer}
                onChange={(e) => {
                  setOdometer(Number(e.target.value));
                  setOdometerSource('MANUAL');
                }}
                className={odometerSource === 'VEHICLE' ? "bg-neutral-100" : ""}
                required
              />
              {odometerSource === 'VEHICLE' && (
                <p className="text-xs text-muted-foreground">
                  Odometer dibaca otomatis dari data kendaraan terakhir. Anda dapat menyesuaikannya jika diperlukan.
                </p>
              )}
            </div>

            {/* BBM */}
            <div className="space-y-3">
              <Label className="text-[11px] uppercase font-semibold text-muted-foreground">{labels.fuelLevel}</Label>
              <div className="flex gap-2">
                {(['EMPTY', 'QUARTER', 'HALF', 'THREE_QUARTER', 'FULL'] as const).map(lvl => (
                  <Button
                    key={lvl}
                    type="button"
                    variant={fuelLevel === lvl ? "primary" : "outline"}
                    className={`flex-1 ${fuelLevel === lvl ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    onClick={() => setFuelLevel(lvl)}
                  >
                    {lvl === 'EMPTY' ? labels.fuelEmpty :
                     lvl === 'QUARTER' ? labels.fuelQuarter :
                     lvl === 'HALF' ? labels.fuelHalf :
                     lvl === 'THREE_QUARTER' ? labels.fuelThreeQuarter :
                     labels.fuelFull}
                  </Button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-3 sm:col-span-2">
              <Label className="text-[11px] uppercase font-semibold text-muted-foreground">{labels.vehicleCondition}</Label>
              <div className="flex gap-2">
                {(['GOOD', 'MINOR_DAMAGE', 'NEEDS_REPAIR'] as const).map(cond => (
                  <Button
                    key={cond}
                    type="button"
                    variant={condition === cond ? "primary" : "outline"}
                    className={`flex-1 ${condition === cond ? 
                      (cond === 'GOOD' ? 'bg-success hover:bg-success/90' : 
                       cond === 'MINOR_DAMAGE' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-danger hover:bg-danger/90') 
                      : ""}`}
                    onClick={() => setCondition(cond)}
                  >
                    {cond === 'GOOD' ? labels.condGood :
                     cond === 'MINOR_DAMAGE' ? labels.condMinorDamage :
                     labels.condNeedsRepair}
                  </Button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </Card>

      {/* Equipment Checklist */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-4 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            {labels.sectionEquipment}
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(equipment).map((key) => {
              if (key === 'other') return null;
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`eq-${key}`} 
                    checked={(equipment as any)[key]} 
                    onCheckedChange={(checked) => setEquipment({...equipment, [key]: checked === true})}
                  />
                  <Label htmlFor={`eq-${key}`} className="text-sm capitalize font-medium cursor-pointer">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-4 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            {labels.sectionNotes}
          </h3>
        </div>
        <div className="p-4">
          <Textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan tambahan terkait serah terima (Opsional)"
            className="min-h-[100px]"
          />
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          {labels.btnCancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : labels.btnSave}
        </Button>
      </div>
    </form>
  );
}
