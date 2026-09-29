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
  const [simCards, setSimCards] = useState<any[]>([]);
  
  useEffect(() => {
    if (open) {
      api.get('/admin/companies')
        .then((res: any) => {
          const data = res.data || res || [];
          setCompanies(data.map((c: any) => ({ value: c.code, label: c.name })));
        })
        .catch(console.error);

      api.get('/admin/sim-cards')
        .then((res: any) => {
          const data = res.data || res || [];
          setSimCards(data);
        })
        .catch(console.error);
    }
  }, [open]);

  const simCardOptions = [
    { value: '', label: 'Manual Input / None' },
    ...simCards.map((s: any) => ({ value: s.iccid, label: `${s.iccid} - ${s.phone_number}` }))
  ];

  const { formData, errors, isSubmitting, handleChange, handleSubmit, setFormData } = useForm({
    initialData: device || { imei: '', sim_number: '', protocol: '', company_code: '', iccid: '' },
    onSubmit: async (data: any) => {
      try {
        const payload = {
          imei: data.imei,
          device_brand: data.device_brand || '',
          device_model: data.device_model || '',
          sim_number: data.sim_number,
          protocol: data.protocol,
          iccid: data.iccid ? data.iccid : null
        };

        if (!isEdit) {
          await api.post('/admin/gps-devices', payload);
        } else {
          await api.put(`/admin/gps-devices/${data.imei}`, payload);
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

  const handleSimCardChange = (iccid: string) => {
    handleChange('iccid', iccid);
    if (iccid) {
      const selectedSim = simCards.find(s => s.iccid === iccid);
      if (selectedSim) {
        setFormData((prev: any) => ({ ...prev, sim_number: selectedSim.phone_number }));
      }
    }
  };

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Device' : 'Add Device'}
      subtitle={isEdit ? 'Update GPS device details' : 'Register a new GPS device'}
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
        <InputSelect
          label="IoT SIM Card (Optional)"
          value={formData.iccid || ''}
          onChange={handleSimCardChange}
          options={simCardOptions}
          helpText="Pilih dari daftar IoT SIM Cards, atau biarkan kosong untuk input manual."
        />
        <InputString
          label="SIM Number"
          value={formData.sim_number || ''}
          onChange={(val) => handleChange('sim_number', val)}
          helpText="Jika memilih IoT SIM Card, nomor otomatis terisi."
        />
        <InputString
          label="Protocol"
          value={formData.protocol || ''}
          onChange={(val) => handleChange('protocol', val)}
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
