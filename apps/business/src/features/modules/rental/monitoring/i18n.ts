export type MonitoringLocaleDict = Record<string, string>;

const id: MonitoringLocaleDict = {
  allVehicles: 'Semua Kendaraan',
  safe: 'Aman (> 24 Jam)',
  warning: 'Segera Habis (< 24 Jam)',
  overdue: 'Terlambat (Overdue)',
  emptyTitle: 'Tidak ada data kendaraan terpantau',
  emptyDescription: 'Belum ada kendaraan yang disewa atau sesuai dengan pencarian Anda.',
  colCustomer: 'Pelanggan',
  colVehicle: 'Kendaraan',
  colStatus: 'Status',
  colRef: 'No Ref',
  searchPlaceholder: 'Cari pelanggan, no ref, atau plat nomor...',
  exportFilename: 'Data_Monitoring',
  selectedItems: '{0} Data Terpilih',
  openTracking: 'Buka Live Tracking',
  statusSafe: 'Aman',
  statusWarning: 'Segera Habis',
  statusOverdue: 'Terlambat',
  actionDetail: 'Lihat Detail',
  unknown: 'Tidak Diketahui',
  locale: 'id-ID',
};

const en: MonitoringLocaleDict = {
  allVehicles: 'All Vehicles',
  safe: 'Safe (> 24 Hours)',
  warning: 'Expiring Soon (< 24 Hours)',
  overdue: 'Overdue',
  emptyTitle: 'No monitored vehicle data',
  emptyDescription: 'There are no rented vehicles or matching your search.',
  colCustomer: 'Customer',
  colVehicle: 'Vehicle',
  colStatus: 'Status',
  colRef: 'Ref No',
  searchPlaceholder: 'Search customer, ref no, or license plate...',
  exportFilename: 'Monitoring_Data',
  selectedItems: '{0} Items Selected',
  openTracking: 'Open Live Tracking',
  statusSafe: 'Safe',
  statusWarning: 'Expiring Soon',
  statusOverdue: 'Overdue',
  actionDetail: 'View Details',
  unknown: 'Unknown',
  locale: 'en-US',
};

export const getMonitoringTranslation = (locale: 'id' | 'en') => {
  return locale === 'id' ? id : en;
};
