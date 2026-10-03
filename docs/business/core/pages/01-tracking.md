# HALAMAN PEMANTAUAN (TRACKING)

**Rute Aplikasi:** `/tracking`  
**Domain:** CORE  
**Label UI:** Pemantauan (Tracking)  
**Title Dokumen:** `Pemantauan - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/app/(core)/tracking/page.tsx` -> `apps/business/src/features/core/tracking/TrackingFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Pemantauan (`/tracking`) merupakan **pusat kendali telematika dan operasi armada terpusat (*fleet command center*)** pada aplikasi ADATRACK Business. Halaman ini menyediakan pemantauan spasial menyeluruh di atas peta interaktif, pemutaran riwayat lintasan kendaraan, analisis kepadatan operasional, audit data tabular terperinci, pemantauan alarm/peringatan keselamatan, serta fitur berbagi lokasi langsung (*live location sharing*).

### Ringkasan Kemampuan Utama:
1. **Live Fleet Tracking:** Memantau posisi GPS, arah pergerakan (*bearing*), kecepatan, dan status mesin seluruh unit armada secara real-time.
2. **Tri-View Architecture:** Beralih instan antara tampilan **Peta (Maps)**, **Tabel (Table)**, dan **Aktivitas (Notification)** melalui bilah navigasi bawah (*bottom bar*).
3. **Multi-Mode Telematika:** Menyediakan mode **Live**, **Playback**, dan **Heatmap** di atas kanvas peta interaktif.
4. **Analisis Tabular Spesifik:** Menyediakan 6 sudut pandang tabel data melalui `TableModeSelector`: Ringkasan Live, Log Playback, Peta Panas, Audit Parkir, Jarak Tempuh, dan Pemantauan Kecepatan.
5. **Pusat Peringatan & Insiden:** Feed terpusat notifikasi alarm kendaraan (kecepatan lebih, putus daya GPS, alarm aki, deviasi batas wilayah, servis rutin).
6. **Berbagi Lokasi Langsung (*Live Sharing*):** Menghasilkan tautan publik aman berbatas waktu untuk dipantau pihak eksternal/pelanggan tanpa perlu login.
7. **Penerimaan Konteks Bisnis (*VehicleContext*):** Menerima navigasi dari modul bisnis luar (seperti modul Rental dan Logistik) untuk menyorot armada serta menampilkan data kontrak terkait secara instan tanpa mencemari URL browser.

---

## 2. Navigasi Tiga Tampilan Utama (View Navigation)

Di bagian paling bawah layar terdapat bilah navigasi horizontal (*bottom bar* setinggi 34px) yang membagi antarmuka menjadi 3 tampilan utama:

| Tampilan | Ikon | Komponen Render | Deskripsi & Kegunaan |
|---|:---:|---|---|
| **Peta (Maps)** | `Map` (Biru Langit) | `LiveMap` / `PlaybackMap` / `HeatmapMap` | Kanvas peta penuh dengan kontrol floating mode (Live, Playback, Heatmap), panel sidebar kanan, dan drawer bawah. |
| **Tabel (Table)** | `Grid` (Hijau Zamrud) | `LiveTable`, `PlaybackTable`, `HeatmapTable`, `ParkingTable`, `MileageTable`, `SpeedTable` | Antarmuka data grid berbasis `@adatrack/ui` DataTable dengan filter parameter khusus dan selector sub-mode. |
| **Aktivitas (Activity)** | `Activity` (Biru) | `TrackingNotificationPanel` | Pusat feed alarm dan peristiwa penting kendaraan yang disaring berdasarkan armada aktif. |

---

## 3. Tampilan Peta (Maps View) & Kontrol Mode

Saat berada pada tampilan Peta (`view === 'map'`), pengguna dapat beralih antara 3 mode pemantauan melalui tombol toggle floating di pojok kiri atas peta:

```text
[ ● Live ]  [ ↺ Playback ]  [ 📍 Heatmap ]
```

---

### A. Mode Live (Pemantauan Langsung)

Mode default saat halaman dibuka. Berfungsi untuk mengawasi seluruh unit armada yang beroperasi saat ini.

#### 1. Kanvas Peta Live (`LiveMap.tsx`)
- Menggunakan engine peta `@adatrack/maps` (`TrackingMap`).
- **Marker Kendaraan (`VehicleMarker.tsx`):**
  - Menampilkan ikon spesifik kendaraan (ikon Truk untuk angkutan barang/box, ikon Bus untuk minibus/Hiace).
  - Jarum/arah panah menunjukkan sudut rotasi hadap pergerakan kendaraan (*heading* 0–360°).
  - Warna dan label status:
    - **Berjalan (*Driving*):** Hijau (`bg-success`) — Kendaraan bergerak dengan kecepatan > 0 km/jam.
    - **Idle (*Idle*):** Oranye/Kuning (`bg-warning`) — Mesin hidup (kontak ACC ON) namun kecepatan 0 km/jam.
    - **Parkir (*Parking*):** Biru (`bg-info`) — Kendaraan berhenti dengan mesin mati (kontak ACC OFF).
    - **Offline (*Offline*):** Abu-abu (`bg-neutral-400`) — Perangkat GPS tidak mengirimkan sinyal telemetri dalam periode tertentu.
  - Hover/Klik marker memunculkan popup ringkas (`VehiclePopupPanel`).

#### 2. Panel Daftar Armada Kanan (`VehicleList.tsx`)
Panel sidebar sisi kanan selebar 320px (dapat diciutkan/diperluas hingga 34px):
- **Header:** Judul "Pemantauan", total counter unit aktif, tombol segarkan (*Refresh*), dan tombol ciutkan (*Collapse*).
- **Tab Filter Cepat:** Tab pemfilteran status instan: `Semua`, `Berjalan`, `Idle`, `Parkir`, `Offline`.
- **Kotak Pencarian:** Input pencarian instan berdasarkan plat nomor, model kendaraan, grup, atau nama pengemudi.
- **Pilih Semua (*Select All*):** Checkbox global untuk menampilkan atau menyembunyikan seluruh armada sekaligus di atas peta.
- **Struktur Folder Grup Kendaraan:**
  - Menampilkan folder grup armada (misal: "Jabodetabek Fleet", "Armada Logistik", "Rental Unit").
  - Menampilkan counter jumlah armada di dalam tiap grup.
  - Checkbox grup untuk memilih seluruh unit dalam satu grup secara batch.
- **Kartu Baris Armada:** Menampilkan checkbox seleksi, plat nomor (klik untuk auto-pan kamera peta), tipe kendaraan, nama driver yang bertugas, serta badge status.

#### 3. Panel Ringkasan Kendaraan Bawah (`VehicleOverviewPanel.tsx`)
Drawer bawah setinggi 180px yang muncul otomatis ketika satu unit kendaraan dipilih:
- **Header:** Plat nomor, kota operasional, model unit, badge status operasional, tombol "Bagikan Lokasi" (*Share Location*), dan tombol tutup (*X*).
- **Struktur 4 Kolom Informasi Telemetri:**
  - **Kolom 1:** Driver (Nama pengemudi), Kecepatan (*Speed* dalam km/h), Kontak Mesin (ACC ON hijau / OFF merah).
  - **Kolom 2:** Alamat Lokasi (*Reverse-geocoded* alamat jalan terkini), Alarm Event (Peringatan alarm aktif).
  - **Kolom 3:** Lokasi Geofence (Nama geofence tempat kendaraan berada), Area Geofence (Kategori zona wilayah).
  - **Kolom 4:** Koordinat GPS (Latitude & Longitude), GPS SN (Nomor seri perangkat GPS), Update Terakhir (Stempel waktu update data terakhir).

#### 4. Panel Popup Marker Peta (`VehiclePopupPanel.tsx`)
Popup berukuran 420px di atas marker armada:
- **Header & Status:** Plat nomor, tipe, status operasional, tombol tutup.
- **Tab Khusus (Konteks Bisnis):**
  - **Tab "UMUM":** Rincian telemetri lengkap (Driver, Kecepatan, ACC, Alarm, Alamat, Geofence, Koordinat, GPS SN, Update Terakhir).
  - **Tab "KONTEKS BISNIS" (misal: RENTAL):** Muncul otomatis jika ada data `VehicleContext` dari modul luar. Menampilkan rincian kontrak sewa, nama penyewa/korporasi, tanggal sewa, status ketersediaan unit sewa (*READY, RESERVED, RENTED*).
- **Aksi Footer Popup:**
  - **Tombol "Putar Jejak / Playback":** Berpindah langsung ke mode Playback untuk kendaraan yang bersangkutan.
  - **Tombol "Bagikan":** Membuka dialog pembagian tautan publik real-time.
  - **Tombol "Maps":** Membuka tautan koordinat kendaraan di Google Maps pada tab browser baru.

---

### B. Mode Playback (Pemutaran Riwayat Jejak)

Mode untuk merekonstruksi dan menganalisis riwayat perjalanan armada pada rentang tanggal dan jam tertentu di masa lalu.

#### 1. Kanvas Peta Playback (`PlaybackMap.tsx` & `PlaybackMapLayers.tsx`)
- Menampilkan garis lintasan rute penuh (`playbackTrack`).
- Garis jejak yang telah dilewati (`playbackPassedTrack`) disorot dengan warna tegas saat animasi berjalan.
- **Marker Khusus Playback:**
  - Marker Titik Awal Perjalanan (*Start Point*).
  - Marker Titik Selesai Perjalanan (*Finish Point*).
  - Marker Pemberhentian/Parkir (*Parking Events*) sepanjang rute yang menampilkan durasi henti saat diklik.
  - Animasi pergerakan marker kendaraan mengikuti titik koordinat historis.
- **Integrasi Layer Geofence & Rute:** Menggambar batas wilayah geofence dan garis koridor rute yang dicentang dari panel samping.

#### 2. Panel Kontrol Pemutar Bawah (`PlaybackPanel.tsx`)
Bilah horizontal mengambang setinggi 56px di bagian bawah peta:
- **Pilih Kendaraan:** Dropdown atau pemilih unit armada yang akan diperiksa riwayatnya.
- **Rentang Waktu:** Input tanggal dan jam mulai (*Start Date & Time*) serta tanggal dan jam selesai (*End Date & Time*).
- **Tombol "Muat Riwayat":** Menjalankan kalkulasi lintasan track points (dengan status loading dan indikator progres).
- **Tombol "Hapus Jejak" (*Clear*):** Menghapus lintasan playback dari peta dan mengembalikan panel ke status awal.
- **Kontrol Animasi Pergerakan:**
  - Tombol **Play**, **Pause**, dan **Stop**.
  - **Seekbar Timeline Interaktif:** Slider linier (0%–100%) yang dapat digeser (*scrubbing*) bebas untuk melompat ke detik perjalanan tertentu.
  - **Penunjuk Waktu:** Menampilkan jam absolut perjalanan aktual serta durasi elapsed / total (format `HH:MM:SS`).
  - **Pengatur Kecepatan (*Playback Speed*):** Pilihan percepatan animasi: `1x`, `2x`, `5x`, dan `10x`.

#### 3. Panel Layer Peta Samping Kanan (`PlaybackMapLayerPanel.tsx`)
Menggantikan panel daftar kendaraan saat mode Playback aktif:
- **Daftar Geofence:** Menampilkan master geofence dari `geofenceService` lengkap dengan kotak pencarian, checkbox seleksi, dan paginasi. Geofence yang dicentang langsung digambar sebagai poligon/lingkaran di peta playback.
- **Daftar Rute Standar:** Menampilkan master rute dari `routeService` lengkap dengan pencarian, checkbox, dan paginasi untuk membandingkan kepatuhan pengemudi terhadap rute resmi.

---

### C. Mode Heatmap (Peta Sebaran Kepadatan)

Mode analisis spasial untuk mengidentifikasi konsentrasi area operasional dan titik henti armada.

#### 1. Kanvas Peta Heatmap (`HeatmapMap.tsx`)
- Menghasilkan visualisasi sebaran densitas menggunakan gradasi warna termal (biru muda -> hijau -> kuning -> merah pekat).
- Mengelompokkan titik koordinat berdasarkan frekuensi kunjungan atau pemberhentian armada.

#### 2. Panel Kontrol Heatmap Bawah (`HeatmapPanel.tsx`)
Bilah kontrol setinggi 56px di bagian bawah peta:
- **Rentang Tanggal:** Input Tanggal Mulai dan Tanggal Selesai.
- **Filter Status Aktivitas:**
  - Berjalan (*Driving*) — Menganalisis koridor jalan yang paling sering dilalui.
  - Idle (*Idle*) — Menganalisis titik henti dengan mesin tetap menyala (kemacetan atau antrean).
  - Parkir (*Parking*) — Menganalisis titik lokasi parkir/gudang yang paling sering disinggahi.
- **Tombol "Tampilkan Heatmap" (*Generate Heatmap*):** Memproses dan merender ulang intensitas panas pada peta.

---

## 4. Tampilan Tabel (Table View) & 6 Mode Analisis

Saat pengguna memilih tab **Tabel** pada navigasi bawah, antarmuka beralih ke tampilan data tabular penuh yang ditenagai oleh `@adatrack/ui` `DataTable`.

Pengguna dapat memilih salah satu dari **6 sub-mode tabel** menggunakan tombol dropdown `TableModeSelector`:

```text
[ ▾ Live ] | [ ↺ Playback ] | [ 📍 Heatmap ] | [ 🅿 Parkir ] | [ 🛣 Jarak Tempuh ] | [ ⏱ Kecepatan ]
```

### 1. Tabel Pemantauan Langsung (`LiveTable.tsx`)
- **Fungsi:** Menyajikan audit komprehensif seluruh armada yang sedang dicentang.
- **Kolom Data:**
  - `Kendaraan`: Plat nomor kendaraan (dapat diklik untuk memilih unit).
  - `Status`: Badge visual status (Berjalan, Idle, Parkir, Offline).
  - `Kecepatan (km/j)`: Kecepatan aktual saat ini.
  - `Lokasi`: Alamat teks lokasi terakhir dilengkapi tautan langsung ke Google Maps.
  - `Grup`: Nama grup armada kepemilikan unit.
  - `Update Terakhir`: Tanggal dan jam pembaruan sinyal GPS.
  - `Aksi Cepat`: Indikator ikon tautan aktif jika kendaraan sedang memiliki sesi *Share Location*.
- **Fitur Toolbar:** Pencarian teks bebas, Show/Hide Kolom, Ekspor Data (CSV/Excel), Mode Layar Penuh (*Fullscreen*), dan Segarkan Data.

### 2. Tabel Riwayat Perjalanan (`PlaybackTable.tsx`)
- **Fungsi:** Menampilkan log rincian setiap titik koordinat (*waypoint*) dari riwayat perjalanan yang telah dimuat.
- **Kolom Data:**
  - `Waktu`: Stempel waktu setiap titik koordinat tercatat.
  - `Kecepatan (km/j)`: Kecepatan pada titik tersebut.
  - `Status`: Status bergerak atau berhenti.
  - `Odometer`: Angka odometer kendaraan pada titik terkait.
  - `Alamat`: Alamat jalan titik waypoint beserta tautan peta.
- **Toolbar Khusus:** Dropdown pemilih kendaraan, input tanggal & waktu mulai/selesai, tombol muat riwayat, dan ekspor rute.

### 3. Tabel Peta Panas (`HeatmapTable.tsx`)
- **Fungsi:** Rekapitulasi unit armada yang masuk dalam lingkup analisis kepadatan spasial.
- **Kolom Data:** No, Plat Kendaraan, Nama Grup, Tipe Kendaraan.
- **Toolbar Khusus:** Filter status aktivitas (Berjalan / Idle / Parkir), pemilih tanggal, dan tombol proses data.

### 4. Tabel Analisis Parkir (`ParkingTable.tsx`)
- **Fungsi:** Audit pemberhentian armada guna mendeteksi parkir liar atau durasi singgah yang tidak wajar.
- **Kolom Data:**
  - `No`: Nomor urut.
  - `Kendaraan`: Plat nomor kendaraan.
  - `Durasi Parkir`: Total lama henti (format: `X jam Y menit` atau `Y menit`).
  - `Alamat`: Alamat presisi lokasi kendaraan diparkir beserta tautan Google Maps.
  - `Geofence`: Nama zona geofence jika parkir terjadi di dalam area resmi (misal: "Pool Slipi", "Gudang Utama").
- **Popover Parameter Filter:** Input durasi minimal parkir dalam satuan menit (misal: hanya tampilkan parkir >= 15 menit) dan rentang tanggal.

### 5. Tabel Analisis Jarak Tempuh (`MileageTable.tsx`)
- **Fungsi:** Rekapitulasi utilisasi armada berdasarkan kilometer tempuh dan efisiensi waktu mesin.
- **Kolom Data:**
  - `No`: Nomor urut.
  - `Kendaraan`: Plat nomor armada.
  - `Total Mesin Hidup`: Akumulasi waktu kontak mesin berada pada posisi ON (jam & menit).
  - `Total KM`: Akumulasi jarak yang ditempuh kendaraan dalam kilometer (format desimal 1 angka di belakang koma).
- **Popover Parameter Filter:** Pemilih tanggal mulai dan tanggal selesai evaluasi.

### 6. Tabel Analisis Kecepatan (`SpeedTable.tsx`)
- **Fungsi:** Pemantauan profil kecepatan dan evaluasi perilaku mengemudi (*driver safety behavior*).
- **Kolom Data:**
  - `No`: Nomor urut.
  - `Kendaraan`: Plat nomor armada.
  - `Min. Kecepatan`: Kecepatan terendah saat unit beroperasi (km/jam).
  - `Kecepatan Rata-rata`: Rata-rata kecepatan armada (km/jam).
  - `Kecepatan Maks`: Kecepatan puncak yang dicapai unit (disorot warna merah jika mendekati batas bahaya).
- **Popover Parameter Filter:** Rentang tanggal evaluasi kecepatan.

---

## 5. Tampilan Aktivitas & Notifikasi (`view === 'notification'`)

Dikelola oleh komponen `TrackingNotificationPanel.tsx`. Menampilkan log peringatan telematika terpusat secara real-time yang terjadi pada armada aktif:

### Tab Kategori Notifikasi:
1. **Semua (*All*):** Menampilkan seluruh log peristiwa tanpa filter.
2. **Alarm Kendaraan (*Vehicle Alarm*):** Peringatan overspeed (kecepatan melampaui batas jalan/kebijakan), unit offline berkepanjangan, pemutusan aki liar (*power cut*), sensor bahan bakar turun drastis.
3. **Perawatan (*Maintenance*):** Peringatan jatuh tempo servis berkala, batas kilometer ganti oli mesin, uji KIR mendekati kedaluwarsa.
4. **Operasional (*Operation*):** Peringatan unit masuk/keluar zona geofence, penyelesaian rute perjalanan (*trip completed*), dan laporan pergantian pengemudi.

### Elemen Kartu Notifikasi:
- **Indikator Tingkat Keparahan:** Ikon bahaya merah (*Alert/Danger*), peringatan kuning (*Warning*), informasi biru (*Info*).
- **Konten:** Judul alarm, plat kendaraan terkait, deskripsi peristiwa, dan stempel waktu relatif.
- **Aksi Cepat "Lihat Lokasi":** Tombol yang langsung mengalihkan antarmuka kembali ke tampilan Peta dan memfokuskan kamera ke unit kendaraan terkait.

---

## 6. Fitur Berbagi Lokasi Publik (`ShareLocationDialog.tsx`)

Fitur untuk membagikan tautan pemantauan kendaraan secara aman kepada pihak ketiga (pelanggan, vendor, atau mitra bisnis):

- **Durasi Tautan:** Dapat dipilih antara `1 jam`, `2 jam`, `4 jam`, `8 jam`, atau `24 jam`.
- **Tautan Publik:** Menghasilkan URL unik ber-token: `http://localhost:3000/share/{token}`.
- **Manajemen Sesi Aktif:**
  - Menampilkan status hitung mundur masa berlaku tautan.
  - Tombol salin tautan instan ke clipboard.
  - Tombol **Cabut Akses / Berhenti Berbagi (*Stop Sharing*)** untuk menonaktifkan tautan seketika sebelum masa kedaluwarsa berakhir.

