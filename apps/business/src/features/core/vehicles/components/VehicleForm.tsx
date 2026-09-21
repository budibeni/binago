import React from 'react';
import { CarFront, Cpu, Wrench, Hash, Calendar, Smartphone, FileText } from 'lucide-react';
import {
  FormShell,
  FormCard,
  InputString,
  InputNumber,
  InputSelect,
  InputDate,
  InputTextarea,
  useForm,
  InfoRow
} from '@adatrack/ui';
import { getVehicleFormSchema, type Vehicle } from '../types/vehicle';
import { vehicleService, driverService } from '@/data/services';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getVehiclesTranslation } from '../i18n';
// Options moved inside component to support localization


const DEFAULT_VEHICLE = {
  plateNumber: '',
  vehicleName: '',
  vehicleCategory: 'truck',
  brand: '',
  year: new Date().getFullYear(),
  fuelType: 'solar',
  groupId: '',
  driverId: null,
  deviceImei: '',
  vehicleId: '',
  gpsDeviceBrand: '',
  gpsDeviceType: '',
  gpsInstallDate: '',
  registrationExpiry: '',
  passengerCapacity: undefined,
  notes: '',
  assetNumber: '',
  dimLength: undefined,
  dimWidth: undefined,
  dimHeight: undefined,
  fuelRatio: undefined,
  maxSpeed: undefined,
  stnkNumber: '',
  kirNumber: '',
  bpkbNumber: '',
  engineNumber: '',
  chassisNumber: '',
  engineCapacity: undefined,
  odometer: undefined,
  lastServiceKm: undefined,
  nextServiceKm: undefined,
} as unknown as Vehicle;

function useVehicleOptions(open: boolean) {
  const [groups, setGroups] = React.useState<{ value: string, label: string }[]>([]);
  const [drivers, setDrivers] = React.useState<{ value: string, label: string }[]>([]);

  React.useEffect(() => {
    if (open) {
      setGroups(vehicleService.getVehicleGroups().map(g => ({ value: g.id, label: g.name })));
      setDrivers(driverService.getDrivers().map(d => ({ value: d.id, label: d.name })));
    }
  }, [open]);

  return { groups, drivers };
}

interface VehicleFormProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Vehicle>) => void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog';
}

