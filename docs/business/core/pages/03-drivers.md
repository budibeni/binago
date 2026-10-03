# HALAMAN PENGEMUDI (DRIVERS)

**Rute Aplikasi:** `/drivers`, `/drivers/[id]/edit`  
**Domain:** CORE  
**Label UI:** Pengemudi (Drivers)  
**Title Dokumen:** `Pengemudi - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/drivers/DriversFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Pengemudi (`/drivers`) merupakan **pusat manajemen sumber daya pengemudi (driver master database)** pada ADATRACK Business. Halaman ini mengelola identitas resmi pengemudi, kualifikasi lisensi izin mengemudi (SIM), penugasan kendaraan operasional, pemantauan keselamatan berkendara (*safety driving metrics*), serta riwayat kedisiplinan dan penghargaan pengemudi.

### Ringkasan Kemampuan Utama:
1. **Master Data Driver Terpusat:** Menyimpan profil lengkap pengemudi (nama, foto/avatar, nomor telepon, email, alamat domisili, nomor KTP, serta tempat dan tanggal lahir).
2. **Kepatuhan Izin Mengemudi (SIM):** Mencatat nomor SIM dan memantau tanggal kedaluwarsa masa berlaku SIM untuk memastikan pengemudi selalu memenuhi syarat hukum berkendara.
3. **Status Ketersediaan & Penugasan:** Memantau status pengemudi:
   - **Aktif (*Active*):** Siap bertugas atau sedang mengemudi.
   - **Tidak Aktif (*Inactive*):** Sedang dinonaktifkan sementara dari operasional.
   - **Cuti (*On Leave*):** Sedang mengambil cuti kerja atau izin resmi.
4. **Penugasan Unit Armada (*Vehicle Assignment*):** Memetakan relasi antara driver dengan unit kendaraan yang sedang dikemudikan (`assignedVehiclePlate`).
5. **Skor & Metrik Keselamatan Mengemudi (*Driver Behavior Scoring*):** Mengakumulasi skor keselamatan (0–100) dan metrik risiko telematika: rem mendadak (*harsh driving*), mengebut (*speeding*), mesin idle terlalu lama (*over idling*), dan mengemudi melebihi batas jam aman (*fatigue driving*).
6. **Audit Trail Riwayat Pengemudi:** Merekam jejak penugasan unit (*assignment*), catatan pelanggaran lalu lintas (*violation*), penghargaan prestasi (*achievement*), serta izin cuti (*leave*).

---

## 2. Struktur Komponen Antarmuka

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [🔍 Cari Nama / KTP / SIM / Telepon]  [🏷 Filter]  [👁 Kolom]  [+ Tambah Pengemudi] │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Master Pengemudi:                                           │
│  [Aksi] | Pengemudi      | Status  | Kendaraan  | Grup    | Performa... │
│  ───────┼────────────────┼─────────┼────────────┼─────────┼─────────────┤
│   [👁]  | Budi Santoso   | 🟢 Aktif| B 1234 ABC | Rental  | ★★★★★ (96)  │
│   [👁]  | Joko Widodo    | 🟡 Cuti | -          | Logistik| ★★★★☆ (84)  │
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik tombol [👁] / Nama Pengemudi)                   ▼ (Klik [+ Tambah Pengemudi])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Drawer Detail: DriverView    │              │ Modal Form: DriverForm       │
│ • Profil & Kontak Driver     │              │ • Nama Lengkap & No KTP      │
│ • Identitas KTP & Tanggal Lhr│              │ • No Telepon, Email, Alamat  │
│ • Nomor SIM & Masa Berlaku   │              │ • Penempatan Cabang & Grup   │
│ • Armada Ditugaskan          │              │ • No SIM & Masa Berlaku      │
│ • Skor Perilaku Mengemudi    │              │ • Tanggal Bergabung          │
│ • Riwayat Prestasi/Pelanggaran│             │ [Tombol: Simpan / Batal]     │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Tabel Pengemudi (`DriverTable.tsx`)

Tabel data berbasis `@adatrack/ui` `DataTable` yang menampilkan parameter operasional:

### Kolom Data:
1. **Aksi Pinned Kiri:** Tombol ikon mata (`Eye`) untuk membuka drawer rincian driver.
2. **Pengemudi (`colDriver`):** Menampilkan avatar foto, nama lengkap pengemudi, email, dan nomor kontak aktif.
3. **Status Ketersediaan (`colStatus`):**
   - **Aktif:** Badge hijau (`bg-success`).
   - **Tidak Aktif:** Badge abu-abu netral.
   - **Cuti:** Badge kuning oranye (`bg-warning`).
4. **Kendaraan Ditugaskan (`colVehicle`):** Plat nomor kendaraan yang sedang dioperasikan oleh driver (atau label "Belum Ditugaskan").
5. **Grup Armada (`colGroup`):** Divisi atau grup armada penempatan driver.
6. **Penempatan Cabang (`colPlacement`):** Lokasi cabang atau pool penugasan (misal: "Pool Slipi Jakarta", "Cabang Bandung").
7. **Identitas & Lisensi:**
   - Nomor KTP (`colKtp`).
   - Nomor SIM (`colLicenseNo`) dan Tanggal Kedaluwarsa SIM (`colLicenseExpiry`).
8. **Performa Mengemudi (`colPerformance`):** Skor angka (0–100) dan rating bintang 1–5.
9. **Tanggal Bergabung (`colJoinDate`):** Tanggal resmi mulai bekerja.

### Filter Panel (`DataTableFilterPanel`):
- **Filter Status:** Aktif, Tidak Aktif, Cuti.
- **Filter Grup:** Pilihan multi-grup pengemudi.
- **Filter Performa:** Pilihan rating bintang (5 Bintang s.d. 1 Bintang).

---

## 4. Drawer Detail Pengemudi (`DriverView.tsx`)

Drawer sisi kanan yang menampilkan 5 bagian data utama:
1. **Header Profil:** Foto profil/avatar, nama driver, badge status ketersediaan, rating performa bintang, nomor telepon, dan email.
2. **Identitas Diri & Kontak:** Nomor KTP, Tempat/Tanggal Lahir, Alamat Domisili, dan Tanggal Bergabung.
3. **Kualifikasi SIM:** Nomor SIM dan Tanggal Jatuh Tempo Perpanjangan SIM (dengan indikator visual jika masa berlaku SIM segera habis).
4. **Armada & Penempatan:** Kendaraan yang sedang ditugaskan dan lokasi penempatan pool kerja.
5. **Metrik Keselamatan Mengemudi (*Safety Metrics*):**
   - **Rem Mendadak (*Harsh Driving*):** Frekuensi pengereman agresif.
   - **Mengebut (*Speeding*):** Frekuensi melampaui batas kecepatan jalan.
   - **Mesin Menyala Diam (*Over Idling*):** Durasi pemborosan BBM saat parkir.
   - **Kelelahan (*Fatigue Driving*):** Durasi mengemudi terus menerus tanpa istirahat.
6. **Log Riwayat Aktivitas (*Driver History*):** Daftar kronologis penugasan unit, surat peringatan/pelanggaran, piagam penghargaan, dan catatan cuti.

---

## 5. Formulir Driver (`DriverForm.tsx`)

Formulir dialog modal untuk pendaftaran driver baru atau pengeditan data driver yang divalidasi dengan Zod (`getDriverFormSchema`):

- **Nama Lengkap:** Wajib diisi.
- **Nomor KTP:** Wajib diisi (16 digit identitas kependudukan).
- **Nomor Telepon:** Wajib diisi (format nomor telepon aktif).
- **Email & Alamat Domisili:** Opsional.
- **Tempat & Tanggal Lahir:** Tanggal lahir pengemudi.
- **Penempatan Cabang (*Placement*):** Wajib diisi.
- **Grup Armada:** Wajib dipilih.
- **Nomor SIM & Masa Berlaku SIM:** Wajib diisi.
- **Tanggal Bergabung:** Tanggal mulai aktif bekerja.

---

## 6. Model Data Teknis (`Driver`)

```ts
export type DriverStatus = 'active' | 'inactive' | 'on_leave';

