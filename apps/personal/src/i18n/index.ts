import { Locale } from '@binago/types';

export const dictionaries = {
  id: {
    appName: 'BINAGO Personal',
    welcome: 'Selamat Datang di BINAGO Personal',

    // Navigation Labels
    nav: {
      home: 'Beranda',
      tracking: 'Pemantauan',
      vehicles: 'Kendaraan',
      gpsDevices: 'GPS & Perangkat',
      geofences: 'Geofence',
      reports: 'Laporan',
      settings: 'Pengaturan',
      helpCenter: 'Pusat Bantuan',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Utama',
      operational: 'Operasional',
      system: 'Sistem',
      analysis: 'Analisis',
      settings: 'Pengaturan',
    },

    // User Menu
    userMenu: {
      profile: 'Profil Saya',
      settings: 'Pengaturan',
      logout: 'Keluar',
    },

    // Home
    home: {
      title: 'Beranda',
      pageTitle: 'Beranda',
      pageSubtitle: 'Pantau kendaraan Anda dengan mudah dan real-time.',
      heroGreeting: 'Selamat datang kembali,',
      heroSubtitle: 'Pantau kendaraan Anda, lihat posisi secara real-time, dan kelola perangkat GPS dalam satu platform.',
      metrics: {
        registeredVehicles: 'Kendaraan Terdaftar',
        movingVehicles: 'Kendaraan Bergerak',
        activeAlerts: 'Peringatan Aktif',
        onlineDevices: 'Perangkat Online',
      },
      favoritTitle: 'Favorit Saya',
      favoritSubtitle: 'Akses cepat ke menu yang paling sering Anda gunakan.',
      manageFavorite: 'Kelola Favorit',
      addShortcut: 'Tambah Shortcut',
      favoriteDialogTitle: 'Kelola Favorit',
      favoriteDialogDescription: 'Pilih menu yang ingin ditampilkan pada Favorit Saya.',
      cancel: 'Batal',
      save: 'Simpan',
      infoBarText: 'Anda dapat menandai menu sebagai favorit dengan klik ikon bintang di menu manapun.',
      learnMore: 'Pelajari lebih lanjut',
      shortcuts: {
        tracking: { label: 'Pemantauan', desc: 'Lihat posisi kendaraan di peta' },
        vehicles: { label: 'Kendaraan', desc: 'Kelola data kendaraan Anda' },
        geofences: { label: 'Geofence', desc: 'Kelola zona aman dan pembatas' },
        gpsDevices: { label: 'GPS & Perangkat', desc: 'Kelola perangkat pelacak GPS' },
        reports: { label: 'Laporan', desc: 'Riwayat dan ringkasan perjalanan' },
        settings: { label: 'Pengaturan', desc: 'Pengaturan akun dan aplikasi' },
      },
    },
  },
  en: {
    appName: 'BINAGO Personal',
    welcome: 'Welcome to BINAGO Personal',

    // Navigation Labels
    nav: {
      home: 'Home',
      tracking: 'Tracking',
      vehicles: 'Vehicles',
      gpsDevices: 'GPS & Devices',
      geofences: 'Geofences',
      reports: 'Reports',
      settings: 'Settings',
      helpCenter: 'Help Center',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Main',
      operational: 'Operational',
      system: 'System',
      analysis: 'Analysis',
      settings: 'Settings',
    },

    // User Menu
    userMenu: {
      profile: 'My Profile',
      settings: 'Settings',
      logout: 'Log Out',
    },

    // Home
    home: {
      title: 'Home',
      pageTitle: 'Home',
      pageSubtitle: 'Monitor your vehicles easily and in real-time.',
      heroGreeting: 'Welcome back,',
      heroSubtitle: 'Monitor your vehicles, view their location in real-time, and manage GPS devices on one platform.',
      metrics: {
        registeredVehicles: 'Registered Vehicles',
        movingVehicles: 'Moving Vehicles',
        activeAlerts: 'Active Alerts',
        onlineDevices: 'Online Devices',
      },
      favoritTitle: 'My Favorites',
      favoritSubtitle: 'Quick access to your most frequently used menus.',
      manageFavorite: 'Manage Favorites',
      addShortcut: 'Add Shortcut',
      favoriteDialogTitle: 'Manage Favorites',
      favoriteDialogDescription: 'Select the menus you want to show in My Favorites.',
      cancel: 'Cancel',
      save: 'Save',
      infoBarText: 'You can mark menus as favorites by clicking the star icon on any menu.',
      learnMore: 'Learn more',
      shortcuts: {
        tracking: { label: 'Tracking', desc: 'View vehicle location on the map' },
        vehicles: { label: 'Vehicles', desc: 'Manage your vehicle data' },
        geofences: { label: 'Geofences', desc: 'Manage safe zones and boundaries' },
        gpsDevices: { label: 'GPS & Devices', desc: 'Manage GPS tracking devices' },
        reports: { label: 'Reports', desc: 'Trip history and summaries' },
        settings: { label: 'Settings', desc: 'Account and application settings' },
      },
    },
  },
};

export function getTranslation(locale: Locale = 'id') {
  return dictionaries[locale] || dictionaries.id;
}
