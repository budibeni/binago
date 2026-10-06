# TASK-04 — HALAMAN PEMESANAN RENTAL (BOOKINGS)

**Halaman/Menu:** Booking (`/rental/bookings`)  
**Status:** COMPLETED  
**Domain:** Rental (Transaction Subdomain)  
**Label UI:** Booking (Reservasi Sewa)  
**Title Dokumen:** `Pemesanan Rental - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/modules/rental/bookings/BookingsFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Pemesanan Rental (`/rental/bookings`) berfungsi sebagai **pusat reservasi dan pemesanan armada rental dengan dukungan pemesanan multi-kendaraan (*Multi-Vehicle Booking Engine*)**. Halaman ini mencatat reservasi calon penyewa, memvalidasi ketersediaan jadwal armada, menghitung kalkulasi biaya sewa otomatis, dan mengonversi pesanan terkonfirmasi menjadi dokumen kontrak sewa resmi.

### Ringkasan Kemampuan Utama:
1. **Dukungan Multi-Kendaraan (*1 Customer → 1 Booking → N BookingItems*):** Satu transaksi pemesanan dapat menaungi banyak unit kendaraan sekaligus (misalnya perusahaan menyewa 3 unit MPV dan 2 unit Blind Van dalam satu pesanan).
2. **Mesin Pengecekan Ketersediaan Jadwal (*Availability Check Engine*):** Memeriksa jadwal sewa armada rental secara otomatis untuk memastikan unit yang dipilih tidak sedang disewa atau dipesan pelanggan lain pada rentang tanggal tersebut guna mencegah *double booking*.
3. **Kalkulasi Biaya Sewa Terotomasi:**
   - Menghitung durasi hari sewa secara presisi.
   - Mengambil tarif per unit menggunakan mesin resolusi tarif `pricingService`.
   - Mengakumulasi subtotal sewa per armada, total deposit jaminan, dan grand total tagihan pemesanan.
4. **Siklus Status Pemesanan (*Booking Lifecycle*):**
   - **Draf (*DRAFT*):** Pemesanan awal yang masih dapat diubah.
   - **Terkonfirmasi (*CONFIRMED*):** Pemesanan telah disepakati penyewa dan unit armada berstatus `RESERVED`.
   - **Dalam Kontrak (*IN_CONTRACT*):** Booking telah diproses menjadi Kontrak Sewa resmi.
   - **Selesai (*COMPLETED*):** Seluruh masa sewa telah tuntas.
   - **Dibatalkan (*CANCELLED*):** Reservasi dibatalkan dan armada kembali berstatus `READY`.
5. **Konversi Cepat ke Kontrak Sewa:** Aksi satu klik pada drawer booking untuk langsung menerbitkan Kontrak Sewa resmi (`/rental/contracts`) dengan mewariskan seluruh rincian armada dan pelanggan secara otomatis.

---

## 2. Struktur Antarmuka dan Alur Transaksi

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [🔍 Cari No Booking / Pelanggan]  [🏷 Filter Status]  [+ Buat Booking Baru] │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Pemesanan Rental:                                           │
│  [Aksi] | No Booking | Pelanggan         | Rentang Sewa | Unit | Total │
│  ───────┼────────────┼───────────────────┼──────────────┼──────┼───────┤
│   [👁]  | BKG-202601 | PT MAJU LOGISTIK  | 25-30 Sep 26 | 3    | Rp 6jt│
│   [👁]  | BKG-202602 | BUDI SANTOSO      | 01-03 Okt 26 | 1    | Rp 1jt│
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik tombol [👁] / No Booking)                       ▼ (Klik [+ Buat Booking])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Drawer Detail: BookingView   │              │ Form: BookingForm            │
│ • Informasi Pelanggan (SSoT) │              │ 1. Pilih Pelanggan (Customer)│
│ • Rentang Tanggal & Durasi   │              │ 2. Rentang Tanggal Mulai-Akhir│
│ • Tabel Multi-Armada Sewa:   │              │ 3. Keranjang Multi-Kendaraan:│
│   - Unit 1: Avanza (Rp 2jt)  │              │    [+ Tambah Unit Armada]    │
│   - Unit 2: Xpander (Rp 2jt) │              │    (Cek Ketersediaan Jadwal) │
│ • Rincian Deposit & Biaya    │              │ 4. Rincian Biaya & Deposit   │
│ [Aksi: Konversi ke Kontrak]  │              │ [Tombol: Simpan Booking]     │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`BookingList.tsx`:**
  - Tabel data pemesanan berbasis `@adatrack/ui` `DataTable`.
  - **Kolom Data:** Nomor Booking, Nama Pelanggan, Tanggal Mulai, Tanggal Selesai, Total Durasi Hari, Jumlah Kendaraan Dipesan (*Vehicle Count*), Total Deposit, Total Tagihan, Status Booking (Badge DRAFT, CONFIRMED, IN_CONTRACT, COMPLETED, CANCELLED), dan Menu Aksi.
- **`BookingForm.tsx`:**
  - Formulir pemesanan multi-langkah:
    - **Langkah 1:** Pilih Pelanggan dari master `customerService` (SSoT).
    - **Langkah 2:** Tentukan Tanggal & Jam Mulai serta Tanggal & Jam Selesai Sewa.
    - **Langkah 3:** Pilih Tipe Layanan (Lepas Kunci / Dengan Pengemudi).
    - **Langkah 4 (Multi-Unit Basket):** Menambahkan 1 atau lebih armada rental yang berstatus siap sewa. Setiap unit otomatis dicek ketersediaan jadwalnya pada kalender reservasi.
    - **Langkah 5:** Pratinjau kalkulasi rincian biaya dan tombol konfirmasi pemesanan.
- **`BookingView.tsx`:**
  - Drawer detail pemesanan yang menampilkan informasi lengkap pemesan, rincian biaya, daftar seluruh kendaraan dalam pesanan beserta tarifnya, dan tombol aksi **"Buat Kontrak Sewa"**.

---

## 4. Model Data Teknis (`Booking` & `BookingItem`)

```ts
export type BookingStatus = 'DRAFT' | 'CONFIRMED' | 'IN_CONTRACT' | 'COMPLETED' | 'CANCELLED';
export type RentalServiceType = 'SELF_DRIVE' | 'WITH_DRIVER';

