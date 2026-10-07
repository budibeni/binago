# TASK-04 Booking Rental

## 1. Fungsionalitas Utama

Modul **Booking (Pemesanan Rental)** merupakan titik temu (nexus) dari modul Pelanggan, Kategori Tarif, dan Kendaraan. Modul ini bertanggung jawab atas:

1. **Pembuatan Reservasi (Pemesanan):** Memilih Pelanggan, menentukan durasi sewa, dan memilih unit armada (multi-kendaraan).
2. **Otomatisasi Kalkulasi Tarif:** Mengambil *rate* harian/mingguan/bulanan dari `categoryId` atau harga kustom kendaraan, dikalikan dengan durasi.
3. **Manajemen Siklus Pemesanan (State Machine):** Status berawal dari `DRAFT` (menyimpan sementara) -> `CONFIRMED` (dipesan, mengubah status unit jadi `RESERVED`) -> `CANCELLED` atau berlanjut ke Kontrak (`ACTIVE`).
4. **Alokasi Armada:** Memastikan armada yang dipesan (*booked*) tidak bisa dipesan pelanggan lain di rentang waktu yang sama (melalui validasi ketersediaan).

---

## 2. Struktur UI/UX (Konsistensi Modul)

Implementasi antarmuka wajib mengikuti standar *Enterprise Grade* ADATRACK:

### A. Data Table (`BookingTable.tsx`)
- Menggunakan `DataTable` foundation dari `@adatrack/ui`.
- Kolom "Status" harus menggunakan pola titik warna (*color dot*):
  - `DRAFT`: Abu-abu tipis (`bg-neutral-400`)
  - `CONFIRMED`: Biru (`bg-blue-500`)
  - `ACTIVE`: Hijau (`bg-green-500`)
  - `COMPLETED`: Ungu (`bg-purple-500`)
  - `CANCELLED`: Merah (`bg-danger`)
- Nominal tagihan disejajarkan ke kanan (*align right*) dengan `formatCurrency`.
- Fitur *filter* pencarian meliputi Nama Pelanggan dan Nomor Booking, dengan filter rentang tanggal.

### B. View Drawer (`BookingView.tsx`)
- Komponen rincian (*drawer detail*) wajib menggunakan wrapper `DetailShell`.
- Desain blok kartu informasi (*card section*) harus menggunakan wrapper kustom `<SectionCard>` agar seragam dengan modul-modul lain (seperti `CustomerView` dan `RentalVehicleView`):
  - **Info Booking:** Latar & Ikon Biru Muda (`bg-blue-100`, `text-blue-600`)
  - **Data Pelanggan:** Latar & Ikon Ungu Muda (`bg-purple-100`, `text-purple-600`)
  - **Armada & Durasi:** Latar & Ikon Hijau Muda (`bg-emerald-100`, `text-emerald-600`)
  - **Rincian Biaya:** Latar & Ikon Kuning/Amber (`bg-amber-100`, `text-amber-600`)
- Tipografi nilai data wajib menggunakan `text-[11px] font-medium` dan label field `text-[9px] uppercase font-medium`.

### C. Form Overlay (`BookingForm.tsx`)
- Di-mount menggunakan logika *overlay* murni (menumpuk di atas tabel dengan `window.history.pushState`) agar tabel tidak me-*unmount*.
- Mengadopsi responsivitas grid yang bersih lewat kombinasi `<FormShell>` dan modifier `group-data-[layout=drawer]`.
- Input yang dipakai murni mengambil dari library `@adatrack/ui/form` (`InputOptions`, `Select`, `DatePicker`).
- Proses validasi dikontrol secara utuh oleh Zod Schema dan React Hook Form.

---

## 3. Komponen Modul

- **`BookingsFeature.tsx`:** 
  - File *entry-point* page `/rental/bookings`. Menyediakan *PanelShell*, status *card summary*, tabel data, pencarian, manajemen *state* filter, dan logika pop-up drawer Detail & Form.
