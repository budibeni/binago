import type { Locale } from '@adatrack/types';

export const rentalCustomersDictionaries = {
  id: {
    title: 'Pelanggan Rental',
    pageSubtitle: 'Manajemen data pelanggan perorangan dan perusahaan.',
    searchPlaceholder: 'Cari nama, kode, no. telepon, NIK, atau NPWP...',
    addCustomer: 'Tambah',
    exportFilename: 'pelanggan-rental-adatrack',
    filterType: 'Tipe',
    filterStatus: 'Status',
    filterAll: 'Semua',
    typeIndividual: 'Perorangan',
    typeCompany: 'Perusahaan',
    statusActive: 'Aktif',
    statusInactive: 'Nonaktif',
    clearFilters: 'Hapus Filter',
    
    // Table Columns
    colCode: 'Kode',
    colCustomer: 'Pelanggan',
    colType: 'Tipe',
    colContact: 'Kontak',
    colPic: 'PIC',
    colActiveVehicles: 'Armada Aktif',
    colActiveContracts: 'Kontrak Aktif',
    colStatus: 'Status',
    colActions: 'Aksi',
    
    // Empty state
    emptyTitle: 'Belum ada pelanggan',
    emptyDescription: 'Belum ada data pelanggan yang tersedia.',
    noResultTitle: 'Pelanggan tidak ditemukan',
    noResultDescription: 'Coba sesuaikan kata kunci atau filter pencarian.',
    
    // Drawer / Detail
    detailTitle: 'Detail Pelanggan',
    detailClose: 'Tutup',
    tabPersonalInfo: 'Data Pribadi',
    tabCompanyInfo: 'Informasi Perusahaan',
    tabAddress: 'Alamat',
    tabLegal: 'Legalitas',
    tabPic: 'PIC',
    tabSim: 'Data SIM',
    
    // Form / Actions
    actionDetail: 'Lihat Detail',
    actionEdit: 'Edit Pelanggan',
    actionDelete: 'Hapus',
    confirmDelete: 'Hapus Pelanggan',
    confirmDeleteDesc: 'Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.',
    cancel: 'Batal',
    confirm: 'Hapus',
    save: 'Simpan',
    createSuccess: 'Pelanggan berhasil ditambahkan.',
    updateSuccess: 'Data pelanggan berhasil diperbarui.',
    deleteSuccess: 'Pelanggan berhasil dihapus.',
    
    // Form Fields
    fieldCustomerType: 'Tipe Pelanggan',
    fieldFullName: 'Nama Lengkap',
    fieldCompanyName: 'Nama Perusahaan',
    fieldNik: 'NIK / KTP',
    fieldNib: 'NIB',
    fieldNpwp: 'NPWP',
    fieldPhone: 'No. HP / Telepon',
    fieldEmail: 'Email',
    fieldAddress: 'Alamat',
    fieldCity: 'Kota',
    fieldProvince: 'Provinsi',
    fieldPostalCode: 'Kode Pos',
    fieldBirthPlace: 'Tempat Lahir',
    fieldBirthDate: 'Tanggal Lahir',
    fieldSimNumber: 'Nomor SIM',
    fieldSimType: 'Jenis SIM',
    fieldSimExpiredAt: 'Masa Berlaku SIM',
    fieldPicName: 'Nama PIC',
    fieldPicPosition: 'Jabatan PIC',
    fieldPicPhone: 'No. HP PIC',
    fieldPicEmail: 'Email PIC',
    fieldPicNik: 'NIK PIC',
    fieldStatus: 'Status',
    
    // Placeholders
    placeholderName: 'Masukkan nama',
    placeholderNik: 'Masukkan NIK',
    placeholderPhone: 'Contoh: 081234567890',
    placeholderEmail: 'contoh@email.com',

    validation: {
      typeRequired: 'Tipe pelanggan wajib dipilih',
      nameRequired: 'Nama wajib diisi',
      phoneRequired: 'No. telepon wajib diisi',
      nikRequired: 'NIK/KTP wajib diisi',
      simRequired: 'No. SIM wajib diisi',
      npwpRequired: 'NPWP wajib diisi',
      picNameRequired: 'Nama PIC wajib diisi',
      picPhoneRequired: 'No. telepon PIC wajib diisi',
    }
  },
  en: {
    title: 'Rental Customers',
    pageSubtitle: 'Manage individual and company customer data.',
    searchPlaceholder: 'Search name, code, phone, NIK, or NPWP...',
    addCustomer: 'Add Customer',
    exportFilename: 'rental-customers-adatrack',
    filterType: 'Type',
    filterStatus: 'Status',
    filterAll: 'All',
    typeIndividual: 'Individual',
    typeCompany: 'Company',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    clearFilters: 'Clear Filters',
    
    // Table Columns
    colCode: 'Code',
    colCustomer: 'Customer',
    colType: 'Type',
    colContact: 'Contact',
    colPic: 'PIC',
    colActiveVehicles: 'Active Vehicles',
    colActiveContracts: 'Active Contracts',
    colStatus: 'Status',
    colActions: 'Actions',
    
    // Empty state
    emptyTitle: 'No customers yet',
    emptyDescription: 'No customer data available yet.',
    noResultTitle: 'Customer not found',
    noResultDescription: 'Try adjusting search keywords or filters.',
    
    // Drawer / Detail
    detailTitle: 'Customer Detail',
    detailClose: 'Close',
    tabPersonalInfo: 'Personal Data',
    tabCompanyInfo: 'Company Info',
    tabAddress: 'Address',
    tabLegal: 'Legal',
    tabPic: 'PIC',
    tabSim: 'SIM Data',
    
    // Form / Actions
    actionDetail: 'View Detail',
    actionEdit: 'Edit Customer',
    actionDelete: 'Delete',
    confirmDelete: 'Delete Customer',
    confirmDeleteDesc: 'Are you sure you want to delete this customer? This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Delete',
    save: 'Save',
    createSuccess: 'Customer added successfully.',
    updateSuccess: 'Customer data updated successfully.',
    deleteSuccess: 'Customer deleted successfully.',
    
    // Form Fields
    fieldCustomerType: 'Customer Type',
    fieldFullName: 'Full Name',
    fieldCompanyName: 'Company Name',
    fieldNik: 'NIK / KTP',
    fieldNib: 'NIB',
    fieldNpwp: 'NPWP',
    fieldPhone: 'Phone',
    fieldEmail: 'Email',
    fieldAddress: 'Address',
    fieldCity: 'City',
    fieldProvince: 'Province',
    fieldPostalCode: 'Postal Code',
    fieldBirthPlace: 'Birth Place',
    fieldBirthDate: 'Birth Date',
    fieldSimNumber: 'SIM Number',
    fieldSimType: 'SIM Type',
    fieldSimExpiredAt: 'SIM Expiry Date',
    fieldPicName: 'PIC Name',
    fieldPicPosition: 'PIC Position',
    fieldPicPhone: 'PIC Phone',
    fieldPicEmail: 'PIC Email',
    fieldPicNik: 'PIC NIK',
    fieldStatus: 'Status',
    
    // Placeholders
    placeholderName: 'Enter name',
    placeholderNik: 'Enter NIK',
    placeholderPhone: 'E.g. 081234567890',
    placeholderEmail: 'example@email.com',

    validation: {
      typeRequired: 'Customer type is required',
      nameRequired: 'Name is required',
      phoneRequired: 'Phone is required',
      nikRequired: 'NIK/ID is required',
      simRequired: 'SIM is required',
      npwpRequired: 'NPWP is required',
      picNameRequired: 'PIC Name is required',
      picPhoneRequired: 'PIC Phone is required',
    }
  }
};

export function getRentalCustomersTranslation(locale: Locale = 'id') {
  return rentalCustomersDictionaries[locale] || rentalCustomersDictionaries.id;
}
