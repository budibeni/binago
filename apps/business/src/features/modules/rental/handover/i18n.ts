export type HandoverLocaleDict = typeof id;

const id = {
  // Page / Feature
  pageTitle: 'Serah Terima',
  pageDescription: 'Manajemen serah terima kendaraan ke pelanggan.',
  
  // List / Table
  colHandoverId: 'NO. SERAH TERIMA',
  colContractRef: 'REF KONTRAK',
  colCustomer: 'PELANGGAN',
  colContact: 'KONTAK',
  colDate: 'TGL SERAH TERIMA',
  colStatus: 'STATUS',
  colVehicle: 'KENDARAAN',
  colNotes: 'CATATAN',
  colStaff: 'PETUGAS',
  typeCompany: 'Perusahaan',
  typeIndividual: 'Individu',
  valWithDriverFull: 'Dengan Pengemudi',
  colContractDate: 'TANGGAL KONTRAK',
  emptyTitle: 'Tidak ada data serah terima',
  emptyDescription: 'Belum ada transaksi serah terima yang tercatat atau sesuai dengan pencarian Anda.',
  statusCompleted: 'Selesai',
  statusPartial: 'Sebagian',
  
  // DataTable Generics
  dtSearchPlaceholder: 'Cari...',
  dtExportFilename: 'Data_Serah_Terima',
  dtPaginationShowing: 'Menampilkan {0}-{1} dari {2} data',
  dtPaginationPerPage: ' / halaman',
  dtFilter: 'Filter',
  dtColumns: 'Kolom',
  dtExport: 'Ekspor',

  // Panel
  panelTitle: 'Siap Serah Terima',
  panelCollapsedTitle: 'SIAP SERAH TERIMA',
  panelEmpty: 'Tidak ada kendaraan yang siap diserahterimakan',
  btnProcessHandover: 'Proses Serah Terima',
  btnViewLocation: 'Lihat Lokasi Kendaraan',

  // View Drawer
  viewTitle: 'Detail Serah Terima',
  tabDetail: 'Detail Handover',
  tabPayment: 'Pembayaran',
  sectionContract: 'Informasi Kontrak',
  sectionVehicles: 'Detail Kendaraan',
  sectionNotes: 'Catatan Tambahan',
  handoverDateText: 'Tgl Serah Terima:',
  contractRefText: 'Ref. Kontrak:',
  statusInUse: 'Sedang Digunakan',
  statusReturned: 'Telah Kembali',
  statusCancelled: 'Batal',
  statusPending: 'Menunggu',
  actionPrintTitle: 'Cetak dokumen Bukti Serah Terima',
  actionPrint: 'Cetak Bukti Serah Terima',
  payContract: 'Bayar',
  fieldOdometerStart: 'Odometer Awal',
  fieldPhysicalCondition: 'Kondisi Fisik',
  locHandover: 'Lokasi Serah Terima',
  fieldLatitude: 'Latitude',
  fieldLongitude: 'Longitude',
  locNotAvailable: 'Lokasi Tidak Tersedia',
  btnOpenMap: 'Buka di Google Maps',

  // Form
  formTitle: 'Proses Serah Terima',
  descContract: 'Rincian kontrak penyewaan yang menjadi dasar serah terima.',
  descVehicles: 'Lengkapi data serah terima untuk kendaraan di bawah ini.',
  descVehiclesTabs: 'Detail Kendaraan (Pilih Tab)',
  descNotes: 'Catatan tambahan secara keseluruhan jika ada.',
  placeholderNotes: 'Catatan tambahan terkait serah terima keseluruhan (Opsional)...',
  checkboxHandover: 'Serah terimakan kendaraan ini',
  emptyVehicleDesc: 'Kendaraan ini tidak dipilih untuk diserahterimakan saat ini.',
  emptyVehicleSub: 'Centang kotak di atas untuk mengisi detail kondisinya.',

  // Form Fields
  fieldContractNumber: 'Nomor Kontrak',
  fieldCustomer: 'Pelanggan',
  fieldRentPeriod: 'Periode Sewa',
  fieldService: 'Layanan',
  fieldHandoverTime: 'Waktu Serah Terima',
  fieldAddress: 'Detail Alamat (Opsional)',
  fieldAddressPlaceholder: 'Cth: Area lobi...',
  fieldOdometer: 'Odometer (km)',
  fieldOdometerPlaceholder: 'Contoh: 15000',
  fieldFuelLevel: 'BBM',
  fieldFuelPlaceholder: 'Pilih Kondisi BBM',
  fieldCondition: 'Kondisi',
  fieldConditionPlaceholder: 'Pilih Kondisi Kendaraan',
  fieldEquipment: 'Kelengkapan Kendaraan',
  fieldLocation: 'Lokasi Serah Terima',
  fieldStaff: 'Petugas',

  // Select Options & Conditions
  fuelEmpty: 'Kosong',
  fuelQuarter: '1/4',
  fuelHalf: '1/2',
  fuelThreeQuarter: '3/4',
  fuelFull: 'Penuh',
  
  condGood: 'Baik',
  condMinorDamage: 'Kerusakan Ringan',
  condNeedsRepair: 'Perlu Perbaikan',

  typeSelfDrive: 'Lepas Kunci',
  typeWithDriver: 'Dgn Sopir',

  // Equipments
  eqStnk: 'STNK',
  eqSpareTire: 'Ban Cadangan',
  eqJack: 'Dongkrak',
  eqToolkit: 'Toolkit',
  eqTriangle: 'Segitiga Pengaman',
  eqFireExtinguisher: 'APAR',

  // Validation / Error
  errIncomplete: 'Mohon lengkapi data Odometer, BBM, dan Kondisi untuk semua kendaraan yang dipilih.',
  errNoLocation: 'Lokasi serah terima wajib diambil untuk semua kendaraan yang dipilih.',
  errSuccess: 'Serah terima berhasil disimpan.',
  errFailed: 'Gagal memproses serah terima.',

  // Buttons
  btnClose: 'Tutup',
  btnCancel: 'Batal',
  btnSave: 'Simpan Serah Terima',
  btnSaving: 'Menyimpan...',

  // Baru ditambahkan untuk HandoverForm
  locale: 'id-ID',
  errIncompleteForm: 'Mohon lengkapi data Odometer, BBM, dan Kondisi untuk semua kendaraan yang dipilih.',
  errIncompleteLocation: 'Lokasi serah terima wajib diambil untuk semua kendaraan yang dipilih.',
  descSearchContract: 'Cari nomor kontrak, nama pelanggan, atau plat nomor kendaraan untuk memulai proses serah terima.',
  placeholderSearchContract: 'Cari nomor kontrak, nama pelanggan, atau plat nomor...',
  fieldRentalPeriod: 'Periode Sewa',
  textEnd: 'Selesai:',
  fieldPickupLocation: 'Lokasi Pengambilan',
  textType: 'Tipe:',
  valSelfDrive: 'Lepas Kunci',
  valWithDriver: 'Dgn Sopir',
  btnSelectContract: 'Pilih Kontrak',
  textVehicles: 'Kendaraan',
  btnChangeContract: 'Ganti Kontrak',
  textNoPlate: 'Belum ada Nopol',
  equipStnk: 'STNK Original',
  equipSpareKey: 'Kunci Cadangan',
  equipJackAndTools: 'Dongkrak & Toolkit',
  equipSpareTire: 'Ban Cadangan',
  equipFirstAid: 'P3K',
};

