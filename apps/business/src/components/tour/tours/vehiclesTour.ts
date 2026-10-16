import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// ─── 1. OVERVIEW TOUR ────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Manajemen Kendaraan (Vehicles Overview)
 */
export function getVehiclesOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Welcome to Vehicle Management 👋' : 'Selamat Datang di Manajemen Kendaraan 👋',
        description: isEn
          ? 'Centralized master data, telemetry health status, fuel efficiency scores, and operational documents for all vehicles in your organization.'
          : 'Pusat data master, status kesehatan telemetri, skor efisiensi BBM, dan kelengkapan dokumen operasional seluruh kendaraan perusahaan Anda.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-vehicle-detail'));
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-vehicle-form'));
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-filter'));
      },
    },
    {
      element: '#vehicles-table-container',
      popover: {
        title: isEn ? 'Vehicle Master Data Table' : 'Tabel Master Data Kendaraan',
        description: isEn
          ? 'Interactive data table displaying license plates, real-time status, vehicle category, primary driver, odometer, and last telemetry update.'
          : 'Tabel data interaktif yang menampilkan nomor pelat, status operasional terkini, kategori, pengemudi utama, odometer, dan update telemetri terakhir.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#data-table-search-input',
      popover: {
        title: isEn ? 'Quick Vehicle Search' : 'Pencarian Cepat Kendaraan',
        description: isEn
          ? 'Quickly locate vehicles by plate number, vehicle name, brand, driver name, or telemetry device ID.'
          : 'Cari kendaraan dengan cepat berdasarkan nomor pelat, nama unit, merk, nama pengemudi, maupun nomor ID perangkat telemetri.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#data-table-filter-btn',
      popover: {
        title: isEn ? 'Filter & Grouping Controls' : 'Tombol Filter & Pengelompokan',
        description: isEn
          ? 'Click to expand multidimensional filter criteria such as operational status, vehicle groups, driver ratings, and document expiry.'
          : 'Klik untuk membuka filter multidimensi seperti status operasional, grup kendaraan, rating efisiensi pengemudi, dan masa berlaku dokumen.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#vehicles-first-plate-btn',
      popover: {
        title: isEn ? 'Vehicle Plate & Quick Detail' : 'Pelat Nomor & Buka Detail',
        description: isEn
          ? 'Click on any license plate to open the full vehicle specifications drawer, efficiency analytics, and remote immobilizer commands.'
          : 'Klik tombol pelat nomor untuk membuka laci spesifikasi lengkap kendaraan, analitik efisiensi, serta kendali pemutus mesin (remote immobilizer).',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#vehicles-btn-add',
      popover: {
        title: isEn ? 'Register New Vehicle' : 'Tambah Kendaraan Baru',
        description: isEn
          ? 'Add and onboard a new vehicle into the system, including registration cards, engine specifications, and telemetry device binding.'
          : 'Daftarkan unit kendaraan baru ke dalam sistem, lengkap dengan identitas STNK, spesifikasi mesin, dan penautan perangkat telemetri.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#data-table-pagination',
      popover: {
        title: isEn ? 'Pagination & Records Summary' : 'Paginasi & Ringkasan Data',
        description: isEn
          ? 'View total registered vehicles, navigate through pages, and adjust page size (10, 25, 50, 100 rows).'
          : 'Lihat ringkasan total kendaraan yang terdaftar, navigasi antar halaman, dan atur jumlah baris per halaman (10, 25, 50, 100 baris).',
        side: 'top',
        align: 'center',
      },
    },
  ];
}

// ─── 2. FILTER & TOOLS TOUR ─────────────────────────────────────────────────

/**
 * Tur Filter dan Alat Bantu Tabel Kendaraan
 */
export function getVehiclesFilterTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#data-table-search-input',
      popover: {
        title: isEn ? '1. Global Search Filter' : '1. Filter Pencarian Cepat',
        description: isEn
          ? 'Filter vehicles instantaneously by typing partial plate numbers (e.g., "B 1234"), driver names, or vehicle model.'
          : 'Saring kendaraan secara instan dengan mengetikkan nomor pelat (contoh: "B 1234"), nama pengemudi, atau model kendaraan.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-vehicle-detail'));
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-vehicle-form'));
      },
    },
    {
      element: '#data-table-filter-btn',
      popover: {
        title: isEn ? '2. Filter Panel Toggle' : '2. Buka Panel Filter',
        description: isEn
          ? 'Toggle the advanced filter panel to apply deep operational queries.'
          : 'Buka atau tutup panel filter lanjutan untuk menyaring data kendaraan berdasarkan kriteria operasional mendalam.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-open-filter'));
      },
    },
    {
      element: '#data-table-filter-panel',
      popover: {
        title: isEn ? '3. Multi-Criteria Filter Panel' : '3. Panel Kriteria Multi-Dimensi',
        description: isEn
          ? 'Filter by moving status (Driving, Idle, Parking, Offline), driver efficiency stars (1-5 stars), vehicle operating group, and registration validity (STNK status).'
          : 'Saring berdasarkan status operasional (Berjalan, Idle, Parkir, Offline), bintang efisiensi pengemudi (1-5 bintang), grup kendaraan, dan masa berlaku STNK.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-open-filter'));
      },
    },
    {
      element: '#data-table-columns-btn',
      popover: {
        title: isEn ? '4. Column Visibility Picker' : '4. Pengaturan Kolom Tabel',
        description: isEn
          ? 'Customize visible columns according to your monitoring needs. Show or hide chassis numbers, engine CC, fuel ratios, and device IMEIs.'
          : 'Sesuaikan kolom yang tampil sesuai kebutuhan operasional. Tampilkan atau sembunyikan nomor rangka, kapasitas mesin CC, rasio BBM, hingga IMEI perangkat.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#data-table-export-btn',
      popover: {
        title: isEn ? '5. Export Vehicle Data' : '5. Ekspor Data Kendaraan',
        description: isEn
          ? 'Download the currently filtered vehicle dataset into Excel/CSV format for reporting, audits, or operational archives.'
          : 'Unduh seluruh data kendaraan yang sedang disaring ke format Excel/CSV untuk kebutuhan pelaporan, audit, maupun arsip operasional.',
        side: 'bottom',
        align: 'end',
      },
    },
  ];
}

