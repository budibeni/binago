import { Locale } from '@binago/types';

export const dictionaries = {
  id: {
    appName: 'BINAGO Business',
    welcome: 'Selamat Datang di BINAGO Business',

    // Navigation Labels
    nav: {
      home: 'Beranda',
      tracking: 'Pemantauan',
      vehicles: 'Armada',
      drivers: 'Pengemudi',
      geofences: 'Geofence',
      trips: 'Perjalanan',
      deliveries: 'Pengiriman',
      fieldServices: 'Layanan Lapangan',
      assets: 'Manajemen Aset',
      maintenance: 'Perawatan',
      safety: 'Keselamatan',
      incidents: 'Insiden',
      tasks: 'Tugas',
      reports: 'Laporan',
      analytics: 'Analitik',
      usersAccess: 'Pengguna & Akses',
      organization: 'Organisasi',
      gpsDevices: 'GPS & Perangkat',
      integrations: 'Integrasi',
      settings: 'Pengaturan',
      helpCenter: 'Pusat Bantuan',
      alerts: 'Peringatan',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Utama',
      operational: 'Operasional',
      transportation: 'Transportasi',
      asset: 'Aset',
      safety: 'Keselamatan',
      work: 'Pekerjaan',
      analysis: 'Analisis',
      administration: 'Administrasi',
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
      pageSubtitle: 'Kelola armada dan operasional bisnis Anda dengan mudah dan real-time.',
      heroGreeting: 'Selamat datang kembali,',
      heroSubtitle: 'Pantau armada, kelola operasional, dan ambil keputusan berbasis data secara real-time dalam satu platform.',
      metrics: {
        totalVehicles: 'Total Kendaraan',
        movingVehicles: 'Kendaraan Bergerak',
        activeAlerts: 'Peringatan Aktif',
        tripsToday: 'Perjalanan Hari Ini',
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
        tracking: { label: 'Pemantauan', desc: 'Lihat lokasi kendaraan secara real-time' },
        vehicles: { label: 'Armada', desc: 'Kelola data kendaraan dan informasinya' },
        drivers: { label: 'Pengemudi', desc: 'Kelola data pengemudi dan performa' },
        trips: { label: 'Perjalanan', desc: 'Lihat dan kelola perjalanan' },
        deliveries: { label: 'Pengiriman', desc: 'Kelola pengiriman dan statusnya' },
        alerts: { label: 'Peringatan', desc: 'Lihat peringatan dan notifikasi' },
        geofences: { label: 'Geofence', desc: 'Kelola area aman dan pembatas' },
        maintenance: { label: 'Perawatan', desc: 'Kelola perawatan kendaraan' },
        tasks: { label: 'Tugas', desc: 'Lihat dan kelola tugas pekerjaan' },
        reports: { label: 'Laporan', desc: 'Lihat dan unduh laporan' },
        incidents: { label: 'Insiden', desc: 'Kelola insiden dan tindak lanjut' },
        gpsDevices: { label: 'GPS & Perangkat', desc: 'Kelola perangkat GPS dan sensor' },
      },
    },
  },
  en: {
    appName: 'BINAGO Business',
    welcome: 'Welcome to BINAGO Business',

    // Navigation Labels
    nav: {
      home: 'Home',
      tracking: 'Tracking',
      vehicles: 'Vehicles',
      drivers: 'Drivers',
      geofences: 'Geofences',
      trips: 'Trips',
      deliveries: 'Deliveries',
      fieldServices: 'Field Services',
      assets: 'Asset Management',
      maintenance: 'Maintenance',
      safety: 'Safety',
      incidents: 'Incidents',
      tasks: 'Tasks',
      reports: 'Reports',
      analytics: 'Analytics',
      usersAccess: 'Users & Access',
      organization: 'Organization',
      gpsDevices: 'GPS & Devices',
      integrations: 'Integrations',
      settings: 'Settings',
      helpCenter: 'Help Center',
      alerts: 'Alerts',
    },

    // Nav Group Titles
    navGroup: {
      main: 'Main',
      operational: 'Operational',
      transportation: 'Transportation',
      asset: 'Assets',
      safety: 'Safety',
      work: 'Work',
      analysis: 'Analysis',
      administration: 'Administration',
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
      pageSubtitle: 'Manage your fleet and business operations easily and in real-time.',
      heroGreeting: 'Welcome back,',
      heroSubtitle: 'Monitor your fleet, manage operations, and make data-driven decisions in real-time on one platform.',
      metrics: {
        totalVehicles: 'Total Vehicles',
        movingVehicles: 'Moving Vehicles',
        activeAlerts: 'Active Alerts',
        tripsToday: 'Trips Today',
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
        tracking: { label: 'Tracking', desc: 'View vehicle locations in real-time' },
        vehicles: { label: 'Vehicles', desc: 'Manage vehicle data and information' },
        drivers: { label: 'Drivers', desc: 'Manage driver data and performance' },
        trips: { label: 'Trips', desc: 'View and manage trips' },
        deliveries: { label: 'Deliveries', desc: 'Manage deliveries and status' },
        alerts: { label: 'Alerts', desc: 'View alerts and notifications' },
        geofences: { label: 'Geofences', desc: 'Manage safe zones and boundaries' },
        maintenance: { label: 'Maintenance', desc: 'Manage vehicle maintenance' },
        tasks: { label: 'Tasks', desc: 'View and manage work tasks' },
        reports: { label: 'Reports', desc: 'View and download reports' },
        incidents: { label: 'Incidents', desc: 'Manage incidents and follow-up' },
        gpsDevices: { label: 'GPS & Devices', desc: 'Manage GPS devices and sensors' },
      },
    },
  },
};

export function getTranslation(locale: Locale = 'id') {
  return dictionaries[locale] || dictionaries.id;
}
