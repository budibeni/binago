# TASK-03 — HALAMAN ARMADA KENDARAAN RENTAL (RENTAL VEHICLES)

**Halaman/Menu:** Kendaraan Rental (`/rental/vehicles`)  
**Status:** COMPLETED  
**Domain:** Rental (Fleet Subdomain)  
**Label UI:** Kendaraan Rental (Rental Vehicles)  
**Title Dokumen:** `Armada Rental - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/modules/rental/vehicles/RentalVehiclesFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Kendaraan Rental (`/rental/vehicles`) berfungsi sebagai **pusat pengelolaan dan pemantauan ketersediaan seluruh armada yang dialokasikan khusus untuk bisnis sewa rental**. Halaman ini memperkaya master data kendaraan CORE (*Single Source of Truth*) dengan atribut operasional komersial sewa, status kesiapan sewa, histori kontrak berjalan, serta integrasi pelacakan GPS langsung.

### Ringkasan Kemampuan Utama:
1. **Pendaftaran Armada dari CORE (SSoT):** Mengalokasikan unit kendaraan dari master CORE `Vehicle` ke inventaris rental melalui dialog pemilih armada (`VehicleSelectionDialog`), sehingga data fisik (plat nomor, nomor mesin, rangka/VIN, merk, model) tetap terpusat dan tidak pernah diduplikasi.
2. **Monitoring Status Kesiapan Armada (*Rental Fleet Availability*):**
   - **Siap Sewa (*READY*):** Kendaraan prima, bersih, dan tersedia untuk dipesan pelanggan.
   - **Dipesan (*RESERVED*):** Kendaraan telah dipesan dalam booking terkonfirmasi dan menunggu serah terima.
   - **Sedang Disewa (*RENTED*):** Kendaraan sedang berada di tangan penyewa di bawah kontrak aktif.
   - **Perawatan (*MAINTENANCE*):** Kendaraan sedang servis berkala di bengkel atau dalam perbaikan fisik.
   - **Tidak Tersedia (*UNAVAILABLE*):** Kendaraan ditarik sementara dari operasional komersial.
3. **Kartu Statistik Ketersediaan Cepat (*PanelShell Metrics*):** Menampilkan ringkasan jumlah armada per status (Total Armada, Siap Sewa, Sedang Disewa, Dipesan, Perawatan) di bagian atas halaman.
4. **Pemeriksaan Kelengkapan & Dokumen Kendaraan:** Memantau ketersediaan perlengkapan unit (STNK asli, kunci cadangan, dongkrak, toolkit) sebelum diserahkan kepada penyewa.
5. **Navigasi Langsung ke Pemantauan Spasial (`/tracking`):** Tombol "Buka Lokasi" langsung memindahkan tampilan ke halaman pelacakan live GPS dengan menyuntikkan payload `VehicleContext` (menampilkan nomor kontrak, nama penyewa, dan tanggal sewa pada popup peta) tanpa mengubah query string URL.
6. **Bilah Aksi Massal (*Bottom Multi-Select Action Bar*):** Memungkinkan staf operasional memilih beberapa armada sekaligus untuk pemantauan batch atau perubahan status.

---

## 2. Struktur Antarmuka dan Alur Kerja Pengguna

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Statistik Armada:                                                     │
│  [Total: 32 Unit]  [Siap Sewa: 18]  [Disewa: 10]  [Dipesan: 3]  [Servis: 1] │
├────────────────────────────────────────────────────────────────────────┤
│  [🔍 Cari Plat/Model/Kategori...]  [🏷 Filter Status]  [+ Daftarkan Armada] │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Armada Rental:                                              │
│  [Aksi] | Plat Nomor | Model Kendaraan | Status   | Kategori | Tarif/Hari │
│  ───────┼────────────┼─────────────────┼──────────┼──────────┼────────────┤
│   [👁]  | B 1234 ABC | Toyota Avanza   | 🟢 READY | MPV Std  | Rp 450.000 │
│   [👁]  | B 5678 DEF | Mitsubishi Xp   | 🔵 RENTED| MPV Std  | Rp 450.000 │
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik tombol [👁] / Plat Nomor)                       ▼ (Klik [+ Daftarkan Armada])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Drawer Detail: RentalVehicle │              │ Modal: RentalVehicleForm     │
│ • Status Sewa & Kontrak Aktif│              │ • Pilih Unit dari Master CORE│
│ • Spesifikasi Fisik Master   │              │ • Pilih Kategori Tarif       │
│ • Kelengkapan Unit & Dokumen │              │ • Tentukan Status Awal       │
│ • Odometer Terkini           │              │ • Checklist Kelengkapan Unit │
│ [Tombol: Buka Lokasi di Peta]│              │ [Tombol: Simpan / Batal]     │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`RentalVehicleTable.tsx`:**
  - Tabel data armada rental berbasis `@adatrack/ui` `DataTable`.
  - **Kolom Data:** Plat Nomor, Model Kendaraan, Status Rental (Badge READY hijau, RESERVED kuning, RENTED biru, MAINTENANCE oranye, UNAVAILABLE merah), Kategori Tarif, Tarif Harian, Transmisi (Manual/Matic), Lokasi Pool, Odometer Terkini, dan Menu Aksi.
  - **Aksi Baris:**
    - `Detail`: Membuka drawer rincian unit.
    - `Buka Lokasi`: Menavigasi langsung ke `/tracking`.
    - `Edit`: Membuka form penyuntingan profil rental.
    - `Nonaktifkan`: Membuka modal konfirmasi disable unit.
- **`RentalVehicleView.tsx`:**
  - Drawer detail komprehensif menampilkan gabungan data master CORE (plat, nomor mesin, rangka, warna, bahan bakar) dan data komersial rental (kategori tarif, harga sewa, deposit, status kesiapan, riwayat kontrak).
  - Dilengkapi tombol aksi **"Buka Lokasi"** yang mengaktifkan `trackingNavigationService`.
- **`RentalVehicleForm.tsx`:**
  - Modal form pendaftaran unit rental baru dari master CORE `Vehicle` atau penyuntingan profil operasional unit sewa.
- **`RentalVehicleDisableDialog.tsx`:**
  - Modal dialog konfirmasi penonaktifan unit dari operasional rental.

---

## 4. Model Data Teknis (`RentalVehicleProfile`)

```ts
export type RentalVehicleStatus = 'READY' | 'RESERVED' | 'RENTED' | 'MAINTENANCE' | 'UNAVAILABLE';

