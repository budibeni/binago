import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// ─── 1. OVERVIEW TOUR ────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Manajemen Pengemudi (Drivers Overview)
 */
export function getDriversOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Welcome to Driver Management 👋' : 'Selamat Datang di Manajemen Pengemudi 👋',
        description: isEn
          ? 'Centralized directory for managing drivers, license validities, contact records, vehicle assignments, and driving safety performance scores.'
          : 'Pusat pengelolaan data pengemudi, masa berlaku SIM, kontak resmi, penugasan kendaraan operasional, dan skor performa keselamatan berkendara.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-driver-detail'));
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-driver-form'));
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-filter'));
      },
    },
    {
      element: '#drivers-table-container',
      popover: {
        title: isEn ? 'Driver Master Data Table' : 'Tabel Master Data Pengemudi',
        description: isEn
          ? 'Interactive data table displaying driver names, employment status, assigned vehicle plate, performance star ratings, phone numbers, and license info.'
          : 'Tabel data interaktif yang menampilkan nama pengemudi, status kerja, pelat kendaraan yang ditugaskan, bintang performa, nomor kontak, dan lisensi SIM.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#data-table-search-input',
      popover: {
        title: isEn ? 'Quick Driver Search' : 'Pencarian Cepat Pengemudi',
        description: isEn
          ? 'Search for drivers instantly by full name, National ID (KTP), phone number, or driver license (SIM) number.'
          : 'Cari pengemudi dengan cepat berdasarkan nama lengkap, nomor KTP, nomor telepon, maupun nomor SIM.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#data-table-filter-btn',
      popover: {
        title: isEn ? 'Filter & Grouping Controls' : 'Tombol Filter & Pengelompokan',
        description: isEn
          ? 'Filter drivers by operational status (Active, On Leave, Inactive), performance rating stars (1-5 stars), and vehicle operational groups.'
          : 'Saring pengemudi berdasarkan status kerja (Aktif, Cuti, Nonaktif), rating bintang performa (1-5 bintang), serta grup kendaraan operasional.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#drivers-first-item-btn',
      popover: {
        title: isEn ? 'Driver Name & Quick Detail' : 'Nama Pengemudi & Buka Detail',
        description: isEn
          ? 'Click on any driver name to open their full profile drawer, safety telemetry metrics, direct WhatsApp contact, and assignment history.'
          : 'Klik pada nama pengemudi untuk membuka profil lengkap, metrik keselamatan telemetri, kontak cepat WhatsApp, dan riwayat penugasan.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#drivers-btn-add',
      popover: {
        title: isEn ? 'Register New Driver' : 'Tambah Pengemudi Baru',
        description: isEn
          ? 'Onboard a new driver into the system, including National ID (KTP), driver license (SIM), residential address, contact details, and vehicle group placement.'
          : 'Daftarkan pengemudi baru ke dalam sistem lengkap dengan data KTP, nomor SIM, alamat domisili, kontak resmi, dan penempatan grup kendaraan.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#data-table-pagination',
      popover: {
        title: isEn ? 'Pagination & Records Summary' : 'Paginasi & Ringkasan Data',
        description: isEn
          ? 'View total registered drivers, navigate through pages, and adjust records per page (10, 25, 50, 100 rows).'
          : 'Lihat ringkasan total pengemudi yang terdaftar, navigasi antar halaman, dan atur jumlah baris per halaman (10, 25, 50, 100 baris).',
        side: 'top',
        align: 'center',
      },
    },
  ];
}

// ─── 2. FILTER & TOOLS TOUR ─────────────────────────────────────────────────

/**
 * Tur Filter dan Alat Bantu Tabel Pengemudi
 */
export function getDriversFilterTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#data-table-search-input',
      popover: {
        title: isEn ? '1. Global Driver Search' : '1. Filter Pencarian Cepat',
        description: isEn
          ? 'Filter drivers instantaneously by typing partial names, KTP numbers, or license numbers.'
          : 'Saring pengemudi secara instan dengan mengetikkan nama, nomor KTP, nomor telepon, atau nomor SIM.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-driver-detail'));
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-driver-form'));
      },
    },
    {
      element: '#data-table-filter-btn',
      popover: {
        title: isEn ? '2. Filter Panel Toggle' : '2. Buka Panel Filter',
        description: isEn
          ? 'Toggle the multidimensional filter panel to isolate drivers based on specific criteria.'
          : 'Buka atau tutup panel filter lanjutan untuk menyaring data pengemudi berdasarkan kriteria spesifik.',
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
          ? 'Filter drivers by employment status (Active, On Leave, Inactive), driver performance score (1-5 stars), and operational vehicle groups.'
          : 'Saring pengemudi berdasarkan status operasional (Aktif, Cuti, Nonaktif), bintang performa berkendara (1-5 bintang), dan grup kendaraan operasional.',
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
          ? 'Customize table columns according to your monitoring requirements. Show or hide KTP, birth dates, email, join date, or address columns.'
          : 'Sesuaikan kolom tabel sesuai kebutuhan monitor Anda. Tampilkan atau sembunyikan kolom nomor KTP, tanggal lahir, email, tanggal bergabung, hingga alamat domisili.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#data-table-export-btn',
      popover: {
        title: isEn ? '5. Export Driver Data' : '5. Ekspor Data Pengemudi',
        description: isEn
          ? 'Download the currently filtered driver dataset into Excel/CSV format for HR archives, audits, or operational reporting.'
          : 'Unduh seluruh data pengemudi yang sedang disaring ke format Excel/CSV untuk arsip HR, audit keselamatan, maupun pelaporan operasional.',
        side: 'bottom',
        align: 'end',
      },
    },
  ];
}

