import React, { useState } from 'react';
import { api } from '@adatrack/utils';
import { FormShell, FormCard, InputString, InputTextarea, Checkbox, toast, Button } from '@adatrack/ui';
import { Shield, Lock } from 'lucide-react';
import { Role } from '../hooks/useRoles';
import { getRolesTranslation, RolesLocale } from '../i18n';

// Available permissions in Adatrack
const AVAILABLE_PERMISSIONS = [
  { id: 'vehicles:read', labelKey: 'vehicles:read', groupKey: 'Kendaraan' },
  { id: 'vehicles:write', labelKey: 'vehicles:write', groupKey: 'Kendaraan' },
  { id: 'routes:read', labelKey: 'routes:read', groupKey: 'Rute & Penugasan' },
  { id: 'routes:write', labelKey: 'routes:write', groupKey: 'Rute & Penugasan' },
  { id: 'assignments:read', labelKey: 'assignments:read', groupKey: 'Rute & Penugasan' },
  { id: 'assignments:write', labelKey: 'assignments:write', groupKey: 'Rute & Penugasan' },
  { id: 'geofences:read', labelKey: 'geofences:read', groupKey: 'Geofence' },
  { id: 'geofences:write', labelKey: 'geofences:write', groupKey: 'Geofence' },
  { id: 'alerts:read', labelKey: 'alerts:read', groupKey: 'Peringatan' },
  { id: 'alerts:write', labelKey: 'alerts:write', groupKey: 'Peringatan' },
  { id: 'reports:read', labelKey: 'reports:read', groupKey: 'Laporan' },
  { id: 'users:read', labelKey: 'users:read', groupKey: 'Pengguna' },
  { id: 'users:write', labelKey: 'users:write', groupKey: 'Pengguna' },
  { id: 'settings:write', labelKey: 'settings:write', groupKey: 'Pengaturan' }
];

interface RoleFormProps {
  role?: Role | null;
  locale?: RolesLocale;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoleForm({ role, locale = 'id', open, onOpenChange, onSuccess, onCancel }: RoleFormProps) {
  const t = getRolesTranslation(locale);
  const [formData, setFormData] = useState({
    name: role?.name || '',
    code: role?.code || '',
    description: role?.description || '',
    permissions: role?.permissions || []
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!role;
  const isReadOnly = role?.is_system === true;

  const displayCode = isEditing ? formData.code : formData.code;

  const togglePermission = (permId: string) => {
    if (isReadOnly) return;
    setFormData(prev => {
      const perms = prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: perms };
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/settings/roles/${role.id}`, {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        });
        toast.success(t.successUpdate);
      } else {
        await api.post('/settings/roles', {
          code: formData.code.toUpperCase().replace(/\s+/g, '_'),
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        });
        toast.success(t.successCreate);
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || t.failedSave);
    } finally {
      setLoading(false);
    }
  };

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, curr) => {
    const groupName = t.permGroups[curr.groupKey as keyof typeof t.permGroups] || curr.groupKey;
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push({
      ...curr,
      label: t.permLabels[curr.labelKey as keyof typeof t.permLabels] || curr.labelKey
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Consider * as all permissions
  const hasWildcard = formData.permissions.includes('*');

  return (
    <FormShell
      layout="default"
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? (isReadOnly ? "Detail Role Sistem" : t.editRole) : t.createNewRole}
      subtitle={isEditing ? (isReadOnly ? "Melihat informasi dan hak akses role bawaan sistem" : "Perbarui informasi dan hak akses role ini") : "Tambahkan role baru dan tentukan hak aksesnya"}
      onCancel={onCancel}
      onSave={isReadOnly ? undefined : () => handleSubmit()}
      onSubmit={isReadOnly ? undefined : handleSubmit}
      isSubmitting={loading}
      columns={1}
      actions={
        isReadOnly ? (
          <Button variant="outline" size="sm" onClick={onCancel} className="h-7 text-xs px-4">
            Tutup
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <FormCard
          title="Detail Role"
          description="Informasi dasar mengenai role ini"
          icon={<Shield className="w-5 h-5 text-primary" />}
          columns={2}
        >
          {(!isEditing || isReadOnly) && (
            <div className="col-span-2">
              <InputString
                id="code"
                label={t.internalCode}
                required
                disabled={true}
                placeholder={t.internalCodePlaceholder}
                value={displayCode}
                onChange={val => setFormData({ ...formData, code: val })}
                helpText={t.internalCodeHelp}
              />
            </div>
          )}

          <div className="col-span-2 sm:col-span-1">
            <InputString
              id="name"
              label={t.displayName}
              required
              disabled={isReadOnly}
              placeholder={t.displayNamePlaceholder}
              value={formData.name}
              onChange={val => {
                const newCode = val.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
                setFormData({ ...formData, name: val, code: isEditing ? formData.code : newCode });
              }}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <InputTextarea
              id="description"
              label={t.shortDescription}
              placeholder={t.shortDescriptionPlaceholder}
              disabled={isReadOnly}
              value={formData.description}
              onChange={val => setFormData({ ...formData, description: val })}
              rows={3}
            />
          </div>
        </FormCard>

        <FormCard
          title={t.permissionsList}
          description="Hak akses yang dimiliki oleh role ini"
          icon={<Lock className="w-5 h-5 text-primary" />}
          columns={1}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Pilih hak akses yang sesuai</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              {hasWildcard ? "Semua Akses" : `${formData.permissions.length} ${t.selected}`}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedPermissions).map(([group, perms]) => (
              <div key={group} className="flex flex-col gap-3 bg-muted/20 p-4 rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{group}</h4>
                <div className="flex flex-col gap-2">
                  {perms.map(perm => {
                    const isChecked = hasWildcard || formData.permissions.includes(perm.id);
                    return (
                      <label key={perm.id} className={`flex items-start gap-2.5 p-2 rounded transition-colors ${isReadOnly ? 'cursor-default opacity-80' : 'cursor-pointer hover:bg-muted/50'}`}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => togglePermission(perm.id)}
                          disabled={isReadOnly || hasWildcard}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-foreground select-none leading-tight mt-0.5">
                          {perm.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}
