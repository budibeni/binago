import React, { useState } from 'react';
import { api } from '@adatrack/utils';
import { Button, toast, InputString, InputTextarea, Checkbox } from '@adatrack/ui';
import { Role } from '../hooks/useRoles';

// Available permissions in Adatrack
const AVAILABLE_PERMISSIONS = [
  { id: 'vehicles:read', label: 'Melihat Kendaraan', group: 'Kendaraan' },
  { id: 'vehicles:write', label: 'Mengelola Kendaraan (Tambah/Edit/Hapus)', group: 'Kendaraan' },
  { id: 'routes:read', label: 'Melihat Rute', group: 'Rute & Penugasan' },
  { id: 'routes:write', label: 'Mengelola Rute & Penugasan (Assign/Selesai)', group: 'Rute & Penugasan' },
  { id: 'geofences:read', label: 'Melihat Geofence', group: 'Geofence' },
  { id: 'geofences:write', label: 'Mengelola Geofence', group: 'Geofence' },
  { id: 'alerts:read', label: 'Melihat Peringatan (Alerts & SOS)', group: 'Peringatan' },
  { id: 'alerts:write', label: 'Mengelola Peringatan', group: 'Peringatan' },
  { id: 'reports:read', label: 'Melihat Laporan', group: 'Laporan' },
  { id: 'users:read', label: 'Melihat Pengguna/Karyawan', group: 'Pengguna' },
  { id: 'users:write', label: 'Mengelola Pengguna/Karyawan', group: 'Pengguna' },
  { id: 'settings:write', label: 'Mengelola Pengaturan & Role', group: 'Pengaturan' }
];

interface RoleFormProps {
  role?: Role | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoleForm({ role, onSuccess, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    code: role?.code || '',
    description: role?.description || '',
    permissions: role?.permissions || []
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!role;

  const displayCode = isEditing ? formData.code : formData.code;

  const togglePermission = (permId: string) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: perms };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/settings/roles/${role.id}`, {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        });
        toast.success('Role berhasil diperbarui');
      } else {
        await api.post('/settings/roles', {
          code: formData.code.toUpperCase().replace(/\s+/g, '_'),
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        });
        toast.success('Role berhasil dibuat');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan role');
    } finally {
      setLoading(false);
    }
  };

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PERMISSIONS>);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 w-full max-w-md sm:w-[500px]">
      
      {!isEditing && (
        <InputString
          id="code"
          label="Kode Internal"
          required
          disabled={isEditing}
          placeholder="Cth: KEPALA_GUDANG"
          value={displayCode}
          onChange={val => setFormData({ ...formData, code: val })}
          helpText="Kode unik yang digunakan oleh sistem (tanpa spasi). Sistem otomatis menambahkan awalan CUSTOM_."
        />
      )}

      <InputString
        id="name"
        label="Nama Tampilan"
        required
        placeholder="Contoh: Kepala Gudang Pusat"
        value={formData.name}
        onChange={val => setFormData({ ...formData, name: val })}
      />

      <InputTextarea
        id="description"
        label="Deskripsi Singkat"
        placeholder="Tugas dan wewenang role ini..."
        value={formData.description}
        onChange={val => setFormData({ ...formData, description: val })}
        rows={2}
      />

      <div className="flex flex-col gap-3 mt-2 border-t pt-4 border-border">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Daftar Hak Akses
          </label>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {formData.permissions.length} dipilih
          </span>
        </div>
        <div className="h-[250px] overflow-y-auto pr-2 flex flex-col gap-4 border border-border rounded-md p-4 bg-muted/30">
          {Object.entries(groupedPermissions).map(([group, perms]) => (
            <div key={group} className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group}</h4>
              <div className="flex flex-col gap-2 ml-1">
                {perms.map(perm => (
                  <label key={perm.id} className="flex items-start gap-2.5 cursor-pointer hover:bg-muted/50 p-1.5 -ml-1.5 rounded transition-colors">
                    <Checkbox
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-foreground select-none leading-tight mt-0.5">
                      {perm.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Role'}
        </Button>
      </div>
    </form>
  );
}
