# TASK-02 — HALAMAN KATEGORI TARIF RENTAL (PRICING CATEGORY)

**Halaman/Menu:** Kategori Tarif (`/rental/pricing-category`)  
**Status:** COMPLETED  
**Domain:** Rental (Pricing Subdomain)  
**Label UI:** Kategori Tarif (Pricing Category)  
**Title Dokumen:** `Kategori Tarif Rental - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/modules/rental/pricing-category/PricingCategoryFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Kategori Tarif (`/rental/pricing-category`) berfungsi sebagai **pusat standardisasi skema harga sewa armada rental secara terstruktur, transparan, dan terotomasi**. Halaman ini menetapkan struktur harga bertingkat untuk tiap kelas kendaraan, mengelola alokasi armada ke dalam kelas tarif, serta memberikan fleksibilitas melalui penetapan tarif khusus (*custom rate override*) untuk kendaraan tertentu.

### Ringkasan Kemampuan Utama:
1. **Pengelompokan Kelas Tarif Kendaraan:** Mengelompokkan armada sewa ke dalam kategori harga yang jelas (misalnya: *City Car Hemat*, *MPV Standar Keluarga*, *Compact SUV*, *Luxury Sedan*, *Commercial Van/Blind Van*).
2. **Struktur Tarif Bertingkat (*Tiered Rates*):** Menetapkan harga sewa per periode:
   - **Tarif Per Jam (*Hourly Rate*):** Harga sewa dasar per jam.
   - **Tarif Harian (*Daily Rate*):** Harga sewa dasar per 24 jam.
   - **Paket Sewa (*Rental Packages*):** Kumpulan durasi hari dengan harga paket yang spesifik (misal: paket 7 hari, 15 hari, 30 hari).
   - **Uang Jaminan (*Security Deposit*):** Nominal deposit wajib yang ditahan selama masa sewa sebagai proteksi risiko kerusakan atau tilang elektronik.
3. **Penugasan Armada ke Kategori Tarif (`PricingVehicleAssignmentDialog`):** Menautkan unit-unit armada rental ke kategori tarif yang sesuai.
4. **Penetapan Tarif Khusus (*Custom Rate Override*):** Menyediakan mekanisme penyesuaian harga khusus per unit kendaraan tanpa mengubah standar kategori (misalnya unit tahun pembuatan baru atau unit modifikasi audio/chiller).
5. **Mesin Resolusi Harga Pemesanan (`resolveVehicleRate`):** Menyediakan kalkulator harga otomatis dengan hierarki prioritas (*Override Unit → Kategori Standar → Error*) yang dipanggil saat pembuatan Booking untuk mengunci snapshot harga transaksi.

---

## 2. Struktur Antarmuka dan Alur Interaksi

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [🔍 Cari Kategori Tarif...]       [+ Tambah Kategori Tarif]           │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Kategori Tarif Rental:                                      │
│  Kategori Tarif| Deskripsi    | Per Jam  | Harian     | Jumlah Paket| Deposit | Kendaraan | Status │
│  ──────────────┼──────────────┼──────────┼────────────┼─────────────┼─────────┼───────────┼────────┤
│  MPV Standar   | MPV Keluarga | Rp 50rb  | Rp 450.000 | 3 Paket     | Rp 1jt  | 14 unit   | Aktif  │
│  City Car      | Mobil Kota   | Rp 40rb  | Rp 350.000 | 3 Paket     | Rp 500rb| 8 unit    | Aktif  │
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik baris kategori)                                 ▼ (Klik [+ Tambah])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Detail: PricingCategoryView  │              │ Drawer: PricingCategoryForm  │
│ • Informasi Kategori & Status│              │ • Nama Kategori & Deskripsi  │
│ • Struktur Tarif & Deposit   │              │ • Status Aktif/Nonaktif      │
│ • Daftar Kendaraan           │              │ • Tarif Per Jam (Hourly)     │
│ [+ Kelola Kendaraan]         │              │ • Tarif Harian (Daily)       │
│                              │              │ • Daftar Paket Sewa          │
│                              │              │ • Deposit Wajib              │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`PricingCategoryTable.tsx`:**
  - Tabel data berbasis `@adatrack/ui` `DataTable`.
  - **Kolom Data:** Kategori Tarif, Deskripsi, Harian, Mingguan, Bulanan, Deposit, Kendaraan (*Assigned Vehicles Count*), Status. Mendukung sistem *multilingual* (i18n).
- **`PricingCategoryView.tsx`:**
  - Tampilan Detail (Drawer Samping) yang merangkum tarif default kategori beserta daftar lengkap armada rental yang dinaungi.
  - Setiap baris kendaraan di dalam drawer menampilkan plat nomor, tipe, nama kendaraan, dan merek.
  - Tombol **"+ Kelola"** untuk membuka *form assignment* kendaraan.
  - Tombol aksi (ikon tong sampah) untuk mengeluarkan kendaraan dari kategori.
- **`PricingCategoryForm.tsx`:**
  - Drawer form untuk menambah kategori tarif baru atau menyunting kategori yang ada (Nama Kategori Tarif, Status, Deskripsi, Tarif Harian, Tarif Mingguan, Tarif Bulanan, Deposit).
- **`PricingCategoryAssignmentForm.tsx`:**
  - Dialog modal yang menampilkan daftar armada rental yang tersedia, lengkap dengan fitur pencarian dan *checkbox* untuk menugaskan banyak unit sekaligus ke dalam kategori tarif (*batch assignment*).

---

## 4. Struktur Direktori & File

Proyek memisahkan antara bagian **URL Routing**, **Features**, dan **Data/Mockups**.

### A. Routing (Next.js App Router)
Berada di `apps/business/src/app/(modules)/rental/pricing-category/`. Bertugas memetakan URL ke komponen:
- `page.tsx` → URL `/rental/pricing-category` (Daftar Kategori Tarif)
- `create/page.tsx` → URL `/rental/pricing-category/create` (Form Penambahan)
- `edit/page.tsx` → URL `/rental/pricing-category/edit` (Form Penyuntingan)

### B. Features & Components
Berada di `apps/business/src/features/modules/rental/pricing-category/`. Menyimpan komponen visual dan logika UI:
- `PricingCategoryFeature.tsx` (Root/gabungan tabel, filter, fungsi Hapus)
- `PricingCategoryCreateFeature.tsx` (Layout khusus halaman tambah)
- `PricingCategoryEditFeature.tsx` (Layout khusus halaman sunting)
- `i18n.ts` (Terjemahan antarmuka spesifik modul kategori tarif)
- `components/PricingCategoryTable.tsx`, `PricingCategoryForm.tsx`, `PricingCategoryView.tsx`, `PricingCategoryAssignmentForm.tsx`
- `types/pricing.ts` (Definisi tipe data UI)

### C. Data Layer & Mockups
Berada di `apps/business/src/data/modules/rental/`. Bertugas sebagai mesin data di balik UI:
- **Mockup Data:** `mock/pricing.ts` (Kumpulan data dummy awal/database bayangan).
- **Repositories:** `repositories/pricingRepository.ts` (Logika baca/tulis/hapus memanipulasi *mock array*).
- **Services:** `services/pricingService.ts` (Menjembatani pemanggilan dari komponen UI ke repository).

---

## 5. Mesin Resolusi Harga (`resolveVehicleRate`)

Saat modul pemesanan (Booking) memilih kendaraan, sistem memanggil mesin resolusi harga pada `pricingService.ts`:

```text
                      [ Mulai Resolusi Tarif ]
                                 │
                                 ▼
               Apakah unit memiliki Custom Override?
                                 │
                 ┌───────────────┴───────────────┐
             YA  │                               │ TIDAK
                 ▼                               ▼
     Gunakan Tarif Khusus               Apakah unit memiliki
       (Custom Rate)                       Kategori Tarif?
                                                 │
                                 ┌───────────────┴───────────────┐
                             YA  │                               │ TIDAK
                                 ▼                               ▼
                        Gunakan Tarif Kategori            Kembalikan Error:
                          (Category Rate)              "Belum Ditetapkan Tarif"
