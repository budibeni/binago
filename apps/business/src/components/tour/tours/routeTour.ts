import type { DriveStep } from 'driver.js';
import type { Locale } from '@adatrack/types';

// ─── 1. OVERVIEW TOUR ────────────────────────────────────────────────────────

/**
 * Tur Keseluruhan Manajemen Rute Operasional (Route Overview)
 */
export function getRouteOverviewTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      popover: {
        title: isEn ? 'Welcome to Route Management 🛣️' : 'Selamat Datang di Manajemen Rute 🛣️',
        description: isEn
          ? 'Standard operating route manager for defining fleet corridors, multi-stop waypoints, and route deviation monitoring.'
          : 'Manajer rute operasional standar untuk merancang koridor perjalanan armada, titik singgah wajib (waypoints), dan acuan deteksi deviasi perjalanan.',
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-close-route-editor'));
      },
    },
    {
      element: '#route-map-container',
      popover: {
        title: isEn ? 'Interactive Route Canvas' : 'Kanvas Peta Rute Interaktif',
        description: isEn
          ? 'Displays the planned path multiline, sequential stop markers, origin (A), destination (B), and road corridor boundaries.'
          : 'Menampilkan garis koridor rute multiline resmi, marker titik singgah berurutan, lokasi asal (A), dan tujuan akhir (B).',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#route-list-panel',
      popover: {
        title: isEn ? 'Route Catalog Panel' : 'Panel Katalog Rute',
        description: isEn
          ? 'Hierarchical list grouping operational routes into inter-city, distribution, and local routes with distance and duration estimates.'
          : 'Daftar rute operasional yang dikelompokkan berdasarkan kategori antarkota atau dalam kota, lengkap dengan estimasi jarak (km) dan durasi (menit).',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#route-search-input',
      popover: {
        title: isEn ? 'Search Routes' : 'Pencarian Rute Cepat',
        description: isEn
          ? 'Search routes by route name, terminal, warehouse, or destination city.'
          : 'Cari rute perjalanan dengan cepat berdasarkan nama koridor, depo asal, maupun kota tujuan.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#route-filter-btn',
      popover: {
        title: isEn ? 'Filter Operational Status' : 'Filter Status Rute',
        description: isEn
          ? 'Filter routes by operational status: All, Active, or Inactive.'
          : 'Saring rute berdasarkan status operasional: Semua, Aktif, atau Nonaktif.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#route-first-item',
      popover: {
        title: isEn ? 'Select Route & Focus Map' : 'Pilih Rute & Sorot Peta',
        description: isEn
          ? 'Click any route card to auto-zoom and pan the map directly to its full path, or use the menu for edit and delete actions.'
          : 'Klik kartu rute untuk memusatkan peta ke seluruh lintasan jalur, atau gunakan tombol aksi untuk mengubah dan menghapus rute.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#route-btn-add',
      popover: {
        title: isEn ? 'Create New Route' : 'Buat Rute Baru',
        description: isEn
          ? 'Launch the visual multi-stop route builder to establish an official trip corridor.'
          : 'Buka visual route builder untuk merancang rute perjalanan baru dan menentukan titik singgah wajib.',
        side: 'bottom',
        align: 'start',
      },
    },
  ];
}

// ─── 2. BUILDER TOUR ─────────────────────────────────────────────────────────

/**
 * Tur Visual Route Builder (Editor Penyusunan Rute)
 */
export function getRouteBuilderTourSteps(locale: Locale = 'id'): DriveStep[] {
  const isEn = locale === 'en';

  return [
    {
      element: '#route-editor-panel',
      popover: {
        title: isEn ? 'Visual Route Builder 📍' : 'Visual Route Builder 📍',
        description: isEn
          ? 'Configure route name, group assignment, origin location, sequential transit waypoints, and destination.'
          : 'Atur nama rute operasional, penugasan grup, titik awal keberangkatan, titik singgah berurutan, dan lokasi tujuan akhir.',
        side: 'right',
        align: 'start',
      },
      onHighlightStarted: () => {
        window.dispatchEvent(new CustomEvent('adatrack:tour-open-route-create'));
      },
    },
    {
      element: '#route-editor-map',
      popover: {
        title: isEn ? 'Interactive Map Location Picker' : 'Pemilihan Lokasi & Jalur di Peta',
        description: isEn
          ? 'Click directly on the map or select existing geofences to set waypoints, or use the multiline tool to draw custom corridors.'
          : 'Klik langsung di atas peta atau pilih dari geofence yang sudah ada untuk menentukan titik singgah, serta gambar garis koridor rute resmi.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '#route-form-save-btn',
      popover: {
        title: isEn ? 'Save Route' : 'Simpan Rute Operasional',
        description: isEn
          ? 'Persist the new route into the central database to immediately enable route deviation monitoring across the fleet.'
          : 'Simpan rute baru ke master data terpusat agar langsung menjadi standar pemantauan deviasi perjalanan armada.',
        side: 'top',
        align: 'end',
      },
    },
  ];
}
