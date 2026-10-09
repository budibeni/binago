import React, { useState } from 'react';
import { useRoles, Role } from './hooks/useRoles';
import { api } from '@adatrack/utils';
import { Button, Dialog, ConfirmDialog, toast } from '@adatrack/ui';
import { Shield, Edit2, Trash2, Plus, Info } from 'lucide-react';
import { RoleForm } from './components/RoleForm';

export function RolesFeature() {
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
      toast.error('Role sistem bawaan tidak dapat dihapus');
      return;
    }
    setRoleToDelete(role);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      await api.delete(`/settings/roles/${roleToDelete.id}`);
      toast.success('Role berhasil dihapus');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus role');
    } finally {
      setRoleToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            Manajemen Hak Akses (RBAC)
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Kelola peran (role) dan izin akses untuk pengguna di perusahaan Anda.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Buat Role Kustom
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden flex-1">
        {loading ? (
          <div className="p-8 text-center text-neutral-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                <tr>
                  <th className="px-6 py-4">Nama Role</th>
                  <th className="px-6 py-4">Kode Internal</th>
                  <th className="px-6 py-4">Deskripsi</th>
                  <th className="px-6 py-4 text-center">Jenis</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {roles.map(role => (
                  <tr key={role.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                      {role.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-xs font-mono text-neutral-600 dark:text-neutral-400">
                        {role.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 truncate max-w-[200px]" title={role.description}>
                      {role.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {role.is_system ? (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Sistem Bawaan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Kustom Tenant
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!role.is_system && (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(role)} className="h-8 px-2 text-neutral-600">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(role)} className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {role.is_system && (
                         <div className="flex justify-end">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-neutral-400" onClick={() => toast.info('Role sistem tidak dapat diubah, namun Anda dapat membuat role kustom baru yang menyerupainya.')}>
                                <Info className="w-4 h-4" />
                            </Button>
                         </div>
                      )}
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                      Belum ada role yang tersedia.
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
        title={editingRole ? 'Edit Role Kustom' : 'Buat Role Kustom Baru'}
      >
        <RoleForm 
          role={editingRole} 
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
        title="Hapus Role"
        description={`Apakah Anda yakin ingin menghapus role "${roleToDelete?.name}"? Pengguna dengan role ini mungkin akan kehilangan akses ke sistem jika tidak diubah ke role lain.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
