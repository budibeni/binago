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
   - **Tarif Harian (*Daily Rate*):** Harga sewa dasar per 24 jam.
   - **Tarif Mingguan (*Weekly Rate*):** Paket sewa 7 hari dengan potongan harga ekonomis.
   - **Tarif Bulanan (*Monthly Rate*):** Paket sewa jangka panjang 30 hari untuk pelanggan korporasi/individu.
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
│  Nama Kategori | Tarif Harian | Mingguan   | Bulanan     | Deposit | Armada│
│  ──────────────┼──────────────┼────────────┼─────────────┼─────────┼───────┤
│  MPV Standar   | Rp 450.000   | Rp 2.800rb | Rp 9.500rb  | Rp 1jt  | 14    │
│  City Car      | Rp 350.000   | Rp 2.100rb | Rp 7.000rb  | Rp 500rb| 8     │
│  Luxury Sedan  | Rp 1.500.000 | Rp 9.000rb | Rp 32.000rb | Rp 3jt  | 4     │
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik baris kategori)                                 ▼ (Klik [+ Tambah])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Drawer Detail Kategori Tarif │              │ Modal: PricingCategoryForm   │
│ • Struktur Tarif & Deposit   │              │ • Nama Kategori & Deskripsi  │
│ • Daftar Armada Terdaftar    │              │ • Tarif Harian (Daily)       │
│ • Indikator Custom Override  │              │ • Tarif Mingguan (Weekly)    │
│ [+ Tugaskan Armada]          │              │ • Tarif Bulanan (Monthly)    │
│ [⚙ Set Tarif Khusus Unit]    │              │ • Nominal Deposit Wajib      │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`PricingCategoryTable.tsx`:**
  - Tabel data berbasis `@adatrack/ui` `DataTable`.
  - **Kolom Data:** Nama Kategori, Deskripsi, Tarif Harian, Tarif Mingguan, Tarif Bulanan, Uang Jaminan (Deposit), Jumlah Armada Terdaftar (*Assigned Vehicles Count*), Status, dan Tombol Aksi (Ubah & Hapus).
- **`PricingCategoryDetailDrawer.tsx`:**
  - Drawer sisi kanan yang menampilkan rincian tarif kategori beserta daftar lengkap armada rental yang bernaung di bawah kategori tersebut.
  - Setiap baris kendaraan di dalam drawer menampilkan plat nomor, merk/model, dan apakah unit menggunakan tarif standar atau tarif khusus (*Custom Override*).
  - Tombol **"Tugaskan Armada"** untuk memunculkan modal alokasi armada.
  - Tombol **"Set Tarif Khusus"** untuk mengatur harga override pada unit tertentu.
- **`PricingCategoryForm.tsx`:**
  - Dialog modal untuk menambah kategori tarif baru atau menyunting kategori yang ada (Nama, Deskripsi, Tarif Harian, Tarif Mingguan, Tarif Bulanan, Nominal Deposit).
- **`PricingVehicleAssignmentDialog.tsx`:**
  - Dialog modal yang menampilkan daftar armada rental yang belum memiliki kategori tarif, lengkap dengan pencarian dan checkbox untuk menugaskan banyak unit sekaligus (*batch assignment*).
- **`PricingVehicleCustomRateDialog.tsx`:**
  - Dialog modal untuk menetapkan tarif override pada unit kendaraan terpilih.

---

## 4. Mesin Resolusi Harga (`resolveVehicleRate`)

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

## 5. Model Data Teknis (`Pricing`)

```ts
export type RentalRateType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface RentalRate {
  daily: number;                 // Tarif per hari
  weekly: number;                // Tarif paket 7 hari
  monthly: number;               // Tarif paket 30 hari
  deposit: number;               // Uang jaminan sewa
}

export interface RentalPricingCategory {
  id: string;                    // Format: prc-xxx
  name: string;                  // e.g. "MPV Standar"
  description?: string;
  rates: RentalRate;
  assignedVehicleCount: number;  // Jumlah unit terdaftar
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface VehicleRateOverride {
  vehicleId: string;             // Referensi ke RentalVehicle
  categoryId: string;
  rates: Partial<RentalRate>;    // Nilai tarif yang ditimpa
  reason?: string;               // Alasan tarif khusus
}
```

---

## 6. Service & Repository Layer

- **`pricingService.ts`:**
  - `getCategories()`: Mengambil seluruh kategori tarif aktif.
  - `createCategory(data)` / `updateCategory(id, data)` / `deleteCategory(id)`: Operasi CRUD kategori.
  - `assignVehiclesToCategory(categoryId, vehicleIds[])`: Menugaskan batch armada ke kategori tarif.
  - `setVehicleRateOverride(vehicleId, overrideData)`: Menetapkan tarif khusus kendaraan.
  - `resolveVehicleRate(vehicleId, rateType)`: Menghasilkan snapshot tarif kalkulasi booking.

---

## 7. Status Verifikasi & Hasil

- **Status:** COMPLETED
- **Verifikasi:** Seluruh alur pembuatan kategori, penugasan armada, penetapan custom override, dan resolusi kalkulasi tarif pada pemesanan booking telah diuji dan bekerja sesuai spesifikasi.
