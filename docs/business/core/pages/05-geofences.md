# HALAMAN BATAS WILAYAH VIRTUAL (GEOFENCES)

**Rute Aplikasi:** `/geofences`  
**Domain:** CORE  
**Label UI:** Geofence  
**Title Dokumen:** `Geofence - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/geofences/GeofenceFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Geofence (`/geofences`) berfungsi sebagai **manajer batas spasial virtual dan perimeter operasi (*virtual geographic boundary manager*)** pada platform ADATRACK Business. Halaman ini memungkinkan pengguna menggambar, mengatur, dan memantau zona-zona wilayah virtual di atas peta interaktif untuk mendeteksi pergerakan armada dan memicu alarm otomatis saat kendaraan masuk (*entry alert*) atau keluar (*exit alert*) dari area yang ditentukan.

### Ringkasan Kemampuan Utama:
1. **Peta Interaktif Spasial Penuh:** Menampilkan seluruh batas wilayah geofence yang aktif di atas peta dengan pewarnaan zona yang jelas.
2. **Editor Gambar Geofence Interaktif (`GeofenceEditorView`):**
   - **Tipe Poligon (*Polygon*):** Menggambar batas area bebas multi-titik (*multi-point vertex*) untuk area gudang, kawasan industri, pelabuhan, atau wilayah perkotaan.
   - **Tipe Lingkaran (*Circle*):** Menetapkan titik pusat (*center point*) dan radius jarak jangkauan (dalam meter).
3. **Kustomisasi Visual Geofence:** Mengatur warna garis tepi (*stroke color*), ketebalan garis, dan warna transparansi isi (*fill opacity*) untuk membedakan kategori zona (misal: merah untuk zona terlarang, hijau untuk depo resmi).
4. **Pemicu Alarm & Otomasi Peristiwa:** Menjadi referensi bagi modul telematika GPS untuk membunyikan alarm otomatis saat armada melewati batas wilayah (ditampilkan pada tab Aktivitas `/tracking`).
5. **Pengelompokan Zona Geofence:** Mengelompokkan geofence ke dalam grup tertentu melalui `GeofenceGroup` (misal: "Depo Logistik", "Kawasan Pelabuhan", "Pool Cabang").

---

## 2. Struktur Antarmuka dan Mode Tampilan

Halaman memiliki 2 mode tampilan utama:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Mode 1: List View (Daftar Geofence + Peta Monitoring)                 │
├───────────────────────────────┬────────────────────────────────────────┤
│  Panel Daftar Samping (Kiri): │  Kanvas Peta Penuh (Kanan):            │
│  [🔍 Cari Geofence...]        │  • Menampilkan seluruh poligon/circle  │
│  [+ Buat Geofence Baru]       │  • Auto-zoom ke geofence saat diklik   │
│  ──────────────────────────── │  • Popup nama, tipe, dan luas area     │
│  • Depo Utama Marunda (Poly)  │                                        │
│  • Pool Slipi (Radius 500m)   │                                        │
│  • Kawasan Industri MM2100    │                                        │
└───────────────────────────────┴────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  Mode 2: Editor View (Mode Menggambar Batas Wilayah)                   │
├───────────────────────────────┬────────────────────────────────────────┤
│  Form Parameter (Kiri):       │  Kanvas Peta Menggambar (Kanan):       │
│  • Nama Geofence              │  • Tool Menggambar Titik Poligon       │
│  • Grup Geofence              │  • Tool Menggambar Radius Lingkaran    │
│  • Status (Aktif / Nonaktif)  │  • Drag & Drop Vertex untuk Edit Titik │
│  • Warna Garis & Warna Isi    │                                        │
│  [Batal]  [Simpan Geofence]   │                                        │
└───────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`GeofenceListView.tsx` & `GeofenceListPanel.tsx`:**
  - Panel daftar samping yang menampilkan seluruh geofence terdaftar.
  - Pencarian teks nama geofence dan filter grup geofence.
  - Kartu geofence menampilkan nama, tipe bentuk (*Polygon/Circle*), status aktif/tidak aktif, dan tombol aksi (Edit, Hapus, dan Fokus Peta).
- **`GeofenceMap.tsx`:**
  - Kanvas peta Leaflet/OpenStreetMap yang merender semua entitas geometri geofence.
  - Memberikan respon hover dan klik untuk menyorot informasi luas area atau radius geofence.
- **`GeofenceEditorView.tsx`:**
  - Antarmuka khusus saat membuat atau menyunting batas wilayah.
  - Peta dilengkapi kontrol interaktif untuk menggambar titik koordinat satu per satu atau menentukan radius lingkaran.

---

## 4. Model Data Teknis (`Geofence`)

```ts
import type { MapGeometry } from '@adatrack/maps';

export interface GeofenceGroup {
  id: string;
  name: string;
  description?: string;
}

export interface Geofence {
  id: string;                    // Format: gf-xxx
  groupId?: string;              // Referensi ke GeofenceGroup
  name: string;                  // Nama batas wilayah
  description?: string;
  geometry: MapGeometry;         // Objek koordinat { type: 'polygon' | 'circle', coordinates, radius }
  status: 'active' | 'inactive';
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

---

## 5. Aturan Bisnis & Integrasi

1. **Integrasi dengan Halaman Pemantauan (`/tracking`):**
   - Geofence yang dibuat di halaman ini dapat dimuat pada sidebar `PlaybackMapLayerPanel` di halaman Tracking untuk memverifikasi apakah armada melewati atau menyimpang dari area resmi selama perjalanan.
2. **Evaluasi Spasial Real-Time:**
   - Posisi GPS armada secara berkala dievaluasi terhadap geofence aktif menggunakan fungsi `checkGeofenceFn` untuk mendeteksi event *Geofence Entry* dan *Geofence Exit*.
