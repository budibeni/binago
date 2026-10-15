'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Radio, Plus, Edit2, Trash2, Eye, Truck, Phone, Hash, ShieldAlert } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { cn, api } from '@adatrack/utils';
import { Button, Dialog, Badge, ConfirmDialog, toast } from '@adatrack/ui';
import { mockDevices } from '../data/mockSettingsData';

export function DevicesSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.devices;

  const [devices, setDevices] = useState<any[]>(mockDevices);
  const [vehicles, setVehicles] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any | null>(null);
  const [detailDevice, setDetailDevice] = useState<any | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states (Strictly Smartphone Protocol)
  const [formData, setFormData] = useState({
    imei: '',
    protocol: 'SMARTPHONE',
    deviceBrand: 'Android / iOS',
    deviceModel: 'Mobile Tracking App',
    simNumber: '',
    vehicleId: '',
  });

  const fetchDevices = () => {
    api.get('/devices')
      .then((res: any) => {
        const data = Array.isArray(res) ? res : res?.data || [];
        if (data.length > 0) {
          setDevices(data);
        }
      })
      .catch(() => {
        // Fallback to mockDevices
      });
  };

  useEffect(() => {
    fetchDevices();

    api.get('/vehicles')
      .then((res: any) => {
        const vList = Array.isArray(res) ? res : res?.data || [];
        setVehicles(vList.map((v: any) => ({
          id: String(v.id),
          name: `${v.plate_number || 'Tanpa Plat'} ${v.vehicle_name ? `(${v.vehicle_name})` : ''}`,
        })));
      })
      .catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setEditingDevice(null);
    setFormData({
      imei: '',
      protocol: 'SMARTPHONE',
      deviceBrand: 'Android / iOS',
      deviceModel: 'Mobile Tracking App',
      simNumber: '',
      vehicleId: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (device: any) => {
    const proto = (device.protocol || '').toUpperCase();
    if (proto !== 'SMARTPHONE' && proto !== 'HTTP_MOBILE') {
      toast.error('Perangkat GPS fisik hanya dapat diedit melalui Admin Portal.');
      return;
    }
    setEditingDevice(device);
    setFormData({
      imei: device.imei || device.id,
      protocol: device.protocol || 'SMARTPHONE',
      deviceBrand: device.device_brand || device.deviceBrand || device.brand || '',
      deviceModel: device.device_model || device.deviceModel || device.model || '',
      simNumber: device.sim_number || device.simNumber || '',
      vehicleId: device.vehicle_id || device.vehicleId ? String(device.vehicle_id || device.vehicleId) : '',
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (device: any) => {
    const proto = (device.protocol || '').toUpperCase();
    if (proto !== 'SMARTPHONE' && proto !== 'HTTP_MOBILE') {
      toast.error('Perangkat GPS fisik hanya dapat dihapus melalui Admin Portal.');
      return;
    }
    setDeviceToDelete(device);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imei.trim()) {
      toast.error('ID Perangkat / IMEI wajib diisi');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: any = {
        imei: formData.imei.trim(),
        protocol: formData.protocol,
        device_brand: formData.deviceBrand.trim() || 'Android / iOS',
        device_model: formData.deviceModel.trim() || 'Mobile Tracking App',
        sim_number: formData.simNumber.trim(),
      };
      if (formData.vehicleId) {
        payload.vehicle_id = Number(formData.vehicleId);
      }

      if (editingDevice) {
        await api.put(`/devices/${editingDevice.imei || editingDevice.id}`, payload);
        toast.success('Smartphone tracker berhasil diperbarui');
      } else {
        await api.post('/devices', payload);
        toast.success('Smartphone tracker berhasil didaftarkan');
      }

      fetchDevices();
      setIsFormOpen(false);
      setEditingDevice(null);
    } catch (err: any) {
      console.error('Save device error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Gagal menyimpan perangkat';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deviceToDelete) return;
    try {
      await api.delete(`/devices/${deviceToDelete.imei || deviceToDelete.id}`);
      toast.success('Perangkat berhasil dihapus');
      fetchDevices();
      setDeviceToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error('Gagal menghapus perangkat');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Daftar Perangkat Pelacak</h2>
          <p className="text-xs text-foreground-muted">
            Kelola smartphone pelacak dan monitor status GPS kendaraan Anda
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="gap-2 text-xs font-semibold h-9 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Smartphone</span>
        </Button>
      </div>

      {/* Devices List */}
      <div className="flex flex-col gap-3">
        {devices.map((device) => {
          const imei = device.imei || device.id;
          const name = device.name || `${device.device_brand || device.deviceBrand || ''} ${device.device_model || device.deviceModel || ''}`.trim() || imei;
          const proto = (device.protocol || (device.id?.startsWith('GPS') ? 'GT06' : 'SMARTPHONE')).toUpperCase();
          const isSmartphone = proto === 'SMARTPHONE' || proto === 'HTTP_MOBILE';
          const vehicleLabel = device.vehicle_name || device.vehicleName || (device.plate_number ? `Armada (${device.plate_number})` : 'Belum Ditugaskan');
          const isOnline = device.status === 'online' || device.status === 'active';

          return (
            <div
              key={imei}
              className="bg-surface border border-border rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors hover:border-neutral-300"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                  isSmartphone ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800"
                )}>
                  {isSmartphone ? <Smartphone className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground leading-none">{name}</h3>
                    <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-green-500" : "bg-neutral-300")} />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-mono text-foreground-muted">{imei}</span>
                    <span className="text-xs text-foreground-muted">&bull;</span>
                    <span className="text-xs text-foreground-muted">{vehicleLabel}</span>
                    <Badge
                      variant={isSmartphone ? "info" : "default"}
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      {isSmartphone ? "Smartphone Tracker" : "GPS Fisik (Hanya Lihat)"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-2 md:pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-lg"
                  onClick={() => setDetailDevice(device)}
                  title="Lihat Detail"
                >
                  <Eye className="w-4 h-4" />
                </Button>

                {isSmartphone ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-foreground-muted hover:text-primary hover:bg-neutral-100 rounded-lg"
                      onClick={() => handleOpenEdit(device)}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-foreground-muted hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={() => handleOpenDelete(device)}
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <span className="text-[11px] text-foreground-muted px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 font-medium">
                    Hanya Lihat
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Dialog: Khusus Protokol Smartphone */}
      <Dialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingDevice ? "Edit Smartphone Tracker" : "Daftarkan Smartphone Tracker"}
        description="Lengkapi identitas smartphone driver untuk pengiriman koordinat GPS"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              ID Perangkat / No. HP Driver (IMEI) <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!!editingDevice}
              placeholder="Misal: APP-08123456789 atau ID unik"
              value={formData.imei}
              onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
              className="w-full text-sm px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />
            <p className="text-[11px] text-foreground-muted mt-1">
              Gunakan nomor HP driver atau kode unik aplikasi pelacak
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Protokol Pelacakan Smartphone <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.protocol}
              onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
              className="w-full text-sm px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="SMARTPHONE">Smartphone App Driver (Android / iOS)</option>
              <option value="HTTP_MOBILE">Mobile Tracking HTTP Protocol</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Merk Smartphone</label>
              <input
                type="text"
                placeholder="Misal: Samsung, Xiaomi"
                value={formData.deviceBrand}
                onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                className="w-full text-sm px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Model Smartphone</label>
              <input
                type="text"
                placeholder="Misal: Galaxy A54"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                className="w-full text-sm px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Nomor Kontak / SIM</label>
            <input
              type="text"
              placeholder="Misal: +628123456789"
              value={formData.simNumber}
              onChange={(e) => setFormData({ ...formData, simNumber: e.target.value })}
              className="w-full text-sm px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Tautkan ke Kendaraan (Opsional)</label>
            <select
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              className="w-full text-sm px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Belum Ditugaskan (Idle) --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perangkat"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={!!detailDevice}
        onOpenChange={(open) => !open && setDetailDevice(null)}
        title="Detail Perangkat Pelacak"
        description="Informasi spesifikasi dan penugasan armada kendaraan"
      >
        {detailDevice && (
          <div className="flex flex-col gap-3 py-2">
            {!(detailDevice.protocol?.toUpperCase() === 'SMARTPHONE' || detailDevice.protocol?.toUpperCase() === 'HTTP_MOBILE') && (
              <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 flex items-center gap-2.5 text-xs text-foreground-muted">
                <Radio className="w-4 h-4 text-primary shrink-0" />
                <span>Perangkat ini merupakan GPS Fisik (Read-only). Pengelolaan hanya dapat dilakukan melalui Admin Portal.</span>
              </div>
            )}

            <div className="rounded-lg border p-3 flex flex-col gap-2 bg-neutral-50/50 dark:bg-neutral-900/20 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-foreground-muted">ID Perangkat / IMEI:</span>
                <span className="font-mono font-bold text-foreground">{detailDevice.imei || detailDevice.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-foreground-muted">Tipe / Protokol:</span>
                <span className="font-semibold text-foreground">{detailDevice.protocol || 'GT06 / HARDWARE'}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-foreground-muted">Merk & Model:</span>
                <span className="text-foreground">{detailDevice.device_brand || detailDevice.deviceBrand || detailDevice.brand || '-'} {detailDevice.device_model || detailDevice.deviceModel || detailDevice.model || ''}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-foreground-muted">No. Kontak / SIM:</span>
                <span className="font-mono text-foreground">{detailDevice.sim_number || detailDevice.simNumber || '-'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailDevice(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deviceToDelete}
        onOpenChange={(open) => !open && setDeviceToDelete(null)}
        title="Hapus Perangkat Smartphone"
        description={`Apakah Anda yakin ingin menghapus perangkat smartphone (${deviceToDelete?.imei || deviceToDelete?.id})?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
