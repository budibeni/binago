# HALAMAN ARMADA KENDARAAN (VEHICLES)

**Rute Aplikasi:** `/vehicles`  
**Domain:** CORE  
**Label UI:** Armada (Vehicles)  
**Title Dokumen:** `Armada - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/app/(core)/vehicles/page.tsx` -> `apps/business/src/features/core/vehicles/VehiclesFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Armada (`/vehicles`) berfungsi sebagai **Single Source of Truth (SSoT) master database seluruh aset kendaraan fisik** pada platform ADATRACK Business. Halaman ini bertanggung jawab atas integritas identitas kendaraan, penugasan perangkat telematika GPS, kepatuhan dokumen legalitas, dan menjadi acuan utama bagi modul bisnis vertikal seperti Rental dan Logistik.

### Ringkasan Kemampuan Utama:
1. **Pusat Master Armada (Single Source of Truth):** Mencatat spesifikasi lengkap unit (plat nomor, nama kendaraan, kategori/tipe bodi, merek, model, tahun pembuatan, warna, kapasitas bahan bakar, kapasitas penumpang, nomor rangka/VIN, dan nomor mesin).
2. **Kepatuhan Legalitas & Dokumen Kendaraan:** Memantau nomor dan masa berlaku STNK, Pajak Tahunan, Buku Pemilik Kendaraan Bermotor (BPKB), dan Uji KIR guna mencegah denda dan pelanggaran hukum lalu lintas.
3. **Manajemen Perangkat GPS Tracker:** Menghubungkan nomor IMEI perangkat telematika GPS, nomor kartu SIM M2M, merek/tipe GPS, dan tanggal pemasangan unit tracker.
4. **Penugasan Pengemudi & Grup:** Menetapkan pengemudi utama (*default driver*) yang bertanggung jawab atas unit armada serta memasukkan armada ke dalam Grup Operasional (*Vehicle Group*).
5. **Pencatatan Odometer & Servis Berkala:** Melacak odometer total kumulatif kendaraan, kilometer servis terakhir, dan jadwal target kilometer servis berikutnya.
6. **Integrasi Langsung ke Pemantauan (*Direct Track Action*):** Aksi satu klik pada baris tabel untuk membuka posisi armada secara real-time di halaman `/tracking` melalui `trackingNavigationService`.
7. **Penyedia Komponen Dialog Seleksi Armada (`VehicleSelectionDialog`):** Menyediakan modal pemilih kendaraan resmi untuk modul vertikal (seperti modul Rental saat mengalokasikan unit kendaraan ke portofolio sewa).

---

## 2. Struktur Antarmuka dan Alur Kerja Pengguna

Halaman didesain dengan tata letak satu layar penuh (*full height*) yang responsif dan mengedepankan efisiensi operasional armada:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [🔍 Cari Plat/Nama/Driver/IMEI...]  [🏷 Filter (4)]  [👁 Kolom]  [⬇ Ekspor]  [+ Tambah Armada] │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Master Armada:                                              │
│  [Aksi] | Plat Nomor | Status | Performa | Nama Unit | Grup | Driver... │
│  ───────┼────────────┼────────┼──────────┼───────────┼──────┼──────────┤
│   [👁]  | B 1234 ABC | 🟢 Jln | ★★★★☆    | Avanza 01 | Rent | Budi S   │
│   [👁]  | B 5678 XYZ | 🟡 Idl | ★★★★★    | Box CDE   | Lgst | Joko W   │
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik tombol [👁] / Plat Nomor)                       ▼ (Klik [+ Tambah Armada])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Drawer Detail: VehicleView   │              │ Modal Form: VehicleForm      │
│ • Tab Spesifikasi Unit       │              │ • Identitas & No Polisi      │
│ • Tab GPS & Sensor           │              │ • Penugasan Grup & Driver    │
│ • Tab Dokumen Legalitas      │              │ • IMEI & SIM GPS Tracker     │
│ • Tab Metrik & Servis        │              │ • Legalitas STNK, BPKB, KIR  │
│ [Tombol: Buka di Tracking]   │              │ [Tombol: Simpan / Batal]     │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Tabel Armada (`VehicleTable.tsx`)

Tabel data armada dibangun di atas fondasi `@adatrack/ui` `DataTable` dengan konfigurasi kolom yang sangat lengkap:

### Kolom Tabel Data:
1. **Kolom Aksi (Pinned Kiri):** Tombol ikon mata (`Eye`) untuk membuka panel drawer detail kendaraan (`VehicleView`).
2. **Plat Nomor (`colPlateNumber`):** Nomor registrasi polisi kendaraan (format tebal, dapat diklik untuk membuka detail).
3. **Status Operasional (`status`):** Badge warna telematika:
   - **Berjalan (*Driving*):** Badge hijau (`variant: 'success'`).
   - **Idle (*Idle*):** Badge kuning (`variant: 'warning'`).
   - **Parkir (*Parking*):** Badge netral (`variant: 'default'`).
   - **Offline (*Offline*):** Badge merah (`variant: 'danger'`).
4. **Performa Unit (`performanceMetrics.score`):** Representasi rating bintang (*1 hingga 5 bintang*) berdasarkan kestabilan sinyal, rasio idling, dan perilaku aman pengemudi.
5. **Nama Kendaraan (`vehicleName`):** Nama alias armada (misal: "Avanza Silver Unit 03").
6. **Grup Armada (`groupName`):** Nama kelompok armada internal (misal: "Logistik Jabodetabek", "Rental Fleet").
7. **Pengemudi Utama (`driverName`):** Nama driver penanggung jawab unit (atau teks "Belum Ditugaskan").
8. **Kategori Unit (`vehicleCategory`):** Tipe bodi (`truck`, `minibus`, `pickup`, `motorcycle`, `other`).
9. **Merek & Model (`brand`):** Merek pabrikan (Toyota, Isuzu, Mitsubishi, Hino, Daihatsu).
10. **Tahun Pembuatan (`year`):** Tahun produksi kendaraan.
11. **Jenis Bahan Bakar (`fuelType`):** Solar, Bensin, atau Listrik.
12. **Kapasitas Tangki (`fuelCapacity`):** Kapasitas maksimal tangki bahan bakar dalam satuan liter.
13. **IMEI Perangkat GPS (`deviceImei`):** Nomor identitas unik perangkat keras tracker yang terpasang di unit.
14. **Nomor SIM GPS (`deviceSimNumber`):** Nomor kartu seluler data M2M GPS tracker.
15. **Masa Berlaku STNK (`registrationExpiry`):** Tanggal kedaluwarsa STNK lengkap dengan penanda peringatan jika mendekati kedaluwarsa atau sudah mati pajak.
16. **Dokumen Kendaraan Lainnya:** Nomor STNK (`stnkNumber`), Nomor KIR (`kirNumber`), Nomor BPKB (`bpkbNumber`), Nomor Mesin (`engineNumber`), dan Nomor Rangka / VIN (`chassisNumber`).
17. **Odometer & Pemeliharaan:** Odometer saat ini, Km Servis Terakhir, Km Servis Berikutnya.

### Panel Filter Lanjutan (`DataTableFilterPanel`):
Pengguna dapat mengombinasikan filter multi-kriteria:
- **Filter Status Telematika:** Checkbox `Berjalan`, `Idle`, `Parkir`, `Offline`.
- **Filter Grup Armada:** Multi-pilihan grup kendaraan.
- **Filter Status Dokumen STNK:** Pilihan `Aktif`, `Segera Berakhir (< 30 hari)`, atau `Kedaluwarsa`.
- **Filter Skor Performa:** Pilihan rating `5 Bintang`, `4 Bintang`, `3 Bintang`, `2 Bintang`, atau `1 Bintang`.

### Fitur Toolbar Tambahan:
- **Pencarian Global:** Menelusuri kecocokan teks pada plat nomor, nama kendaraan, nama driver, nama grup, maupun nomor IMEI.
- **Visibilitas Kolom (*Column Visibility*):** Mengatur kolom mana saja yang ingin disembunyikan/ditampilkan untuk menyesuaikan lebar layar pengguna.
- **Ekspor Dokumen:** Mengunduh data tabel armada ke berkas Excel/CSV.
- **Tombol "Tambah Armada":** Membuka dialog formulir pendaftaran armada baru.

---

## 4. Panel Laci Detail Kendaraan (`VehicleView.tsx`)

Drawer sisi kanan yang menampilkan rincian komprehensif aset kendaraan tanpa meninggalkan konteks halaman tabel.

### Tab 1: Spesifikasi Unit
- Plat Nomor, Nama Kendaraan, Kategori Kendaraan, Merek, Tahun, Warna Kendaraan.
- Dimensi Kendaraan (Panjang x Lebar x Tinggi dalam satuan meter).
- Kapasitas Tangki Bahan Bakar (Liter) dan Estimasi Rasio Konsumsi BBM (km/L).
- Kapasitas Mesin (CC), Kecepatan Maksimal (km/h), dan Kapasitas Penumpang.
- Nomor Rangka (VIN) dan Nomor Mesin.

### Tab 2: Perangkat GPS Tracker & Sensor
- Status Konektivitas Telematika Terkini.
- Nomor IMEI Tracker dan Nomor Kartu SIM M2M.
- Merek & Tipe Perangkat GPS (misal: Teltonika FMB920, Concox GT06N).
- Tanggal Instalasi Perangkat GPS pada Kendaraan.
- Odometer Kumulatif Sistem.

### Tab 3: Dokumen & Legalitas
- Nomor STNK dan Tanggal Jatuh Tempo Pajak Tahunan / 5 Tahunan.
- Nomor BPKB dan Kepemilikan Dokumen.
- Nomor Uji KIR dan Tanggal Kedaluwarsa Uji Berkala.
- Catatan Operasional Khusus Dokumen.

### Tab 4: Metrik Performa & Servis
- Skor Performa Keseluruhan (0–100) dan Visualisasi Rating Bintang.
- Indikator Kestabilan Sinyal GPS (*Signal Stability*).
- Rasio Waktu Diam (*Idle Ratio*) dan Rasio Pelanggaran Batas Kecepatan (*Speeding Ratio*).
- Kilometer Servis Terakhir dan Estimasi Sisa Kilometer menuju Jadwal Servis Berikutnya.

### Aksi Cepat Footer Drawer:
- **Tombol "Lacak Kendaraan" (*Track Vehicle*):** Mengarahkan navigasi langsung ke `/tracking` untuk melihat posisi langsung kendaraan di peta.
- **Tombol "Ubah Data" (*Edit*):** Menutup drawer dan langsung membuka form pengeditan data kendaraan.

---

## 5. Formulir Pendaftaran & Penyuntingan (`VehicleForm.tsx`)

Formulir dialog modal untuk menambah armada baru atau menyunting data armada existing. Dilengkapi validasi skema Zod (`getVehicleFormSchema`):

### Bidang Input Formulir:
1. **Identitas Utama:**
   - Plat Nomor (Wajib diisi, format plat polisi Indonesia, otomatis huruf besar).
   - Nama Kendaraan (Wajib diisi).
   - Kategori Kendaraan (Dropdown: Truk, Minibus, Pickup, Sepeda Motor, Lainnya).
   - Merek & Tahun Pembuatan.
   - Warna Kendaraan & Jenis Bahan Bakar (Solar, Bensin, Listrik).
2. **Penugasan Organisasi:**
   - Grup Armada (Wajib dipilih).
   - Pengemudi Utama (Opsional, dipilih dari master `driverService`).
3. **Hardware GPS:**
   - IMEI GPS & Nomor SIM GPS.
   - Merek & Tipe GPS serta Tanggal Instalasi.
4. **Legalitas & Spesifikasi Teknis:**
   - Nomor STNK, Tanggal Kedaluwarsa STNK.
   - Nomor BPKB, Nomor KIR.
   - Nomor Mesin & Nomor Rangka / VIN.
   - Kapasitas Tangki BBM, Kapasitas Mesin (CC), Kapasitas Penumpang.
   - Odometer Awal, Km Servis Terakhir, Km Servis Berikutnya.
   - Catatan Tambahan.

---

## 6. Dialog Pemilihan Armada Reusable (`VehicleSelectionDialog.tsx`)

Komponen dialog modal khusus yang disediakan oleh modul CORE untuk dikonsumsi oleh modul bisnis lain:
- **Konsumen:** Modul **Rental** (saat mendaftarkan kendaraan ke inventaris armada rental) dan Modul **Logistik** (saat menetapkan kendaraan ke jadwal pengiriman).
- **Fitur Dialog:**
  - Menampilkan daftar kendaraan CORE yang memenuhi kriteria ketersediaan.
  - Pencarian cepat berdasarkan plat nomor, jenis unit, atau grup.
  - Filter grup armada.
  - Pemilihan satu klik (*single-click selection*) yang mengembalikan objek data `Vehicle` lengkap ke pemanggil.

---

## 7. Model Data Teknis (`Vehicle`)

```ts
export type VehicleStatus = 'driving' | 'idle' | 'parking' | 'offline';
export type VehicleCategory = 'truck' | 'minibus' | 'pickup' | 'motorcycle' | 'other';
export type FuelType = 'solar' | 'bensin' | 'listrik';

