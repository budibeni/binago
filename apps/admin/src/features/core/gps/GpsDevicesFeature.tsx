'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@adatrack/utils';
import { DataTable, Button, type DataTableColumnDef } from '@adatrack/ui';
import { GpsDeviceForm } from './components/GpsDeviceForm';
import { Plus } from 'lucide-react';

export interface GpsDevicesFeatureProps {
  locale: 'id' | 'en';
}

export function GpsDevicesFeature({ locale }: GpsDevicesFeatureProps) {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<any>(null);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/admin/gps-devices');
      setDevices(res.data || res || []);
    } catch (err) {
      console.error('Failed to fetch devices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAdd = () => {
    setEditDevice(null);
    setIsFormOpen(true);
  };

  const handleAssign = (device: any) => {
    setEditDevice(device);
    setIsFormOpen(true);
  };

  const columns: DataTableColumnDef<any>[] = [
    {
      id: 'imei',
      header: 'IMEI',
      cell: (row) => row.imei,
      enableSorting: true,
    },
    {
      id: 'sim_number',
      header: 'SIM Number',
      cell: (row) => row.sim_number || '-',
      enableSorting: true,
    },
    {
      id: 'protocol',
      header: 'Protocol',
      cell: (row) => row.protocol || '-',
      enableSorting: true,
    },
    {
      id: 'company',
      header: 'Company',
      cell: (row) => row.company_code || 'Unassigned',
      enableSorting: true,
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAssign(row)}>
            Assign
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <DataTable
          data={devices}
          columns={columns}
          isLoading={loading}
          toolbarActions={
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Device
            </Button>
          }
          searchValue=""
          onSearchChange={() => {}}
        />
      </div>
      
      {(isFormOpen || editDevice) && (
        <GpsDeviceForm
          device={editDevice}
          open={isFormOpen || !!editDevice}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false);
              setEditDevice(null);
            }
          }}
          onSave={() => {
            fetchDevices();
            setIsFormOpen(false);
            setEditDevice(null);
          }}
        />
      )}
    </div>
  );
}
