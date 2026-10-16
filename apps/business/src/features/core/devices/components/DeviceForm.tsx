'use client';

import React from 'react';
import { Smartphone, Phone } from 'lucide-react';
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
  status: 'idle',
};

function formatImeiFromSim(simNumber: string): string {
  const clean = (simNumber || '').trim().replace(/\s+/g, '');
  return clean ? `PHONE${clean}` : '';
}

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
        }
      : {
          ...DEFAULT_DEVICE,
        },
    resetOn: [open, device],
    schema: getDeviceFormSchema(tD.validation || {}),
    onSubmit: async (data) => {
      const payload: Partial<Device> = {
        ...data,
      };
      delete payload.driverId;
      await onSave(payload);
    },
  });

  const protocolOptions = [
    { value: 'SMARTPHONE', label: 'Smartphone App Driver (Android / iOS)' },
    { value: 'HTTP_MOBILE', label: 'Mobile Tracking HTTP Protocol' },
  ];

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

  const handleSimNumberChange = (val: string) => {
    handleChange('simNumber', val);
    if (!isEdit) {
      handleChange('imei', formatImeiFromSim(val));
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
      {/* Kolom Kiri: Identitas & Konektivitas SIM */}
      <div className="flex flex-col gap-6">
        <FormCard
          title={tF.sectionIdentity}
          description={tF.descIdentity}
          icon={<Smartphone className="w-5 h-5 text-primary" />}
          columns={2}
        >
          <div className="col-span-2">
            <InputAutocomplete
              label={tF.simNumber}
              placeholder={tF.simPlaceholder}
              value={formData.simNumber || ''}
              onChange={handleSimNumberChange}
              options={phoneAutocompleteOptions}
              error={errors.simNumber}
              emptyText="Ketik nomor telepon manual atau pilih dari daftar supir"
              autoFocus={!isEdit}
              required
            />
          </div>

          <div className="col-span-2">
            <InputString
              label={tF.imei}
              placeholder={tF.imeiPlaceholder}
              value={formData.imei || ''}
              onChange={(v) => handleChange('imei', v)}
              error={errors.imei}
              required
              disabled={true} // Auto-generated from PHONE + simNumber
            />
            <p className="text-[11px] text-foreground-muted mt-1">
              {tF.imeiDesc}
            </p>
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

      {/* Kolom Kanan: Spesifikasi Aplikasi Smartphone */}
      <div className="flex flex-col gap-6">
        <FormCard
          title={tF.sectionSpec}
          description={tF.descSpec}
          icon={<Phone className="w-5 h-5 text-blue-500" />}
          columns={2}
        >
          <div className="col-span-2">
            <InputSelect
              label={tF.protocol}
              value={formData.protocol || 'SMARTPHONE'}
              onChange={(v) => handleChange('protocol', v)}
              error={errors.protocol}
              options={protocolOptions}
              required
            />
          </div>

          <div className="col-span-2">
            <InputString
              label={tF.brand}
              placeholder={tF.brandPlaceholder}
              value={formData.deviceBrand || ''}
              onChange={(v) => handleChange('deviceBrand', v)}
              error={errors.deviceBrand}
              required
            />
          </div>

          <div className="col-span-2">
            <InputString
              label={tF.model}
              placeholder={tF.modelPlaceholder}
              value={formData.deviceModel || ''}
              onChange={(v) => handleChange('deviceModel', v)}
              error={errors.deviceModel}
              required
            />
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}
