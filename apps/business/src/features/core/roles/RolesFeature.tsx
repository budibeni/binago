import React, { useState } from 'react';
import { useRoles, Role } from './hooks/useRoles';
import { api } from '@adatrack/utils';
import { Button, Dialog, ConfirmDialog, toast } from '@adatrack/ui';
import { Shield, Edit2, Trash2, Plus, Info } from 'lucide-react';
import { RoleForm } from './components/RoleForm';
import { getRolesTranslation, RolesLocale } from './i18n';

interface RolesFeatureProps {
  locale?: RolesLocale;
}

export function RolesFeature({ locale = 'id' }: RolesFeatureProps) {
  const t = getRolesTranslation(locale);
  const { roles, loading, refetch } = useRoles();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const handleCreate = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleDelete = (role: Role) => {
    if (role.is_system) {
      toast.error('Role sistem bawaan tidak dapat dihapus'); // System error, usually not translated, but let's keep it
      return;
    }
    setRoleToDelete(role);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      await api.delete(`/settings/roles/${roleToDelete.id}`);
      toast.success(t.successUpdate); // Reusing general success msg for now or we could add successDelete
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus role');
    } finally {
      setRoleToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Shield className="w-6 h-6 text-primary" />
            {t.rolesList}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.rolesDesc}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          {t.createRole}
        </Button>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden flex-1 flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground flex-1 flex items-center justify-center">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4">{t.name}</th>
                  <th className="px-6 py-4">{t.code}</th>
                  <th className="px-6 py-4">{t.description}</th>
                  <th className="px-6 py-4 text-center">Jenis</th>
                  <th className="px-6 py-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roles.map(role => (
                  <tr key={role.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {role.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-muted px-2 py-1 rounded text-xs font-mono text-muted-foreground">
                        {role.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]" title={role.description}>
                      {role.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {role.is_system ? (
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Sistem Bawaan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Kustom Tenant
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!role.is_system && (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(role)} className="h-8 w-8 p-0 text-muted-foreground">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(role)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {role.is_system && (
                         <div className="flex justify-end">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground/50" onClick={() => toast.info('Role sistem tidak dapat diubah, namun Anda dapat membuat role kustom baru yang menyerupainya.')}>
                                <Info className="w-4 h-4" />
                            </Button>
                         </div>
                      )}
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Shield className="w-10 h-10 opacity-20 mb-2" />
                      <p>{t.noRoles}</p>
                      <Button variant="link" onClick={handleCreate}>{t.createFirstRole}</Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog 
        open={isFormOpen} 
        onOpenChange={(open) => !open && setIsFormOpen(false)}
        title={editingRole ? t.editRole : t.createNewRole}
      >
        <RoleForm 
          role={editingRole} 
          locale={locale}
          onSuccess={() => {
            setIsFormOpen(false);
            refetch();
          }} 
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>

      <ConfirmDialog
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        title={t.deleteRole}
        description={roleToDelete ? t.deleteConfirm.replace('{name}', roleToDelete.name) : ''}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
