import type { Locale } from '@adatrack/types';

export const reservationDictionaries = {
  id: {
    title: 'Reservasi Rental',
    createTitle: 'Buat Reservasi',
    pageSubtitle: 'Kelola pemesanan kendaraan dan reservasi rental Anda.',
    searchPlaceholder: 'Cari nomor reservasi, pelanggan, atau plat nomor...',
    addReservation: 'Buat Reservasi',
    
    // Status
    statusPending: 'Menunggu Konfirmasi',
    statusConfirmed: 'Dikonfirmasi',
    statusActive: 'Berjalan',
    statusCompleted: 'Selesai',
    statusCancelled: 'Dibatalkan',
    statusAll: 'Semua Status',
    
    // Summary Cards
    summaryTotal: 'Semua Reservasi',
    
    // Filters
    filterStatus: 'Status',
    filterReservationDate: 'Tanggal Reservasi',
    filterRentalDate: 'Tanggal Sewa',
    selectDate: 'Pilih tanggal',
    reset: 'Reset',
    
    // Table
    colNo: 'NO. RESERVASI',
    colCustomer: 'PELANGGAN',
    colVehicle: 'KENDARAAN',
    colRentalDate: 'TANGGAL SEWA',
    colDuration: 'DURASI',
    colTotal: 'TOTAL',
    colStatus: 'STATUS',
    colActions: 'AKSI',
    
    // Details
    dp: 'DP',
    
    // Create Form Sections
    sectionGeneral: 'Informasi Utama',
    sectionTimeLocation: 'Waktu & Lokasi',
    sectionPricing: 'Detail Pembayaran',
    sectionAdditional: 'Kebutuhan Tambahan',
    sectionSummary: 'Ringkasan Reservasi',
    
    // Form Fields
    fieldCustomer: 'Pelanggan',
    newCustomer: 'Pelanggan Baru',
    searchCustomerPlaceholder: 'Cari nama atau nomor telepon pelanggan...',
    fieldVehicle: 'Kendaraan',
    selectVehiclePlaceholder: 'Pilih kendaraan rental...',
    fieldVehicleStatus: 'Status Kendaraan',
    
    fieldStartDate: 'Tanggal & Jam Pengambilan',
    fieldEndDate: 'Tanggal & Jam Pengembalian',
    fieldPickupLocation: 'Lokasi Pengambilan',
    fieldDropoffLocation: 'Lokasi Pengembalian',
    pickupPlaceholder: 'Contoh: Bandara, Stasiun, Kantor',
    fieldDuration: 'Durasi Sewa',
    fieldRentalType: 'Tipe Rental',
    
    rentalTypeSelfDrive: 'Lepas Kunci',
    rentalTypeWithDriver: 'Dengan Driver',
    
    fieldDailyRate: 'Tarif Harian',
    fieldWeeklyRate: 'Tarif Mingguan',
    fieldMonthlyRate: 'Tarif Bulanan',
    fieldUsedRate: 'Tarif yang Digunakan',
    fieldTotalEstimate: 'Total Estimasi',
    fieldDeposit: 'Uang Jaminan (Deposit)',
    depositPlaceholder: 'Opsional jika tidak ada deposit',
    fieldPaymentMethod: 'Metode Pembayaran',
    paymentTransfer: 'Transfer Bank',
    paymentCash: 'Tunai',
    paymentCard: 'Kartu Kredit',
    
    fieldNotes: 'Catatan',
    notesPlaceholder: 'Tulis catatan reservasi (opsional)...',
    fieldAdditionalNeeds: 'Layanan Ekstra',
    needDriver: 'Pakai Supir',
    needDelivery: 'Layanan Antar-Jemput',
    needFuel: 'BBM Termasuk (Full to Full)',
    needInsurance: 'Asuransi Kendaraan',
    needOther: 'Lainnya',
    
    remainingEstimate: 'Sisa Pembayaran Estimasi',
    
    // Form Actions
    cancel: 'Batal',
    save: 'Simpan Reservasi',
    
    // Messages
    createSuccess: 'Reservasi berhasil dibuat.',
    updateSuccess: 'Reservasi berhasil diperbarui.',
    overlapError: 'Kendaraan sudah memiliki reservasi pada periode tersebut.',
    
    // Empty State
    emptyTitle: 'Belum ada Reservasi',
    emptyDesc: 'Belum ada data reservasi kendaraan.',
    noResultTitle: 'Reservasi tidak ditemukan',
    noResultDesc: 'Coba sesuaikan kata kunci atau filter pencarian Anda.',

    validation: {
      customerRequired: 'Pelanggan wajib dipilih',
      vehicleRequired: 'Kendaraan wajib dipilih',
      startDateRequired: 'Tanggal mulai wajib diisi',
      endDateRequired: 'Tanggal selesai wajib diisi',
      rentalTypeRequired: 'Tipe rental wajib dipilih',
      dateRangeInvalid: 'Tanggal selesai harus setelah tanggal mulai',
    }
  },
  en: {
    title: 'Rental Reservations',
    createTitle: 'Create Reservation',
    pageSubtitle: 'Manage your vehicle bookings and rental reservations.',
    searchPlaceholder: 'Search reservation number, customer, or plate number...',
    addReservation: 'Create Reservation',
    
    // Status
    statusPending: 'Pending Confirmation',
    statusConfirmed: 'Confirmed',
    statusActive: 'Active',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    statusAll: 'All Statuses',
    
    // Summary Cards
    summaryTotal: 'All Reservations',
    
    // Filters
    filterStatus: 'Status',
    filterReservationDate: 'Reservation Date',
    filterRentalDate: 'Rental Date',
    selectDate: 'Select date',
    reset: 'Reset',
    
    // Table
    colNo: 'RESERVATION NO.',
    colCustomer: 'CUSTOMER',
    colVehicle: 'VEHICLE',
    colRentalDate: 'RENTAL DATE',
    colDuration: 'DURATION',
    colTotal: 'TOTAL',
    colStatus: 'STATUS',
    colActions: 'ACTIONS',
    
    // Details
    dp: 'DP',
    
    // Create Form Sections
    sectionGeneral: 'General Information',
    sectionTimeLocation: 'Time & Location',
    sectionPricing: 'Pricing & Payment',
    sectionAdditional: 'Additional Needs',
    sectionSummary: 'Reservation Summary',
    
    // Form Fields
    fieldCustomer: 'Customer',
    newCustomer: 'New Customer',
    searchCustomerPlaceholder: 'Search customer name or phone number...',
    fieldVehicle: 'Vehicle',
    selectVehiclePlaceholder: 'Select rental vehicle...',
    fieldVehicleStatus: 'Vehicle Status',
    
    fieldStartDate: 'Pickup Time',
    fieldEndDate: 'Dropoff Time',
    fieldPickupLocation: 'Pickup Location',
    fieldDropoffLocation: 'Dropoff Location',
    pickupPlaceholder: 'E.g. Airport, Station, Office',
    fieldDuration: 'Rental Duration',
    fieldRentalType: 'Rental Type',
    
    rentalTypeSelfDrive: 'Self Drive',
    rentalTypeWithDriver: 'With Driver',
    
    fieldDailyRate: 'Daily Rate',
    fieldWeeklyRate: 'Weekly Rate',
    fieldMonthlyRate: 'Monthly Rate',
    fieldUsedRate: 'Used Rate',
    fieldTotalEstimate: 'Total Estimate',
    fieldDeposit: 'Security Deposit',
    depositPlaceholder: 'Optional if no deposit',
    fieldPaymentMethod: 'Payment Method',
    paymentTransfer: 'Bank Transfer',
    paymentCash: 'Cash',
    paymentCard: 'Credit Card',
    
    fieldNotes: 'Notes',
    notesPlaceholder: 'Write reservation notes (optional)...',
    fieldAdditionalNeeds: 'Extra Services',
    needDriver: 'Include Driver',
    needDelivery: 'Delivery & Pickup Service',
    needFuel: 'Fuel Included (Full to Full)',
    needInsurance: 'Vehicle Insurance',
    needOther: 'Other',
    
    remainingEstimate: 'Remaining Estimate',
    
    // Form Actions
    cancel: 'Cancel',
    save: 'Save Reservation',
    
    // Messages
    createSuccess: 'Reservation created successfully.',
    updateSuccess: 'Reservation updated successfully.',
    overlapError: 'Vehicle already has a reservation for the selected period.',
    
    // Empty State
    emptyTitle: 'No Reservations',
    emptyDesc: 'There are no reservation data yet.',
    noResultTitle: 'Reservation not found',
    noResultDesc: 'Try adjusting your keywords or search filters.',

    validation: {
      customerRequired: 'Customer is required',
      vehicleRequired: 'Vehicle is required',
      startDateRequired: 'Start date is required',
      endDateRequired: 'End date is required',
      rentalTypeRequired: 'Rental type is required',
      dateRangeInvalid: 'End date must be after start date',
    }
  }
};

export function getReservationTranslation(locale: Locale = 'id') {
  return reservationDictionaries[locale] || reservationDictionaries.id;
}
