'use client';

import React from 'react';
import { Smartphone, Users, Phone } from 'lucide-react';
import { FormShell, FormCard, InputString, InputSelect, InputAutocomplete, useForm } from '@adatrack/ui';
import { api } from '@adatrack/utils';
import { getDeviceFormSchema, type Device } from '../types/device';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getDevicesTranslation } from '../i18n';

interface DeviceFormProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Device>) => Promise<void> | void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
}

interface DriverOption {
  id: string;
  name: string;
  phone?: string;
  deviceImei?: string;
}

const DEFAULT_DEVICE: Partial<Device> = {
  imei: '',
  protocol: 'SMARTPHONE',
  deviceBrand: 'Android / iOS',
  deviceModel: 'Mobile Tracking App',
  simNumber: '',
  iccid: '',
  driverId: undefined,
  status: 'idle',
};

export function DeviceForm({
  device,
  open,
  onOpenChange,
  onSave,
  onCancel,
  layout = 'default',
}: DeviceFormProps) {
  const isEdit = !!device;
  const locale = useBusinessLocale();
  const tD = getDevicesTranslation(locale);
  const tF = tD.form;

  const [drivers, setDrivers] = React.useState<DriverOption[]>([]);

  React.useEffect(() => {
    if (open) {
      api.get('/drivers')
        .then((res: any) => {
          const dData = Array.isArray(res) ? res : res?.data || [];
          setDrivers(dData.map((d: any) => ({
            id: String(d.id),
            name: d.name || 'Pengemudi',
            phone: d.phone || '',
            deviceImei: d.device_imei || '',
          })));
        })
        .catch(console.error);
    }
  }, [open]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<any>({
    initialData: device
      ? {
          ...device,
          driverId: device.driverId ? String(device.driverId) : '',
        }
      : {
          ...DEFAULT_DEVICE,
          driverId: '',
        },
    resetOn: [open, device],
    schema: getDeviceFormSchema(tD.validation || {}),
    onSubmit: async (data) => {
      const payload: Partial<Device> = {
        ...data,
        driverId: data.driverId ? Number(data.driverId) : undefined,
      };
      await onSave(payload);
    },
  });

  const protocolOptions = [
    { value: 'SMARTPHONE', label: 'Smartphone App Driver (Android / iOS)' },
    { value: 'HTTP_MOBILE', label: 'Mobile Tracking HTTP Protocol' },
  ];

  // Driver options: show unassigned drivers or the driver currently linked to this device
  const driverSelectOptions = React.useMemo(() => {
    const available = drivers.filter(
      (d) => !d.deviceImei || (device?.imei && d.deviceImei === device.imei)
    );
    return [
      { value: '', label: tF.driverNone || 'Belum Ditugaskan (Idle)' },
      ...available.map((d) => ({
        value: d.id,
        label: `${d.name} ${d.phone ? `(${d.phone})` : ''}`,
      })),
    ];
  }, [drivers, device?.imei, tF.driverNone]);

  // Phone autocomplete options: unassigned drivers with phone numbers
  const phoneAutocompleteOptions = React.useMemo(() => {
    return drivers
      .filter((d) => d.phone && d.phone.trim() !== '' && (!d.deviceImei || (device?.imei && d.deviceImei === device.imei)))
      .map((d) => ({
        value: d.phone!,
        label: `${d.phone} - ${d.name}`,
        sublabel: d.name,
      }));
  }, [drivers, device?.imei]);

  const handleDriverChange = (driverIdVal: string) => {
    handleChange('driverId', driverIdVal);
    if (driverIdVal) {
      const selectedDriver = drivers.find((d) => d.id === driverIdVal);
      if (selectedDriver?.phone && (!formData.simNumber || formData.simNumber.trim() === '')) {
        handleChange('simNumber', selectedDriver.phone);
      }
    }
  };

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? tF.editTitle : tF.addTitle}
      subtitle={tF.subtitle}
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      columns={2}
    >
      {/* Kolom Kiri */}
      <div className="flex flex-col gap-6">
        {/* Identitas Perangkat Smartphone */}
        <FormCard
          title={tF.sectionIdentity}
          description={tF.descIdentity}
          icon={<Smartphone className="w-5 h-5 text-primary" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={tF.imei}
              placeholder={tF.imeiPlaceholder}
              value={formData.imei || ''}
              onChange={(v) => handleChange('imei', v)}
              error={errors.imei}
              required
              disabled={isEdit} // IMEI is primary identifier
            />
            <p className="text-[11px] text-foreground-muted mt-1">
              {tF.imeiDesc}
            </p>
          </div>

          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputSelect
              label={tF.protocol}
              value={formData.protocol || 'SMARTPHONE'}
              onChange={(v) => handleChange('protocol', v)}
              error={errors.protocol}
              options={protocolOptions}
              required
            />
          </div>

          <InputString
            label={tF.brand}
            placeholder={tF.brandPlaceholder}
            value={formData.deviceBrand || ''}
            onChange={(v) => handleChange('deviceBrand', v)}
            error={errors.deviceBrand}
            required
          />

          <InputString
            label={tF.model}
            placeholder={tF.modelPlaceholder}
            value={formData.deviceModel || ''}
            onChange={(v) => handleChange('deviceModel', v)}
            error={errors.deviceModel}
            required
          />
        </FormCard>
      </div>

      {/* Kolom Kanan */}
      <div className="flex flex-col gap-6">
        {/* Penugasan Pengemudi */}
        <FormCard
          title={tF.sectionDriver || 'Penugasan Pengemudi'}
          description={tF.descDriver || 'Tautkan perangkat GPS Smartphone ini ke akun pengemudi'}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        >
          <div className="col-span-2">
            <InputSelect
              label={tF.driver || 'Pilih Pengemudi'}
              placeholder={tF.driverPlaceholder || '-- Pilih Pengemudi (Opsional) --'}
              value={formData.driverId || ''}
              onChange={handleDriverChange}
              error={errors.driverId}
              options={driverSelectOptions}
            />
          </div>
        </FormCard>

        {/* Konektivitas SIM */}
        <FormCard
          title="Konektivitas SIM / Telepon"
          description="Nomor kontak kartu SIM pada perangkat atau nomor telepon driver"
          icon={<Phone className="w-5 h-5 text-green-500" />}
          columns={2}
        >
          <div className="col-span-2">
            <InputAutocomplete
              label={tF.simNumber}
              placeholder={tF.simPlaceholder}
              value={formData.simNumber || ''}
              onChange={(v) => handleChange('simNumber', v)}
              options={phoneAutocompleteOptions}
              error={errors.simNumber}
              emptyText="Ketik nomor telepon manual atau pilih dari daftar supir"
            />
          </div>

          <div className="col-span-2">
            <InputString
              label={tF.iccid}
              placeholder={tF.iccidPlaceholder}
              value={formData.iccid || ''}
              onChange={(v) => handleChange('iccid', v)}
              error={errors.iccid}
            />
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}