// ─── 3. DRIVER DETAIL TOUR ──────────────────────────────────────────────────

/**
 * Tur Laci Detail Pengemudi
 */
export function getDriversDetailTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureDetailOpen = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-driver-form'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-filter'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-open-driver-detail'));
  };

  return [
    {
      element: '#driver-view-header',
      popover: {
        title: isEn ? 'Driver Profile & Status' : 'Header Profil & Status Kerja',
        description: isEn
          ? 'Displays the driver full name, operational status badge (Active / Inactive / On Leave), and placement branch location.'
          : 'Menampilkan nama lengkap pengemudi, lencana status kerja (Aktif / Nonaktif / Cuti), dan lokasi penempatan kantor/pool.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#driver-view-card-operations',
      popover: {
        title: isEn ? 'Operational & Driving Safety' : 'Operasional & Keselamatan Berkendara',
        description: isEn
          ? 'Tracks assigned vehicle plate, overall safety score (0-100 points, 1-5 stars), harsh driving incidents, speeding events, excessive idling, and fatigue warnings.'
          : 'Pantau pelat kendaraan yang ditugaskan, skor performa keselamatan (0-100 poin, rating 1-5 bintang), insiden pengereman mendadak (harsh driving), speeding, idling berlebih, dan indikasi kelelahan.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#driver-view-card-contact',
      popover: {
        title: isEn ? 'Official Contact Information' : 'Informasi Kontak Resmi',
        description: isEn
          ? 'Official phone number with direct messaging link, active email address, and complete residential address.'
          : 'Nomor telepon resmi dengan link perpesanan langsung, alamat email aktif, dan alamat domisili tempat tinggal lengkap pengemudi.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#driver-view-card-identity',
      popover: {
        title: isEn ? 'Official Identity & Work Info' : 'Identitas Resmi & Pekerjaan',
        description: isEn
          ? 'National ID number (KTP), place and date of birth, assigned vehicle operational group, placement branch, and join date.'
          : 'Nomor Induk Kependudukan (KTP), tempat dan tanggal lahir, grup kendaraan operasional, cabang penempatan kerja, serta tanggal bergabung.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
    {
      element: '#driver-view-card-license',
      popover: {
        title: isEn ? 'Driver License (SIM)' : 'Lisensi Mengemudi (SIM)',
        description: isEn
          ? 'Official driver license number and expiration date to ensure continuous regulatory compliance and roadworthiness.'
          : 'Nomor Surat Izin Mengemudi (SIM) resmi dan tanggal masa berlaku untuk memastikan kepatuhan regulasi berkendara di jalan raya.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureDetailOpen,
    },
  ];
}

// ─── 4. DRIVER FORM TOUR ────────────────────────────────────────────────────

/**
 * Tur Formulir Pendaftaran / Pengeditan Pengemudi
 */
export function getDriversFormTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  const ensureFormOpen = () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-driver-detail'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-close-filter'));
    window.dispatchEvent(new CustomEvent('adatrack:tour-open-driver-form'));
  };

  return [
    {
      element: '#driver-form-identity-card',
      popover: {
        title: isEn ? '1. Personal Identity Information' : '1. Data Diri Sesuai KTP',
        description: isEn
          ? 'Fill in the driver full legal name, 16-digit National ID (KTP) number, place of birth, and date of birth.'
          : 'Isi nama lengkap resmi pengemudi, 16 digit Nomor Induk Kependudukan (KTP), tempat lahir, dan tanggal lahir.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#driver-form-address-card',
      popover: {
        title: isEn ? '2. Residential Address' : '2. Alamat Domisili Tempat Tinggal',
        description: isEn
          ? 'Enter complete current residential address for administrative records and emergency correspondence.'
          : 'Masukkan alamat lengkap domisili tempat tinggal pengemudi saat ini untuk arsip administrasi dan kontak darurat.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#driver-form-contact-card',
      popover: {
        title: isEn ? '3. Contact & Communication' : '3. Kontak Resmi & Komunikasi',
        description: isEn
          ? 'Provide the official active mobile phone number (WhatsApp enabled) and optional email address for operational dispatches.'
          : 'Isikan nomor telepon seluler aktif (terhubung WhatsApp) dan email opsional untuk koordinasi penugasan pengiriman.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#driver-form-work-card',
      popover: {
        title: isEn ? '4. License & Vehicle Group' : '4. Lisensi SIM & Grup Kendaraan',
        description: isEn
          ? 'Select the vehicle operational group, placement branch, official driver license (SIM) number, license expiry date, and join date.'
          : 'Pilih grup kendaraan operasional yang ditugaskan, cabang penempatan kerja, nomor SIM resmi, masa berlaku SIM, dan tanggal bergabung.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: ensureFormOpen,
    },
    {
      element: '#driver-form-save-btn',
      popover: {
        title: isEn ? '5. Save Driver Record' : '5. Simpan Data Pengemudi',
        description: isEn
          ? 'Click to validate all input fields and save the driver record to the system.'
          : 'Klik tombol simpan untuk memvalidasi isian formulir dan menyimpan data pengemudi ke dalam sistem.',
        side: 'top',
        align: 'end',
      },
      onHighlightStarted: ensureFormOpen,
    },
  ];
}