---

## 7. Integrasi Antar-Modul & Navigasi Bersih (`VehicleContext`)

Modul CORE Tracking dirancang untuk dapat menerima konteks dari modul bisnis (Rental, Logistik, Transport) secara terisolasi tanpa menciptakan ketergantungan balik (*no reverse dependency*).

### Mekanisme `trackingNavigationService.ts`:
1. Modul eksternal (misal tabel armada Rental atau halaman kontrak) memanggil:
   ```ts
   trackingNavigationService.navigateToTracking({
     mode: 'live', // atau 'playback'
     vehicleId: 'veh-001',
     start: '2026-10-01T08:00:00Z',
     end: '2026-10-03T18:00:00Z'
   });
   ```
2. Data navigasi disimpan sementara di `sessionStorage` dengan key khusus.
3. Halaman `/tracking` membaca state ini saat inisialisasi (`initializedRef`):
   - Jika `mode === 'live'`: Kamera peta langsung memusatkan posisi ke unit tersebut dan membuka popup konteks kontrak sewa.
   - Jika `mode === 'playback'`: Tanggal sewa otomatis terisi ke input tanggal dan riwayat perjalanan langsung dimuat otomatis (`pendingAutoLoadRef`).
4. State di `sessionStorage` segera dibersihkan agar saat pengguna melakukan reload/refresh halaman, antarmuka kembali ke mode pantau default tanpa bug navigasi.
5. **URL Tetap Bersih:** Rute di browser selalu menampilkan `http://localhost:3000/tracking` tanpa parameter URL kotor seperti `?v=veh-001&lat=-6.2&lng=106.8`.

