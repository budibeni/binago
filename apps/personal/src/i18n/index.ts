import { Locale } from '@binago/types';

export const dictionaries = {
  id: {
    appName: 'BINAGO Personal',
    welcome: 'Selamat Datang di BINAGO Personal',
    foundationReady: 'Application Shell Berhasil Terintegrasi',

    // Navigation Labels
    nav: {
      tracking: 'Pemantauan',
      devices: 'Perangkat',
      geofences: 'Geofence',
      reports: 'Laporan',
      settings: 'Pengaturan',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Utama',
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
      greeting: 'Halo',
      subtitle: 'Pantau posisi dan keamanan kendaraan Anda.',
      metrics: {
        registeredVehicles: 'Kendaraan Terdaftar',
        gpsStatus: 'Status GPS',
        activeGeofences: 'Geofence Aktif',
      },
      shortcuts: 'Pintasan Personal',
      status: 'Status Kendaraan Pribadi',
      noStatus: 'Belum ada data status kendaraan.',
    },
  },
  en: {
    appName: 'BINAGO Personal',
    welcome: 'Welcome to BINAGO Personal',
    foundationReady: 'Application Shell Integrated Successfully',

    // Navigation Labels
    nav: {
      tracking: 'Tracking',
      devices: 'Devices',
      geofences: 'Geofences',
      reports: 'Reports',
      settings: 'Settings',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Main',
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
      greeting: 'Hello',
      subtitle: 'Monitor the position and security of your vehicles.',
      metrics: {
        registeredVehicles: 'Registered Vehicles',
        gpsStatus: 'GPS Status',
        activeGeofences: 'Active Geofences',
      },
      shortcuts: 'Personal Shortcuts',
      status: 'Personal Vehicle Status',
      noStatus: 'No vehicle status data available.',
    },
  },
};

export function getTranslation(locale: Locale = 'id') {
  return dictionaries[locale] || dictionaries.id;
}
