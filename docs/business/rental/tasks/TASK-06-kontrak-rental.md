# TASK-06 — HALAMAN KONTRAK SEWA RENTAL (CONTRACTS)

**Halaman/Menu:** Kontrak Rental (`/rental/contracts`)  
**Status:** COMPLETED  
**Domain:** Rental (Legal & Contract Subdomain)  
**Label UI:** Kontrak Rental (Contracts)  
**Title Dokumen:** `Kontrak Rental - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/modules/rental/contracts/ContractsFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Kontrak Rental (`/rental/contracts`) berfungsi sebagai **pusat pengelolaan dokumen hukum perjanjian sewa kendaraan (*rental agreement & legal contract manager*)**. Halaman ini menerbitkan kontrak sewa multi-kendaraan dari reservasi booking yang telah disepakati, mengatur klausul syarat dan ketentuan sewa, memantau masa aktif sewa, serta menyediakan fasilitas pratinjau dan pencetakan dokumen fisik/PDF surat perjanjian sewa resmi.

### Ringkasan Kemampuan Utama:
1. **Penerbitan Kontrak dari Booking Terkonfirmasi (`BookingSelectModal`):** Mengonversi transaksi pemesanan (Booking) yang telah disepakati menjadi Kontrak Sewa resmi dengan mewariskan data pelanggan, jadwal sewa, dan seluruh unit kendaraan yang dipesan.
2. **Dukungan Multi-Armada dalam Satu Kontrak (*1 Contract → N ContractItems*):** Menampung banyak kendaraan dalam satu dokumen hukum sewa, lengkap dengan rincian nomor polisi, nomor mesin, dan tarif masing-masing unit.
3. **Penyusunan Perjanjian Berbasis Template (`templateService`):** Menggunakan template dokumen HTML WYSIWYG yang dikelola di menu Template Kontrak untuk menghasilkan redaksi surat perjanjian yang rapi dan terstandarisasi.
4. **Pratinjau & Cetak Dokumen Legalitas (`ContractPrintModal`):** Menyediakan fitur cetak langsung ke printer atau ekspor berkas PDF surat perjanjian sewa resmi dengan injeksi otomatis variabel dinamis (data perusahaan, pelanggan, daftar kendaraan, tabel biaya, dan kolom tanda tangan).
5. **Siklus Status Kontrak (*Contract Lifecycle*):**
   - **Diterbitkan (*ISSUED*):** Kontrak baru dibuat dari booking dan siap dilanjutkan ke proses serah terima armada.
   - **Aktif (*ACTIVE*):** Unit kendaraan telah diserahterimakan kepada penyewa, dan masa sewa sedang berjalan (armada berstatus `RENTED`).
   - **Selesai (*COMPLETED*):** Seluruh armada sewa telah dikembalikan dalam kondisi baik dan kontrak ditutup (selesai melalui BAST Pengembalian).
   - **Batal (*CANCELLED*):** Kontrak dibatalkan sebelum unit armada diserahterimakan.
6. **Gerbang Menuju Serah Terima & Pengembalian:** Menjadi induk alur operasional fisik untuk proses Serah Terima Armada (*Handover*) dan Pengembalian Armada (*Return*).

---

## 2. Struktur Antarmuka dan Alur Operasional

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [🔍 Cari No Kontrak / Pelanggan]  [🏷 Filter Status]  [+ Buat Kontrak Baru] │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Kontrak Rental:                                             │
│  [Aksi] | No Kontrak  | Pelanggan         | Periode Sewa | Unit | Total │
│  ───────┼─────────────┼───────────────────┼──────────────┼──────┼───────┤
│   [👁]  | CTR-2026-01 | PT MAJU LOGISTIK  | 25-30 Sep 26 | 3    | Rp 6jt│
│   [👁]  | CTR-2026-02 | BUDI SANTOSO      | 01-03 Okt 26 | 1    | Rp 1jt│
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik tombol [👁] / No Kontrak)                       ▼ (Klik [+ Buat Kontrak])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Drawer Detail: ContractView  │              │ Modal: BookingSelectModal    │
│ • Nomor Kontrak & Pelanggan  │              │ • Pilih Booking Terkonfirmasi│
│ • Masa Berlaku Sewa          │              └──────────────┬───────────────┘
│ • Tabel Armada dalam Kontrak │                             ▼
│ • Total Biaya & Deposit      │              ┌──────────────────────────────┐
│ [🖨 Cetak Surat Perjanjian] │              │ Form: ContractForm           │
│ [🚚 Lanjut Serah Terima]     │              │ • Pilih Template Surat Sewa  │
└──────────────────────────────┘              │ • Syarat & Ketentuan Tambahan│
                                              │ • Pejabat Penandatangan      │
                                              │ [Tombol: Terbitkan Kontrak]  │
                                              └──────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`ContractList.tsx`:**
  - Tabel data kontrak berbasis `@adatrack/ui` `DataTable`.
  - **Kolom Data:** Nomor Kontrak, Nama Pelanggan, Tanggal Mulai, Tanggal Selesai, Jumlah Unit Sewa, Total Nilai Kontrak, Total Deposit, Status Kontrak (Badge ISSUED, ACTIVE, COMPLETED, CANCELLED), dan Menu Aksi.
- **`BookingSelectModal.tsx`:**
  - Modal dialog untuk memilih reservasi Booking yang berstatus `CONFIRMED` untuk dijadikan kontrak resmi.
- **`ContractForm.tsx`:**
  - Formulir penerbitan kontrak: memilih template surat perjanjian sewa, memasukkan klausul syarat & ketentuan khusus, serta nama dan jabatan pihak penandatangan (pihak pertama rental & pihak kedua penyewa).
- **`ContractView.tsx`:**
  - Drawer detail lengkap menampilkan ringkasan hukum kontrak, tabel rincian seluruh kendaraan yang disewa, stempel waktu, dan tombol aksi cepat:
    - **Cetak Kontrak:** Membuka modal preview cetak surat perjanjian.
    - **Serah Terima Unit:** Mengarahkan ke formulir inspeksi serah terima armada (hanya muncul saat status `ISSUED`).
    - **Batalkan Kontrak:** Membatalkan kontrak sewa (hanya bisa dilakukan saat status `ISSUED`).
- **`ContractPrintModal.tsx`:**
  - Modal dialog pratinjau dokumen surat perjanjian sewa resmi dengan rendering HTML TipTap yang disuntikkan data kontrak, siap untuk dicetak langsung (*Ctrl+P / window.print*) atau disimpan sebagai PDF.

---

## 4. Model Data Teknis (`Contract` & `ContractItem`)

```ts
export type ContractStatus = 'ISSUED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface ContractItem {
  id: string;                    // Format: cti-xxx
  contractId: string;
  vehicleId: string;             // Referensi ke RentalVehicle (SSoT)
  plateNumber: string;
  vehicleName: string;
  brand: string;
  chassisNumber?: string;
  engineNumber?: string;
  dailyRate: number;
  subtotal: number;
  deposit: number;
  handoverCompleted: boolean;    // Status serah terima fisik
  returnCompleted: boolean;      // Status pengembalian fisik
}

