# HALAMAN BERANDA (HOME / DASHBOARD)

**Rute Aplikasi:** `/`  
**Domain:** CORE / Application Shell  
**Label UI:** Beranda (Home)  
**Title Dokumen:** `Beranda - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/home/components/BusinessHomePage.tsx`  
**Service Layer:** `apps/business/src/data/services/homeService.ts`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Beranda (`/`) berfungsi sebagai **pusat kendali awal (*cockpit dashboard*)** bagi manajer operasional dan pengelola armada pada platform ADATRACK Business. Halaman ini dirancang untuk:

1. **Memberikan Ringkasan Cepat Telematika Armada:** Memberikan gambaran sekilas kondisi armada secara aktual saat pengguna pertama kali masuk ke aplikasi (jumlah total armada, armada aktif bergerak, alarm/peringatan yang membutuhkan tindakan, dan perjalanan aktif hari ini).
2. **Menyediakan Navigasi Akses Cepat yang Dapat Dipersonalisasi (*Customizable Shortcuts*):** Memudahkan pengguna melompat ke modul atau fitur kerja prioritas tanpa harus menelusuri menu hierarki sidebar. Pengguna dapat memilih dan mengatur shortcut favorit sesuai peran tugasnya masing-masing.

---

## 2. Struktur Antarmuka Pengguna

Tata letak halaman terbagi menjadi dua blok fungsional utama:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  HERO SECTION (Banner Gelap dengan Radial Pattern & Accent Glow)       │
│  Selamat Datang,                                                       │
│  Budi Beni!                                                            │
│  Pantau dan kelola seluruh operasional armada Anda dari satu tempat.   │
│                                                                        │
│  [ 🚚 120 Total Armada ]   [ 📈 48 Bergerak ]                          │
│  [ ⚠️ 3 Peringatan ]       [ 🛣 86 Perjalanan Hari Ini ]               │
├────────────────────────────────────────────────────────────────────────┤
│  MENU FAVORIT                           [ + Tambah Shortcut ]          │
│  Akses cepat ke modul dan fitur yang sering Anda gunakan               │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ 🗺 Pemantauan│  │ 🚚 Armada    │  │ 👤 Pengemudi │  │ 📦 Pengiriman││
│  │ Live GPS     │  │ Master unit  │  │ Lisensi sopir│  │ Distribusi   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
│  ┌──────────────┐  ┌──────────────┐                                    │
│  │ 🔧 Perawatan │  │ 📡 GPS Device│                                    │
│  │ Servis unit  │  │ Hardware I/O │                                    │
│  └──────────────┘  └──────────────┘                                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Komponen-Komponen Fitur

### A. `BusinessHeroSection.tsx`
- **Kartu Identitas Pengguna:** Menampilkan sapaan nama pengguna aktif dan ringkasan peran.
- **Visual Silhouette:** Siluet visual kendaraan armada di sisi kanan dengan aksen ambient glow (orange/red gradient).
- **Metric Cards Grid:** 4 kartu metrik telematika utama yang terhubung langsung ke `homeService.getMetricSummary()`:
  - **Total Kendaraan (`totalVehicles`):** Total seluruh unit armada yang terdaftar di sistem.
  - **Kendaraan Bergerak (`movingVehicles`):** Armada yang saat ini berstatus mesin ON dan kecepatan > 0 km/h.
  - **Peringatan Aktif (`activeAlerts`):** Peringatan operasional yang belum diselesaikan (misal overspeeding, geofence breach, SOS).
  - **Perjalanan Hari Ini (`tripsToday`):** Akumulasi surat jalan/trip aktif dan selesai per hari ini.

### B. Header Bagian Favorit (`FavoriteSectionHeader` — `@adatrack/ui`)
- Menampilkan judul *"Menu Favorit"* dan deskripsi singkat.
- Tombol aksi primer **`+ Tambah Shortcut`** (varian warna accent) yang memicu dibukanya dialog pengelola favorit (`FavoriteManager`).

### C. Grid Pintasan (`HomeShortcutGrid.tsx`)
- Merender daftar kartu shortcut interaktif yang sedang aktif dipilih oleh pengguna.
- Setiap kartu memiliki icon berwarna tematik, label judul, deskripsi tugas, dan navigasi langsung ke rute terkait.
- Efek hover interaktif, transisi halus, dan accessibility focus-ring.

### D. Pengelola Favorit (`FavoriteManager` — `@adatrack/ui`)
- Modal dialog untuk mengatur shortcut yang ingin ditampilkan di halaman beranda.
- Menampilkan 12 pilihan shortcut bisnis lengkap:
  1. `tracking` (`/tracking`) — Pemantauan Armada
  2. `vehicles` (`/vehicles`) — Master Armada Kendaraan (SSoT)
  3. `drivers` (`/drivers`) — Master Pengemudi & Safety Score
  4. `trips` (`/trips`) — Perjalanan & Riwayat Rute
  5. `deliveries` (`/deliveries`) — Pengiriman Barang & Logistik
  6. `alerts` (`/alerts`) — Pusat Peringatan & Alarm
  7. `geofences` (`/geofences`) — Manajemen Batas Wilayah Virtual
  8. `maintenance` (`/maintenance`) — Jadwal Servis & Pemeliharaan
  9. `tasks` (`/tasks`) — Tugas Kerja & Surat Perintah
  10. `reports` (`/reports`) — Laporan Analitik & Unduhan
  11. `incidents` (`/incidents`) — Rekam Kejadian & Insiden Lapangan
  12. `gpsDevices` (`/gps-devices`) — Manajemen Perangkat Keras Telematika
- Aksi: Centang/hapus centang item, tombol Batal (*Cancel*), dan Simpan (*Save*).

### E. Kondisi Kosong (`FavoriteEmptyState` — `@adatrack/ui`)
- Ditampilkan secara elegan jika pengguna memilih untuk mengosongkan seluruh shortcut favorit.
- Menyediakan pesan informatif dan tombol pemicu langsung untuk menambahkan kembali shortcut.

---

## 4. Mekanisme State & Persistensi Data

- **Penyimpanan Lokal (*Local Storage*):** Preferensi shortcut disimpan pada browser klien menggunakan kunci `adatrack.business.favorites`.
- **Default Shortcuts:** Jika pengguna baru pertama kali masuk dan belum memiliki data lokal, sistem memuat default:
  ```ts
  const DEFAULT_FAVORITES = ['tracking', 'vehicles', 'drivers', 'deliveries', 'maintenance', 'gpsDevices'];
  ```
- **SSR-Safe Hydration:** State `isLoaded` memastikan komponen grid hanya dirender di sisi klien setelah `localStorage` terbaca, mencegah terjadinya *hydration mismatch error* pada Next.js.
- **Multibahasa (i18n):** Seluruh label teks, sapaan hero, metrik, judul dialog, dan deskripsi shortcut didukung penuh dalam Bahasa Indonesia (`id`) dan Bahasa Inggris (`en`).
