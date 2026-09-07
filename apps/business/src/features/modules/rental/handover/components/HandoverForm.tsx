import React from 'react';
import { Card, Button, Checkbox, FormShell, FormCard, InputString, InputNumber, InputTextarea, Label } from '@adatrack/ui';
import { MapPin, Car, Fuel, Wrench, CheckSquare, Clock } from 'lucide-react';
import type { RentalContract } from '../../contracts/types/contract';
import type { RentalHandover } from '../types/handover';

interface HandoverFormProps {
  contract: RentalContract;
  labels: Record<string, string>;
  onSubmit: (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HandoverForm({ contract, labels, onSubmit, onCancel, isSubmitting, layout = 'default', open, onOpenChange }: HandoverFormProps) {
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
      staffName: 'Budi Setiawan'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full relative">
      <FormShell
        layout={layout}
        open={open}
        onOpenChange={onOpenChange}
        onCancel={onCancel}
        cancelProps={{ disabled: isSubmitting }}
        cancelText={labels.btnCancel}
        saveText={isSubmitting ? 'Menyimpan...' : labels.btnSave}
        saveProps={{ disabled: isSubmitting }}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-6">
      
      {/* Contract & Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard title={labels.sectionContract}>
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
        </FormCard>

        <FormCard title={labels.sectionVehicleInfo}>
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
        </FormCard>
      </div>

      {/* Location */}
      <FormCard
        title={labels.sectionLocation}
        icon={<MapPin className="w-5 h-5 text-primary" />}
      >
          <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full sm:w-auto">
            {labels.btnGetLocation}
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputString
                id="latitude"
                label={labels.latitude}
                value={latitude !== null ? String(latitude) : ''}
                onChange={() => {}}
                readOnly
                placeholder="-"
                className="bg-neutral-100"
              />
            </div>
            <div>
              <InputString
                id="longitude"
                label={labels.longitude}
                value={longitude !== null ? String(longitude) : ''}
                onChange={() => {}}
                readOnly
                placeholder="-"
                className="bg-neutral-100"
              />
            </div>
          </div>
      </FormCard>

      {/* Vehicle Condition */}
      <FormCard
        title={labels.sectionVehicleCondition}
        icon={<Car className="w-5 h-5 text-primary" />}
      >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Odometer */}
            <div>
              <InputNumber
                id="odometer"
                label={`${labels.startOdometer} (KM)`}
                value={odometer}
                onChange={(val) => { setOdometer(val || 0); setOdometerSource('MANUAL'); }}
                min={defaultOdometer}
                required
                className={odometerSource === 'VEHICLE' ? "bg-neutral-100" : ""}
                helpText={odometerSource === 'VEHICLE' ? 'Odometer dibaca otomatis dari data kendaraan terakhir. Anda dapat menyesuaikannya jika diperlukan.' : undefined}
              />
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
      </FormCard>

      {/* Equipment Checklist */}
      <FormCard
        title={labels.sectionEquipment}
        icon={<CheckSquare className="w-5 h-5 text-primary" />}
      >
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
      </FormCard>

      {/* Notes */}
      <FormCard title={labels.sectionNotes}>
          <InputTextarea
            id="notes"
            value={notes}
            onChange={setNotes}
            placeholder="Catatan tambahan terkait serah terima (Opsional)"
            className="min-h-[100px]"
          />
      </FormCard>

        </div>
      </FormShell>
    </form>
  );
}
