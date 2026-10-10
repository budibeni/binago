import React, { useState, useMemo } from 'react';
import { useRoles, Role } from './hooks/useRoles';
import { api } from '@adatrack/utils';
import { Button, Dialog, ConfirmDialog, toast, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { Shield, Edit2, Trash2, Plus, Info, Eye } from 'lucide-react';
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

  const [search, setSearch] = useState('');
  
  const filteredRoles = useMemo(() => {
    if (!search) return roles;
    const s = search.toLowerCase();
    return roles.filter(r => r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s) || (r.description && r.description.toLowerCase().includes(s)));
  }, [roles, search]);
  
  const dtLabels = useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) => isEn ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items` : `Menampilkan ${from}-${to} dari ${total.toLocaleString('id-ID')} data`,
      paginationPerPage: isEn ? '/ page' : '/ halaman',
      toolbarRefresh: isEn ? 'Refresh' : 'Refresh',
      toolbarFilter: isEn ? 'Filter' : 'Filter',
      toolbarColumns: isEn ? 'Columns' : 'Kolom',
      toolbarExport: isEn ? 'Export' : 'Ekspor',
      activeFilterClear: isEn ? 'Clear Filters' : 'Reset Filter',
      columnPanelHideAll: isEn ? 'Hide all' : 'Sembunyikan semua',
      columnPanelShowAll: isEn ? 'Show all' : 'Tampilkan semua',
      errorLoadData: isEn ? 'Failed to load data.' : 'Gagal memuat data.',
      errorTryAgain: isEn ? 'Try Again' : 'Coba Lagi',
      errorTitle: isEn ? 'An error occurred' : 'Terjadi Kesalahan',
      noResultTitle: isEn ? 'No results found' : 'Hasil Tidak Ditemukan',
      noResultDesc: isEn ? 'No data matches your search or filters.' : 'Tidak ada data yang sesuai dengan pencarian atau filter Anda.',
    };
  }, [locale]);
  
  const columns = useMemo<DataTableColumnDef<Role>[]>(() => [
    {
      id: 'name',
      header: t.name,
      accessorFn: (row) => row.name,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.name}
        </span>
      ),
      enableSorting: true,
      size: 200,
    },
    {
      id: 'code',
      header: t.code,
      accessorFn: (row) => row.code,
      cell: ({ row }) => (
        <span className="bg-muted px-2 py-1 rounded text-xs font-mono text-muted-foreground">
          {row.original.code}
        </span>
      ),
      enableSorting: true,
      size: 150,
    },
    {
      id: 'description',
      header: t.description,
      accessorFn: (row) => row.description,
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate max-w-[200px]" title={row.original.description}>
          {row.original.description || '-'}
        </span>
      ),
      enableSorting: false,
      size: 300,
    },
    {
      id: 'jenis',
      header: 'Jenis',
      accessorFn: (row) => row.is_system ? 'Sistem' : 'Kustom',
      cell: ({ row }) => (
        row.original.is_system ? (
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
            Sistem Bawaan
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            Kustom Tenant
          </span>
        )
      ),
      enableSorting: true,
      size: 150,
    },
    {
      id: 'actions',
      header: t.actions,
      enableSorting: false,
      size: 80,
      meta: { fixedWidth: true, align: 'right' },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          {!row.original.is_system ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-full">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full" onClick={() => handleEdit(row.original)}>
                <Info className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    }
  ], [t]);


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
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <DataTable<Role>
          data={filteredRoles}
          columns={columns}
          isLoading={loading}
          searchable
          sortable
          pagination
          columnVisibility
          exportable
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t.rolesDesc || "Search roles..."}
          labels={dtLabels}
          emptyTitle={t.noRoles}
          emptyDescription=""
          toolbarActions={
            <Button variant="destructive" onClick={handleCreate} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{t.createRole}</span>
            </Button>
          }
        />
      </div>

            {(isFormOpen || !!editingRole) && (
        <RoleForm 
          open={isFormOpen || !!editingRole}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false);
              setEditingRole(null);
            }
          }}
          role={editingRole} 
          locale={locale}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingRole(null);
            refetch();
          }} 
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRole(null);
          }}
        />
      )}

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
