# TASK-01 — HALAMAN MASTER PELANGGAN (CUSTOMERS)

**Halaman/Menu:** Pelanggan (`/rental/customers`)  
**Status:** COMPLETED  
**Domain:** Rental (Customer Subdomain)  
**Label UI:** Pelanggan (Customers)  
**Title Dokumen:** `Pelanggan Rental - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/modules/rental/customers/CustomersFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Pelanggan (`/rental/customers`) berfungsi sebagai **Single Source of Truth (SSoT) master database seluruh penyewa kendaraan** pada platform ADATRACK Rental. Halaman ini bertanggung jawab atas registrasi legalitas penyewa (baik perorangan maupun perusahaan), verifikasi dokumen identitas, pemeliharaan riwayat kontak, dan menjadi fondasi utama seluruh transaksi reservasi (Booking) dan perjanjian sewa (Contract).

### Ringkasan Kemampuan Utama:
1. **Registrasi Pelanggan Berbasis Tipe Entitas:**
   - **Perorangan (*INDIVIDUAL*):** Mengelola dokumen identitas personal: Nomor Induk Kependudukan (NIK/KTP) dan Surat Izin Mengemudi (SIM A/B) yang sah.
   - **Perusahaan (*COMPANY*):** Mengelola dokumen legalitas korporasi: Nomor Pokok Wajib Pajak (NPWP), Nama Kontak Penanggung Jawab (*Person in Charge / PIC*), serta nomor telepon langsung PIC.
2. **Pencarian Cepat & Filter Status:** Menyediakan pencarian teks instan (berdasarkan nama pelanggan, kode pelanggan, email, nomor telepon, atau NIK/NPWP) serta pemfilteran status (`ACTIVE`, `INACTIVE`) dan tipe pelanggan (`INDIVIDUAL`, `COMPANY`).
3. **Pemeriksaan Profil Cepat (*Detail Drawer*):** Menyediakan laci detail samping (`CustomerView`) untuk memeriksa profil lengkap pelanggan, alamat domisili/kantor, kontak, dan riwayat penyewaan tanpa meninggalkan halaman tabel.
4. **Pencegahan Redundansi Data (SSoT):** Menjadi acuan tunggal data penyewa bagi modul transaksi. Modul Booking dan Kontrak hanya menyimpan referensi `customerId` dan dilarang menduplikasi data master penyewa.
5. **Konfirmasi Penghapusan Aman:** Menyediakan mekanisme proteksi konfirmasi secara ketat menggunakan komponen global sebelum pelanggan dihapus dari sistem.

---

## 2. Struktur Antarmuka dan Alur Kerja Pengguna

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [🔍 Cari Nama / Kode / Telepon / Email]  [🏷 Filter (2)]  [+ Tambah Pelanggan] │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Master Pelanggan:                                           │
│  [Aksi] | Pelanggan          | Kode      | Tipe   | Kontak   | Status │
│  ───────┼────────────────────┼───────────┼────────┼──────────┼────────┤
│   [👁]  | PT MAJU LOGISTIK   | CUST-001  | 🏢 CPY | 0812...  | 🟢 AKT │
│   [👁]  | BUDI SANTOSO       | CUST-002  | 👤 IND | 0878...  | 🟢 AKT │
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik tombol [👁] / Nama Pelanggan)                   ▼ (Klik [+ Tambah Pelanggan])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Drawer Detail: CustomerView  │              │ Modal Form: CustomerForm     │
│ • Profil & Kontak Pelanggan  │              │ • Pilihan Tipe: IND vs CPY   │
│ • Tipe IND: NIK & No SIM     │              │ • Nama Lengkap & Kode        │
│ • Tipe CPY: NPWP & Info PIC  │              │ • Telepon, Email, Alamat     │
│ • Alamat & Kota Operasional  │              │ • Input Dinamis sesuai Tipe  │
│ [Tombol: Edit / Tutup]       │              │ [Tombol: Simpan / Batal]     │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`CustomerTable.tsx`:**
  - Dibangun menggunakan fondasi `@adatrack/ui` `DataTable`.
  - **Kolom Data:**
    - `actions` (Pinned Kiri): Tombol ikon mata (`Eye`) untuk membuka drawer detail.
    - `name` (*Customer Name*): Nama pelanggan (klik membuka detail).
    - `code` (*Customer Code*): Kode unik pelanggan (contoh: `CUST-001`).
    - `type` (*Customer Type*): Badge tipe entitas `INDIVIDUAL` atau `COMPANY`.
    - `contact`: Gabungan nomor telepon dan email.
    - `pic`: Nama dan telepon PIC (khusus tipe perusahaan).
    - `address`: Alamat domisili/kantor dan kota.
    - `status`: Badge status `ACTIVE` (Hijau) atau `INACTIVE` (Abu-abu).
  - **Filter Drawer (`DataTableFilterPanel`):**
    - Filter Tipe: `INDIVIDUAL`, `COMPANY`.
    - Filter Status: `ACTIVE`, `INACTIVE`.
- **`CustomerView.tsx`:**
  - Drawer sisi kanan menampilkan ringkasan profil pelanggan.
  - Untuk perorangan: Menampilkan nomor NIK/KTP dan nomor SIM.
  - Untuk perusahaan: Menampilkan nomor NPWP, nama PIC, dan kontak PIC.
  - Menampilkan alamat lengkap, stempel waktu pendaftaran, dan tombol aksi ubah (*Edit*).
- **`CustomerForm.tsx`:**
  - Formulir utama pengisian data pelanggan, beradaptasi secara dinamis antara tipe entitas (Perorangan/Perusahaan).
- **`ConfirmDialog` (Global dari `@adatrack/ui`):**
  - Menggantikan implementasi dialog lokal untuk peringatan sebelum penghapusan data secara permanen. Menampilkan peringatan tegas jika pengguna hendak menghapus data pelanggan.

---

## 4. Struktur Direktori & File

Proyek memisahkan antara bagian **URL Routing**, **Features**, dan **Data/Mockups**.

### A. Routing (Next.js App Router)
Berada di `apps/business/src/app/(modules)/rental/customers/`. Bertugas memetakan URL ke komponen:
- `page.tsx` → URL `/rental/customers` (Daftar Pelanggan)
- `create/page.tsx` → URL `/rental/customers/create` (Form Penambahan)
- `edit/page.tsx` → URL `/rental/customers/edit` (Form Penyuntingan, dengan ID dikelola via localStorage agar URL bersih)

### B. Features & Components
Berada di `apps/business/src/features/modules/rental/customers/`. Menyimpan komponen visual dan logika UI:
- `CustomersFeature.tsx` (Root/gabungan tabel, filter, fungsi Hapus)
- `CustomerCreateFeature.tsx` (Layout khusus halaman tambah)
- `CustomerEditFeature.tsx` (Layout khusus halaman sunting)
- `i18n.ts` (Terjemahan antarmuka spesifik modul pelanggan)
- `components/CustomerTable.tsx`, `CustomerForm.tsx`, `CustomerView.tsx`
- `types/customer.ts` (Definisi tipe data UI)

### C. Data Layer & Mockups
Berada di `apps/business/src/data/modules/rental/`. Bertugas sebagai mesin data di balik UI:
- **Mockup Data:** `mock/customers.ts` (Kumpulan data dummy awal/database bayangan).
- **Repositories:** `repositories/customerRepository.ts` (Logika baca/tulis/hapus memanipulasi *mock array*).
- **Services:** `services/customerService.ts` (Menjembatani pemanggilan dari komponen UI ke repository).

---

## 5. Model Data Teknis (`Customer`)

```ts
export type CustomerType = 'INDIVIDUAL' | 'COMPANY';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE';

export interface BaseCustomer {
  id: string;                    // Format: cust-xxx
  code: string;                  // Format: CUST-xxx
  name: string;
  type: CustomerType;
  email: string;
  phone: string;
  address: string;
  city?: string;
  status: CustomerStatus;
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}

export interface IndividualCustomer extends BaseCustomer {
  type: 'INDIVIDUAL';
  nik: string;                   // Nomor KTP (16 digit)
  sim: string;                   // Nomor SIM A/B
}

export interface CompanyCustomer extends BaseCustomer {
  type: 'COMPANY';
  npwp: string;                  // Nomor Pokok Wajib Pajak Perusahaan
  picName: string;               // Nama Penanggung Jawab
  picPhone: string;              // Telepon Penanggung Jawab
}

export type Customer = IndividualCustomer | CompanyCustomer;
```

---

## 6. Status Verifikasi & Hasil

- **Status:** COMPLETED
- **Verifikasi:** Seluruh alur pendaftaran, pemilihan tipe individu vs korporasi, pemfilteran data, drawer rincian, perbaikan route edit URL bersih, dan konfirmasi hapus menggunakan UI Toaster telah diuji dan berjalan normal tanpa *error rendering* SSR pada Next.js.