const en: HandoverLocaleDict = {
  // Page / Feature
  pageTitle: 'Handovers',
  pageDescription: 'Manage vehicle handovers to customers.',
  
  // List / Table
  colHandoverId: 'HANDOVER NO',
  colContractRef: 'CONTRACT REF',
  colCustomer: 'CUSTOMER',
  colContact: 'CONTACT',
  colDate: 'HANDOVER DATE',
  colStatus: 'STATUS',
  colVehicle: 'VEHICLE',
  colNotes: 'NOTES',
  colStaff: 'STAFF',
  typeCompany: 'Company',
  typeIndividual: 'Individual',
  valWithDriverFull: 'With Driver',
  colContractDate: 'CONTRACT DATE',
  emptyTitle: 'No handover data',
  emptyDescription: 'There are no recorded handovers or matching your search.',
  statusCompleted: 'Completed',
  statusPartial: 'Partial',

  // DataTable Generics
  dtSearchPlaceholder: 'Search...',
  dtExportFilename: 'Handover_Data',
  dtPaginationShowing: 'Showing {0}-{1} of {2} items',
  dtPaginationPerPage: ' / page',
  dtFilter: 'Filter',
  dtColumns: 'Columns',
  dtExport: 'Export',

  // Panel
  panelTitle: 'Ready for Handover',
  panelCollapsedTitle: 'READY FOR HANDOVER',
  panelEmpty: 'No vehicles ready for handover',
  btnProcessHandover: 'Process Handover',
  btnViewLocation: 'View Vehicle Location',

  // View Drawer
  viewTitle: 'Handover Detail',
  tabDetail: 'Handover Detail',
  tabPayment: 'Payment',
  sectionContract: 'Contract Information',
  sectionVehicles: 'Vehicle Details',
  sectionNotes: 'Additional Notes',
  handoverDateText: 'Handover Date:',
  contractRefText: 'Contract Ref:',
  statusInUse: 'In Use',
  statusReturned: 'Returned',
  statusCancelled: 'Cancelled',
  statusPending: 'Pending',
  actionPrintTitle: 'Print Doc. Handover',
  actionPrint: 'Print Doc. Handover',
  payContract: 'Pay',
  fieldOdometerStart: 'Start Odometer',
  fieldPhysicalCondition: 'Physical Condition',
  locHandover: 'Handover Location',
  fieldLatitude: 'Latitude',
  fieldLongitude: 'Longitude',
  locNotAvailable: 'Location Not Available',
  btnOpenMap: 'Open in Google Maps',

  // Form
  formTitle: 'Process Handover',
  descContract: 'Rental contract details as the basis of handover.',
  descVehicles: 'Complete handover data for the vehicles below.',
  descVehiclesTabs: 'Vehicle Details (Select Tab)',
  descNotes: 'Overall additional notes if any.',
  placeholderNotes: 'Additional notes regarding overall handover (Optional)...',
  checkboxHandover: 'Handover this vehicle',
  emptyVehicleDesc: 'This vehicle is not selected for handover at this time.',
  emptyVehicleSub: 'Check the box above to fill in its condition details.',

  // Form Fields
  fieldContractNumber: 'Contract Number',
  fieldCustomer: 'Customer',
  fieldRentPeriod: 'Rental Period',
  fieldService: 'Service',
  fieldHandoverTime: 'Handover Time',
  fieldAddress: 'Address Details (Optional)',
  fieldAddressPlaceholder: 'E.g., Lobby area...',
  fieldOdometer: 'Odometer (km)',
  fieldOdometerPlaceholder: 'Example: 15000',
  fieldFuelLevel: 'Fuel',
  fieldFuelPlaceholder: 'Select Fuel Level',
  fieldCondition: 'Condition',
  fieldConditionPlaceholder: 'Select Vehicle Condition',
  fieldEquipment: 'Vehicle Equipment',
  fieldLocation: 'Handover Location',
  fieldStaff: 'Staff',

  // Select Options & Conditions
  fuelEmpty: 'Empty',
  fuelQuarter: '1/4',
  fuelHalf: '1/2',
  fuelThreeQuarter: '3/4',
  fuelFull: 'Full',
  
  condGood: 'Good',
  condMinorDamage: 'Minor Damage',
  condNeedsRepair: 'Needs Repair',

  typeSelfDrive: 'Self Drive',
  typeWithDriver: 'With Driver',

  // Equipments
  eqStnk: 'Vehicle Registration',
  eqSpareTire: 'Spare Tire',
  eqJack: 'Jack',
  eqToolkit: 'Toolkit',
  eqTriangle: 'Warning Triangle',
  eqFireExtinguisher: 'Fire Extinguisher',

  // Validation / Error
  errIncomplete: 'Please complete Odometer, Fuel, and Condition data for all selected vehicles.',
  errNoLocation: 'Handover location must be captured for all selected vehicles.',
  errSuccess: 'Handover successfully saved.',
  errFailed: 'Failed to process handover.',

  // Buttons
  btnClose: 'Close',
  btnCancel: 'Cancel',
  btnSave: 'Save Handover',
  btnSaving: 'Saving...',

  // Baru ditambahkan untuk HandoverForm
  locale: 'en-US',
  errIncompleteForm: 'Please complete Odometer, Fuel, and Condition data for all selected vehicles.',
  errIncompleteLocation: 'Handover location must be captured for all selected vehicles.',
  descSearchContract: 'Search for contract number, customer name, or license plate to start the handover process.',
  placeholderSearchContract: 'Search contract number, customer name, or license plate...',
  fieldRentalPeriod: 'Rental Period',
  textEnd: 'End:',
  fieldPickupLocation: 'Pickup Location',
  textType: 'Type:',
  valSelfDrive: 'Self Drive',
  valWithDriver: 'With Driver',
  btnSelectContract: 'Select Contract',
  textVehicles: 'Vehicles',
  btnChangeContract: 'Change Contract',
  textNoPlate: 'No Plate',
  equipStnk: 'Original STNK',
  equipSpareKey: 'Spare Key',
  equipJackAndTools: 'Jack & Toolkit',
  equipSpareTire: 'Spare Tire',
  equipFirstAid: 'First Aid Kit',
};

export const getHandoverTranslation = (locale: 'id' | 'en') => {
  return locale === 'id' ? id : en;
};
