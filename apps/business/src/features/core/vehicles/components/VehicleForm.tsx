import React from 'react';
import { CarFront, Cpu, Wrench } from 'lucide-react';
import {
  FormShell,
  FormCard,
  InputString,
  InputNumber,
  InputSelect,
  InputDate,
  InputTextarea,
  useForm
} from '@adatrack/ui';
import { getVehicleFormSchema, type Vehicle } from '../types/vehicle';
import { vehicleService, driverService } from '@/data/services';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getVehiclesTranslation } from '../i18n';
const VEHICLE_CATEGORY_OPTIONS = [
  { value: 'truck', label: 'Truk' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'motorcycle', label: 'Sepeda Motor' },
  { value: 'other', label: 'Lainnya' },
];

const FUEL_TYPE_OPTIONS = [
  { value: 'solar', label: 'Solar' },
  { value: 'bensin', label: 'Bensin' },
  { value: 'listrik', label: 'Listrik' },
];


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
  registrationExpiry: '',
  passengerCapacity: undefined,
  notes: ''
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



  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<Vehicle>({
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
            label={tF.lblVehicleName}
            value={formData.vehicleName || ''}
            onChange={(val) => handleChange('vehicleName', val)}
            error={errors.vehicleName}
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

          <InputSelect
            label={tF.lblCategory}
            value={formData.vehicleCategory || ''}
            onChange={(val) => handleChange('vehicleCategory', val)}
            options={VEHICLE_CATEGORY_OPTIONS}
            required
          />
        </FormCard>

        <FormCard
          title={tF.cardDeviceGroup}
          description={tF.cardDeviceGroupDesc}
          icon={<Cpu className="w-5 h-5 text-purple-500" />}
          columns={2}
        >
          <InputSelect
            label={tF.lblGroup}
            value={formData.groupId || ''}
            onChange={(val) => handleChange('groupId', val)}
            options={groups}
            error={errors.groupId}
            required
          />
          <InputSelect
            label={tF.lblDriver}
            value={formData.driverId || ''}
            onChange={(val) => handleChange('driverId', val)}
            options={drivers}
          />
          <InputString
            label={tF.lblImei}
            value={formData.deviceImei || ''}
            onChange={(val) => handleChange('deviceImei', val)}
            disabled
            helpText={tF.helpDeviceManage}
          />
          <InputString
            label={tF.lblSimCard}
            value={formData.deviceSimNumber || ''}
            onChange={(val) => handleChange('deviceSimNumber', val)}
            disabled
            helpText={tF.helpDeviceManage}
          />
        </FormCard>
      </div>

      <div className="flex flex-col gap-6">
        <FormCard
          title={tF.cardAdminMaintenance}
          description={tF.cardAdminMaintenanceDesc}
          icon={<Wrench className="w-5 h-5 text-orange-500" />}
          columns={2}
        >
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
          <InputDate
            label={tF.lblRegExpiry}
            value={formData.registrationExpiry || ''}
            onChange={(val) => handleChange('registrationExpiry', val)}
          />
          <InputDate
            label={tF.lblKirExpiry}
            value={formData.kirExpiry || ''}
            onChange={(val) => handleChange('kirExpiry', val)}
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
    </FormShell>
  );
}
