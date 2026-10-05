import type { Locale } from '@adatrack/types';

export const pricingCategoryDictionaries = {
  id: {
    title: 'Kategori Tarif',
    pageSubtitle: 'Kelola master tarif penyewaan kendaraan',
    addBtn: 'Tambah',
    exportBtn: 'Ekspor',
    searchPlaceholder: 'Cari kategori tarif...',
    actionDetail: 'Detail',
    actionEdit: 'Edit',
    formAddTitle: 'Tambah Kategori Tarif Baru',
    formEditTitle: 'Edit Kategori Tarif',
    headerName: 'Kategori Tarif',
    headerDesc: 'Deskripsi',
    headerVehicles: 'Kendaraan',
    headerStatus: 'Status',
    statusActive: 'Aktif',
    statusInactive: 'Nonaktif',
    unit: 'unit',
    createSuccess: 'Kategori tarif berhasil ditambahkan',
    updateSuccess: 'Kategori tarif berhasil diperbarui',
    deleteSuccess: 'Kategori tarif berhasil dihapus',
    filterAll: 'Semua',
    filterStatus: 'Status',
    clearFilters: 'Hapus Filter',
  },
  en: {
    title: 'Pricing Category',
    pageSubtitle: 'Manage rental pricing categories',
    addBtn: 'Add',
    exportBtn: 'Export',
    searchPlaceholder: 'Search pricing category...',
    actionDetail: 'Detail',
    actionEdit: 'Edit',
    formAddTitle: 'Add New Pricing Category',
    formEditTitle: 'Edit Pricing Category',
    headerName: 'Pricing Category',
    headerDesc: 'Description',
    headerVehicles: 'Vehicles',
    headerStatus: 'Status',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    unit: 'units',
    createSuccess: 'Pricing category successfully added',
    updateSuccess: 'Pricing category successfully updated',
    deleteSuccess: 'Pricing category successfully deleted',
    filterAll: 'All',
    filterStatus: 'Status',
    clearFilters: 'Clear Filters',
  }
};

export function getPricingCategoryTranslation(locale: Locale | string = 'id') {
  const normalizedLocale = locale.startsWith('en') ? 'en' : 'id';
  return pricingCategoryDictionaries[normalizedLocale as keyof typeof pricingCategoryDictionaries];
}