---

## 8. Struktur File dan Arsitektur Komponen

```text
apps/business/src/
├── app/(core)/tracking/
│   └── page.tsx                               # Next.js Page Route wrapper
└── features/core/tracking/
    ├── TrackingFeature.tsx                     # Top-level Orchestrator (State, Tabs, Layout)
    ├── i18n.ts                                 # Kamus bilingual (id & en)
    ├── types/
    │   └── tracking.ts                         # Type definitions resmi (Vehicle, Trip, Mode, State)
    ├── services/
    │   └── trackingNavigationService.ts        # Service navigasi via sessionStorage
    ├── data/
    │   └── mockTrackingData.ts                 # Data dummy generator rute playback realistis
    └── components/
        ├── shared/
        │   ├── VehicleList.tsx                 # Sidebar daftar armada (Filter, Search, Groups)
        │   ├── VehicleOverviewPanel.tsx        # Drawer bawah info unit (4 Kolom telemetri)
        │   ├── VehiclePopupPanel.tsx           # Popup marker (Tab Umum & Konteks Bisnis)
        │   ├── VehicleMarker.tsx               # Marker SVG dinamis di atas canvas peta
        │   ├── VehicleSelect.tsx               # Dropdown pemilih unit armada
        │   ├── TableModeSelector.tsx           # Dropdown pemilih sub-mode tabel
        │   └── TableFilterPopover.tsx          # Popover parameter filter tabel
        ├── live/
        │   ├── LiveMap.tsx                     # Kanvas peta live tracking
        │   └── LiveTable.tsx                   # Data grid tabular armada live
        ├── playback/
        │   ├── PlaybackMap.tsx                 # Kanvas peta playback pergerakan
        │   ├── PlaybackMapLayers.tsx           # Render poligon geofence & koridor rute
        │   ├── PlaybackMapLayerPanel.tsx       # Sidebar kanan layer geofence & rute
        │   ├── PlaybackPanel.tsx               # Bilah kontrol pemutar jejak & seekbar
        │   └── PlaybackTable.tsx               # Data grid tabular waypoint jejak
        ├── heatmap/
        │   ├── HeatmapMap.tsx                  # Kanvas visualisasi sebaran densitas
        │   ├── HeatmapPanel.tsx                # Bilah parameter filter heatmap
        │   └── HeatmapTable.tsx                # Data grid unit cakupan heatmap
        ├── parking/
        │   └── ParkingTable.tsx                # Data grid analisis durasi & lokasi parkir
        ├── mileage/
        │   └── MileageTable.tsx                # Data grid analisis total kilometer tempuh
        ├── speed/
        │   └── SpeedTable.tsx                  # Data grid analisis profil kecepatan unit
        └── activity/
            └── TrackingNotificationPanel.tsx   # Panel pusat log feed notifikasi & alarm
```

---

## 9. Aturan Bisnis & Batasan Scope

1. **Frontend Mock Scope:**
   Seluruh data telemetri, titik koordinat GPS playback, alarm event, dan durasi parkir dihasilkan oleh layer data mock lokal (`mockTrackingData.ts` dan `trackingRepository.ts`). Tidak ada koneksi ke server GPS backend/MQTT/TCP nyata.
2. **Kemandirian Modul CORE:**
   Modul CORE Tracking dilarang melakukan import kode atau komponen dari modul bisnis vertikal (`apps/business/src/features/rental` atau `logistik`). Data bisnis hanya boleh dikonsumsi melalui model generic `VehicleContext`.
3. **Penyelarasan Desain Enterprise:**
   Semua tabel menggunakan `@adatrack/ui` `DataTable` dengan dukungan pengurutan (*sorting*), pencarian (*searching*), visibilitas kolom, pagination, dan ekspor berkas.
4. **Dukungan Dua Bahasa:**
   Seluruh label antarmuka mendukung Bahasa Indonesia (default) dan Bahasa Inggris yang terhubung ke sistem i18n aplikasi.
