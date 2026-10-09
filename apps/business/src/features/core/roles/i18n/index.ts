export type RolesLocale = 'id' | 'en';

export const rolesTranslations = {
  id: {
    // page.tsx
    usersManagement: 'Manajemen Pengguna',
    rolesAccess: 'Hak Akses (Roles)',
    usersModule: 'Modul Pengguna',
    usersModuleDesc: 'Daftar pengguna aplikasi akan ditampilkan di sini. Anda dapat mengatur pengguna mana yang mendapat role spesifik.',
    // RolesFeature.tsx
    createRole: 'Buat Role Baru',
    rolesList: 'Daftar Hak Akses (Roles)',
    rolesDesc: 'Kelola peran dan wewenang pengguna dalam sistem.',
    code: 'Kode',
    name: 'Nama',
    description: 'Deskripsi',
    users: 'Pengguna',
    permissions: 'Hak Akses',
    actions: 'Aksi',
    noRoles: 'Belum ada role kustom',
    createFirstRole: 'Buat role kustom pertama Anda',
    editRole: 'Edit Role Kustom',
    createNewRole: 'Buat Role Kustom Baru',
    deleteRole: 'Hapus Role',
    deleteConfirm: 'Apakah Anda yakin ingin menghapus role "{name}"? Pengguna dengan role ini mungkin akan kehilangan akses ke sistem jika tidak diubah ke role lain.',
    // RoleForm.tsx
    internalCode: 'Kode Internal',
    internalCodePlaceholder: 'Cth: KEPALA_GUDANG',
    internalCodeHelp: 'Kode unik yang digunakan oleh sistem (tanpa spasi). Sistem otomatis menambahkan awalan CUSTOM_.',
    displayName: 'Nama Tampilan',
    displayNamePlaceholder: 'Contoh: Kepala Gudang Pusat',
    shortDescription: 'Deskripsi Singkat',
    shortDescriptionPlaceholder: 'Tugas dan wewenang role ini...',
    permissionsList: 'Daftar Hak Akses',
    selected: 'dipilih',
    cancel: 'Batal',
    saveRole: 'Simpan Role',
    saving: 'Menyimpan...',
    successUpdate: 'Role berhasil diperbarui',
    successCreate: 'Role berhasil dibuat',
    failedSave: 'Gagal menyimpan role',
    // Permissions groups & labels
    permGroups: {
      'Kendaraan': 'Kendaraan',
      'Rute & Penugasan': 'Rute & Penugasan',
      'Geofence': 'Geofence',
      'Peringatan': 'Peringatan',
      'Laporan': 'Laporan',
      'Pengguna': 'Pengguna',
      'Pengaturan': 'Pengaturan'
    },
    permLabels: {
      'vehicles:read': 'Melihat Kendaraan',
      'vehicles:write': 'Mengelola Kendaraan (Tambah/Edit/Hapus)',
      'routes:read': 'Melihat Rute',
            'routes:write': 'Mengelola Rute',
      'assignments:read': 'Melihat Penugasan',
      'assignments:write': 'Mengelola Penugasan',
      'geofences:read': 'Melihat Geofence',
      'geofences:write': 'Mengelola Geofence',
      'alerts:read': 'Melihat Peringatan (Alerts & SOS)',
      'alerts:write': 'Mengelola Peringatan',
      'reports:read': 'Melihat Laporan',
      'users:read': 'Melihat Pengguna/Karyawan',
      'users:write': 'Mengelola Pengguna/Karyawan',
      'settings:write': 'Mengelola Pengaturan & Role'
    }
  },
  en: {
    // page.tsx
    usersManagement: 'User Management',
    rolesAccess: 'Roles & Access',
    usersModule: 'Users Module',
    usersModuleDesc: 'Application user list will be displayed here. You can manage which user gets specific roles.',
    // RolesFeature.tsx
    createRole: 'Create New Role',
    rolesList: 'Roles & Access List',
    rolesDesc: 'Manage user roles and permissions in the system.',
    code: 'Code',
    name: 'Name',
    description: 'Description',
    users: 'Users',
    permissions: 'Permissions',
    actions: 'Actions',
    noRoles: 'No custom roles yet',
    createFirstRole: 'Create your first custom role',
    editRole: 'Edit Custom Role',
    createNewRole: 'Create New Custom Role',
    deleteRole: 'Delete Role',
    deleteConfirm: 'Are you sure you want to delete the role "{name}"? Users with this role might lose system access if not changed to another role.',
    // RoleForm.tsx
    internalCode: 'Internal Code',
    internalCodePlaceholder: 'E.g: WAREHOUSE_HEAD',
    internalCodeHelp: 'Unique code used by the system (no spaces). System automatically adds CUSTOM_ prefix.',
    displayName: 'Display Name',
    displayNamePlaceholder: 'E.g: Central Warehouse Head',
    shortDescription: 'Short Description',
    shortDescriptionPlaceholder: 'Tasks and authority of this role...',
    permissionsList: 'Permissions List',
    selected: 'selected',
    cancel: 'Cancel',
    saveRole: 'Save Role',
    saving: 'Saving...',
    successUpdate: 'Role successfully updated',
    successCreate: 'Role successfully created',
    failedSave: 'Failed to save role',
    // Permissions groups & labels
    permGroups: {
      'Kendaraan': 'Vehicles',
      'Rute & Penugasan': 'Routes & Assignments',
      'Geofence': 'Geofences',
      'Peringatan': 'Alerts',
      'Laporan': 'Reports',
      'Pengguna': 'Users',
      'Pengaturan': 'Settings'
    },
    permLabels: {
      'vehicles:read': 'View Vehicles',
      'vehicles:write': 'Manage Vehicles (Add/Edit/Delete)',
      'routes:read': 'View Routes',
            'routes:write': 'Manage Routes',
      'assignments:read': 'View Assignments',
      'assignments:write': 'Manage Assignments',
      'geofences:read': 'View Geofences',
      'geofences:write': 'Manage Geofences',
      'alerts:read': 'View Alerts (Alerts & SOS)',
      'alerts:write': 'Manage Alerts',
      'reports:read': 'View Reports',
      'users:read': 'View Users/Employees',
      'users:write': 'Manage Users/Employees',
      'settings:write': 'Manage Settings & Roles'
    }
  }
};

export function getRolesTranslation(locale: RolesLocale = 'id') {
  return rolesTranslations[locale] || rolesTranslations.id;
}
