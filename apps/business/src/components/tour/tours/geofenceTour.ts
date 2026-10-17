import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// ─── 1. OVERVIEW TOUR ────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Pemantauan & Batas Wilayah Virtual (Geofence Overview)
 */
export function getGeofenceOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Welcome to Geofence Management 🌐' : 'Selamat Datang di Manajemen Geofence 🌐',
        description: isEn
          ? 'Spatial geographic boundary manager for creating virtual zones, depot perimeters, restricted areas, and automated fleet entry/exit triggers.'
          : 'Manajer batas spasial virtual untuk membuat perimeter depo armada, zona operasional resmi, area terlarang, serta pemicu alarm keluar-masuk kendaraan secara otomatis.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-geofence-editor'));
      },
    },
    {
      element: '#geofence-map-container',
      popover: {
        title: isEn ? 'Spatial Boundary Canvas' : 'Kanvas Peta Batas Wilayah',
        description: isEn
          ? 'Full-screen interactive map displaying all active geofence polygons and perimeters with live color differentiation by operational status.'
          : 'Kanvas peta interaktif penuh yang merender seluruh poligon dan perimeter zona geofence aktif dengan pewarnaan semantik status operasional.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#geofence-list-panel',
      popover: {
        title: isEn ? 'Geofence Sidebar Panel' : 'Panel Daftar Batas Wilayah',
        description: isEn
          ? 'Collapsible side panel organizing geofences by operational groups, showing shape dimensions, point counts, and individual visibility controls.'
          : 'Panel samping yang mengelompokkan batas wilayah berdasarkan grup operasional, dimensi bentuk, jumlah titik koordinat, dan visibilitas pada peta.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#geofence-search-input',
      popover: {
        title: isEn ? 'Search Geofences' : 'Pencarian Batas Wilayah',
        description: isEn
          ? 'Quickly locate warehouse zones, client branches, or ports by typing the geofence name.'
          : 'Cari gudang logistik, pool cabang, pelabuhan, atau zona klien dengan cepat menggunakan nama wilayah.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#geofence-filter-btn',
      popover: {
        title: isEn ? 'Status Filter' : 'Filter Status Geofence',
        description: isEn
          ? 'Filter geofences by operational status: All, Active, or Inactive.'
          : 'Saring batas wilayah berdasarkan status operasional: Semua, Aktif, atau Nonaktif.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#geofence-select-all',
      popover: {
        title: isEn ? 'Map Layer Visibility' : 'Kontrol Visibilitas Lapisan Peta',
        description: isEn
          ? 'Toggle all geofence overlays on the map simultaneously or select specific groups.'
          : 'Tampilkan atau sembunyikan seluruh poligon batas wilayah di peta secara serentak.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#geofence-first-item',
      popover: {
        title: isEn ? 'Geofence Quick Actions' : 'Aksi Cepat & Sorot Peta',
        description: isEn
          ? 'Click any geofence card to smoothly auto-zoom and pan the map directly to its coordinates, or use the menu for edit and delete actions.'
          : 'Klik kartu geofence untuk auto-zoom dan memusatkan peta ke lokasi zona, atau gunakan tombol aksi untuk menyunting dan menghapus batas wilayah.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#geofence-btn-add',
      popover: {
        title: isEn ? 'Create New Geofence' : 'Tambah Batas Wilayah Baru',
        description: isEn
          ? 'Open the interactive drawing editor to establish a new operational zone on the map.'
          : 'Buka mode editor gambar untuk membuat zona batas wilayah baru langsung di atas peta.',
        side: 'bottom',
        align: 'start',
      },
    },
  ];
}

// ─── 2. EDITOR TOUR ──────────────────────────────────────────────────────────

/**
 * Tur Mode Menggambar & Editor Wilayah (Geofence Drawing Editor)
 */
export function getGeofenceEditorTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#geofence-editor-panel',
      popover: {
        title: isEn ? 'Geofence Drawing & Parameters Panel ✏️' : 'Panel Parameter & Gambar Wilayah ✏️',
        description: isEn
          ? 'Configure the identity, operational group, boundary type, and description while drawing coordinates on the map.'
          : 'Atur nama zona, penempatan grup, tipe bentuk wilayah, dan deskripsi sembari menggambar titik koordinat di peta.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-open-geofence-create'));
      },
    },
    {
      element: '#geofence-form-type',
      popover: {
        title: isEn ? 'Geometry Shape Selection' : 'Pilihan Bentuk Geometri',
        description: isEn
          ? 'Select Polygon for multi-point irregular perimeters, Rectangle for box areas, or Multiline for path corridors.'
          : 'Pilih Polygon untuk area bebas multi-titik, Rectangle untuk area persegi teratur, atau Multiline untuk koridor jalur lintasan.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#geofence-editor-map',
      popover: {
        title: isEn ? 'Interactive Map Drawing Canvas' : 'Kanvas Menggambar Peta Interaktif',
        description: isEn
          ? 'Click anywhere on the map to place vertices one by one. Drag vertex handles to adjust boundaries accurately.'
          : 'Klik pada peta untuk menempatkan titik sudut wilayah satu per satu. Seret titik untuk menyesuaikan batas area dengan presisi tinggi.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#geofence-editor-area-info',
      popover: {
        title: isEn ? 'Real-time Spatial Measurement' : 'Kalkulasi Spasial Real-time',
        description: isEn
          ? 'Automatically computes total vertex points, circle radius (if applicable), surface area (m² / km²), and total perimeter length.'
          : 'Secara otomatis menghitung jumlah titik koordinat, radius jangkauan, estimasi luas area (m² / km²), serta panjang keliling batas wilayah.',
        side: 'right',
        align: 'end',
      },
    },
    {
      element: '#geofence-btn-save',
      popover: {
        title: isEn ? 'Save Geofence' : 'Simpan Batas Wilayah',
        description: isEn
          ? 'Persist the new perimeter into the central business repository and immediately sync across tracking modules.'
          : 'Simpan batas wilayah ke master data bisnis terpusat agar langsung tersinkronisasi dengan modul pemantauan armada.',
        side: 'top',
        align: 'end',
      },
    },
  ];
}
