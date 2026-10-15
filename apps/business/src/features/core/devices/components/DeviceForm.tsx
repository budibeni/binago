'use client';

import React from 'react';
import { Smartphone, Radio, Truck, Cpu, Phone } from 'lucide-react';
import { FormShell, FormCard, InputString, InputSelect, useForm } from '@adatrack/ui';
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

const DEFAULT_DEVICE: Partial<Device> = {
  imei: '',
  protocol: 'SMARTPHONE',
  deviceBrand: 'Android / iOS',
  deviceModel: 'Mobile Tracking App',
  simNumber: '',
  iccid: '',
  vehicleId: undefined,
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

  const [vehicles, setVehicles] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    if (open) {
      api.get('/vehicles')
        .then((res: any) => {
          const vData = Array.isArray(res) ? res : res?.data || [];
          const opts = [
            { value: '', label: tF.vehicleNone },
            ...vData.map((v: any) => ({
              value: String(v.id),
              label: `${v.plate_number || 'Tanpa Plat'} ${v.vehicle_name ? `(${v.vehicle_name})` : ''}`,
            })),
          ];
          setVehicles(opts);
        })
        .catch(console.error);
    }
  }, [open, tF.vehicleNone]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<any>({
    initialData: device
      ? {
          ...device,
          vehicleId: device.vehicleId ? String(device.vehicleId) : '',
        }
      : DEFAULT_DEVICE,
    resetOn: [open, device],
    schema: getDeviceFormSchema(tD.validation || {}),
    onSubmit: async (data) => {
      const payload: Partial<Device> = {
        ...data,
        vehicleId: data.vehicleId ? Number(data.vehicleId) : undefined,
      };
      await onSave(payload);
    },
  });

  const protocolOptions = [
    { value: 'SMARTPHONE', label: 'Smartphone / Mobile App Driver' },
    { value: 'HTTP_MOBILE', label: 'Mobile HTTP Custom' },
    { value: 'GT06', label: 'Concox GT06 / GT06N' },
    { value: 'TELTONIKA', label: 'Teltonika (FMB920 / FMC)' },
    { value: 'TK103', label: 'TK103 Protocol' },
    { value: 'JT808', label: 'JT808 Protocol' },
    { value: 'OTHER', label: 'Lainnya (Universal)' },
  ];

  const applyPreset = (type: 'smartphone' | 'gps') => {
    if (type === 'smartphone') {
      handleChange('protocol', 'SMARTPHONE');
      handleChange('deviceBrand', 'Android / iOS');
      handleChange('deviceModel', 'Mobile Tracking App');
    } else {
      handleChange('protocol', 'GT06');
      handleChange('deviceBrand', 'Concox');
      handleChange('deviceModel', 'GT06N Tracker');
    }
  };

  const isMobile = formData.protocol === 'SMARTPHONE' || formData.protocol === 'HTTP_MOBILE';

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
        {/* Preset & Tipe Perangkat */}
        {!isEdit && (
          <FormCard
            title={tF.sectionDeviceType}
            description={tF.descDeviceType}
            icon={<Cpu className="w-5 h-5 text-primary" />}
          >
            <div className="grid grid-cols-2 gap-3 col-span-2">
              <button
                type="button"
                onClick={() => applyPreset('smartphone')}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                  isMobile
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-neutral-400 bg-background text-foreground'
                }`}
              >
                <Smartphone className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] font-bold">Smartphone App</p>
                  <p className="text-[11px] text-foreground-muted">Pelacakan via HP Driver</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('gps')}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                  !isMobile
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-neutral-400 bg-background text-foreground'
                }`}
              >
                <Radio className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] font-bold">GPS Fisik</p>
                  <p className="text-[11px] text-foreground-muted">Tracker Concox, dll.</p>
                </div>
              </button>
            </div>
          </FormCard>
        )}

        {/* Identitas Perangkat */}
        <FormCard
          title={tF.sectionIdentity}
          description={tF.descIdentity}
          icon={isMobile ? <Smartphone className="w-5 h-5 text-primary" /> : <Radio className="w-5 h-5 text-neutral-500" />}
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
        {/* Penugasan Kendaraan */}
        <FormCard
          title={tF.sectionVehicle}
          description={tF.descVehicle}
          icon={<Truck className="w-5 h-5 text-blue-500" />}
        >
          <div className="col-span-2">
            <InputSelect
              label={tF.vehicle}
              placeholder={tF.vehiclePlaceholder}
              value={formData.vehicleId || ''}
              onChange={(v) => handleChange('vehicleId', v)}
              error={errors.vehicleId}
              options={vehicles}
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
            <InputString
              label={tF.simNumber}
              placeholder={tF.simPlaceholder}
              value={formData.simNumber || ''}
              onChange={(v) => handleChange('simNumber', v)}
              error={errors.simNumber}
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