export interface DriverHistory {
  id: string;
  date: string;
  type: 'assignment' | 'violation' | 'achievement' | 'leave';
  description: string;
  vehicleId?: string;
}

export interface Driver {
  id: string;
  name: string;
  avatarUrl?: string;
  phone: string;
  email: string;
  address: string;
  ktpNumber: string;
  placeOfBirth: string;
  dateOfBirth: string;       // YYYY-MM-DD
  joinDate: string;          // YYYY-MM-DD
  placement: string;         // Cabang/Pool
  groupId?: string;
  groupName?: string;
  licenseNumber: string;
  licenseExpiry: string;     // YYYY-MM-DD
  status: DriverStatus;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  performanceScore: number;  // 0 - 100
  performanceMetrics?: {
    harshDriving: number;
    speeding: number;
    overIdling: number;
    fatigueDriving: number;
  };
  history: DriverHistory[];
}
```

---

## 7. Aturan Bisnis & Integrasi

1. **Konsumsi oleh Modul Bisnis:**
   - Modul Rental dapat memilih driver dari master CORE saat paket sewa mencakup layanan pengemudi (*with driver*).
   - Modul Logistik/Transport mengalokasikan driver dari master ini ke surat jalan pengiriman.
2. **Sinkronisasi Dua Arah:**
   - Saat kendaraan di halaman `/vehicles` diberi pengemudi, relasi `assignedVehicleId` dan `assignedVehiclePlate` pada driver otomatis tersinkronisasi.
3. **Penyelarasan Desain:**
   - Menggunakan `@adatrack/ui` DataTable, Badge, Button, dan Dialog.
