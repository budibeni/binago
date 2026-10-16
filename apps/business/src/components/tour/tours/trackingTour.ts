import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// ─── 1. LIVE MAP TOURS ────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Pemantauan Langsung (Live Map)
 */
export function getLiveTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Welcome to Live Tracking 👋' : 'Selamat Datang di Pemantauan Langsung 👋',
        description: isEn
          ? 'ADATRACK Live Tracking provides real-time visibility, telemetry, moving status, and camera centering for all your vehicles.'
          : 'Modul Pemantauan Langsung ADATRACK menyediakan visibilitas real-time, telemetri, status pergerakan, dan pemantauan kamera untuk seluruh kendaraan Anda.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#tracking-mode-toggle',
      popover: {
        title: isEn ? 'Map Mode Tabs' : 'Tab Mode Peta',
        description: isEn
          ? 'Easily switch between Live (current real-time positions), Playback (trip route replay), and Heatmap (density distribution).'
          : 'Beralih dengan mudah antara mode Live (posisi langsung saat ini), Playback (putar ulang riwayat rute), dan Heatmap (kepadatan aktivitas).',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tracking-map-canvas',
      popover: {
        title: isEn ? 'Interactive Map Canvas' : 'Kanvas Peta Interaktif',
        description: isEn
          ? 'Displays moving vehicles with directional headings, color status (driving, idle, parking), and clusters. Click any vehicle icon to focus and track.'
          : 'Menampilkan kendaraan aktif dengan arah pergerakan, status warna (berjalan, idle, parkir), dan kluster. Klik kendaraan untuk memusatkan kamera.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#map-control-panel',
      popover: {
        title: isEn ? 'Map Control Toolbar' : 'Toolbar & Kontrol Peta',
        description: isEn
          ? 'Quick tools to change basemaps (satellite/dark mode), zoom in/out, fit camera to all vehicles, and access measuring rulers.'
          : 'Alat cepat untuk mengganti basemap (satelit/dark mode), kontrol zoom, pusatkan kamera ke seluruh kendaraan, dan alat ukur.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#tracking-vehicle-list-panel',
      popover: {
        title: isEn ? 'Vehicle List & Filters' : 'Daftar Kendaraan & Filter',
        description: isEn
          ? 'Search by license plate or driver, filter by status (driving, idle, parking, offline), and organize vehicles by groups/areas.'
          : 'Cari berdasarkan plat nomor atau pengemudi, filter status (berjalan, idle, parkir, offline), serta kelompokkan kendaraan berdasarkan grup/area.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#tracking-bottom-dock',
      popover: {
        title: isEn ? 'Bottom View Navigation' : 'Navigasi Tampilan Bawah',
        description: isEn
          ? 'Switch between Map View, Data Table View, or Notification & Activity Log at any time.'
          : 'Beralih kapan saja antara tampilan Kanvas Peta, Tabel Data Kendaraan, atau Log Aktivitas & Notifikasi.',
        side: 'top',
        align: 'start',
      },
    },
  ];
}

/**
 * Panduan Toolbar & Kontrol Peta Vertikal
 */
export function getMapToolbarTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#map-control-panel',
      popover: {
        title: isEn ? 'Map Control Panel & Toolbar' : 'Toolbar & Kontrol Peta',
        description: isEn
          ? 'This vertical panel gives you direct control over the map view, search tools, layer toggles, and distance calculations.'
          : 'Panel vertikal ini memberi Anda kontrol langsung untuk navigasi peta, alat pencarian, layer geofence, dan pengukuran jarak.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#ctrl-search',
      popover: {
        title: isEn ? '1. Search Tool (Pencarian)' : '1. Alat Pencarian (Search)',
        description: isEn
          ? 'Search for any address, raw GPS coordinates, or find active vehicles located within a specific radius, geofence, or route.'
          : 'Cari alamat, koordinat GPS, atau temukan kendaraan aktif di dalam radius tertentu, area geofence, maupun sepanjang rute perjalanan.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#ctrl-basemap',
      popover: {
        title: isEn ? '2. Basemap Switcher (Tampilan Peta)' : '2. Pilihan Basemap Peta',
        description: isEn
          ? 'Switch between Standard Street map, High-Resolution Satellite imagery, and Dark Mode for high-contrast viewing.'
          : 'Ganti tampilan peta ke peta jalan Standar, Citra Satelit resolusi tinggi, atau Dark Mode untuk kenyamanan di malam hari.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#ctrl-zoom-in',
      popover: {
        title: isEn ? '3. Zoom Controls (+ / -)' : '3. Kontrol Perbesar & Perkecil',
        description: isEn
          ? 'Zoom in for detailed street-level inspection or zoom out for a wider distribution view.'
          : 'Gunakan tombol (+) dan (-) untuk melihat detail jalan atau memperluas pandangan ke skala kota/provinsi.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#ctrl-fit-selected',
      popover: {
        title: isEn ? '4. Center / Fit Vehicles (Pusatkan)' : '4. Pusatkan Kamera Kendaraan',
        description: isEn
          ? 'Instantly centers the camera to display all visible vehicles or focus onto your selected vehicle.'
          : 'Secara instan memusatkan sudut kamera peta agar seluruh kendaraan yang aktif dapat terlihat dalam satu layar.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#ctrl-fullscreen',
      popover: {
        title: isEn ? '5. Fullscreen Mode (Layar Penuh)' : '5. Mode Layar Penuh',
        description: isEn
          ? 'Maximizes the map area to full screen, ideal for dedicated monitoring desks and control centers.'
          : 'Maksimalkan tampilan peta ke layar penuh (command center) tanpa terpotong menu atau header browser.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#ctrl-more-tools',
      popover: {
        title: isEn ? '6. Additional Tools (...)' : '6. Alat & Layer Tambahan',
        description: isEn
          ? 'Open advanced utilities such as Polyline Distance Measurement (Ruler), Geofence Validator, and Vehicle Marker styles.'
          : 'Buka alat tambahan seperti Pengukur Jarak (Ruler), alat cek Geofence, dan kustomisasi gaya marker kendaraan.',
        side: 'left',
        align: 'center',
      },
    },
  ];
}

/**
 * Panduan Kartu Alat Pencarian & Pemindai Kendaraan
 */
export function getSearchToolTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#search-location-card',
      popover: {
        title: isEn ? 'Location & Vehicle Search Card' : 'Kartu Pencarian & Pemindai Kendaraan',
        description: isEn
          ? 'This interactive floating card allows you to search locations, look up GPS coordinates, check your current position, or pick Geofences & Routes to scan nearby vehicles.'
          : 'Kartu pencarian serbaguna ini memungkinkan Anda mencari tempat, mengurai koordinat GPS, menggunakan lokasi Anda, atau memilih batas Geofence & Rute, serta memindai kendaraan yang ada di sekitar area tersebut.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#search-tab-address',
      popover: {
        title: isEn ? '1. Address Tab (Alamat)' : '1. Tab Alamat (Nama Tempat & Jalan)',
        description: isEn
          ? 'Search by street address, landmark, POI, or building name (e.g., "Monas", "Jl. Sudirman"). The map will focus on the selected location and scan nearby vehicles.'
          : 'Pencarian berbasis nama lokasi, gedung, POI (Point of Interest), atau nama jalan (contoh: "Monas", "Bandara Soekarno Hatta", "Jl. Sudirman"). Peta akan melompat ke lokasi yang dipilih untuk dipindai.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        (document.querySelector('#search-tab-address') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#search-tab-coordinate',
      popover: {
        title: isEn ? '2. Coordinates Tab (Koordinat GPS)' : '2. Tab Koordinat (Latitude & Longitude GPS)',
        description: isEn
          ? 'Input raw GPS coordinates in decimal degrees (e.g., -6.2088, 106.8456), DMS format, or paste a Google Maps link directly. The map centers on the precise pin.'
          : 'Pencarian presisi menggunakan angka koordinat GPS (derajat desimal maupun format DMS, contoh: -6.2088, 106.8456) atau dengan menempelkan langsung link Google Maps.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        (document.querySelector('#search-tab-coordinate') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#search-tab-my_location',
      popover: {
        title: isEn ? '3. My Location Tab (Saya)' : '3. Tab Saya (Posisi GPS Pengguna)',
        description: isEn
          ? 'Instantly detects your current device location using browser geolocation. Ideal for field operators to find the closest vehicles to their actual position.'
          : 'Mendeteksi lokasi perangkat Anda saat ini secara langsung menggunakan GPS browser. Sangat memudahkan operator di lapangan untuk melihat kendaraan mana yang paling dekat dengan posisinya.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        (document.querySelector('#search-tab-my_location') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#search-tab-geofence',
      popover: {
        title: isEn ? '4. Geofence Tab (Area Geofence)' : '4. Tab Geofence (Area Batas Virtual)',
        description: isEn
          ? 'Select from your saved virtual geofence boundaries (warehouses, branch offices, ports, or restricted zones) to scan all vehicles inside or near that boundary.'
          : 'Pilih zona Geofence tersimpan (seperti area gudang, kantor cabang, pelabuhan, atau zona operasional) untuk memindai seluruh kendaraan yang berada di dalam atau di sekitar batas wilayah tersebut.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        (document.querySelector('#search-tab-geofence') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#search-tab-route',
      popover: {
        title: isEn ? '5. Route Tab (Rute Koridor)' : '5. Tab Rute (Koridor Jalur Perjalanan)',
        description: isEn
          ? 'Select a planned transit corridor or highway delivery route (e.g., Jakarta - Bandung). Detects all active vehicles currently travelling along that route path.'
          : 'Pilih koridor rute perjalanan yang sudah dibuat (seperti jalur tol antarkota atau rute pengiriman logistik) untuk memindai dan memantau kendaraan yang sedang melintas di sepanjang rute tersebut.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        (document.querySelector('#search-tab-route') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#search-radius-section',
      popover: {
        title: isEn ? 'Scan Radius Presets' : 'Pengaturan Radius Pemindaian',
        description: isEn
          ? 'Set the detection radius around the target point. Enter custom meters or click quick presets (250m, 500m, 1km, 2km).'
          : 'Atur luas lingkaran radius pemindaian kendaraan di sekitar titik yang dicari. Masukkan angka meter kustom atau klik tombol cepat (250m, 500m, 1km, 2km).',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        (document.querySelector('#search-tab-address') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#search-results-section',
      popover: {
        title: isEn ? 'Detected Vehicles & Results' : 'Hasil Pemindaian Kendaraan Terdekat',
        description: isEn
          ? 'All active vehicles detected within the specified radius will be listed here with distance calculation. Click any vehicle to focus.'
          : 'Semua kendaraan aktif yang terdeteksi berada di dalam radius akan terdaftar di sini lengkap dengan jaraknya. Klik kendaraan untuk langsung fokus memantau.',
        side: 'top',
        align: 'center',
      },
    },
  ];
}

// ─── 2. PLAYBACK TOURS ────────────────────────────────────────────────────────

/**
 * Tur Lengkap Mode Playback (Riwayat Rute)
 */
export function getPlaybackTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#tracking-map-canvas',
      popover: {
        title: isEn ? 'Route History & Stops' : 'Riwayat Rute & Titik Parkir',
        description: isEn
          ? 'In Playback mode, previous GPS trails are rendered on the map with start/end markers and stop locations (P).'
          : 'Pada mode Playback, jalur jejak GPS perjalanan sebelumnya digambar di peta lengkap dengan titik awal, titik akhir, dan titik berhenti/parkir (P).',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#playback-panel-container',
      popover: {
        title: isEn ? 'Playback Control Player' : 'Panel Kontrol Player Playback',
        description: isEn
          ? 'This bottom panel allows you to select vehicles, pick date/time windows, load historical tracks, and simulate vehicle movement.'
          : 'Panel bawah ini berfungsi untuk memilih kendaraan, menentukan rentang waktu & tanggal, memuat histori rute, serta memutar simulasi pergerakan.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#playback-vehicle-select-btn',
      popover: {
        title: isEn ? '1. Select Vehicle' : '1. Pilih Kendaraan',
        description: isEn
          ? 'Click to choose which vehicle history you want to inspect.'
          : 'Klik tombol ini untuk memilih plat nomor kendaraan yang ingin dilihat riwayat perjalanannya.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#playback-date-range-section',
      popover: {
        title: isEn ? '2. Date & Time Range' : '2. Rentang Tanggal & Jam',
        description: isEn
          ? 'Specify start date/time and end date/time for the trip query.'
          : 'Tentukan tanggal serta jam mulai dan selesai untuk memfilter periode perjalanan yang dicari.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#playback-load-btn',
      popover: {
        title: isEn ? '3. Query History' : '3. Muat Data Histori',
        description: isEn
          ? 'Click "Cari Histori" to fetch GPS track points and draw the vehicle trail onto the map.'
          : 'Klik tombol "Cari Histori" untuk mengunduh titik koordinat GPS dan menggambar rute kendaraan di peta.',
        side: 'top',
        align: 'end',
      },
    },
  ];
}

/**
 * Panduan Khusus Kontrol Pemutar Playback (Saat data sudah dimuat)
 */
export function getPlaybackPlayerTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#playback-media-controls',
      popover: {
        title: isEn ? 'Media Controls (Play / Pause / Reset)' : 'Kontrol Pemutaran Rute',
        description: isEn
          ? 'Simulate vehicle travel along the route. Click Play to start, Pause to freeze, or SkipBack to reset to start.'
          : 'Simulasikan pergerakan kendaraan di sepanjang rute. Tekan Play untuk memutar, Pause untuk menjeda, atau Reset untuk kembali ke titik awal.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#playback-timeline-bar',
      popover: {
        title: isEn ? 'Interactive Timeline Scrubber' : 'Linimasa Perjalanan (Timeline)',
        description: isEn
          ? 'Drag or click anywhere along the timeline bar to jump directly to any specific timestamp of the trip.'
          : 'Geser atau klik pada garis waktu untuk melompat langsung ke jam dan posisi tertentu dalam perjalanan.',
        side: 'top',
        align: 'center',
      },
    },
  ];
}

// ─── 3. HEATMAP TOURS ─────────────────────────────────────────────────────────

/**
 * Tur Peta Kepadatan (Heatmap)
 */
export function getHeatmapTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#tracking-map-canvas',
      popover: {
        title: isEn ? 'Heatmap Density Canvas' : 'Kanvas Peta Kepadatan (Heatmap)',
        description: isEn
          ? 'Visualizes vehicle spatial density across geographic areas. Warm colors (red/orange) indicate high concentration or frequent stops, while cool colors (green/blue) represent lower density.'
          : 'Menampilkan peta sebaran kepadatan kendaraan secara visual. Warna hangat (merah/oranye) menunjukkan area dengan konsentrasi tinggi atau sering disinggahi, sedangkan warna dingin (hijau/biru) menandakan kepadatan rendah.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#heatmap-date-filter',
      popover: {
        title: isEn ? '1. Heatmap Date Range' : '1. Rentang Tanggal Analisis',
        description: isEn
          ? 'Choose the start and end dates to analyze vehicle distribution patterns.'
          : 'Tentukan tanggal mulai dan selesai untuk menganalisis pola sebaran dan kepadatan kendaraan.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#heatmap-status-filter',
      popover: {
        title: isEn ? '2. Status Condition Filter' : '2. Filter Kondisi Status',
        description: isEn
          ? 'Filter by vehicle movement status: Driving (traffic congestion), Idle (waiting spots), or Parking (frequent resting bases).'
          : 'Filter berdasarkan kondisi pergerakan: Berjalan (titik rute ramai), Idle (titik antrean/tunggu), atau Parkir (kantong parkir umum).',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#heatmap-generate-btn',
      popover: {
        title: isEn ? '3. Generate Heatmap' : '3. Tombol Buat Heatmap',
        description: isEn
          ? 'Click to calculate coordinates and render the new density layers on the map.'
          : 'Klik tombol ini untuk memproses data koordinat dan memperbarui lapisan gradien kepadatan pada peta.',
        side: 'top',
        align: 'end',
      },
    },
  ];
}

// ─── 4. TABLE VIEW TOURS ──────────────────────────────────────────────────────

/**
 * Tur Pilihan Mode Tabel (Dropdown 6 Mode: Live, Playback, Heatmap, Parkir, Jarak Tempuh, Kecepatan)
 */
export function getTableModeSelectorTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureDropdownOpen = () => {
    window.dispatchEvent(new CustomEvent('adatrack:open-table-dropdown'));
  };

  const ensureDropdownClosed = () => {
    window.dispatchEvent(new CustomEvent('adatrack:close-table-dropdown'));
  };

  return [
    {
      element: '#table-mode-selector-btn',
      popover: {
        title: isEn ? 'Table Mode Selector' : 'Pilihan Mode Tampilan Tabel',
        description: isEn
          ? 'This dropdown menu allows you to switch between 6 specialized tabular data and report modes for your fleet vehicles.'
          : 'Menu dropdown utama ini memungkinkan Anda memilih dan beralih di antara 6 mode analisis data tabular dan laporan kendaraan sesuai kebutuhan operasional.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureDropdownOpen,
    },
    {
      element: '#table-mode-option-live',
      popover: {
        title: isEn ? '1. Live Mode (Real-Time Telemetry)' : '1. Mode Live (Telemetri Real-Time)',
        description: isEn
          ? 'Monitors real-time fleet telemetry: current moving status (Driving, Idle, Parking, Offline), vehicle speed, ACC engine status, odometer, and last update timestamp.'
          : 'Memantau data telemetri terkini kendaraan secara real-time: status pergerakan (Berjalan, Berhenti, Parkir, Offline), kecepatan aktual, status kontak mesin ACC, odometer, dan waktu pembaruan terakhir.',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: ensureDropdownOpen,
    },
    {
      element: '#table-mode-option-playback',
      popover: {
        title: isEn ? '2. Playback Mode (Trip GPS Coordinates)' : '2. Mode Playback (Histori Koordinat Perjalanan)',
        description: isEn
          ? 'Presents chronological coordinate rows of points traversed by the vehicle within the selected date/time window, with speed at each point and exact timestamps.'
          : 'Menyajikan data kronologis seluruh titik koordinat GPS yang dilalui kendaraan pada rentang waktu yang dipilih, lengkap dengan kecepatan di setiap titik dan cap waktu.',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: ensureDropdownOpen,
    },
    {
      element: '#table-mode-option-heatmap',
      popover: {
        title: isEn ? '3. Heatmap Mode (Spatial Density)' : '3. Mode Heatmap (Kepadatan Spasial)',
        description: isEn
          ? 'Tabulates spatial concentration and stop frequency data based on date range and movement status conditions (driving, idle, parking).'
          : 'Menganalisis tabulasi sebaran kepadatan dan titik singgah kendaraan berdasarkan rentang tanggal dan status pergerakan (Berjalan, Idle, Parkir).',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: ensureDropdownOpen,
    },
    {
      element: '#table-mode-option-parking',
      popover: {
        title: isEn ? '4. Parking Mode (Stop & Parking Report)' : '4. Mode Parkir (Laporan Durasi & Lokasi Parkir)',
        description: isEn
          ? 'Comprehensive report on vehicle stops and parking durations, start/end times, parking locations/addresses, and configurable minimum stop duration thresholds.'
          : 'Rekapitulasi durasi parkir kendaraan, waktu mulai dan selesai berhenti, koordinat/lokasi tempat parkir, serta filter durasi henti minimum (misal parkir > 5 menit).',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: ensureDropdownOpen,
    },
    {
      element: '#table-mode-option-mileage',
      popover: {
        title: isEn ? '5. Mileage Mode (Odometer & Distance)' : '5. Mode Jarak Tempuh (Akumulasi Kilometer)',
        description: isEn
          ? 'Daily and period distance accumulation reports for route efficiency evaluation, fuel consumption tracking, and vehicle maintenance scheduling.'
          : 'Laporan akumulasi jarak tempuh (kilometer) kendaraan per periode waktu untuk evaluasi efisiensi rute operasional, konsumsi BBM, dan jadwal perawatan.',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: ensureDropdownOpen,
    },
    {
      element: '#table-mode-option-speed',
      popover: {
        title: isEn ? '6. Speed Mode (Speed Analysis & Overspeed)' : '6. Mode Kecepatan (Analisis Kecepatan & Overspeed)',
        description: isEn
          ? 'Tracks average speed, maximum top speeds, and overspeed threshold violations to enforce driver safety and company speed compliance policies.'
          : 'Monitoring kecepatan rata-rata, kecepatan maksimum, serta pencatatan insiden pelanggaran batas kecepatan (overspeed) untuk keselamatan berkendara.',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: ensureDropdownOpen,
    },
    {
      element: '#data-table-search',
      popover: {
        title: isEn ? 'Vehicle Search' : 'Pencarian Cepat Kendaraan',
        description: isEn
          ? 'Quickly filter the table rows by vehicle license plate number, driver name, or fleet group.'
          : 'Saring baris data tabel secara cepat berdasarkan nomor pelat kendaraan, nama pengemudi, atau kelompok kendaraan.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureDropdownClosed,
    },
    {
      element: '#data-table-utilities',
      popover: {
        title: isEn ? 'Table Utilities & Export' : 'Toolbar Utilitas & Ekspor Data',
        description: isEn
          ? 'Standard utility controls: Refresh data, customize visible columns (Columns), expand to full screen (Fullscreen), or download table data as CSV/Excel (Export).'
          : 'Kontrol utilitas standar: Muat ulang data (Refresh), atur kolom yang ditampilkan (Kolom), buka tampilan layar penuh (Fullscreen), serta unduh data ke format CSV/Excel (Ekspor).',
        side: 'bottom',
        align: 'end',
      },
      onHighlightStarted: ensureDropdownClosed,
    },
  ];
}

/**
 * Tur Tampilan Tabel Data Kendaraan (Tab Bawah: Tabel - Umum / Live)
 */
export function getTableTourSteps(locale: Locale = 'id'): DriveStep[] {
  return getTableModeSelectorTourSteps(locale);
}

/**
 * Tur Tabel Parkir
 */
export function getParkingTableTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureParkingMode = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-switch-table-mode', { detail: { mode: 'parking' } }));
  };

  return [
    {
      element: '#table-mode-selector-btn',
      popover: {
        title: isEn ? 'Parking Table Mode' : 'Mode Tabel Parkir Terpilih',
        description: isEn
          ? 'Currently viewing vehicle parking and stop event summaries.'
          : 'Saat ini menampilkan ringkasan laporan waktu henti dan durasi parkir kendaraan.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureParkingMode,
    },
    {
      element: '#table-filter-popover-btn',
      popover: {
        title: isEn ? 'Date & Minimum Duration Filter' : 'Filter Tanggal & Durasi Minimal',
        description: isEn
          ? 'Set the date range and the minimum duration threshold (e.g. 5 mins, 15 mins) to only capture significant parking stops.'
          : 'Tentukan rentang tanggal dan ambang durasi henti minimal (contoh: 5 menit, 15 menit) agar hanya mencatat pemberhentian yang signifikan.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: ensureParkingMode,
    },
    {
      element: '#tracking-table-container',
      popover: {
        title: isEn ? 'Parking Event Records' : 'Daftar Catatan Parkir Kendaraan',
        description: isEn
          ? 'Displays vehicle plate, stop location/address, start time, end time, and total parking duration.'
          : 'Menampilkan nomor pelat, alamat/lokasi parkir, waktu mulai, waktu selesai, serta total durasi kendaraan parkir.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureParkingMode,
    },
    {
      element: '#data-table-utilities',
      popover: {
        title: isEn ? 'Export Parking Reports' : 'Ekspor Laporan Parkir',
        description: isEn
          ? 'Download parking duration records as CSV/Excel for driver time tracking or billing audits.'
          : 'Unduh laporan durasi parkir ke format CSV/Excel untuk audit operasional atau penagihan.',
        side: 'bottom',
        align: 'end',
      },
      onHighlightStarted: ensureParkingMode,
    },
  ];
}

/**
 * Tur Tabel Jarak Tempuh (Mileage)
 */
export function getMileageTableTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureMileageMode = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-switch-table-mode', { detail: { mode: 'mileage' } }));
  };

  return [
    {
      element: '#table-mode-selector-btn',
      popover: {
        title: isEn ? 'Mileage Table Mode' : 'Mode Tabel Jarak Tempuh Terpilih',
        description: isEn
          ? 'Currently viewing accumulated vehicle mileage and odometer statistics.'
          : 'Saat ini menampilkan akumulasi jarak tempuh dan statistik odometer kendaraan.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureMileageMode,
    },
    {
      element: '#table-filter-popover-btn',
      popover: {
        title: isEn ? 'Date Range Parameters' : 'Parameter Rentang Tanggal',
        description: isEn
          ? 'Select date boundaries to calculate vehicle distances driven over specific work shifts or days.'
          : 'Pilih batas tanggal untuk menghitung jarak tempuh kendaraan pada shift atau periode kerja tertentu.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: ensureMileageMode,
    },
    {
      element: '#tracking-table-container',
      popover: {
        title: isEn ? 'Distance Breakdown Table' : 'Tabel Akumulasi Jarak Tempuh',
        description: isEn
          ? 'Review initial odometer reading, final odometer, and total accumulated kilometers per vehicle.'
          : 'Tinjau odometer awal, odometer akhir, serta total kilometer yang ditempuh oleh masing-masing kendaraan.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureMileageMode,
    },
  ];
}

/**
 * Tur Tabel Kecepatan (Speed & Overspeed)
 */
export function getSpeedTableTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureSpeedMode = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-switch-table-mode', { detail: { mode: 'speed' } }));
  };

  return [
    {
      element: '#table-mode-selector-btn',
      popover: {
        title: isEn ? 'Speed Table Mode' : 'Mode Tabel Kecepatan Terpilih',
        description: isEn
          ? 'Currently analyzing speed metrics, average speed, and overspeed safety events.'
          : 'Saat ini menganalisis metrik kecepatan, kecepatan rata-rata, dan insiden pelanggaran overspeed.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureSpeedMode,
    },
    {
      element: '#table-filter-popover-btn',
      popover: {
        title: isEn ? 'Date Range & Speed Limits' : 'Filter Tanggal & Parameter Batas Kecepatan',
        description: isEn
          ? 'Select the reporting dates and configure speed thresholds for overspeed detection.'
          : 'Tentukan tanggal laporan dan atur ambang batas kecepatan untuk deteksi overspeed.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: ensureSpeedMode,
    },
    {
      element: '#tracking-table-container',
      popover: {
        title: isEn ? 'Speed Analysis Records' : 'Tabel Analisis Kecepatan Kendaraan',
        description: isEn
          ? 'Displays vehicle plate, top speed recorded, average moving speed, and count of overspeed occurrences.'
          : 'Menampilkan nomor pelat, kecepatan puncak (maksimum), kecepatan rata-rata, dan jumlah kejadian pelanggaran batas kecepatan.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureSpeedMode,
    },
  ];
}


// ─── 5. ACTIVITY / NOTIFICATION TOURS ─────────────────────────────────────────

/**
 * Tur Pusat Aktivitas & Notifikasi (Tab Bawah: Aktivitas)
 */
export function getActivityTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#tracking-activity-tabs',
      popover: {
        title: isEn ? '1. Category Filter Tabs' : '1. Filter Kategori Aktivitas',
        description: isEn
          ? 'Easily filter alerts between All Notifications, Vehicle Alarms (overspeed/offline/impact), Maintenance (service reminders), and Operations (trip completions).'
          : 'Saring peringatan dengan mudah: Semua Notifikasi, Alarm Kendaraan (kecepatan berlebih/offline), Perawatan (jadwal servis), dan Operasional (penyelesaian rute).',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tracking-activity-list',
      popover: {
        title: isEn ? '2. Real-time Event Feed' : '2. Daftar Peringatan & Riwayat Alarm',
        description: isEn
          ? 'Chronological feed of critical alerts. Icons indicate alert severity: red for critical alarms, yellow for warnings, and blue for operational info.'
          : 'Daftar riwayat peringatan berurutan waktu. Ikon menunjukkan tingkat urgensi: merah untuk alarm kritis, kuning untuk peringatan sensor, dan biru untuk info operasional.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#tracking-bottom-dock',
      popover: {
        title: isEn ? 'Dock Navigation' : 'Kembali ke Peta atau Tabel',
        description: isEn
          ? 'Click Peta to return to the interactive map canvas.'
          : 'Klik tombol Peta pada dock bawah ini untuk kembali ke kanvas peta interaktif.',
        side: 'top',
        align: 'start',
      },
    },
  ];
}

// ─── 6. VEHICLE SELECTION & OVERVIEW TELEMETRY PANEL TOURS ─────────────────────

/**
 * Tur Memilih Kendaraan & Penjelasan Lengkap Panel Detail Telemetri (VehicleOverviewPanel)
 */
export function getVehicleOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureVehicleSelected = () => {
    if (!document.querySelector('#vehicle-overview-panel')) {
      window.dispatchEvent(new CustomEvent('adatrack:tour-select-vehicle'));
    }
  };

  return [
    {
      element: '#tracking-first-vehicle-item',
      popover: {
        title: isEn ? '1. Select a Vehicle' : '1. Memilih Kendaraan',
        description: isEn
          ? 'Click any vehicle in the right list panel (or click a vehicle marker directly on the map). This centers the map on the vehicle and opens the Telemetry & Action Overview Panel at the bottom.'
          : 'Klik salah satu kendaraan pada daftar panel kanan (atau klik marker kendaraan langsung pada peta). Tindakan ini akan memusatkan kamera peta ke kendaraan dan otomatis membuka Panel Informasi & Telemetri di bagian bawah layar.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-select-vehicle'));
      },
    },
    {
      element: '#vehicle-overview-panel',
      popover: {
        title: isEn ? '2. Vehicle Overview & Telemetry Panel' : '2. Panel Informasi & Telemetri Kendaraan',
        description: isEn
          ? 'This docked panel provides a real-time summary of vehicle movement, driver assignments, instant operational actions, and 4 modular telemetry KPI metric cards.'
          : 'Panel dock bawah ini menyajikan rangkuman telemetri lengkap, status operasional real-time, tombol tindakan cepat, serta 4 kartu metrik telemetri modular untuk kendaraan yang dipilih.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-vehicle-info',
      popover: {
        title: isEn ? '3. License Plate & Operational Status' : '3. Plat Nomor & Status Operasional',
        description: isEn
          ? 'Shows the vehicle license plate with a directional heading arrow (°), and a real-time status badge (Driving, Idle, Parking, or Offline) with an animated live pulse.'
          : 'Menampilkan Plat Nomor kendaraan dengan panah arah hadap kompas (°), serta Label Status real-time (Berjalan, Idle, Parkir, atau Offline) dengan indikator kedip aktif saat bergerak.',
        side: 'top',
        align: 'start',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-action-playback',
      popover: {
        title: isEn ? '4. Playback Action (Trip Replay)' : '4. Tombol Playback (Riwayat Perjalanan)',
        description: isEn
          ? 'Click to open Playback mode for this vehicle to replay historical routes, inspect movement speeds, and review stop durations.'
          : 'Klik untuk membuka mode Playback kendaraan ini guna memutar ulang rekaman rute perjalanan, meninjau variasi kecepatan, dan durasi titik henti (P).',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-action-geofence',
      popover: {
        title: isEn ? '5. Create Geofence Action' : '5. Tombol Buat Geofence Cepat',
        description: isEn
          ? 'Quickly create a new virtual Geofence boundary centered immediately on this vehicle\'s current GPS location without manual coordinates entry.'
          : 'Membuka modal untuk membuat batas wilayah (Geofence) baru secara instan dengan titik pusat otomatis disematkan pada koordinat lokasi kendaraan saat ini.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-action-maps',
      popover: {
        title: isEn ? '6. Open in Google Maps' : '6. Tombol Buka di Google Maps',
        description: isEn
          ? 'Opens the exact vehicle location directly in Google Maps in a new tab for driving directions, external satellite imagery, or sharing.'
          : 'Membuka lokasi presisi kendaraan secara langsung di Google Maps pada tab browser baru untuk rute petunjuk arah navigasi atau verifikasi visual.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-action-street',
      popover: {
        title: isEn ? '7. Google Street View' : '7. Tombol Google Street View',
        description: isEn
          ? 'Launches a 360° Google Street View panorama corresponding to the vehicle\'s GPS coordinates and heading direction to inspect actual ground conditions.'
          : 'Membuka tampilan panorama 360° Google Street View sesuai titik koordinat dan sudut arah hadap kendaraan untuk memeriksa situasi lingkungan di dunia nyata.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-action-share',
      popover: {
        title: isEn ? '8. Share Live Location' : '8. Tombol Bagikan Lokasi Real-Time',
        description: isEn
          ? 'Generates a secure public tracking link that can be shared with customers or field teams, with configurable link expiration times.'
          : 'Menghasilkan tautan publik pelacakan real-time yang aman untuk dibagikan kepada pelanggan atau tim lapangan, lengkap dengan pengaturan masa aktif tautan.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-action-close',
      popover: {
        title: isEn ? '9. Close Overview Panel' : '9. Tombol Tutup Panel Detail (✕)',
        description: isEn
          ? 'Closes this overview panel and clears vehicle selection to return the map canvas to its full uncluttered view.'
          : 'Menutup panel ringkasan ini dan melepas pemilihan kendaraan untuk mengembalikan tampilan kanvas peta ke mode pemantauan luas penuh.',
        side: 'top',
        align: 'end',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-kpi-speed',
      popover: {
        title: isEn ? '10. Speed & Ignition Telemetry (ACC)' : '10. Telemetri Kecepatan & Kontak Mesin (ACC)',
        description: isEn
          ? 'Displays live speed in km/h, vehicle model/type (e.g. Suzuki Carry), and ignition sensor status (ACC ON: engine running, ACC OFF: engine turned off).'
          : 'Menampilkan kecepatan langsung dalam satuan km/h, tipe/model kendaraan (contoh: Suzuki Carry), serta status sensor kontak kunci mesin (ACC ON: mesin menyala, ACC OFF: mesin mati).',
        side: 'top',
        align: 'start',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-kpi-driver',
      popover: {
        title: isEn ? '11. Driver Info & GPS Hardware' : '11. Informasi Pengemudi & Hardware GPS',
        description: isEn
          ? 'Shows the assigned driver, ONLINE network indicator, and unique hardware Serial Number (SN) of the installed GPS tracker.'
          : 'Menampilkan nama pengemudi yang sedang bertugas, indikator status koneksi jaringan ONLINE, serta Nomor Seri unik (SN) dari perangkat GPS tracker yang terpasang.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-kpi-location',
      popover: {
        title: isEn ? '12. Current Location & Alarm Alerts' : '12. Lokasi Terkini & Peringatan Alarm',
        description: isEn
          ? 'Presents the physical reverse-geocoded street address, any active critical alarm event (e.g. SOS, Overspeed), precise coordinates (Lat, Lng), and city.'
          : 'Menyajikan alamat fisik jalan hasil geocoding, status alarm event aktif (seperti SOS, batas kecepatan, dsb jika ada), koordinat presisi (Lat, Lng), dan nama kota.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
    {
      element: '#overview-kpi-geofence',
      popover: {
        title: isEn ? '13. Geofence Boundary & Heading' : '13. Status Geofence & Sudut Hadap Kompas',
        description: isEn
          ? 'Indicates whether the vehicle is inside or outside a registered geofence, geofence name, compass orientation angle (°), and the last data reception timestamp.'
          : 'Menunjukkan apakah kendaraan berada di \'DALAM\' atau \'LUAR\' batas Geofence operasional, nama geofence, sudut orientasi arah kompas (°), dan waktu pembaruan data terakhir.',
        side: 'top',
        align: 'end',
      },
      onHighlightStarted: ensureVehicleSelected,
    },
  ];
}

// ─── 7. VEHICLE STATUS FILTER TABS TOURS ──────────────────────────────────────

/**
 * Tur Bilah Filter Status Kendaraan (Semua, Berjalan, Berhenti, Parkir, Offline)
 */
export function getVehicleStatusFilterTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureVehicleListOpen = () => {
    const expandBtn = document.querySelector('#tracking-vehicle-list-expand-btn') as HTMLElement | null;
    if (expandBtn) {
      expandBtn.click();
    }
  };

  return [
    {
      element: '#tracking-status-filter-bar',
      popover: {
        title: isEn ? 'Vehicle Status Filter Bar' : 'Bilah Filter Status Kendaraan',
        description: isEn
          ? 'This top filter bar allows you to quickly filter vehicles on the map and list by their real-time operational status (All, Driving, Idle, Parking, Offline).'
          : 'Bilah filter atas ini memungkinkan Anda menyaring kendaraan di peta dan daftar secara instan berdasarkan status operasional real-time (Semua, Berjalan, Berhenti, Parkir, dan Offline).',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: ensureVehicleListOpen,
    },
    {
      element: '#status-tab-all',
      popover: {
        title: isEn ? '1. All Vehicles Tab (Semua)' : '1. Tab Semua Kendaraan',
        description: isEn
          ? 'Displays all registered vehicles across all statuses along with total count badge. Shows the complete fleet without any status filtering applied.'
          : 'Menampilkan seluruh kendaraan yang terdaftar (baik yang sedang aktif maupun tidak), disertai total kuantitas kendaraan. Menampilkan gambaran menyeluruh tanpa penyaringan status.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        ensureVehicleListOpen();
        (document.querySelector('#status-tab-all') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#status-tab-driving',
      popover: {
        title: isEn ? '2. Driving Vehicles Tab (Berjalan)' : '2. Tab Kendaraan Berjalan',
        description: isEn
          ? 'Filters vehicles that are actively moving on the road with speed > 0 km/h and engine ignition switched ON (ACC ON). Indicated by the green play icon.'
          : 'Menyaring kendaraan yang sedang aktif bergerak melaju di jalan dengan kecepatan > 0 km/h dan kunci kontak mesin aktif (ACC ON). Ditandai dengan ikon putar hijau.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        ensureVehicleListOpen();
        (document.querySelector('#status-tab-driving') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#status-tab-idle',
      popover: {
        title: isEn ? '3. Idle / Stopped Vehicles Tab (Berhenti)' : '3. Tab Kendaraan Berhenti (Idle)',
        description: isEn
          ? 'Filters vehicles that are stationary (speed 0 km/h) but the engine is still running with ignition ON (ACC ON), such as waiting at traffic lights or warming up. Indicated by the orange pause icon.'
          : 'Menyaring kendaraan yang sedang dalam kondisi diam/berhenti (kecepatan 0 km/h) namun mesin kendaraan masih tetap menyala (ACC ON), misalnya saat menunggu di lampu merah atau sedang memanaskan mesin. Ditandai dengan ikon jeda oranye.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        ensureVehicleListOpen();
        (document.querySelector('#status-tab-idle') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#status-tab-parking',
      popover: {
        title: isEn ? '4. Parked Vehicles Tab (Parkir)' : '4. Tab Kendaraan Parkir',
        description: isEn
          ? 'Filters vehicles that are safely parked with speed 0 km/h and engine ignition switched OFF (ACC OFF). Indicated by the blue (P) badge icon.'
          : 'Menyaring kendaraan yang sedang diparkir dengan kecepatan 0 km/h dan kunci kontak mesin dimatikan (ACC OFF). Ditandai dengan lencana lingkaran huruf P biru.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        ensureVehicleListOpen();
        (document.querySelector('#status-tab-parking') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#status-tab-offline',
      popover: {
        title: isEn ? '5. Offline Vehicles Tab (Offline)' : '5. Tab Kendaraan Offline',
        description: isEn
          ? 'Filters vehicles whose GPS trackers have stopped transmitting telemetry data or have disconnected from cellular networks for a designated duration. Indicated by the gray circle dot icon.'
          : 'Menyaring kendaraan yang perangkat GPS Tracker-nya tidak mengirimkan pembaruan data telemetri atau terputus dari jaringan dalam jangka waktu tertentu. Ditandai dengan ikon titik abu-abu.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        ensureVehicleListOpen();
        (document.querySelector('#status-tab-offline') as HTMLElement | null)?.click();
      },
    },
    {
      element: '#tracking-vehicle-list-panel',
      popover: {
        title: isEn ? '6. Real-time Filter Results' : '6. Hasil Penyaringan Real-Time',
        description: isEn
          ? 'Selecting any status tab dynamically updates both the vehicle list items below and the corresponding vehicle markers visible on the map canvas.'
          : 'Memilih salah satu tab status akan langsung menyaring daftar kendaraan di bawah serta marker yang tampak pada kanvas peta secara instan.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: () => {
        ensureVehicleListOpen();
        (document.querySelector('#status-tab-all') as HTMLElement | null)?.click();
      },
    },
  ];
}

// ─── 8. PLAYBACK ROUTE CREATION & GEOFENCE LAYER TOURS ────────────────────────

/**
 * Tur Pembuatan Rute dari Playback & Panel Layer Geofence / Rute Terkait
 */
export function getPlaybackRouteCropTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureCropModeActive = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-playback-route-crop'));
  };

  return [
    {
      element: '#playback-map-layer-panel',
      popover: {
        title: isEn ? '1. Playback Layer & Route Panel' : '1. Panel Layer Geofence & Rute Playback',
        description: isEn
          ? 'This right sidebar provides visual layer controls, automatic geofence detection, route pattern matching (≥ 80%), and the tool to create operational routes from playback trails.'
          : 'Panel samping kanan ini menyediakan kontrol visual layer peta, deteksi otomatis batas Geofence yang dilintasi, pencocokan pola rute (≥ 80%), serta alat pembuatan rute operasional langsung dari rekaman perjalanan.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureCropModeActive,
    },
    {
      element: '#playback-layer-legend',
      popover: {
        title: isEn ? '2. Map Layer Legend' : '2. Legenda Jalur & Simbol Peta',
        description: isEn
          ? 'Displays color-coded indicators: Blue for upcoming route trails (Belum dilewati), Red for passed trails (Sudah dilewati), dashed orange for master Routes, and green for Geofence polygons.'
          : 'Memberikan panduan warna: Garis biru untuk jalur yang belum dilewati kendaraan, garis merah tebal untuk jalur yang sudah dilewati, garis putus-putus oranye untuk Master Rute, dan batas hijau untuk polygon Geofence.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: ensureCropModeActive,
    },
    {
      element: '#playback-geofence-section',
      popover: {
        title: isEn ? '3. Traversed Geofences Detection' : '3. Deteksi Batas Geofence Terlewati',
        description: isEn
          ? 'Automatically identifies all geofences that the vehicle entered during this trip. Switch between "Terkait" (only traversed boundaries) or "Semua" (entire system geofences), and use search to locate specific zones.'
          : 'Sistem secara otomatis mendeteksi seluruh zona Geofence yang dilintasi kendaraan selama perjalanan ini. Gunakan tab "Terkait" untuk melihat zona yang dilewati atau "Semua" untuk seluruh geofence, lengkap dengan kotak pencarian.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: ensureCropModeActive,
    },
    {
      element: '#playback-route-section',
      popover: {
        title: isEn ? '4. Route Similarity Matching (≥ 80%)' : '4. Rekomendasi Rute Terkait (≥ 80%)',
        description: isEn
          ? 'Calculates geometric similarity between the playback track and registered master routes. Routes matching 80% or higher are prioritized and checked automatically to verify adherence.'
          : 'Menganalisis kemiripan geometris antara jejak perjalanan playback dengan Master Rute terdaftar. Rute dengan tingkat kemiripan ≥ 80% akan otomatis diprioritaskan dan dicentang untuk memvalidasi kepatuhan rute sopir.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: ensureCropModeActive,
    },
    {
      element: '#playback-create-route-btn',
      popover: {
        title: isEn ? '5. Toggle Route Crop Mode' : '5. Tombol Mode Buat Rute dari Playback',
        description: isEn
          ? 'Click to toggle route creation mode. When active, it unlocks the double-ended trimmer scrubber at the bottom player bar to trim trip start/end boundaries.'
          : 'Tombol untuk mengaktifkan mode pembuatan rute. Saat mode ini aktif, bilah pemutar bawah akan berubah menjadi slider pemotong rentang rute (trimmer) berwarna oranye emas.',
        side: 'left',
        align: 'end',
      },
      onHighlightStarted: ensureCropModeActive,
    },
    {
      element: '#playback-crop-timeline',
      popover: {
        title: isEn ? '6. Interactive Route Trimmer Bar' : '6. Linimasa Pemotongan Rentang Rute',
        description: isEn
          ? 'An interactive dual-bracket trimmer slider inspired by video editing tools. The highlighted amber region represents the exact trip segment that will be converted into a new operational Route.'
          : 'Slider pemotong dua sisi interaktif mirip video editor. Area rentang oranye keemasan yang disorot merupakan segmen perjalanan nyata yang akan diubah menjadi Master Rute operasional baru.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureCropModeActive,
    },
    {
      element: '#playback-crop-handle-start',
      popover: {
        title: isEn ? '7. Start & End Trimmer Handles' : '7. Handle Titik Awal & Akhir',
        description: isEn
          ? 'Drag the left amber bracket to set the start timestamp (e.g. 06:39:45), and drag the right bracket to set the end timestamp (e.g. 08:44:45). You can also drag the center window to shift the entire time window.'
          : 'Geser handle kiri untuk memotong jam awal perjalanan (contoh: 06:39:45), dan geser handle kanan untuk memotong jam akhir perjalanan (contoh: 08:44:45). Anda juga dapat menggeser area tengah untuk memindahkan rentang waktu secara utuh.',
        side: 'top',
        align: 'start',
      },
      onHighlightStarted: ensureCropModeActive,
    },
    {
      element: '#playback-crop-actions',
      popover: {
        title: isEn ? '8. Confirm or Cancel Route Creation' : '8. Tombol Batal & Buat Rute',
        description: isEn
          ? 'Click "Batal" to exit trimmer mode without saving. Click "Buat Rute →" to open the confirmation dialog, customize the route name, and save it directly into the Master Routes system.'
          : 'Klik "Batal" untuk keluar dari mode pemotong rute. Klik "Buat Rute →" untuk membuka dialog konfirmasi, memberi nama rute, serta menyimpannya langsung ke modul Master Rute operasional.',
        side: 'top',
        align: 'end',
      },
      onHighlightStarted: ensureCropModeActive,
    },
  ];
}

// Backward compatibility alias for general tracking tour
export const getTrackingTourSteps = getLiveTourSteps;