// ─── 3. VEHICLE DETAIL TOUR ─────────────────────────────────────────────────

/**
 * Tur Laci Detail Kendaraan & Kendali Jarak Jauh
 */
export function getVehiclesDetailTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureDetailOpen = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-vehicle-form'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-filter'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-open-vehicle-detail'));
  };

  return [
    {
      element: '#vehicle-view-header',
      popover: {
        title: isEn ? 'Vehicle Header & Live Status' : 'Header Kendaraan & Status Operasional',
        description: isEn
          ? 'Displays the vehicle name, plate number, manufacturing year, operational status pill (Driving/Idle/Parking/Offline), and remote immobilizer badge if active.'
          : 'Menampilkan nama unit kendaraan, pelat nomor, tahun pembuatan, indikator status operasional (Berjalan/Idle/Parkir/Offline), dan status immobilizer jika aktif.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#vehicle-view-quick-actions',
      popover: {
        title: isEn ? 'Remote Quick Actions' : 'Tombol Aksi Cepat & Kendali Jarak Jauh',
        description: isEn
          ? 'Execute critical vehicle operations: track live position on the map, reboot GPS telemetry hardware, or trigger the remote engine cut-off immobilizer.'
          : 'Eksekusi kendali kritis kendaraan: lacak posisi live di peta, kirim perintah reboot hardware GPS, atau putus relay mesin (remote immobilizer).',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#vehicle-view-card-efficiency',
      popover: {
        title: isEn ? 'Efficiency & Driving Analytics' : 'Efisiensi & Analitik Berkendara',
        description: isEn
          ? 'Comprehensive telemetry metrics: idle duration ratio, engine operating hours, speeding violations, signal stability, and overall 5-star driver score.'
          : 'Metrik telemetri komprehensif: rasio waktu idle, jam kerja mesin aktif, pelanggaran kecepatan, stabilitas sinyal, dan skor pengemudi bintang 1-5.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#vehicle-view-card-specs',
      popover: {
        title: isEn ? 'Physical Specifications & Identity' : 'Identitas Fisik & Spesifikasi Teknis',
        description: isEn
          ? 'Review structural details: category, internal asset number, color, dimensions (L × W × H), passenger seat count, and engine displacement (CC).'
          : 'Spesifikasi fisik lengkap: kategori kendaraan, nomor aset perusahaan, warna, dimensi fisik (P × L × T), kapasitas penumpang, dan kapasitas mesin (CC).',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#vehicle-view-card-operations',
      popover: {
        title: isEn ? 'Operations & Fuel Performance' : 'Operasional & Performa BBM',
        description: isEn
          ? 'Assigned driver, fuel type (Diesel/Gasoline/Electric), fuel tank capacity (L), standard consumption ratio (km/L), and speed governor limit.'
          : 'Penugasan pengemudi utama, jenis bahan bakar (Solar/Bensin/Listrik), kapasitas tangki (L), estimasi rasio konsumsi (km/L), dan batas kecepatan maksimum.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#vehicle-view-card-maintenance',
      popover: {
        title: isEn ? 'Odometer & Maintenance Schedule' : 'Odometer & Jadwal Perawatan',
        description: isEn
          ? 'Monitors cumulative odometer mileage, last service record, and progress bar towards the next scheduled maintenance with service due warnings.'
          : 'Pantau akumulasi jarak tempuh odometer, histori servis terakhir, dan bar persentase menuju jadwal perawatan berkala berikutnya.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#vehicle-view-card-documents',
      popover: {
        title: isEn ? 'Licensing & Legal Documents' : 'Lisensi & Dokumen Legalitas',
        description: isEn
          ? 'Tracks STNK expiry date with smart color-coded badges (Valid, Expiring Soon < 60 days, Expired), STNK number, KIR test, BPKB, engine number, and chassis VIN.'
          : 'Pemantauan masa berlaku STNK dengan indikator warna pintar (Berlaku, Segera Habis < 60 hari, Kedaluwarsa), nomor STNK, uji KIR, BPKB, nomor mesin, dan nomor rangka.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#vehicle-view-card-device',
      popover: {
        title: isEn ? 'GPS Telemetry Device' : 'Perangkat GPS & Telemetri Terpasang',
        description: isEn
          ? 'Telematics hardware details: GPS brand, device model, hardware IMEI, cellular SIM number, installation date, and last ping timestamp.'
          : 'Data perangkat telematika terpasang: merek GPS, model perangkat, IMEI perangkat, nomor SIM seluler, tanggal pasang, dan timestamp sinyal telemetri terakhir.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
  ];
}

// ─── 4. VEHICLE FORM TOUR ───────────────────────────────────────────────────

/**
 * Tur Formulir Pendaftaran / Pengeditan Kendaraan
 */
export function getVehiclesFormTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureFormOpen = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-vehicle-detail'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-filter'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-open-vehicle-form'));
  };

  return [
    {
      element: '#vehicle-form-identity-card',
      popover: {
        title: isEn ? '1. Basic Identity Information' : '1. Informasi Identitas Dasar',
        description: isEn
          ? 'Enter the official license plate number, vehicle display name, company asset code, and assign the vehicle to an operational group.'
          : 'Isi nomor pelat resmi kendaraan, nama unit, kode aset perusahaan, dan tetapkan grup operasional kendaraan.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#vehicle-form-specs-card',
      popover: {
        title: isEn ? '2. Technical & Physical Specifications' : '2. Spesifikasi Teknis & Dimensi',
        description: isEn
          ? 'Select vehicle category (Truck, Minibus, Pickup, Motorcycle, Other), brand, year, color, exterior dimensions, and engine capacity in CC.'
          : 'Pilih kategori kendaraan (Truk, Minibus, Pickup, Motor, Lainnya), merk, tahun produksi, warna, dimensi bodi fisik, dan kapasitas mesin dalam CC.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#vehicle-form-ops-card',
      popover: {
        title: isEn ? '3. Operations & Performance Profiles' : '3. Profil Operasional & Konsumsi BBM',
        description: isEn
          ? 'Assign a designated driver, configure fuel type, tank volume (L), standard consumption ratio (km/L), and maximum speed threshold.'
          : 'Tugaskan pengemudi utama, atur jenis bahan bakar, kapasitas tangki (L), rasio konsumsi standar (km/L), serta batas kecepatan maksimum unit.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#vehicle-form-legal-card',
      popover: {
        title: isEn ? '4. Legal Documents & Compliance' : '4. Dokumen Legalitas & Perizinan',
        description: isEn
          ? 'Store official document numbers: STNK expiry date, STNK number, periodic KIR certificate, BPKB number, engine number, and chassis number.'
          : 'Catat kelengkapan dokumen resmi: masa berlaku STNK, nomor STNK, masa uji KIR, nomor BPKB, nomor mesin, dan nomor rangka unit.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#vehicle-form-maintenance-card',
      popover: {
        title: isEn ? '5. Baseline Maintenance & Notes' : '5. Saldo Awal Odometer & Catatan',
        description: isEn
          ? 'Enter baseline odometer reading and last service interval as initial anchors before automatic telematics synchronization takes over.'
          : 'Masukkan angka awal odometer dan interval servis terakhir sebagai saldo awal (baseline) sebelum sistem telemetri memperbarui secara otomatis.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#vehicle-form-device-card',
      popover: {
        title: isEn ? '6. Bound Telemetry Hardware' : '6. Perangkat Telemetri Terhubung',
        description: isEn
          ? 'Displays the GPS telemetry device linked to this vehicle (IMEI, SIM number, model, and install date). Device association is managed via Device Management.'
          : 'Menampilkan perangkat GPS telemetri yang terhubung dengan kendaraan ini (IMEI, nomor SIM, tipe, dan tgl pasang). Pengaitan perangkat dikelola pada menu Manajemen Perangkat.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#vehicle-form-save-btn',
      popover: {
        title: isEn ? '7. Save Vehicle Data' : '7. Simpan Data Kendaraan',
        description: isEn
          ? 'Click to validate input fields and save new vehicle records or modifications to the system.'
          : 'Klik tombol simpan untuk memvalidasi isian formulir dan menyimpan data atau pembaruan kendaraan ke dalam sistem.',
        side: 'top',
        align: 'end',
      },
      onHighlightStarted: ensureFormOpen,
    },
  ];
}
