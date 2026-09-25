import React, { useState, useEffect } from 'react';
import { api } from '@adatrack/utils';
import {
  FormShell,
  FormCard,
  InputString,
  InputSelect,
  useForm
} from '@adatrack/ui';
import { Cpu } from 'lucide-react';

interface GpsDeviceFormProps {
  device: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function GpsDeviceForm({ device, open, onOpenChange, onSave }: GpsDeviceFormProps) {
  const isEdit = !!device;
  const [companies, setCompanies] = useState<{value: string, label: string}[]>([]);
  
  useEffect(() => {
    if (open) {
      api.get('/admin/companies')
        .then((res: any) => {
          const data = res.data || res || [];
          setCompanies(data.map((c: any) => ({ value: c.code, label: c.name })));
        })
        .catch(console.error);
    }
  }, [open]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialData: device || { imei: '', sim_number: '', protocol: '', company_code: '' },
    onSubmit: async (data: any) => {
      try {
        if (!isEdit) {
          await api.post('/admin/gps-devices', {
            imei: data.imei,
            sim_number: data.sim_number,
            protocol: data.protocol
          });
        }
        
        if (data.company_code) {
          await api.put(`/admin/gps-devices/${data.imei}/assign`, {
            company_code: data.company_code
          });
        }
        
        onSave();
      } catch (err) {
        console.error('Failed to save device', err);
        alert('Failed to save device');
      }
    }
  });

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Assign Device' : 'Add Device'}
      subtitle={isEdit ? 'Assign GPS device to a company' : 'Register a new GPS device'}
      onCancel={() => onOpenChange(false)}
      onSave={() => handleSubmit()}
      isSubmitting={isSubmitting}
      layout="drawer"
    >
      <FormCard
        title="Device Information"
        description="Enter GPS device details"
        icon={<Cpu className="w-5 h-5 text-blue-500" />}
      >
        <InputString
          label="IMEI"
          value={formData.imei || ''}
          onChange={(val) => handleChange('imei', val)}
          disabled={isEdit}
          required
        />
        <InputString
          label="SIM Number"
          value={formData.sim_number || ''}
          onChange={(val) => handleChange('sim_number', val)}
          disabled={isEdit}
        />
        <InputString
          label="Protocol"
          value={formData.protocol || ''}
          onChange={(val) => handleChange('protocol', val)}
          disabled={isEdit}
        />
        <InputSelect
          label="Assign Company"
          value={formData.company_code || ''}
          onChange={(val) => handleChange('company_code', val)}
          options={companies}
        />
      </FormCard>
    </FormShell>
  );
}