export interface VehiclePerformanceMetrics {
  score: number;
  idleRatio: number;
  activeHours: number;
  speedingRatio: number;
  signalStability: number;
}

export interface Vehicle {
  id: string;                     // Format: veh-xxx
  plateNumber: string;            // Contoh: "B 9027 PU"
  vehicleName: string;            // Contoh: "Isuzu Giga Box 01"
  vehicleCategory: VehicleCategory;
  brand: string;
  year: number;
  fuelType: FuelType;
  groupId: string;
  groupName: string;
  driverId: string | null;
  driverName: string | null;
  deviceImei: string | null;
  deviceSimNumber?: string | null;
  status: VehicleStatus;
  lastUpdate: string;             // ISO 8601
  speed: number;
  course: number;
  odometer: number;               // km
  performanceMetrics?: VehiclePerformanceMetrics;
  lastServiceKm: number;
  nextServiceKm: number;
  registrationExpiry: string;    // YYYY-MM-DD
  passengerCapacity?: number;
  color?: string;
  fuelCapacity?: number;          // liter
  notes?: string;
  assetNumber?: string;
  dimLength?: number;             // meter
  dimWidth?: number;              // meter
  dimHeight?: number;             // meter
  fuelRatio?: number;             // km/L
  maxSpeed?: number;              // km/h
  stnkNumber?: string;
  kirNumber?: string;
  bpkbNumber?: string;
  engineNumber?: string;
  chassisNumber?: string;
  engineCapacity?: number;        // CC
}
```

---

## 8. Aturan Arsitektur & Batasan Bisnis

1. **CORE Adalah Single Source of Truth:**
   Modul vertikal (Rental / Logistik) tidak diizinkan menduplikasi field fisik kendaraan (seperti plat nomor, nomor mesin, atau merk) di tabel mereka sendiri. Modul bisnis hanya menyimpan `vehicleId` sebagai referensi asing (*foreign reference*).
2. **Kemandirian Navigasi Tracking:**
   Tombol "Lacak Kendaraan" menggunakan `trackingNavigationService.navigateToTracking(router, { mode: 'live', vehicleId: vehicle.id })`. Rute URL tujuan tetap bersih `/tracking` tanpa query string kotor.
3. **Penyelarasan Desain:**
   Formulir menggunakan `@adatrack/ui` Dialog, Button, Badge, dan Input. Tabel menggunakan `@adatrack/ui` DataTable.
