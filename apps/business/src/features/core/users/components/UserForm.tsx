'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@adatrack/utils';
import { FormShell, FormCard, InputString, InputEmail, InputPassword, InputSelect, Switch, toast, Button } from '@adatrack/ui';
import { User, Shield, Lock } from 'lucide-react';
import type { TenantUser } from '../hooks/useUsers';
import type { Role } from '../../roles/hooks/useRoles';
import { useBusinessUser } from '@/components/BusinessShellLayout';

interface UserFormProps {
  user?: TenantUser | null;
  roles: Role[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ user, roles, open, onOpenChange, onSuccess, onCancel }: UserFormProps) {
  const isEditing = !!user;
  const currentUser = useBusinessUser();

  const userRole = (currentUser?.role || '').toUpperCase().replace(/[_ ]/g, '');
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  const isSelf = isEditing && Boolean(
    (user?.email && currentUser?.email && user.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (user?.id && currentUser?.id && user.id === currentUser.id)
  );

  const canToggleActive = isAdmin && !isSelf;

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role_code: '',
    password: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        role_code: user.role_code || '',
        password: '',
        is_active: user.is_active ?? true,
      });
    } else {
      setFormData({
        email: '',
        full_name: '',
        role_code: roles.length > 0 ? roles[0].code : 'OPERATOR',
        password: '',
        is_active: true,
      });
    }
  }, [user, roles]);

  const roleOptions = React.useMemo(() => {
    return roles.map((r) => ({
      value: r.code,
      label: `${r.name} (${r.code})`,
    }));
  }, [roles]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error('Nama Lengkap wajib diisi');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email wajib diisi');
      return;
    }
    if (!formData.role_code) {
      toast.error('Role wajib dipilih');
      return;
    }
    if (!isEditing && !formData.password) {
      toast.error('Password wajib diisi untuk pengguna baru');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/settings/users/${user.id}`, {
          full_name: formData.full_name,
          role_code: formData.role_code,
          ...(canToggleActive ? { is_active: formData.is_active } : {}),
          ...(formData.password ? { password: formData.password } : {}),
        });
        toast.success('Pengguna berhasil diperbarui');
      } else {
        await api.post('/settings/users', {
          email: formData.email,
          full_name: formData.full_name,
          role_code: formData.role_code,
          password: formData.password,
          is_active: canToggleActive ? formData.is_active : true,
        });
        toast.success('Pengguna baru berhasil ditambahkan');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data pengguna');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell
      layout="default"
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
      subtitle={
        isEditing
          ? 'Perbarui informasi profil dan penugasan role pengguna'
          : 'Tambahkan pengguna baru ke perusahaan dan tentukan role-nya'
      }
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={loading}
      columns={1}
    >
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        <FormCard
          title="Informasi Akun"
          description="Data identitas pengguna dan akses login"
          icon={<User className="w-5 h-5 text-primary" />}
          columns={2}
        >
          <div className="col-span-2 sm:col-span-1">
            <InputString
              id="full_name"
              label="Nama Lengkap"
              required
              placeholder="Contoh: Budi Santoso"
              value={formData.full_name}
              onChange={(val) => setFormData({ ...formData, full_name: val })}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <InputEmail
              id="email"
              label="Alamat Email"
              required
              disabled={isEditing}
              placeholder="nama@perusahaan.com"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              helpText={isEditing ? 'Alamat email tidak dapat diubah' : 'Digunakan untuk login ke sistem'}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <InputSelect
              id="role_code"
              label="Role / Peran"
              required
              options={roleOptions}
              value={formData.role_code}
              onChange={(val) => setFormData({ ...formData, role_code: val })}
              helpText="Menentukan izin akses dasar pengguna"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <InputPassword
              id="password"
              label={isEditing ? 'Ubah Password (Opsional)' : 'Password'}
              required={!isEditing}
              placeholder={isEditing ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
              value={formData.password}
              onChange={(val) => setFormData({ ...formData, password: val })}
              helpText={isEditing ? 'Biarkan kosong untuk mempertahankan password lama' : undefined}
            />
          </div>

          {canToggleActive ? (
            <div className="col-span-2 pt-2">
              <Switch
                id="is_active"
                label="Status Pengguna Aktif"
                helperText="Pengguna yang tidak aktif tidak dapat masuk ke sistem"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          ) : isSelf ? (
            <div className="col-span-2 px-3.5 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2.5">
              <Shield className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>Status aktif pengguna terkunci karena Anda sedang mengubah data profil akun Anda sendiri.</span>
            </div>
          ) : null}
        </FormCard>
      </div>
    </FormShell>
  );
}
