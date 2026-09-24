'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Router, Save, Target } from 'lucide-react';
import {
  DataTable,
  Button,
  FormShell,
  FormCard,
  InputString,
  InputSelect,
  useForm,
} from '@adatrack/ui';

interface GpsDevice {
  imei: string;
  simNumber: string;
  protocol: string;
  companyCode?: string;
  status?: string;
}

export function GpsDevicesFeature() {
  const [devices, setDevices] = useState<GpsDevice[]>([]);
  const [companies, setCompanies] = useState<{value: string, label: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedImei, setSelectedImei] = useState<string>('');
  
  const { formData: addData, handleChange: handleAddChange, handleSubmit: handleAddSubmit, isSubmitting: isAdding } = useForm({
    initialData: { imei: '', simNumber: '', protocol: '' },
    onSubmit: async (data) => {
      try {
        const res = await fetch('/api/v1/admin/gps-devices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          fetchDevices();
          setIsFormOpen(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

  const { formData: assignData, handleChange: handleAssignChange, handleSubmit: handleAssignSubmit, isSubmitting: isAssigning } = useForm({
    initialData: { companyCode: '' },
    onSubmit: async (data) => {
      if (!selectedImei) return;
      try {
        const res = await fetch(`/api/v1/admin/gps-devices/${selectedImei}/assign`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          fetchDevices();
          setIsAssignOpen(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/admin/gps-devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(Array.isArray(data) ? data : data?.data || []);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/v1/admin/companies');
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.data || [];
        setCompanies(items.map((c: any) => ({ value: c.code, label: c.name })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchCompanies();
  }, []);

  const columns = [
    { key: 'imei', label: 'IMEI', sortable: true },
    { key: 'simNumber', label: 'SIM Number', sortable: true },
    { key: 'protocol', label: 'Protocol', sortable: true },
    { key: 'companyCode', label: 'Company', sortable: true },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_: any, item: GpsDevice) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setSelectedImei(item.imei);
            setIsAssignOpen(true);
          }}
        >
          Assign
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div>
          <h1 className="text-xl font-bold text-slate-900">GPS Devices</h1>
          <p className="text-sm text-slate-500">Manage Enterprise GPS Inventory</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Device
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <DataTable
          columns={columns}
          data={devices}
          isLoading={isLoading}
          keyExtractor={(item) => item.imei}
        />
      </div>

      <FormShell
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title="Add New GPS Device"
        subtitle="Register a new GPS device to the inventory"
        onCancel={() => setIsFormOpen(false)}
        onSave={() => handleAddSubmit()}
        isSubmitting={isAdding}
      >
        <FormCard title="Device Details" icon={<Router className="w-5 h-5 text-blue-500" />}>
          <InputString
            label="IMEI"
            value={addData.imei}
            onChange={(val) => handleAddChange('imei', val)}
            required
          />
          <InputString
            label="SIM Number"
            value={addData.simNumber}
            onChange={(val) => handleAddChange('simNumber', val)}
            required
          />
          <InputString
            label="Protocol"
            value={addData.protocol}
            onChange={(val) => handleAddChange('protocol', val)}
            required
          />
        </FormCard>
      </FormShell>

      <FormShell
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        title="Assign GPS Device"
        subtitle={`Assigning device ${selectedImei} to a company`}
        onCancel={() => setIsAssignOpen(false)}
        onSave={() => handleAssignSubmit()}
        isSubmitting={isAssigning}
      >
        <FormCard title="Assignment Details" icon={<Target className="w-5 h-5 text-purple-500" />}>
          <InputSelect
            label="Company"
            value={assignData.companyCode}
            onChange={(val) => handleAssignChange('companyCode', val)}
            options={companies}
            required
          />
        </FormCard>
      </FormShell>
    </div>
  );
}
