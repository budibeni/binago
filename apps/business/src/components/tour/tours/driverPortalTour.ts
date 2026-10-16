import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// Helper to switch tab in DriverPortal
function switchTab(tab: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adatrack:driver-portal-switch-tab', { detail: { tab } }));
  }
}

// Helper to toggle vehicle modal
function toggleVehicleInfo(show: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adatrack:driver-portal-toggle-vehicle-info', { detail: { show } }));
  }
}

// Helper to toggle SOS form
function toggleSosForm(show: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adatrack:driver-portal-toggle-sos', { detail: { show } }));
  }
}

// Helper to reset attendance tab state
function resetAttendanceState() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adatrack:driver-portal-reset-attendance'));
  }
}

// ─── 1. OVERVIEW TOUR ─────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Portal Pengemudi (Driver Portal Overview)
 */
export function getDriverPortalOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Welcome to Driver Portal 👋' : 'Selamat Datang di Portal Pengemudi 👋',
        description: isEn
          ? 'Driver Portal connects drivers directly to assigned vehicles, GPS attendance verification, trip timelines, and operational alerts.'
          : 'Portal Pengemudi menghubungkan pengemudi langsung ke kendaraan tugas, verifikasi presensi GPS, linimasa perjalanan, dan pengumuman operasional.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#driver-portal-nav-bar',
      popover: {
        title: isEn ? 'Bottom Navigation Dock' : 'Navigasi Tab Operasional',
        description: isEn
          ? 'Switch seamlessly between the Vehicle Finder map, GPS Attendance, Trip History, and Operational Messages anytime.'
          : 'Beralih dengan mudah antara peta Temukan Kendaraan, Presensi GPS, Riwayat Perjalanan, dan Pesan Operasional kapan saja.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#driver-portal-tab-vehicles',
      popover: {
        title: isEn ? 'Find Assigned Vehicle' : 'Temukan Kendaraan Tugas',
        description: isEn
          ? 'View your assigned vehicle location on an interactive map, walking distance, vehicle specifications, and trigger SOS emergency alerts.'
          : 'Pantau lokasi kendaraan tugas di peta interaktif, jarak jalan kaki, spesifikasi kendaraan, dan akses tombol laporan darurat SOS.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('vehicles');
      },
    },
    {
      element: '#driver-portal-tab-attendance',
      popover: {
        title: isEn ? 'Driver GPS Attendance' : 'Presensi GPS Pengemudi',
        description: isEn
          ? 'Check-in or check-out within 200m radius of your vehicle, log geofence attendance at company pools, or report arrival at delivery destinations.'
          : 'Presensi mulai/selesai tugas dalam radius 200m dari kendaraan, presensi geofence pool, atau lapor tiba di tujuan pengiriman.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('attendance');
        resetAttendanceState();
      },
    },
    {
      element: '#driver-portal-tab-history',
      popover: {
        title: isEn ? 'Trip History & Timeline' : 'Riwayat & Linimasa Perjalanan',
        description: isEn
          ? 'Review past 7-day driving records, daily distance in KM, engine start/stop events, and parking locations.'
          : 'Tinjau catatan operasional 7 hari terakhir, akumulasi jarak harian (KM), status mesin menyala/mati, dan titik lokasi parkir.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('history');
      },
    },
    {
      element: '#driver-portal-tab-messages',
      popover: {
        title: isEn ? 'Operational Messages' : 'Pesan & Pengumuman Operasional',
        description: isEn
          ? 'Receive direct notifications regarding scheduled maintenance, speed limit warnings, and important company announcements.'
          : 'Terima notifikasi langsung mengenai jadwal servis berkala kendaraan, peringatan batas kecepatan, dan pengumuman operasional penting.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('messages');
      },
    },
  ];
}

// ─── 2. VEHICLE FINDER & MAP TOUR ─────────────────────────────────────────────

/**
 * Tur Tab Temukan Kendaraan & Peta (Vehicle Finder Tour)
 */