export interface RentalVehicleProfile {
  id: string;                    // Format: rvp-xxx
  vehicleId: string;             // Foreign Key ke CORE Vehicle (SSoT)
  categoryId?: string | null;    // Foreign Key ke RentalPricingCategory
  status: RentalVehicleStatus;
  currentOdometer: number;       // Odometer terkini
  rateOverrideDaily?: number | null;   // Timpa harga master (harian)
  rateOverrideWeekly?: number | null;  // Timpa harga master (mingguan)
  rateOverrideMonthly?: number | null; // Timpa harga master (bulanan)
  
  // Operational fields
  currentBookingId?: string | null;     // Booking aktif jika status RESERVED
  currentContractId?: string | null;    // Kontrak aktif jika status RENTED
  fuelLevelPercent?: number | null;     // Level BBM saat ini (0-100%)
  condition?: 'GOOD' | 'MINOR_DAMAGE' | 'NEEDS_REPAIR'; // Kondisi kendaraan
  conditionNotes?: string | null;
  completenessChecklist: {
    stnkOriginal: boolean;
    spareKey: boolean;
    jackAndTools: boolean;
    spareTire: boolean;
    firstAidKit: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Objek gabungan tampilan (Enriched View Model)
export interface RentalVehicleViewModel {
  profile: RentalVehicleProfile;
  coreVehicle: Vehicle;          // Data spesifikasi teknis dari CORE
  pricingCategoryName?: string;
  dailyRate: number;
}
```

---

## 5. Service Layer & Integrasi CORE

- **`vehicleService.ts` (Modul Rental):**
  - Mengambil data profil armada rental dan menggabungkannya (*enrich*) dengan spesifikasi fisik master kendaraan dari `coreVehicleService`.
  - Mengirimkan payload `VehicleContext` ke `sessionStorage` saat tombol "Buka Lokasi" diklik sehingga popup di `/tracking` menampilkan label "RENTAL", nomor kontrak, dan tanggal masa sewa.
  - Memperbarui status armada saat terjadi transaksi Booking (menjadi `RESERVED`), Kontrak/Serah Terima (menjadi `RENTED`), dan Pengembalian (kembali menjadi `READY`).

---

## 6. Status Verifikasi & Hasil

- **Status:** COMPLETED
- **Verifikasi:** Alokasi armada dari CORE, visualisasi summary cards, tabel data, filter status, drawer rincian, dan integrasi navigasi bersih ke `/tracking` telah teruji dan bekerja normal.