export interface BookingItem {
  id: string;                    // Format: bki-xxx
  bookingId: string;
  vehicleId: string;             // Referensi ke RentalVehicle
  plateNumber: string;
  vehicleName: string;
  dailyRate: number;             // Snapshot tarif harian saat booking dibuat
  days: number;                  // Jumlah hari sewa
  subtotal: number;              // dailyRate * days
  deposit: number;               // Snapshot deposit unit
  driverId?: string;             // Jika layanan WITH_DRIVER
  driverFee?: number;
}

export interface Booking {
  id: string;                    // Format: bkg-xxx
  bookingNumber: string;         // Contoh: "BKG-2026-09-001"
  customerId: string;            // Foreign Key ke Customer (SSoT)
  customerName: string;
  customerType: 'INDIVIDUAL' | 'COMPANY';
  startDate: string;             // YYYY-MM-DD HH:mm
  endDate: string;               // YYYY-MM-DD HH:mm
  serviceType: RentalServiceType;
  items: BookingItem[];          // Daftar multi-kendaraan dalam booking
  totalDays: number;
  totalRentalAmount: number;     // Total biaya sewa seluruh unit
  totalDepositAmount: number;    // Total deposit seluruh unit
  grandTotal: number;            // Total sewa + deposit + biaya driver
  status: BookingStatus;
  contractId?: string;           // Terisi jika sudah dikonversi ke Kontrak
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Service Layer & Integrasi Transaksi

- **`bookingService.ts`:**
  - `checkVehicleAvailability(vehicleId, startDate, endDate)`: Memeriksa apakah armada bebas dari reservasi lain pada rentang waktu yang diminta.
  - `createBooking(data)`: Menyimpan booking baru dan mengubah status armada yang dipilih menjadi `RESERVED`.
  - `confirmBooking(id)`: Mengubah status dari `DRAFT` menjadi `CONFIRMED`.
  - `cancelBooking(id)`: Membatalkan booking dan mengembalikan armada ke status `READY`.
  - `convertToContract(bookingId)`: Menghasilkan kontrak sewa baru di `contractService` dari data booking.

---

## 6. Status Verifikasi & Hasil

- **Status:** 
- **Verifikasi:** Alur reservasi multi-kendaraan, validasi tanggal bentrok (*conflict detection*), kalkulasi harga bertingkat, drawer rincian, dan konversi ke kontrak sewa telah teruji dan bekerja normal.
