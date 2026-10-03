# HALAMAN RUTE OPERASIONAL (ROUTES)

**Rute Aplikasi:** `/routes`  
**Domain:** CORE  
**Label UI:** Rute (Routes)  
**Title Dokumen:** `Rute - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/routes/RouteFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Rute (`/routes`) berfungsi sebagai **manajer rute perjalanan standar, koridor jalur operasional, dan titik singgah wajib (*standard operating route & waypoint manager*)** pada platform ADATRACK Business. Halaman ini menyediakan visual builder interaktif untuk merancang lintasan perjalanan resmi armada, memperkirakan jarak dan durasi tempuh, serta menjadi acuan deteksi deviasi rute (*route deviation alert*) pengemudi.

### Ringkasan Kemampuan Utama:
1. **Perancangan Rute Multititik (*Multi-Stop Route Builder*):**
   - **Titik Asal (*Origin*):** Menentukan lokasi awal keberangkatan (berupa titik koordinat peta atau referensi geofence yang sudah ada).
   - **Titik Singgah Berurutan (*Waypoints / Stops*):** Menambahkan titik pemberhentian/transit wajib dengan urutan sekuensial (*sequence order*).
   - **Titik Tujuan (*Destination*):** Menentukan lokasi akhir kedatangan rute.
2. **Penggambaran Koridor Lintasan (*Planned Path Multiline*):** Menggambar garis jalur resmi di atas peta jalan untuk mendefinisikan koridor perjalanan yang diizinkan bagi armada.
3. **Kalkulasi Estimasi Operasional:** Menghitung estimasi total jarak tempuh (*planned distance* dalam km) dan estimasi durasi waktu perjalanan (*estimated duration*).
4. **Acuan Monitoring Kepatuhan Pengemudi:** Menjadi standar jalur saat memutar riwayat perjalanan di `/tracking` untuk mengevaluasi apakah sopir menyimpang dari rute yang telah ditentukan.
5. **Pengelompokan Rute Operasional:** Mengatur rute ke dalam grup rute (*Route Group*, misal: "Rute Pengiriman Antar-Kota", "Rute Distribusi Harian").

---

## 2. Struktur Antarmuka dan Mode Kerja

Halaman menyediakan 2 mode kerja:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Mode 1: List View (Daftar Rute + Visualisasi Peta Jalur)              │
├───────────────────────────────┬────────────────────────────────────────┤
│  Panel Daftar Rute (Kiri):    │  Kanvas Peta Rute Penuh (Kanan):       │
│  [🔍 Cari Rute Operasional...] │  • Render garis rute multiline         │
│  [+ Buat Rute Baru]           │  • Marker Asal (A), Stops (1,2), Akhir │
│  ──────────────────────────── │  • Jarak (km) & Durasi (jam)           │
│  • JKT-BDG via Tol Cipularang │                                        │
│  • Distribusi Tangerang Barat │                                        │
└───────────────────────────────┴────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  Mode 2: Visual Route Editor (Penyusunan Rute Interaktif)              │
├───────────────────────────────┬────────────────────────────────────────┤
│  Form Alur Perjalanan (Kiri): │  Kanvas Peta Interaktif (Kanan):       │
│  • Nama Rute & Grup           │  • Klik peta untuk set Titik Asal (A)  │
│  • Titik Asal (Geofence/Coord)│  • Klik peta untuk tambah Waypoint (B) │
│  • Daftar Stops (+ Tambah)    │  • Klik peta untuk set Tujuan (C)      │
│  • Titik Tujuan               │  • Tool Menggambar Garis Koridor Jalur │
│  • Status (Aktif / Nonaktif)  │                                        │
│  [Batal]  [Simpan Rute]       │                                        │
└───────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`RouteListView.tsx` & `RouteListPanel.tsx`:**
  - Menampilkan katalog rute perjalanan perusahaan.
  - Kartu rute menampilkan nama rute, asal, tujuan, jumlah titik singgah, total jarak tempuh, dan estimasi waktu.
  - Tombol aksi: Ubah rute (*Edit*), Hapus rute (*Delete*), dan Fokus ke peta rute (*Select*).
- **`RouteMap.tsx`:**
  - Kanvas peta interaktif yang merender garis lintasan rute resmi dengan warna pembeda.
  - Menampilkan marker bernomor urut untuk setiap titik singgah.
- **`RouteEditorView.tsx`:**
  - Editor rute visual interaktif.
  - Mendukung interaksi peta: mode pemilihan lokasi (`select-location`) dan mode menggambar garis koridor rute (`draw_multiline`).

---

## 4. Model Data Teknis (`Route`)

```ts
import type { MapGeometry } from '@adatrack/maps';

export interface RouteLocation {
  type: 'geofence' | 'coordinate';
  geofenceId?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  address?: string;
}

export interface RouteStop {
  id: string;
  sequence: number;           // Urutan titik singgah (1, 2, 3...)
  location: RouteLocation;
}

export interface Route {
  id: string;                 // Format: rt-xxx
  name: string;               // Nama rute resmi
  description?: string;
  groupId?: string;           // Referensi ke RouteGroup
  origin: RouteLocation;      // Titik awal
  stops: RouteStop[];         // Daftar titik transit singgah
  destination: RouteLocation; // Titik akhir
  plannedPath?: MapGeometry;  // Garis multiline rute
  plannedDistance?: number;   // Total km rencana
  estimatedDuration?: number; // Menit
  status: 'active' | 'inactive';
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}
```

---

## 5. Aturan Bisnis & Integrasi

1. **Pemanggilan di Pemantauan Playback (`/tracking`):**
   - Rute resmi yang didefinisikan di sini dapat dimuat pada panel samping `PlaybackMapLayerPanel` di halaman Tracking untuk membandingkan jalur aktual GPS dengan koridor rute resmi.
2. **Keterkaitan Geofence:**
   - Titik awal, singgah, dan tujuan dapat mengikat langsung ke entitas `Geofence` yang sudah terdaftar di master Geofence CORE.
