import type { Locale } from '@adatrack/types';

export const contractDictionaries = {
  id: {
    // Form Titles & Sections
    titleSelectBooking: 'Pilih Booking',
    descSelectBooking: 'Pilih booking untuk dibuatkan kontrak.',
    titleBookingSummary: 'Ringkasan Booking',
    descBookingSummary: 'Informasi pesanan yang telah dipilih.',
    titleNewContractDetail: 'Detail Kontrak Baru',
    descNewContractDetail: 'Lengkapi informasi untuk menerbitkan dokumen kontrak.',
    titleEditContractDetail: 'Ubah Detail Kontrak',
    
    // Booking Summary Fields
    fieldCustomer: 'Pelanggan',
    fieldBookingNo: 'No. Booking',
    fieldRentalType: 'Tipe Sewa',
    fieldStart: 'Mulai',
    fieldEnd: 'Selesai',
    fieldTotalAmount: 'Total Tagihan',
    fieldDays: 'Hari',
    fieldVehicles: 'Kendaraan',
    
    // Form Inputs
    fieldContractDate: 'Tanggal Penerbitan Kontrak',
    descContractDate: 'Tanggal kontrak ini dicetak/diterbitkan.',
    fieldNotes: 'Catatan Tambahan (Opsional)',
    descNotes: 'Catatan ini akan muncul pada dokumen yang dicetak.',
    placeholderNotes: 'Tambahkan catatan khusus yang akan dicetak pada dokumen kontrak...',
    
    // Actions & Misc
    btnChange: 'Ganti',
    btnViewFullBooking: 'Lihat Booking Lengkap',
    searchPlaceholder: 'Cari no booking, pelanggan...',
    notFoundTitle: 'Tidak ditemukan',
    notFoundDesc: 'Coba kata kunci lain.',
    
    // Rental Types
    rentalTypeSelfDrive: 'Lepas Kunci',
    rentalTypeWithDriver: 'Dgn Pengemudi',
    
    // Warnings
    snapshotTitle: 'Data Terkunci (Snapshot)',
    snapshotDesc: 'Data periode, tarif, dan total tagihan disalin dari booking dan tidak dapat diubah pada tahap pembuatan kontrak. Silakan ubah dari menu Booking jika diperlukan penyesuaian.',
    
    // Statuses
    statusIssued: 'Diterbitkan',
    statusActive: 'Berjalan',
    statusCompleted: 'Selesai',
    statusCancelled: 'Batal',
  },
  en: {
    // Form Titles & Sections
    titleSelectBooking: 'Select Booking',
    descSelectBooking: 'Select a booking to create a contract.',
    titleBookingSummary: 'Booking Summary',
    descBookingSummary: 'Information of the selected order.',
    titleNewContractDetail: 'New Contract Details',
    descNewContractDetail: 'Complete the information to issue the contract document.',
    titleEditContractDetail: 'Edit Contract Details',
    
    // Booking Summary Fields
    fieldCustomer: 'Customer',
    fieldBookingNo: 'Booking No.',
    fieldRentalType: 'Rental Type',
    fieldStart: 'Start',
    fieldEnd: 'End',
    fieldTotalAmount: 'Total Amount',
    fieldDays: 'Days',
    fieldVehicles: 'Vehicles',
    
    // Form Inputs
    fieldContractDate: 'Contract Issuance Date',
    descContractDate: 'The date this contract is printed/issued.',
    fieldNotes: 'Additional Notes (Optional)',
    descNotes: 'These notes will appear on the printed document.',
    placeholderNotes: 'Add special notes that will be printed on the contract document...',
    
    // Actions & Misc
    btnChange: 'Change',
    btnViewFullBooking: 'View Full Booking',
    searchPlaceholder: 'Search booking no, customer...',
    notFoundTitle: 'Not found',
    notFoundDesc: 'Try another keyword.',
    
    // Rental Types
    rentalTypeSelfDrive: 'Self Drive',
    rentalTypeWithDriver: 'With Driver',
    
    // Warnings
    snapshotTitle: 'Locked Data (Snapshot)',
    snapshotDesc: 'Period, rate, and total amount data are copied from the booking and cannot be changed during contract creation. Please change from the Booking menu if adjustments are needed.',
    
    // Statuses
    statusIssued: 'Issued',
    statusActive: 'Active',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
  }
};

export function getContractDictionary(locale: Locale) {
  return contractDictionaries[locale] || contractDictionaries.id;
}