export function VehicleForm({
  vehicle,
  open,
  onOpenChange,
  onSave,
  onCancel,
  layout = 'default'
}: VehicleFormProps) {
  const isEdit = !!vehicle;
  const locale = useBusinessLocale();
  const tV = getVehiclesTranslation(locale);
  const tF = tV.form;

  const VEHICLE_CATEGORY_OPTIONS = React.useMemo(() => [
    { value: 'truck', label: tF.catTruck },
    { value: 'minibus', label: tF.catMinibus },
    { value: 'pickup', label: tF.catPickup },
    { value: 'motorcycle', label: tF.catMotorcycle },
    { value: 'other', label: tF.catOther },
  ], [tF]);

  const FUEL_TYPE_OPTIONS = React.useMemo(() => [
    { value: 'solar', label: tF.fuelSolar },
    { value: 'bensin', label: tF.fuelBensin },
    { value: 'listrik', label: tF.fuelListrik },
  ], [tF]);  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<Vehicle>({
    initialData: vehicle || DEFAULT_VEHICLE,
    resetOn: [open, vehicle],
    schema: getVehicleFormSchema(tV.validation || {}),
    onSubmit: async (data) => {
      await new Promise(r => setTimeout(r, 800));

      // Pastikan string kosong pada Select diubah menjadi null agar valid secara tipe (bila optional)
      const submitData = {
        ...data,
        driverId: data.driverId === '' ? null : data.driverId,
      };

      onSave(submitData);
    }
  });

  const { groups, drivers } = useVehicleOptions(open);

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? tF.editTitle : tF.addTitle}
      subtitle={isEdit ? tF.editSubtitle : tF.addSubtitle}
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      columns={2}
    >
      <div className="flex flex-col gap-6">
        {/* 1. Informasi Dasar */}
        <FormCard
          title={tF.cardIdentity}
          description={tF.cardIdentityDesc}
          icon={<CarFront className="w-5 h-5 text-blue-500" />}
          columns={2}
        >
          <InputString
            label={tF.lblPlateNumber}
            value={formData.plateNumber || ''}
            onChange={(val) => handleChange('plateNumber', val)}
            error={errors.plateNumber}
            required
          />
          <InputString
            label="Nomor Aset"
            value={formData.assetNumber || ''}
            onChange={(val) => handleChange('assetNumber', val)}
            error={errors.assetNumber}
          />

          <InputString
            label={tF.lblVehicleName}
            value={formData.vehicleName || ''}
            onChange={(val) => handleChange('vehicleName', val)}
            error={errors.vehicleName}
            required
          />
          <InputSelect
            label={tF.lblGroup}
            value={formData.groupId || ''}
            onChange={(val) => handleChange('groupId', val)}
            options={groups}
            error={errors.groupId}
            required
          />
        </FormCard>

        {/* 2. Spesifikasi Kendaraan */}
        <FormCard
          title={tF.cardSpecs}
          description={tF.cardSpecsDesc}
          icon={<Cpu className="w-5 h-5 text-indigo-500" />}
          columns={2}
        >
          <InputSelect
            label={tF.lblCategory}
            value={formData.vehicleCategory || ''}
            onChange={(val) => handleChange('vehicleCategory', val)}
            options={VEHICLE_CATEGORY_OPTIONS}
            required
          />
          <InputString
            label={tF.lblBrand}
            value={formData.brand || ''}
            onChange={(val) => handleChange('brand', val)}
          />
          <InputNumber
            label={tF.lblYear}
            value={formData.year ?? null}
            onChange={(val) => handleChange('year', val)}
          />
          <InputString
            label={tF.lblColor}
            value={formData.color || ''}
            onChange={(val) => handleChange('color', val)}
          />
          <InputNumber
            label={tF.lblLength}
            value={formData.dimLength ?? null}
            onChange={(val) => handleChange('dimLength', val)}
          />
          <InputNumber
            label={tF.lblWidth}
            value={formData.dimWidth ?? null}
            onChange={(val) => handleChange('dimWidth', val)}
          />
          <InputNumber
            label={tF.lblHeight}
            value={formData.dimHeight ?? null}
            onChange={(val) => handleChange('dimHeight', val)}
          />
          <InputNumber
            label={tF.lblPassengerCapacity}
            value={formData.passengerCapacity ?? null}
            onChange={(val) => handleChange('passengerCapacity', val)}
          />
          <InputNumber
            label={tF.lblEngineCapacity}
            value={formData.engineCapacity ?? null}
            onChange={(val) => handleChange('engineCapacity', val)}
          />
        </FormCard>
      </div>

      <div className="flex flex-col gap-6">
        {/* 3. Operasional & Performa */}
        <FormCard
          title={tF.cardOps}
          description={tF.cardOpsDesc}
          icon={<Wrench className="w-5 h-5 text-orange-500" />}
          columns={2}
        >
          <InputSelect
            label={tF.lblDriver}
            value={formData.driverId || ''}
            onChange={(val) => handleChange('driverId', val)}
            options={drivers}
          />
          <InputSelect
            label={tF.lblFuelType}
            value={formData.fuelType || ''}
            onChange={(val) => handleChange('fuelType', val)}
            options={FUEL_TYPE_OPTIONS}
            required
          />
          <InputNumber
            label={tF.lblFuelCapacity}
            value={formData.fuelCapacity ?? null}
            onChange={(val) => handleChange('fuelCapacity', val)}
          />
          <InputNumber
            label={tF.lblFuelRatio}
            value={formData.fuelRatio ?? null}
            onChange={(val) => handleChange('fuelRatio', val)}
          />
          <InputNumber
            label={tF.lblMaxSpeed}
            value={formData.maxSpeed ?? null}
            onChange={(val) => handleChange('maxSpeed', val)}
          />
        </FormCard>

        {/* 4. Lisensi & Legalitas */}
        <FormCard
          title={tF.cardLegal}
          description={tF.cardLegalDesc}
          icon={<Wrench className="w-5 h-5 text-green-500" />}
          columns={2}
        >
          <InputString
            label="No. STNK"
            value={formData.stnkNumber || ''}
            onChange={(val) => handleChange('stnkNumber', val)}
          />
          <InputDate
            label="Berlaku STNK"
            value={formData.registrationExpiry || ''}
            onChange={(val) => handleChange('registrationExpiry', val)}
          />
          <InputString
            label="No. KIR"
            value={formData.kirNumber || ''}
            onChange={(val) => handleChange('kirNumber', val)}
          />
          <InputString
            label={tF.lblBpkbNo}
            value={formData.bpkbNumber || ''}
            onChange={(val) => handleChange('bpkbNumber', val)}
          />
          <InputString
            label={tF.lblEngineNo}
            value={formData.engineNumber || ''}
            onChange={(val) => handleChange('engineNumber', val)}
          />
          <InputString
            label={tF.lblChassisNo}
            value={formData.chassisNumber || ''}
            onChange={(val) => handleChange('chassisNumber', val)}
          />
        </FormCard>

        {/* 5. Administrasi & Perawatan */}
        <FormCard
          title={tF.cardAdminMaintenance}
          description={tF.cardAdminMaintenanceDesc}
          icon={<FileText className="w-5 h-5 text-violet-500" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <p className="text-[11px] text-foreground-muted mb-4 bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded border border-border/50">
              <strong className="text-foreground">Info:</strong> Nilai di bawah ini berfungsi sebagai saldo awal (baseline). Nantinya angka ini akan diperbarui otomatis oleh sistem telematika dan modul perawatan.
            </p>
          </div>
          <InputNumber
            label={tF.lblOdometer}
            value={formData.odometer ?? null}
            onChange={(val) => handleChange('odometer', val)}
          />
          <InputNumber
            label={tF.lblLastService}
            value={formData.lastServiceKm ?? null}
            onChange={(val) => handleChange('lastServiceKm', val)}
          />
          <InputNumber
            label={tF.lblNextService}
            value={formData.nextServiceKm ?? null}
            onChange={(val) => handleChange('nextServiceKm', val)}
          />
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputTextarea
              label={tF.lblNotes}
              value={formData.notes || ''}
              onChange={(val) => handleChange('notes', val)}
            />
          </div>
        </FormCard>

      </div>

      {/* 6. Perangkat GPS */}
      <div className="col-span-1 group-data-[layout=default]/form:lg:col-span-2 group-data-[layout=fullscreen]/form:lg:col-span-2 group-data-[layout=dialog]/form:lg:col-span-2">
        <FormCard
          title={tF.cardDeviceGroup}
          description={tF.cardDeviceGroupDesc}
          icon={<Cpu className="w-5 h-5 text-purple-500" />}
          columns={2}
        >
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: Hash, label: tF.lblVehicleId, value: formData.vehicleId },
              { icon: Hash, label: tF.lblImei, value: formData.deviceImei },
              { icon: Smartphone, label: tF.lblSimCard, value: formData.deviceSimNumber },
              { icon: Cpu, label: tF.lblGpsDeviceBrand, value: formData.gpsDeviceBrand },
              { icon: Cpu, label: tF.lblGpsDeviceType, value: formData.gpsDeviceType },
              { icon: Calendar, label: tF.lblGpsInstallDate, value: formData.gpsInstallDate ? new Date(formData.gpsInstallDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-md border border-border/50">
                <div className="flex items-center gap-1.5 text-foreground-muted mb-1">
                  <item.icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-semibold tracking-wider">{item.label}</span>
                </div>
                <span className="text-[12px] font-bold text-foreground truncate">{item.value || '-'}</span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}
