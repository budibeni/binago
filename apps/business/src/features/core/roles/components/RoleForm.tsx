import React, { useState } from 'react';
import { api } from '@adatrack/utils';
import { Button, toast, InputString, InputTextarea, Checkbox } from '@adatrack/ui';
import { Role } from '../hooks/useRoles';
import { getRolesTranslation, RolesLocale } from '../i18n';

// Available permissions in Adatrack
const AVAILABLE_PERMISSIONS = [
  { id: 'vehicles:read', labelKey: 'vehicles:read', groupKey: 'Kendaraan' },
  { id: 'vehicles:write', labelKey: 'vehicles:write', groupKey: 'Kendaraan' },
  { id: 'routes:read', labelKey: 'routes:read', groupKey: 'Rute & Penugasan' },
  { id: 'routes:write', labelKey: 'routes:write', groupKey: 'Rute & Penugasan' },
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
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoleForm({ role, locale = 'id', onSuccess, onCancel }: RoleFormProps) {
  const t = getRolesTranslation(locale);
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 w-full max-w-md sm:w-[500px]">
      
      {!isEditing && (
        <InputString
          id="code"
          label={t.internalCode}
          required
          disabled={isEditing}
          placeholder={t.internalCodePlaceholder}
          value={displayCode}
          onChange={val => setFormData({ ...formData, code: val })}
          helpText={t.internalCodeHelp}
        />
      )}

      <InputString
        id="name"
        label={t.displayName}
        required
        placeholder={t.displayNamePlaceholder}
        value={formData.name}
        onChange={val => setFormData({ ...formData, name: val })}
      />

      <InputTextarea
        id="description"
        label={t.shortDescription}
        placeholder={t.shortDescriptionPlaceholder}
        value={formData.description}
        onChange={val => setFormData({ ...formData, description: val })}
        rows={2}
      />

      <div className="flex flex-col gap-3 mt-2 border-t pt-4 border-border">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {t.permissionsList}
          </label>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {formData.permissions.length} {t.selected}
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
        <Button type="button" variant="outline" onClick={onCancel}>{t.cancel}</Button>
        <Button type="submit" disabled={loading}>
          {loading ? t.saving : t.saveRole}
        </Button>
      </div>
    </form>
  );
}
