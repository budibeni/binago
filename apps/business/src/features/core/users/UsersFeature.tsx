'use client';

import React, { useState, useMemo } from 'react';
import { useUsers, TenantUser } from './hooks/useUsers';
import { useRoles } from '../roles/hooks/useRoles';
import { api } from '@adatrack/utils';
import { Button, ConfirmDialog, toast, DataTable, Badge } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { User, Edit2, Trash2, Plus, Sliders, CheckCircle2, XCircle } from 'lucide-react';
import { UserForm } from './components/UserForm';
import { UserMenuAccessModal } from './components/UserMenuAccessModal';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';

export function UsersFeature() {
  const locale = useBusinessLocale();
  const isEn = locale === 'en';

  const { users, loading, refetch } = useUsers();
  const { roles } = useRoles();

  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<TenantUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<TenantUser | null>(null);
  const [menuAccessUser, setMenuAccessUser] = useState<TenantUser | null>(null);

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: TenantUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: TenantUser) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/settings/users/${userToDelete.id}`);
      toast.success(isEn ? 'User deleted successfully' : 'Pengguna berhasil dihapus dari perusahaan');
      refetch();
    } catch (err: any) {
      toast.error(err.message || (isEn ? 'Failed to delete user' : 'Gagal menghapus pengguna'));
    } finally {
      setUserToDelete(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const s = search.toLowerCase();
    return users.filter(
      (u) =>
        u.full_name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.role_name.toLowerCase().includes(s) ||
        u.role_code.toLowerCase().includes(s)
    );
  }, [users, search]);

  const dtLabels = useMemo(() => {
    return {
      paginationShowing: (from: number, to: number, total: number) =>
        isEn
          ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items`
          : `Menampilkan ${from}-${to} dari ${total.toLocaleString('id-ID')} data`,
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
      noResultDesc: isEn
        ? 'No users match your search or filters.'
        : 'Tidak ada data pengguna yang sesuai dengan pencarian.',
    };
  }, [isEn]);

  const columns = useMemo<DataTableColumnDef<TenantUser>[]>(
    () => [
      {
        id: 'full_name',
        header: isEn ? 'Full Name' : 'Nama Pengguna',
        accessorFn: (row) => row.full_name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
              {(row.original.full_name || row.original.email || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-foreground truncate">{row.original.full_name || '-'}</span>
              <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
            </div>
          </div>
        ),
        enableSorting: true,
        size: 250,
      },
      {
        id: 'role',
        header: 'Role / Peran',
        accessorFn: (row) => row.role_name,
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
            {row.original.role_name || row.original.role_code}
          </span>
        ),
        enableSorting: true,
        size: 160,
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => (row.is_active ? 'Aktif' : 'Nonaktif'),
        cell: ({ row }) => (
          row.original.is_active ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Aktif
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              Nonaktif
            </span>
          )
        ),
        enableSorting: true,
        size: 120,
      },
      {
        id: 'created_at',
        header: isEn ? 'Created At' : 'Terdaftar Pada',
        accessorFn: (row) => row.created_at,
        cell: ({ row }) => {
          try {
            const date = new Date(row.original.created_at);
            return (
              <span className="text-xs text-muted-foreground">
                {date.toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            );
          } catch {
            return <span className="text-xs text-muted-foreground">-</span>;
          }
        },
        enableSorting: true,
        size: 150,
      },
      {
        id: 'actions',
        header: isEn ? 'Actions' : 'Aksi',
        enableSorting: false,
        size: 110,
        meta: { fixedWidth: true, align: 'right' },
        cell: ({ row }) => (
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuAccessUser(row.original)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
              title="Atur Hak Akses Menu Pengguna"
            >
              <Sliders className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(row.original)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
              title="Edit Data Pengguna"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original)}
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-full"
              title="Hapus Pengguna"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [isEn]
  );

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <DataTable<TenantUser>
          data={filteredUsers}
          columns={columns}
          isLoading={loading}
          searchable
          sortable
          pagination
          columnVisibility
          exportable
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={isEn ? 'Search users by name, email, or role...' : 'Cari pengguna berdasarkan nama, email, atau role...'}
          labels={dtLabels}
          emptyTitle={isEn ? 'No users found' : 'Belum Ada Pengguna'}
          emptyDescription={
            isEn
              ? 'Click the button below to add your first user.'
              : 'Klik tombol di bawah untuk menambahkan pengguna baru.'
          }
          toolbarActions={
            <Button
              variant="destructive"
              onClick={handleCreate}
              className="h-8 gap-1.5 text-[13px] font-medium shadow-none"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{isEn ? 'Add User' : 'Tambah Pengguna'}</span>
            </Button>
          }
        />
      </div>

      {(isFormOpen || !!editingUser) && (
        <UserForm
          open={isFormOpen || !!editingUser}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false);
              setEditingUser(null);
            }
          }}
          user={editingUser}
          roles={roles}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingUser(null);
            refetch();
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      <UserMenuAccessModal
        user={menuAccessUser}
        open={!!menuAccessUser}
        onOpenChange={(open) => !open && setMenuAccessUser(null)}
        onSuccess={() => {
          refetch();
        }}
      />

      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        title={isEn ? 'Delete User' : 'Hapus Pengguna'}
        description={
          userToDelete
            ? isEn
              ? `Are you sure you want to remove user "${userToDelete.full_name || userToDelete.email}" from this company?`
              : `Apakah Anda yakin ingin menghapus akses pengguna "${userToDelete.full_name || userToDelete.email}" dari perusahaan ini?`
            : ''
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
