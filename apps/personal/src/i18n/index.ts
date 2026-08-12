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
      statistics: 'Statistik',
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
      addShortcut: 'Tambah Shortcut',
      favoriteDialogTitle: 'Kelola Favorit',
      favoriteDialogDescription: 'Pilih menu yang ingin ditampilkan pada Favorit Saya.',
      emptyFavoriteTitle: 'Belum ada favourite menu',
      emptyFavoriteDescription: 'Tambahkan shortcut agar menu penting lebih cepat diakses.',
      cancel: 'Batal',
      save: 'Simpan',
      infoBarText: 'Kelola shortcut favorit menggunakan tombol Tambah Shortcut di atas.',
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

    // Tracking
    tracking: {
      searchPlaceholder: 'Cari kendaraan...',
      filterAll: 'Semua',
      statusDriving: 'Berjalan',
      statusIdle: 'Berhenti',
      statusParking: 'Parkir',
      statusOffline: 'Offline',
      emptyList: 'Tidak ada kendaraan ditemukan.',
      vehicleDetail: 'Detail Kendaraan',
      lastUpdate: 'Update terakhir',
      tripHistory: 'Riwayat Perjalanan',
      noTrips: 'Tidak ada perjalanan hari ini.',
    },

    // Statistics
    statistics: {
      totalDistance: 'Total Jarak',
      totalDuration: 'Waktu Berkendara',
      tripCount: 'Total Perjalanan',
      avgSpeed: 'Kecepatan Rata-rata',
      maxSpeed: 'Kecepatan Maksimum',
      trendTitle: 'Tren Jarak Tempuh',
      emptyState: 'Data statistik tidak tersedia untuk periode ini.',
      periods: {
        daily: 'Harian',
        weekly: 'Mingguan',
        monthly: 'Bulanan',
      },
      footerInfo: 'Data statistik dihitung berdasarkan riwayat perjalanan kendaraan.',
      subLabels: {
        duration: 'Total waktu',
        trips: 'Perjalanan',
        avg: 'Rata-rata',
        max: 'Maksimum',
      },
      diffs: {
        daily: 'dibanding kemarin',
        weekly: 'dibanding minggu lalu',
        monthly: 'dibanding bulan lalu',
      },
      trendLabels: {
        weekly: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        monthly: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
      }
    },

    // Settings
    settings: {
      pageTitle: 'Pengaturan',
      pageSubtitle: 'Kelola akun dan preferensi Anda',
      menus: {
        vehicles: {
          title: 'Kendaraan Saya',
          desc: 'Kelola kendaraan Anda'
        },
        devices: {
          title: 'Perangkat GPS',
          desc: 'Kelola perangkat GPS'
        },
        notifications: {
          title: 'Notifikasi',
          desc: 'Pengaturan notifikasi'
        },
        geofences: {
          title: 'Geofence',
          desc: 'Kelola area aman'
        },
        account: {
          title: 'Akun',
          desc: 'Informasi akun'
        },
        help: {
          title: 'Bantuan',
          desc: 'Pusat bantuan & FAQ'
        },
        about: {
          title: 'Tentang Aplikasi',
          desc: 'Versi dan informasi aplikasi'
        }
      },
      back: 'Kembali',
      vehicles: {
        title: 'Kendaraan Saya',
        plateNumber: 'Nomor Polisi',
        type: 'Tipe',
        status: 'Status',
      },
      devices: {
        title: 'Perangkat GPS',
        vehicle: 'Kendaraan',
        status: 'Status',
        lastUpdate: 'Update terakhir',
        statusOnline: 'Online',
        statusOffline: 'Offline',
      },
      notifications: {
        title: 'Notifikasi',
        movement: 'Kendaraan mulai bergerak',
        stop: 'Kendaraan berhenti',
        offline: 'Kendaraan offline',
        enterGeofence: 'Masuk Geofence',
        exitGeofence: 'Keluar Geofence',
      },
      geofences: {
        title: 'Geofence',
        radius: 'Radius',
        active: 'Aktif',
        inactive: 'Nonaktif',
      },
      account: {
        title: 'Akun',
        name: 'Nama Lengkap',
        email: 'Email',
        phone: 'Nomor HP',
        role: 'Peran',
      },
      help: {
        title: 'Bantuan',
        faq: [
          { q: 'Bagaimana cara menambahkan kendaraan?', a: 'Saat ini penambahan kendaraan dilakukan melalui admin. Silakan hubungi support.' },
          { q: 'Bagaimana cara melihat lokasi kendaraan?', a: 'Buka menu Pemantauan dan pilih kendaraan yang ingin dilihat.' },
          { q: 'Bagaimana cara melihat riwayat perjalanan?', a: 'Pada menu Pemantauan, pilih kendaraan lalu klik tab Riwayat Perjalanan.' },
          { q: 'Bagaimana cara menggunakan Playback?', a: 'Pilih salah satu riwayat perjalanan, sistem akan otomatis masuk ke mode Playback.' },
          { q: 'Apa arti status Offline?', a: 'Status offline berarti perangkat GPS kendaraan tidak mengirimkan data lebih dari batas waktu wajar.' },
        ]
      },
      about: {
        title: 'Tentang Aplikasi',
        description: 'GPS Tracking untuk kendaraan pribadi.',
        version: 'Version',
      }
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
      statistics: 'Statistics',
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
      addShortcut: 'Add Shortcut',
      favoriteDialogTitle: 'Manage Favorites',
      favoriteDialogDescription: 'Select the menus you want to show in My Favorites.',
      emptyFavoriteTitle: 'No favourite menu yet',
      emptyFavoriteDescription: 'Add shortcuts to access important menus faster.',
      cancel: 'Cancel',
      save: 'Save',
      infoBarText: 'Manage your favorite shortcuts using the Add Shortcut button above.',
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

    // Tracking
    tracking: {
      searchPlaceholder: 'Search vehicle...',
      filterAll: 'All',
      statusDriving: 'Driving',
      statusIdle: 'Idle',
      statusParking: 'Parking',
      statusOffline: 'Offline',
      emptyList: 'No vehicles found.',
      vehicleDetail: 'Vehicle Detail',
      lastUpdate: 'Last update',
      tripHistory: 'Trip History',
      noTrips: 'No trips today.',
    },

    // Statistics
    statistics: {
      totalDistance: 'Total Distance',
      totalDuration: 'Driving Time',
      tripCount: 'Total Trips',
      avgSpeed: 'Average Speed',
      maxSpeed: 'Max Speed',
      trendTitle: 'Distance Trend',
      emptyState: 'Statistics data not available for this period.',
      periods: {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
      },
      footerInfo: 'Statistics data is calculated based on vehicle trip history.',
      subLabels: {
        duration: 'Total time',
        trips: 'Trips',
        avg: 'Average',
        max: 'Maximum',
      },
      diffs: {
        daily: 'vs yesterday',
        weekly: 'vs last week',
        monthly: 'vs last month',
      },
      trendLabels: {
        weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        monthly: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      }
    },

    // Settings
    settings: {
      pageTitle: 'Settings',
      pageSubtitle: 'Manage your account and preferences',
      menus: {
        vehicles: {
          title: 'My Vehicles',
          desc: 'Manage your vehicles'
        },
        devices: {
          title: 'GPS Devices',
          desc: 'Manage GPS devices'
        },
        notifications: {
          title: 'Notifications',
          desc: 'Notification settings'
        },
        geofences: {
          title: 'Geofence',
          desc: 'Manage safe zones'
        },
        account: {
          title: 'Account',
          desc: 'Account information'
        },
        help: {
          title: 'Help',
          desc: 'Help center & FAQ'
        },
        about: {
          title: 'About App',
          desc: 'Version and app info'
        }
      },
      back: 'Back',
      vehicles: {
        title: 'My Vehicles',
        plateNumber: 'Plate Number',
        type: 'Type',
        status: 'Status',
      },
      devices: {
        title: 'GPS Devices',
        vehicle: 'Vehicle',
        status: 'Status',
        lastUpdate: 'Last update',
        statusOnline: 'Online',
        statusOffline: 'Offline',
      },
      notifications: {
        title: 'Notifications',
        movement: 'Vehicle starts moving',
        stop: 'Vehicle stops',
        offline: 'Vehicle offline',
        enterGeofence: 'Enter Geofence',
        exitGeofence: 'Exit Geofence',
      },
      geofences: {
        title: 'Geofence',
        radius: 'Radius',
        active: 'Active',
        inactive: 'Inactive',
      },
      account: {
        title: 'Account',
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone Number',
        role: 'Role',
      },
      help: {
        title: 'Help',
        faq: [
          { q: 'How do I add a vehicle?', a: 'Currently, adding a vehicle is done by the admin. Please contact support.' },
          { q: 'How do I view vehicle location?', a: 'Open the Tracking menu and select the vehicle you want to view.' },
          { q: 'How do I view trip history?', a: 'In the Tracking menu, select a vehicle and click the Trip History tab.' },
          { q: 'How do I use Playback?', a: 'Select a trip history, the system will automatically enter Playback mode.' },
          { q: 'What does Offline status mean?', a: 'Offline status means the GPS device is not sending data for more than the reasonable threshold.' },
        ]
      },
      about: {
        title: 'About App',
        description: 'GPS Tracking for personal vehicles.',
        version: 'Version',
      }
    },
  },
};

export function getTranslation(locale: Locale = 'id') {
  return dictionaries[locale] || dictionaries.id;
}
