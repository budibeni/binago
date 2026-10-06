import type { Locale } from '@adatrack/types';

export const rentalVehiclesDictionaries = {
  id: {
    title: 'Kendaraan Rental',
    pageSubtitle: 'Kelola ketersediaan dan informasi kendaraan untuk kebutuhan rental.',
    searchPlaceholder: 'Cari...',
    addVehicle: 'Tambah',
    exportFilename: 'kendaraan-rental-adatrack',

    // Columns
    colLicensePlate: 'Plat Nomor',
    colPricingCategory: 'Kategori Tarif',
    
    // Filter & Status
    filterStatus: 'Status',
    filterTitle: 'Filter',
    filterClear: 'Hapus Filter',
    filterAll: 'Semua',
    summaryTitle: 'Ringkasan',
    totalVehicle: 'Total Kendaraan',
    selectedVehicle: 'kendaraan terpilih',
    openLocation: 'Buka Lokasi',
    dtColumns: 'Kolom',
    dtExport: 'Ekspor',
    dtPerPage: '/halaman',
    dtShowing: (from: number, to: number, total: number) => `Menampilkan ${from}-${to} dari ${total}`,
    statusReady: 'Tersedia',
    statusReserved: 'Dipesan',
    statusRented: 'Disewa',
    statusMaintenance: 'Perawatan',
    statusUnavailable: 'Nonaktif',
    
    // Data Completeness
    dataComplete: 'Data Rental Lengkap',
    dataCompleteShort: 'Lengkap',
    dataCompleteBadge: 'Data Lengkap',
    dataCompleteDesc: 'Seluruh data profil rental telah diisi.',
    dataNotComplete: 'Data Rental Belum Lengkap',
    dataNotCompleteShort: 'Belum Lengkap',
    dataNotCompleteBadge: 'Belum Lengkap',
    dataNotCompleteDesc: 'Harap lengkapi tarif dan dokumen rental.',
    actionCompleteData: 'Lengkapi Data Rental',
    
    // Detail & Form Section
    detailTitle: 'Detail Kendaraan',
    tabCoreInfo: 'Data Kendaraan',
    tabRentalInfo: 'Data Rental',
    coreInfoNotice: 'Data kendaraan dikelola di Master Data Kendaraan. Tidak boleh diedit dari halaman Rental.',
    alreadyRegistered: 'Kendaraan sudah terdaftar pada Kendaraan Rental.',
    noCoreVehicles: 'Tidak ada kendaraan master yang belum didaftarkan ke rental.',
    
    // Table Columns
    colVehicle: 'Kendaraan',
    colYear: 'Tahun',
    colStatus: 'Status',
    colCustomer: 'Pelanggan',
    colPeriod: 'Periode Rental',
    colRate: 'Tarif',
    colDailyRate: 'Tarif Harian',
    colWeeklyRate: 'Tarif Mingguan',
    colMonthlyRate: 'Tarif Bulanan',
    colCondition: 'Kondisi',
    colCompleteness: 'Kelengkapan Data',
    colNotes: 'Catatan',
    colActions: 'Aksi',
    
    // Form fields
    fieldSelectVehicle: 'Pilih Kendaraan',
    fieldRentalStatus: 'Status Rental',
    fieldDailyRate: 'Tarif Harian',
    fieldWeeklyRate: 'Tarif Mingguan',
    fieldMonthlyRate: 'Tarif Bulanan',
    fieldDeposit: 'Deposit',
    fieldCondition: 'Kondisi',
    fieldStartOdo: 'Kilometer Saat Tersedia',
    fieldCurrentOdo: 'Kilometer Terakhir',
    fieldNotes: 'Catatan',
    fieldStnkExpiry: 'Masa Berlaku STNK',
    fieldTaxExpiry: 'Masa Berlaku Pajak',
    fieldInsuranceExpiry: 'Masa Berlaku Asuransi',
    fieldEquipment: 'Kelengkapan',
    
    // Equipment options
    equipStnk: 'STNK Original',
    equipSpareKey: 'Kunci Cadangan',
    equipSpareTire: 'Ban Cadangan',
    equipJackAndTools: 'Dongkrak & Toolkit',
    equipFirstAid: 'P3K',
    
    // Conditions
    conditionGood: 'Baik',
    conditionMinor: 'Kerusakan Ringan',
    conditionRepair: 'Perlu Perbaikan',
    
    // Actions
    actionDetail: 'Detail',
    actionEdit: 'Edit Data Rental',
    actionDisable: 'Nonaktifkan dari Rental',
    confirmDisable: 'Nonaktifkan Kendaraan Rental',
    confirmDisableDesc: 'Apakah Anda yakin ingin menonaktifkan kendaraan ini dari Kendaraan Rental? Data master pada CORE Vehicle tidak akan terhapus.',
    cancel: 'Batal',
    confirm: 'Nonaktifkan',
    save: 'Simpan',
    createSuccess: 'Kendaraan Rental berhasil didaftarkan.',
    updateSuccess: 'Data Kendaraan Rental berhasil diperbarui.',
    deleteSuccess: 'Kendaraan berhasil dinonaktifkan dari Rental.',
    
    // Empty state
    emptyTitle: 'Belum ada Kendaraan Rental',
    emptyDescription: 'Belum ada profil kendaraan rental yang terdaftar.',
    noResultTitle: 'Kendaraan tidak ditemukan',
    noResultDescription: 'Coba sesuaikan kata kunci atau filter pencarian.',

    // Form section titles & helpers
    sectionVehicleData: 'Data Kendaraan',
    sectionVehicleDataDesc: 'Data kendaraan dikelola di Master Data Kendaraan. Informasi berikut bersifat read-only.',
    sectionRentalData: 'Data Rental',
    sectionRentalDataDesc: 'Pengaturan tarif, status, kondisi, dan kilometer.',
    sectionNotes: 'Catatan',
    sectionNotesDesc: 'Informasi tambahan atau catatan khusus mengenai kendaraan rental ini.',
    sectionDocExpiry: 'Masa Berlaku Dokumen',
    sectionEquipmentTitle: 'Kelengkapan Kendaraan',
    sectionEquipmentDesc: 'Ceklis perlengkapan yang tersedia di kendaraan ini.',

    // Status auto-manage
    statusSystemManaged: 'Status dikelola otomatis oleh sistem karena ada transaksi aktif.',
    statusManualHint: 'Set manual untuk Maintenance atau Tidak Tersedia. Status lain dikelola otomatis saat ada transaksi.',

    // Pricing
    pricingLabel: 'Pengaturan Tarif',
    pricingCategory: 'Tarif Kategori',
    pricingIndependent: 'Tarif Mandiri (Kustom)',
    fieldPricingCategoryId: 'Pilih Kategori Tarif',
    fieldDailyRateRp: 'Tarif Harian (Rp)',
    fieldWeeklyRateRp: 'Tarif Mingguan (Rp)',
    fieldMonthlyRateRp: 'Tarif Bulanan (Rp)',
    fieldDepositRp: 'Deposit (Rp)',

    // Core vehicle labels
    fieldPlatNomor: 'Plat Nomor',
    fieldGrup: 'Grup',
    fieldMerk: 'Merk',
    fieldAlias: 'Kendaraan (Alias)',
    fieldKategori: 'Kategori',
    fieldTahun: 'Tahun',
    fieldWarna: 'Warna',
    fieldBahanBakar: 'Bahan Bakar',
    fieldNoStnk: 'No. STNK',
    fieldBerlakuStnk: 'Berlaku STNK',

    // Notes placeholder
    notesPlaceholder: 'Tulis catatan (opsional)',

    validationRequired: 'Wajib diisi',
    validationCategoryRequired: 'Kategori Tarif wajib dipilih'
  },
  en: {
    title: 'Rental Vehicles',
    pageSubtitle: 'Manage vehicle availability and information for rental operations.',
    searchPlaceholder: 'Search...',
    addVehicle: 'Add',
    exportFilename: 'rental-vehicles-adatrack',

    // Columns
    colLicensePlate: 'License Plate',
    colPricingCategory: 'Pricing Category',
    
    // Filter & Status
    filterStatus: 'Status',
    filterTitle: 'Filter',
    filterClear: 'Clear Filter',
    filterAll: 'All',
    summaryTitle: 'Summary',
    totalVehicle: 'Total Vehicles',
    selectedVehicle: 'vehicles selected',
    openLocation: 'View Location',
    dtColumns: 'Columns',
    dtExport: 'Export',
    dtPerPage: '/page',
    dtShowing: (from: number, to: number, total: number) => `Showing ${from}-${to} of ${total}`,
    statusReady: 'Available',
    statusReserved: 'Booked',
    statusRented: 'Rented',
    statusMaintenance: 'Serviced',
    statusUnavailable: 'Inactive',
    
    // Data Completeness
    dataComplete: 'Complete Rental Data',
    dataCompleteShort: 'Complete',
    dataCompleteBadge: 'Data Complete',
    dataCompleteDesc: 'All rental profile data is complete.',
    dataNotComplete: 'Incomplete Rental Data',
    dataNotCompleteShort: 'Incomplete',
    dataNotCompleteBadge: 'Incomplete',
    dataNotCompleteDesc: 'Please complete rental pricing and documents.',
    actionCompleteData: 'Complete Rental Data',
    
    // Detail & Form Section
    detailTitle: 'Vehicle Detail',
    tabCoreInfo: 'Vehicle Data',
    tabRentalInfo: 'Rental Data',
    coreInfoNotice: 'Vehicle data is managed in Core Vehicles. It is read-only here.',
    alreadyRegistered: 'Vehicle is already registered in Rental Vehicles.',
    noCoreVehicles: 'No unregistered core vehicles found.',
    
    // Table Columns
    colVehicle: 'Vehicle',
    colYear: 'Year',
    colStatus: 'Status',
    colCustomer: 'Customer',
    colPeriod: 'Rental Period',
    colRate: 'Rate',
    colDailyRate: 'Daily Rate',
    colWeeklyRate: 'Weekly Rate',
    colMonthlyRate: 'Monthly Rate',
    colCondition: 'Condition',
    colCompleteness: 'Data Completeness',
    colNotes: 'Notes',
    colActions: 'Actions',
    
    // Form fields
    fieldSelectVehicle: 'Select Vehicle',
    fieldRentalStatus: 'Rental Status',
    fieldDailyRate: 'Daily Rate',
    fieldWeeklyRate: 'Weekly Rate',
    fieldMonthlyRate: 'Monthly Rate',
    fieldDeposit: 'Deposit',
    fieldCondition: 'Condition',
    fieldStartOdo: 'Start Odometer',
    fieldCurrentOdo: 'Current Odometer',
    fieldNotes: 'Notes',
    fieldStnkExpiry: 'STNK Expiry',
    fieldTaxExpiry: 'Tax Expiry',
    fieldInsuranceExpiry: 'Insurance Expiry',
    fieldEquipment: 'Equipment',
    
    // Equipment options
    equipStnk: 'Original STNK',
    equipSpareKey: 'Spare Key',
    equipSpareTire: 'Spare Tire',
    equipJackAndTools: 'Jack & Tools',
    equipFirstAid: 'First Aid Kit',
    
    // Conditions
    conditionGood: 'Good',
    conditionMinor: 'Minor Damage',
    conditionRepair: 'Needs Repair',
    
    // Actions
    actionDetail: 'View Detail',
    actionEdit: 'Edit Rental Data',
    actionDisable: 'Disable from Rental',
    confirmDisable: 'Disable Rental Vehicle',
    confirmDisableDesc: 'Are you sure you want to disable this vehicle from Rental Vehicles? Core data will not be deleted.',
    cancel: 'Cancel',
    confirm: 'Disable',
    save: 'Save',
    createSuccess: 'Rental vehicle registered successfully.',
    updateSuccess: 'Rental vehicle data updated successfully.',
    deleteSuccess: 'Vehicle disabled from rental successfully.',
    
    // Empty state
    emptyTitle: 'No Rental Vehicles',
    emptyDescription: 'No rental vehicle profiles have been registered.',
    noResultTitle: 'Vehicle not found',
    noResultDescription: 'Try adjusting search keywords or filters.',

    // Form section titles & helpers
    sectionVehicleData: 'Vehicle Data',
    sectionVehicleDataDesc: 'Managed in core data. The following information is read-only.',
    sectionRentalData: 'Rental Data',
    sectionRentalDataDesc: 'Pricing, status, condition, and odometer settings.',
    sectionNotes: 'Notes',
    sectionNotesDesc: 'Additional notes regarding this rental vehicle.',
    sectionDocExpiry: 'Document Expiry',
    sectionEquipmentTitle: 'Vehicle Equipment',
    sectionEquipmentDesc: 'Check available equipment in this vehicle.',

    // Status auto-manage
    statusSystemManaged: 'Status is automatically managed by system due to active transactions.',
    statusManualHint: 'Set manually for Maintenance or Unavailable. Other statuses are managed automatically.',

    // Pricing
    pricingLabel: 'Pricing Settings',
    pricingCategory: 'Category Pricing',
    pricingIndependent: 'Independent Pricing (Custom)',
    fieldPricingCategoryId: 'Select Pricing Category',
    fieldDailyRateRp: 'Daily Rate (IDR)',
    fieldWeeklyRateRp: 'Weekly Rate (IDR)',
    fieldMonthlyRateRp: 'Monthly Rate (IDR)',
    fieldDepositRp: 'Deposit (IDR)',

    // Core vehicle labels
    fieldPlatNomor: 'License Plate',
    fieldGrup: 'Group',
    fieldMerk: 'Brand',
    fieldAlias: 'Alias',
    fieldKategori: 'Category',
    fieldTahun: 'Year',
    fieldWarna: 'Color',
    fieldBahanBakar: 'Fuel Type',
    fieldNoStnk: 'STNK No.',
    fieldBerlakuStnk: 'STNK Expiry',

    // Notes placeholder
    notesPlaceholder: 'Write a note (optional)',

    validationRequired: 'Required field',
    validationCategoryRequired: 'Pricing Category is required'
  }
};

export function getRentalVehiclesTranslation(locale: Locale = 'id') {
  return rentalVehiclesDictionaries[locale] || rentalVehiclesDictionaries.id;
}