```

---

## 6. Model Data Teknis (`Pricing`)

Model data ini mengacu pada desain database yang didefinisikan pada `database-design.md` untuk tabel `rental_pricing_categories` dan `rental_vehicle_profiles`.

```ts
export type RentalRateType = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type RentalVehicleStatus = 'READY' | 'RESERVED' | 'RENTED' | 'MAINTENANCE';

export interface RentalPricingCategory {
  id: string;                    // UUID
  code: string;                  // Format: CAT-xxx
  name: string;                  // e.g. "MPV Standar"
  description?: string | null;   // Deskripsi
  rateHourly: number;            // Tarif per jam
  rateDaily: number;             // Tarif per hari
  hourlyDeposit: number;         // Uang jaminan sewa per jam
  dailyDeposit: number;          // Uang jaminan sewa harian
  packages: {                    // Daftar paket sewa
    id: string;
    name: string;
    durationDays: number;
    price: number;
    deposit: number;
  }[];
  status: 'ACTIVE' | 'INACTIVE'; // Status aktif/non-aktif
  // Atribut UI tambahan
  assignedVehicleCount?: number; 
}

export interface RentalVehicleProfile {
  id: string;                    // UUID
  vehicleId: string;             // SSoT ke core_vehicles.id
  categoryId: string;            // FK ke rental_pricing_categories.id
  status: RentalVehicleStatus;
  currentOdometer: number;
}
```

---

## 7. Status Verifikasi & Hasil

- **Status:** COMPLETED
- **Verifikasi:** Seluruh alur pembuatan kategori, penugasan armada, penetapan custom override, dan resolusi kalkulasi tarif pada pemesanan booking telah diuji dan bekerja sesuai spesifikasi.
