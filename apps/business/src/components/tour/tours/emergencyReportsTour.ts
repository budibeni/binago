import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// Helper to select the first report for detail viewing
function selectFirstReport() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adatrack:emergency-tour-select-first'));
  }
}

// Helper to clear report selection
function clearReportSelection() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adatrack:emergency-tour-clear-selection'));
  }
}

// Helper to switch status tab
function switchStatusTab(tab: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adatrack:emergency-tour-switch-tab', { detail: { tab } }));
  }
}

// ─── 1. OVERVIEW TOUR ─────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Pemantauan Laporan Darurat (Emergency Reports Overview Tour)
 */
export function getEmergencyReportsOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Emergency Reports Center 🚨' : 'Pusat Laporan Darurat 🚨',
        description: isEn
          ? 'Monitor and manage high-priority emergency alerts submitted in real-time by drivers directly from their vehicles.'
          : 'Pantau dan tangani laporan darurat prioritas tinggi yang dikirimkan secara langsung oleh pengemudi dari kendaraan mereka di lapangan.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#emergency-reports-left-panel',
      popover: {
        title: isEn ? 'Incoming Reports Queue' : 'Antrean Daftar Laporan',
        description: isEn
          ? 'Browse all incoming emergency reports organized by status tabs, incident categories, and quick search filters.'
          : 'Jelajahi seluruh laporan darurat yang masuk, tersusun rapi berdasarkan tab status, kategori insiden, dan filter pencarian cepat.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: () => {
        clearReportSelection();
      },
    },
    {
      element: '#emergency-status-tabs',
      popover: {
        title: isEn ? 'Status Workflow Tabs' : 'Tab Filter Status Penanganan',
        description: isEn
          ? 'Filter incidents by lifecycle: New (with active badge counter), In Progress (Ditangani), and Resolved (Selesai).'
          : 'Saring insiden berdasarkan tahapan: Baru (dengan indikator angka merah aktif), Sedang Ditangani, dan Selesai.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#emergency-search-filter-bar',
      popover: {
        title: isEn ? 'Search & Category Filters' : 'Pencarian & Filter Kategori',
        description: isEn
          ? 'Quickly search by driver name, vehicle plate, or location, and filter by incident category (Breakdown, Accident, Loss, Other).'
          : 'Cari cepat berdasarkan nama pengemudi, plat kendaraan, atau lokasi, serta filter berdasarkan kategori insiden (Kerusakan, Kecelakaan, Kehilangan, Lainnya).',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#emergency-reports-list',
      popover: {
        title: isEn ? 'Incident Cards' : 'Daftar Kartu Laporan',
        description: isEn
          ? 'Each card displays the driver, vehicle plate, incident type, elapsed time, and status badge. Click any card to inspect full details.'
          : 'Setiap kartu menampilkan nama pengemudi, plat kendaraan, jenis insiden, waktu kejadian, dan status. Klik kartu untuk melihat detail penanganan lengkap.',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: () => {
        clearReportSelection();
      },
    },
    {
      element: '#emergency-detail-container',
      popover: {
        title: isEn ? 'Detailed Resolution Panel' : 'Panel Detail & Penanganan',
        description: isEn
          ? 'Displays GPS coordinates, direct Google Maps and Street View links, driver phone contacts, incident descriptions, and past actions.'
          : 'Menampilkan koordinat GPS akurat, link navigasi Google Maps dan Street View, kontak telepon pengemudi, deskripsi kondisi lapangan, serta rekam jejak tindakan.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
    {
      element: '#emergency-detail-action-card',
      popover: {
        title: isEn ? 'Status Updates & Action Notes' : 'Tindakan & Catatan Progres',
        description: isEn
          ? 'Update the incident status and append ongoing chronological progress notes for field technicians and fleet supervisors.'
          : 'Ubah status penanganan insiden dan tambahkan catatan progres berkala yang tercatat secara kronologis untuk teknisi lapangan dan supervisor.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
  ];
}

// ─── 2. LIST & FILTER TOUR ────────────────────────────────────────────────────

/**
 * Tur Antrean & Filter Laporan (List & Filter Tour)
 */
export function getEmergencyReportsListTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#emergency-status-tabs',
      popover: {
        title: isEn ? 'Incident Lifecycle Tabs' : 'Tab Status Penanganan',
        description: isEn
          ? 'Instantly isolate reports requiring urgent attention under the "Baru" tab, monitor active dispatches under "Ditangani", or review resolved cases.'
          : 'Langsung pisahkan laporan yang membutuhkan respon cepat pada tab "Baru", pantau koordinasi tim pada tab "Ditangani", atau tinjau laporan yang telah "Selesai".',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: () => {
        clearReportSelection();
        switchStatusTab('semua');
      },
    },
    {
      element: '#emergency-search-box',
      popover: {
        title: isEn ? 'Instant Search Query' : 'Kolom Pencarian Instan',
        description: isEn
          ? 'Type any keyword to filter reports by driver name, vehicle license plate, report number, or incident street address.'
          : 'Ketik kata kunci untuk menyaring laporan berdasarkan nama pengemudi, nomor plat kendaraan, nomor laporan, atau alamat jalan kejadian.',
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: () => {
        clearReportSelection();
      },
    },
    {
      element: '#emergency-category-filter-btn',
      popover: {
        title: isEn ? 'Incident Category Dropdown' : 'Filter Kategori Insiden',
        description: isEn
          ? 'Narrow down alerts specifically to Vehicle Damage (Kerusakan), Accidents (Kecelakaan), Cargo/Asset Loss (Kehilangan), or General emergencies.'
          : 'Spesifikasikan laporan khusus Kerusakan Kendaraan, Kecelakaan Lalu Lintas, Kehilangan Muatan/Aset, atau situasi darurat Lainnya.',
        side: 'bottom',
        align: 'end',
      },
      onHighlightStarted: () => {
        clearReportSelection();
      },
    },
    {
      element: '#emergency-report-item-first',
      popover: {
        title: isEn ? 'Emergency Report Card' : 'Kartu Laporan Darurat',
        description: isEn
          ? 'Provides immediate operational indicators: pulsing indicator for new alerts, assigned vehicle plate, driver name, and elapsed minutes since trigger.'
          : 'Memberikan indikator operasional seketika: lampu berkedip untuk laporan baru, plat kendaraan tugas, nama pengemudi, serta durasi menit sejak laporan dikirim.',
        side: 'right',
        align: 'center',
      },
      onHighlightStarted: () => {
        clearReportSelection();
      },
    },
    {
      element: '#emergency-reports-pagination',
      popover: {
        title: isEn ? 'Queue Pagination' : 'Navigasi Halaman Laporan',
        description: isEn
          ? 'Navigate through historical emergency records with 15 incident reports per page.'
          : 'Navigasi riwayat laporan darurat dengan kapasitas tampilan 15 laporan per halaman.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        clearReportSelection();
      },
    },
  ];
}

// ─── 3. DETAIL & RESOLUTION ACTION TOUR ───────────────────────────────────────

/**
 * Tur Detail & Tindakan Penanganan (Detail & Resolution Tour)
 */
export function getEmergencyReportsDetailTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#emergency-detail-info-card',
      popover: {
        title: isEn ? 'Report & Driver Overview' : 'Informasi Utama Laporan',
        description: isEn
          ? 'View report number, exact submission timestamp, assigned vehicle plate, and driver identity with a direct phone calling link.'
          : 'Melihat nomor laporan resmi, waktu pengiriman presisi, plat kendaraan tugas, serta kontak telepon pengemudi yang dapat ditelepon langsung.',
        side: 'left',
        align: 'start',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
    {
      element: '#emergency-detail-maps-actions',
      popover: {
        title: isEn ? 'GPS Location & Street View' : 'Titik Lokasi GPS & Street View',
        description: isEn
          ? 'Accurate GPS coordinates of the vehicle when SOS was triggered. Open one-click links in Google Maps or Street View to assess road conditions.'
          : 'Koordinat GPS akurat dari kendaraan saat tombol SOS ditekan. Buka langsung di Google Maps atau Street View untuk memantau kondisi jalan sekitar.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
    {
      element: '#emergency-detail-desc-card',
      popover: {
        title: isEn ? 'Driver Field Notes' : 'Deskripsi Kondisi Lapangan',
        description: isEn
          ? 'Original description submitted by the driver explaining the problem, vehicle breakdown, or road conditions.'
          : 'Keterangan asli yang diketik oleh pengemudi saat kejadian, menjelaskan kondisi kendala kendaraan atau situasi darurat di perjalanan.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
    {
      element: '#emergency-detail-timeline-card',
      popover: {
        title: isEn ? 'Handling Milestones & Activity Log' : 'Riwayat & Linimasa Penanganan',
        description: isEn
          ? 'Tracks resolution milestones (Started, Resolved) and the chronological log of notes updated by fleet dispatchers and supervisors.'
          : 'Merekam pencapaian penanganan (Mulai Ditangani, Selesai) serta rekam jejak catatan progres yang diperbarui oleh petugas dan supervisor.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
    {
      element: '#emergency-detail-action-card',
      popover: {
        title: isEn ? 'Action Form & Status Update' : 'Formulir Tindakan & Perubahan Status',
        description: isEn
          ? 'Select status (Baru, Ditangani, Selesai) and append progressive operational notes (e.g. mechanic dispatched, insurance coordination).'
          : 'Pilih status tindak lanjut (Baru, Ditangani, Selesai) dan tambahkan catatan operasional baru (contoh: mekanik meluncur, koordinasi asuransi).',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
    {
      element: '#emergency-save-action-btn',
      popover: {
        title: isEn ? 'Save & Log Progress' : 'Simpan Perubahan Penanganan',
        description: isEn
          ? 'Persist the updated status and append your notes to the audit timeline. Changes reflect across the monitoring system.'
          : 'Simpan pembaruan status dan tambahkan catatan Anda ke linimasa riwayat. Perubahan langsung tersinkronisasi ke seluruh sistem pemantauan.',
        side: 'top',
        align: 'end',
      },
      onHighlightStarted: () => {
        selectFirstReport();
      },
    },
  ];
}
