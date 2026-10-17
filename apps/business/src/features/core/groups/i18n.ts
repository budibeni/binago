import type { Locale } from '@adatrack/types';

export const groupDictionaries = {
  id: {
    title: 'Grup',
    subtitle: 'Kelola pengelompokan kendaraan, pengemudi, geofence, dan rute.',
    tabs: {
      vehicles: 'Kendaraan',
      drivers: 'Pengemudi',
      geofences: 'Geofence',
      routes: 'Rute',
    },
    table: {
      searchPlaceholder: 'Cari grup...',
      selectTypePlaceholder: 'Pilih Tipe Grup',
      name: 'Nama Grup',
      description: 'Deskripsi',
      memberCount: 'Jumlah Anggota',
      actions: 'Aksi',
      unit: 'unit',
      emptyTitle: 'Grup Tidak Ditemukan',
      emptyDescription: 'Tidak ada data grup yang cocok dengan pencarian Anda.',
    },
    actions: {
      add: 'Tambah Grup',
      edit: 'Ubah',
      delete: 'Hapus',
      detail: 'Detail',
      refresh: 'Segarkan',
    },
    form: {
      addTitle: 'Tambah Grup',
      editTitle: 'Ubah Grup',
      name: 'Nama Grup',
      description: 'Deskripsi',
      descriptionPlaceholder: 'Masukkan deskripsi grup...',
      type: 'Tipe Grup',
      save: 'Simpan',
      cancel: 'Batal',
      placeholders: {
        vehicle: 'Contoh: Armada Logistik Jakarta',
        driver: 'Contoh: Tim Pengemudi Shift Pagi',
        geofence: 'Contoh: Wilayah Pergudangan',
        route: 'Contoh: Rute Distribusi Utama',
        default: 'Masukkan nama grup...',
      },
    },
    view: {
      title: 'Detail Grup',
      sectionInfo: 'Informasi Grup',
      name: 'Nama Grup',
      description: 'Deskripsi',
      type: 'Tipe Grup',
      memberCount: 'Jumlah Anggota',
    },
    delete: {
      title: 'Hapus Grup?',
      description: 'Apakah Anda yakin ingin menghapus grup ini? Tindakan ini tidak dapat dibatalkan.',
      confirm: 'Hapus',
      cancel: 'Batal',
    },
    toast: {
      createSuccess: 'Grup berhasil ditambahkan',
      updateSuccess: 'Grup berhasil diperbarui',
      deleteSuccess: 'Grup berhasil dihapus',
      deleteFailed: 'Gagal menghapus grup',
    },
    validation: {
      nameRequired: 'Nama grup wajib diisi',
      typeRequired: 'Tipe grup wajib dipilih',
      incompleteForm: 'Mohon lengkapi formulir dengan benar',
    },
  },
  en: {
    title: 'Groups',
    subtitle: 'Manage groupings of vehicles, drivers, geofences, and routes.',
    tabs: {
      vehicles: 'Vehicles',
      drivers: 'Drivers',
      geofences: 'Geofences',
      routes: 'Routes',
    },
    table: {
      searchPlaceholder: 'Search groups...',
      selectTypePlaceholder: 'Select Group Type',
      name: 'Group Name',
      description: 'Description',
      memberCount: 'Member Count',
      actions: 'Actions',
      unit: 'units',
      emptyTitle: 'No Groups Found',
      emptyDescription: 'No groups match your search criteria.',
    },
    actions: {
      add: 'Add Group',
      edit: 'Edit',
      delete: 'Delete',
      detail: 'Detail',
      refresh: 'Refresh',
    },
    form: {
      addTitle: 'Add Group',
      editTitle: 'Edit Group',
      name: 'Group Name',
      description: 'Description',
      descriptionPlaceholder: 'Enter group description...',
      type: 'Group Type',
      save: 'Save',
      cancel: 'Cancel',
      placeholders: {
        vehicle: 'e.g. Jakarta Logistics Fleet',
        driver: 'e.g. Morning Shift Drivers',
        geofence: 'e.g. Warehousing Area',
        route: 'e.g. Primary Distribution Route',
        default: 'Enter group name...',
      },
    },
    view: {
      title: 'Group Detail',
      sectionInfo: 'Group Information',
      name: 'Group Name',
      description: 'Description',
      type: 'Group Type',
      memberCount: 'Member Count',
    },
    delete: {
      title: 'Delete Group?',
      description: 'Are you sure you want to delete this group? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel',
    },
    toast: {
      createSuccess: 'Group created successfully',
      updateSuccess: 'Group updated successfully',
      deleteSuccess: 'Group deleted successfully',
      deleteFailed: 'Failed to delete group',
    },
    validation: {
      nameRequired: 'Group name is required',
      typeRequired: 'Group type is required',
      incompleteForm: 'Please complete the form correctly',
    },
  },
};

export function getGroupTranslation(locale: Locale = 'id') {
  return groupDictionaries[locale] || groupDictionaries.id;
}

export type GroupDictionary = typeof groupDictionaries.id;
