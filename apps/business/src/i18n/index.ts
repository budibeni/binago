import { Locale } from '@binago/types';

export const dictionaries = {
  id: {
    appName: 'BINAGO Business',
    welcome: 'Selamat Datang di BINAGO Business',
    foundationReady: 'Application Shell Berhasil Terintegrasi',

    // Navigation Labels
    nav: {
      tracking: 'Pemantauan',
      vehicles: 'Armada',
      drivers: 'Pengemudi',
      deliveries: 'Pengiriman',
      maintenance: 'Perawatan',
      devices: 'Perangkat',
      geofences: 'Geofence',
      reports: 'Laporan',
      administration: 'Administrasi',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Utama',
      fleet: 'Manajemen Armada',
      system: 'Sistem',
    },

    // User Menu
    userMenu: {
      profile: 'Profil Saya',
      settings: 'Pengaturan',
      logout: 'Keluar',
    },

    // Shell Verification Page
    // Home / Dashboard
    home: {
      title: 'Beranda',
      greeting: 'Selamat Datang',
      subtitle: 'Berikut adalah ringkasan operasional armada Anda saat ini.',
      metrics: {
        totalVehicles: 'Total Armada',
        activeDrivers: 'Pengemudi Bertugas',
        ongoingDeliveries: 'Pengiriman Berjalan',
        onlineDevices: 'Perangkat Online',
      },
      shortcuts: 'Menu Pintasan',
      attention: 'Perhatian Armada',
      noAttention: 'Tidak ada perhatian armada saat ini.',
    },
  },
  en: {
    appName: 'BINAGO Business',
    welcome: 'Welcome to BINAGO Business',
    foundationReady: 'Application Shell Integrated Successfully',

    // Navigation Labels
    nav: {
      tracking: 'Tracking',
      vehicles: 'Vehicles',
      drivers: 'Drivers',
      deliveries: 'Deliveries',
      maintenance: 'Maintenance',
      devices: 'Devices',
      geofences: 'Geofences',
      reports: 'Reports',
      administration: 'Administration',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Main',
      fleet: 'Fleet Management',
      system: 'System',
    },

    // User Menu
    userMenu: {
      profile: 'My Profile',
      settings: 'Settings',
      logout: 'Log Out',
    },

    // Shell Verification Page
    // Home / Dashboard
    home: {
      title: 'Home',
      greeting: 'Welcome',
      subtitle: 'Here is the current operational summary of your fleet.',
      metrics: {
        totalVehicles: 'Total Vehicles',
        activeDrivers: 'Active Drivers',
        ongoingDeliveries: 'Ongoing Deliveries',
        onlineDevices: 'Online Devices',
      },
      shortcuts: 'Quick Menu',
      attention: 'Fleet Attention',
      noAttention: 'No fleet attention required at this moment.',
    },
  },
};

export function getTranslation(locale: Locale = 'id') {
  return dictionaries[locale] || dictionaries.id;
}
