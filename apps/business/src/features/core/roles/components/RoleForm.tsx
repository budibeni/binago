import React, { useState } from 'react';
import { api } from '@adatrack/utils';
import { Button, toast } from '@adatrack/ui';
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

  // If editing, extract the actual code without CUSTOM_ prefix if we want, but it's read-only anyway
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

  // Group permissions by category
  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PERMISSIONS>);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 w-[500px] max-w-full">
      <div className="space-y-4">
        {!isEditing && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Kode Internal <span className="text-red-500">*</span></label>
            <input
              required
              disabled={isEditing}
              type="text"
              className="w-full px-3 py-2 border rounded-md text-sm uppercase disabled:bg-neutral-100 disabled:text-neutral-500"
              placeholder="Contoh: KEPALA_GUDANG"
              value={displayCode}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
            />
            <p className="text-xs text-neutral-500">Kode unik yang digunakan oleh sistem (tanpa spasi). Sistem otomatis menambahkan awalan CUSTOM_.</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nama Tampilan <span className="text-red-500">*</span></label>
          <input
            required
            type="text"
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="Contoh: Kepala Gudang Pusat"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Deskripsi Singkat</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="Tugas dan wewenang role ini..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2 mt-4 pt-4 border-t">
          <label className="text-sm font-semibold flex items-center justify-between">
            Daftar Hak Akses (Permissions)
            <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {formData.permissions.length} dipilih
            </span>
          </label>
          <div className="h-[250px] overflow-y-auto pr-2 space-y-4 border rounded-md p-3 bg-neutral-50 dark:bg-neutral-900/50">
            {Object.entries(groupedPermissions).map(([group, perms]) => (
              <div key={group} className="space-y-2">
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{group}</h4>
                <div className="space-y-1.5 ml-1">
                  {perms.map(perm => (
                    <label key={perm.id} className="flex items-start gap-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1 rounded transition-colors">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={formData.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 select-none">
                        {perm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Role'}
        </Button>
      </div>
    </form>
  );
}