export function getDriverPortalVehicleTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#driver-portal-map-area',
      popover: {
        title: isEn ? 'Vehicle Location Map' : 'Peta Lokasi Kendaraan',
        description: isEn
          ? 'Displays the real-time GPS position of your assigned vehicle with heading orientation, your current walking position, and an interactive compass.'
          : 'Menampilkan posisi GPS real-time dari kendaraan tugas Anda lengkap dengan arah haluan, posisi Anda saat ini, dan kompas interaktif.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('vehicles');
        toggleVehicleInfo(false);
        toggleSosForm(false);
      },
    },
    {
      element: '#driver-portal-bottom-card',
      popover: {
        title: isEn ? 'Vehicle Proximity Card' : 'Kartu Posisi & Jarak Kendaraan',
        description: isEn
          ? 'Provides the current street address of the vehicle and dynamically calculates your walking distance to it.'
          : 'Menampilkan alamat lokasi terkini kendaraan serta menghitung jarak jalan kaki Anda ke kendaraan secara dinamis.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        toggleVehicleInfo(false);
        toggleSosForm(false);
      },
    },
    {
      element: '#driver-portal-vehicle-info-btn',
      popover: {
        title: isEn ? 'Vehicle Specs & Telemetry' : 'Detail & Spesifikasi Kendaraan',
        description: isEn
          ? 'Click this button to open the detailed specifications of the assigned vehicle, including model, plate number, year, and live engine status.'
          : 'Klik tombol ini untuk membuka spesifikasi lengkap kendaraan tugas, meliputi tipe unit, plat nomor, tahun, dan status mesin terkini.',
        side: 'top',
        align: 'start',
      },
      onHighlightStarted: () => {
        toggleVehicleInfo(false);
        toggleSosForm(false);
      },
    },
    {
      element: '#driver-portal-vehicle-modal',
      popover: {
        title: isEn ? 'Vehicle Specification Card' : 'Kartu Spesifikasi Kendaraan',
        description: isEn
          ? 'Displays vehicle details: operating group, color, asset number, engine displacement, year, and active engine telemetry indicator.'
          : 'Menampilkan detail lengkap kendaraan: grup operasional, warna, nomor aset, kapasitas mesin, tahun, serta indikator mesin aktif.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        toggleVehicleInfo(true);
        toggleSosForm(false);
      },
    },
    {
      element: '#driver-portal-sos-btn',
      popover: {
        title: isEn ? 'Emergency SOS Report' : 'Lapor Situasi Darurat (SOS)',
        description: isEn
          ? 'In case of breakdowns, accidents, or security incidents on the road, use this button to submit an instant high-priority emergency alert.'
          : 'Jika terjadi kendala mogok, kecelakaan, atau kendala keamanan di perjalanan, gunakan tombol ini untuk mengirim laporan darurat prioritas tinggi.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        toggleVehicleInfo(true);
        toggleSosForm(false);
      },
    },
    {
      element: '#driver-portal-sos-form',
      popover: {
        title: isEn ? 'Emergency Report Form' : 'Formulir Laporan Darurat',
        description: isEn
          ? 'Select the incident category (Damage, Loss, Accident, or Other), provide operational notes, and broadcast instantly to the fleet monitoring center.'
          : 'Pilih kategori insiden (Kerusakan, Kehilangan, Kecelakaan, atau Lainnya), isi catatan kondisi lapangan, dan kirim langsung ke pusat pemantauan.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        toggleVehicleInfo(false);
        toggleSosForm(true);
      },
    },
    {
      element: '#driver-portal-navigation-btn',
      popover: {
        title: isEn ? 'Turn-by-Turn Navigation' : 'Navigasi ke Kendaraan',
        description: isEn
          ? 'Directly opens Google Maps with driving/walking route directions leading straight to your vehicle coordinates.'
          : 'Membuka rute navigasi Google Maps langsung dari posisi Anda menuju titik koordinat kendaraan secara akurat.',
        side: 'top',
        align: 'end',
      },
      onHighlightStarted: () => {
        toggleSosForm(false);
        toggleVehicleInfo(false);
      },
    },
  ];
}

// ─── 3. ATTENDANCE TOUR ───────────────────────────────────────────────────────

/**
 * Tur Tab Presensi Pengemudi (Attendance Tour)
 */
export function getDriverPortalAttendanceTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#driver-portal-attendance-types',
      popover: {
        title: isEn ? 'Driver Attendance Center' : 'Pusat Presensi Pengemudi',
        description: isEn
          ? 'ADATRACK provides 3 automated attendance verification workflows equipped with GPS validation and facial selfie capture.'
          : 'ADATRACK menyediakan 3 alur presensi terverifikasi yang dilengkapi validasi radius GPS dan foto selfie dengan watermark otomatis.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('attendance');
        resetAttendanceState();
      },
    },
    {
      element: '#driver-portal-att-type-vehicle',
      popover: {
        title: isEn ? 'Start / End Duty near Vehicle' : 'Mulai / Selesai Tugas di Kendaraan',
        description: isEn
          ? 'Primary duty check-in mode. Validates that the driver is physically located within a strict 200m radius of the assigned vehicle before activating camera selfie.'
          : 'Mode utama absensi tugas. Sistem memverifikasi pengemudi berada dalam radius maksimal 200m dari kendaraan tugas sebelum membuka kamera selfie.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('attendance');
        resetAttendanceState();
      },
    },
    {
      element: '#driver-portal-att-type-geofence',
      popover: {
        title: isEn ? 'Geofence Location Check-in' : 'Presensi Lokasi Geofence',
        description: isEn
          ? 'Log presence when entering designated operational geofences, such as central pool depots, logistics hubs, or client loading zones.'
          : 'Presensi saat berada di area geofence resmi perusahaan, seperti pool pusat, gudang logistik, atau titik bongkar muat klien.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('attendance');
        resetAttendanceState();
      },
    },
    {
      element: '#driver-portal-att-type-free',
      popover: {
        title: isEn ? 'Arrival Report at Destination' : 'Laporan Tiba di Tujuan',
        description: isEn
          ? 'Submit instant delivery arrival proof with full GPS location coordinates, timestamp watermark, and facial capture without geofence restrictions.'
          : 'Kirim bukti kedatangan pengiriman langsung di lokasi penerima/tujuan dengan koordinat GPS akurat dan watermark resmi tanpa batasan geofence.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('attendance');
        resetAttendanceState();
      },
    },
  ];
}

// ─── 4. TRIP HISTORY TOUR ─────────────────────────────────────────────────────

/**
 * Tur Tab Riwayat Perjalanan (Trip History Tour)
 */
export function getDriverPortalHistoryTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#driver-portal-history-list',
      popover: {
        title: isEn ? 'Trip History & Activity Log' : 'Riwayat Perjalanan & Aktivitas',
        description: isEn
          ? 'Review all trips organized chronologically by date. Each day displays daily distance accumulation and individual vehicle events.'
          : 'Tinjau riwayat perjalanan harian yang tersusun secara kronologis. Setiap hari menampilkan total jarak tempuh dan rincian aktivitas kendaraan.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('history');
      },
    },
    {
      element: '#driver-portal-history-distance-badge',
      popover: {
        title: isEn ? 'Daily Distance Summary' : 'Total Jarak Tempuh Harian',
        description: isEn
          ? 'Shows the total kilometers logged by the vehicle for that day, calculated automatically from GPS telemetry data.'
          : 'Menunjukkan akumulasi jarak tempuh kendaraan pada hari tersebut, dihitung otomatis dari data telemetri GPS terverifikasi.',
        side: 'left',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('history');
      },
    },
    {
      element: '#driver-portal-history-timeline',
      popover: {
        title: isEn ? 'Event Timeline & Map Links' : 'Linimasa Peristiwa & Titik Lokasi',
        description: isEn
          ? 'Timeline tracking engine ignition ON/OFF, parking sessions, and geofence entries. Tap any event to open its exact coordinates in Google Maps.'
          : 'Linimasa status mesin ON/OFF, durasi parkir, dan deteksi geofence. Ketuk baris peristiwa untuk langsung membuka titik lokasinya di Google Maps.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('history');
      },
    },
  ];
}

// ─── 5. OPERATIONAL MESSAGES TOUR ─────────────────────────────────────────────

/**
 * Tur Tab Pesan & Pengumuman Operasional (Operational Messages Tour)
 */
export function getDriverPortalMessagesTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#driver-portal-messages-inbox',
      popover: {
        title: isEn ? 'Operational Messages Inbox' : 'Kotak Masuk Pesan Operasional',
        description: isEn
          ? 'Direct communication channel between fleet managers and drivers for maintenance alerts, security notices, and company bulletins.'
          : 'Saluran komunikasi langsung antara manajer operasional dan pengemudi untuk peringatan servis berkala, batas kecepatan, dan pengumuman resmi.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('messages');
      },
    },
    {
      element: '#driver-portal-message-card-first',
      popover: {
        title: isEn ? 'Alert & Service Notice Cards' : 'Kartu Pemberitahuan & Peringatan Servis',
        description: isEn
          ? 'Displays message severity with color badges (Maintenance Alert, Speed Warning, Official Announcements) with unread status indicators.'
          : 'Menampilkan kategori pesan dengan indikator warna (Peringatan Servis, Batas Kecepatan, Pengumuman Resmi) dan status pesan belum dibaca.',
        side: 'bottom',
        align: 'center',
      },
      onHighlightStarted: () => {
        switchTab('messages');
      },
    },
  ];
}