export interface Contract {
  id: string;                    // Format: ctr-xxx
  contractNumber: string;        // Contoh: "CTR-2026-09-001"
  bookingId?: string;            // Referensi ke Booking asal
  customerId: string;            // Foreign Key ke Customer (SSoT)
  customerName: string;
  customerType: 'INDIVIDUAL' | 'COMPANY';
  templateId?: string;           // Referensi ke DocumentTemplate
  startDate: string;             // YYYY-MM-DD
  endDate: string;               // YYYY-MM-DD
  rentalType: 'LEPAS_KUNCI' | 'DENGAN_PENGEMUDI';
  items: ContractItem[];         // Daftar multi-armada dalam kontrak
  totalAmount: number;           // Total biaya sewa
  depositAmount: number;         // Total uang jaminan
  termsAndConditions?: string;
  signatoryCompany: string;      // Penandatangan dari pihak rental
  signatoryCustomer: string;     // Penandatangan dari pihak penyewa
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Service Layer & Integrasi Transaksi

- **`contractService.ts`:**
  - `getContracts(filters)`: Mengambil seluruh daftar kontrak sewa dengan filter status dan pencarian.
  - `createContractFromBooking(bookingId, templateId, options)`: Menerbitkan kontrak baru dari booking terkonfirmasi dan memperbarui status booking menjadi `IN_CONTRACT`.
  - `activateContract(id)`: Mengubah status kontrak menjadi `ACTIVE` saat seluruh unit telah diserahterimakan dan mengubah status unit armada rental menjadi `RENTED`.
  - `completeContract(id)`: Menutup kontrak sewa menjadi `COMPLETED` setelah seluruh unit kembali diperiksa dan mengembalikan armada ke status `READY`.
  - `printContract(id)`: Menghasilkan HTML surat perjanjian yang siap dicetak menggunakan `templateService`.
  - **Catatan:** Kontrak rental tidak dapat diedit setelah diterbitkan (ISSUED). Jika terdapat kesalahan, pengguna harus membatalkan kontrak tersebut (selama belum serah terima) dan menerbitkan ulang.

---

## 6. Status Verifikasi & Hasil

- **Status:** 
- **Verifikasi:** Seluruh alur pembuatan kontrak dari booking, multi-armada sewa, pratinjau cetak PDF surat perjanjian sewa, drawer rincian, dan transisi status sewa telah teruji dan berjalan normal.
