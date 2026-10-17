import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// ─── 1. OVERVIEW TOUR ────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Manajemen Grup (Group Overview)
 */
export function getGroupOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Welcome to Groups Management 📁' : 'Selamat Datang di Manajemen Grup 📁',
        description: isEn
          ? 'Organize vehicles, drivers, geofences, and routes into functional business units and operational divisions.'
          : 'Kelola pengelompokan kendaraan, pengemudi, geofence, dan rute ke dalam divisi dan unit operasional bisnis Anda.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-group-create'));
      },
    },
    {
      element: '#group-table-container',
      popover: {
        title: isEn ? 'Group Data Table' : 'Tabel Data Grup',
        description: isEn
          ? 'Interactive list displaying group names, descriptions, member counts, and quick management actions.'
          : 'Daftar interaktif yang menampilkan nama grup, deskripsi, jumlah anggota unit, serta aksi pengelolaan data.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#group-type-selector',
      popover: {
        title: isEn ? 'Group Domain Switcher' : 'Pemilih Kategori Grup',
        description: isEn
          ? 'Switch between Vehicle, Driver, Geofence, and Route groups in a single click.'
          : 'Pindah antar grup Kendaraan, Pengemudi, Geofence, dan Rute dengan mudah melalui selektor ini.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#data-table-search-input',
      popover: {
        title: isEn ? 'Search Groups' : 'Pencarian Grup',
        description: isEn
          ? 'Quickly locate groups by name or descriptive keywords.'
          : 'Cari grup operasional dengan cepat berdasarkan nama atau kata kunci deskripsi.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#group-btn-add',
      popover: {
        title: isEn ? 'Add New Group' : 'Tambah Grup Baru',
        description: isEn
          ? 'Click to open the creation drawer and register a new group for the active domain.'
          : 'Klik untuk membuka laci formulir dan mendaftarkan grup baru pada kategori yang sedang aktif.',
        side: 'bottom',
        align: 'end',
      },
    },
  ];
}

// ─── 2. FILTER & TOOLBAR TOUR ────────────────────────────────────────────────

/**
 * Tur Alat Bantu & Ekspor Grup (Group Filter & Tools)
 */
export function getGroupFilterTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#group-type-selector',
      popover: {
        title: isEn ? 'Group Type Filter' : 'Filter Kategori Grup',
        description: isEn
          ? 'Select the operational category (Vehicles, Drivers, Geofences, or Routes) to filter the table view.'
          : 'Pilih kategori operasional (Kendaraan, Pengemudi, Geofence, atau Rute) untuk memfilter tampilan data.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#data-table-search-input',
      popover: {
        title: isEn ? 'Text Filtering' : 'Filter Pencarian Teks',
        description: isEn
          ? 'Instantly filters the list as you type matching group names or descriptions.'
          : 'Memfilter daftar secara instan saat Anda mengetikkan nama grup atau keterangan.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#data-table-export-btn',
      popover: {
        title: isEn ? 'Export Group Data' : 'Ekspor Data Grup',
        description: isEn
          ? 'Download currently filtered group information to spreadsheet formats (CSV/Excel).'
          : 'Unduh data grup yang sedang ditampilkan ke dalam format spreadsheet (CSV/Excel).',
        side: 'bottom',
        align: 'end',
      },
    },
  ];
}

// ─── 3. DETAIL DRAWER TOUR ───────────────────────────────────────────────────

/**
 * Tur Laci Detail Grup (Group Detail)
 */
export function getGroupDetailTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#group-first-item-btn',
      popover: {
        title: isEn ? 'Inspect Group Detail' : 'Buka Detail Grup',
        description: isEn
          ? 'Click this preview button (or click the group name) to slide open the comprehensive detail drawer.'
          : 'Klik tombol pratinjau ini (atau klik nama grup) untuk membuka laci rincian informasi grup.',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-open-group-detail'));
      },
    },
    {
      element: '#group-view-header',
      popover: {
        title: isEn ? 'Group Detail Drawer' : 'Laci Rincian Grup',
        description: isEn
          ? 'Displays group identity, assigned category type, description, and total member count.'
          : 'Menampilkan identitas grup, tipe kategori, deskripsi lengkap, serta total anggota unit yang terdaftar.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#group-view-card-info',
      popover: {
        title: isEn ? 'Group Attributes' : 'Atribut & Informasi Grup',
        description: isEn
          ? 'Review key attributes such as group name, type, description, and current membership units.'
          : 'Tinjau atribut penting seperti nama grup, kategori, deskripsi fungsi, dan total unit yang tergabung.',
        side: 'left',
        align: 'center',
      },
    },
  ];
}

// ─── 4. FORM DRAWER TOUR ─────────────────────────────────────────────────────

/**
 * Tur Formulir Grup (Group Form)
 */
export function getGroupFormTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#group-btn-add',
      popover: {
        title: isEn ? 'Add / Edit Group Form' : 'Formulir Tambah / Edit Grup',
        description: isEn
          ? 'Opens the overlay drawer for creating or editing operational group entries.'
          : 'Membuka laci formulir overlay untuk membuat atau mengubah data grup operasional.',
        side: 'bottom',
        align: 'end',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-open-group-create'));
      },
    },
    {
      element: '#group-form-card',
      popover: {
        title: isEn ? 'Group Fields' : 'Kolom Input Grup',
        description: isEn
          ? 'Specify group name and optional operational description suited for your fleet or personnel needs.'
          : 'Isi nama grup dan deskripsi operasional yang sesuai dengan kebutuhan armada maupun divisi Anda.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#group-form-save-btn',
      popover: {
        title: isEn ? 'Save Group' : 'Simpan Data Grup',
        description: isEn
          ? 'Validate inputs and commit the group to the centralized repository with immediate updates across tables.'
          : 'Validasi data dan simpan grup ke repositori pusat dengan pembaruan instan pada tabel.',
        side: 'top',
        align: 'end',
      },
    },
  ];
}