- **`BookingTable.tsx`:** 
  - Komponen murni pemanggil struktur kolom (columns def) dan tabel *headless* `@adatrack/ui`.
- **`BookingView.tsx`:** 
  - Drawer detail reservasi, mencakup sub-tabel/daftar (*item list*) yang menyewakan satu atau lebih armada, durasi, total, dan riwayat pesanan pelanggan terkait. 
- **`BookingForm.tsx` (atau `BookingCreateFeature.tsx`):**
  - Mengelola State UI pengisian data pemesanan secara hierarki step: Pilih Pelanggan -> Pilih Tanggal & Jenis Rental -> Pilih Kendaraan -> Konfirmasi Harga.

---

## 4. Model Data Teknis (`Booking`)

```ts
export type BookingStatus = 'DRAFT' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type RentalType = 'SELF_DRIVE' | 'WITH_DRIVER';
export type RateType = 'HOURLY' | 'DAILY' | 'PACKAGE';

export interface BookingItem {
  id: string;
  bookingId: string;
  vehicleId: string; 
  startDate: string; 
  endDate: string; 
  duration: number; // durasi (jam/hari)
  rateType: RateType;
  packageId?: string;            // ID paket (jika PACKAGE)
  packageName?: string;          // Nama paket (jika PACKAGE)
  unitPrice: number;             // Snapshot harga bekuan (harian/jam/paket)
  depositSnapshot: number;       // Snapshot uang jaminan untuk kendaraan ini
  subtotal: number;
  vehicle?: RentalVehicle; // View Model relation
}

export interface Booking {
  id: string;
  bookingNumber: string;         // BKG-xxx
  customerId: string;
  startDate: string;             // Tanggal Mulai Global
  endDate: string;               // Tanggal Selesai Global
  duration: number;              
  rentalType: RentalType;        // Lepas Kunci / Dengan Pengemudi
  totalAmount: number;           // Total Invoice
  deposit: number;               // Titipan Jaminan
  remainingAmount: number;       // Sisa tagihan
  driverFee?: number;            
  status: BookingStatus;
  paymentMethod?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  items: BookingItem[];
  customer?: Customer;           // View Model relation
}
```

---

## 5. Service Layer (`bookingService.ts`)

- Mengawinkan/mengagregasi data dari entitas terpisah:
  1. Pelanggan (dari `customerService`).
  2. Profil Kendaraan Rental & Core Vehicle (dari `rentalVehicleService` dan `coreVehicleService`).
- Mengubah state *SSoT Kendaraan* Rental saat status Booking berubah. Misalnya: ketika `CONFIRMED`, `rentalVehicleService.updateStatus(vehicleId, 'RESERVED')` dan mengeset `currentBookingId`.
- Memberlakukan aturan validasi bisnis (Business Rules), seperti: Kendaraan berstatus `RENTED` tidak boleh dipesan lagi pada tanggal yang sama.

---

## 6. Status Verifikasi & Hasil

- **Status:** IN PROGRESS
- **Verifikasi:** Tahap refactor kerangka UI Form Pemesanan (Shopping Cart Style).

## Keputusan Arsitektur: Data Snapshotting
Untuk menjamin integritas data historis, setiap `Booking` dan `BookingItem` wajib menyimpan duplikat informasi utama (snapshot) dari tabel master pada saat pemesanan dibuat. Data snapshot meliputi:
- `customerSnapshot`: name, type, phone, email, address, city, province, picName, picPhone.
- `vehicleSnapshot` (di dalam `items`): licensePlate, brand, model, categoryName.

Hal ini memastikan UI Tabel, Drawer (View), dan Kontrak dapat me-*render* dokumen secara mandiri tanpa bergantung pada relasi ID `customers` atau `vehicles` yang berpotensi berubah atau dihapus di masa depan.
