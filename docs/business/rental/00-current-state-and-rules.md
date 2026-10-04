# ADATRACK RENTAL — Current State, Architecture & Business Rules

## 1. Tujuan dokumen

Dokumen ini menjadi konteks bersama bagi seluruh task halaman Rental. Task halaman tidak boleh mendefinisikan ulang aturan global yang sudah ditetapkan di sini.

## 2. Struktur halaman dan kegunaan

| Urutan | Halaman | Rute | Task | Status | Fungsi & Kegunaan Utama |
|---:|---|---|---|---|---|
| 1 | Pelanggan | `/rental/customers` | TASK-01 | **COMPLETED** | Manajemen master data penyewa (Individu/Perusahaan), legalitas, dan kontak sebagai SSoT transaksi rental. |
| 2 | Kategori Tarif | `/rental/pricing-category` | TASK-02 | **COMPLETED** | Manajemen skema tarif berjenjang (Daily, Weekly, Monthly), deposit, penugasan armada, dan rate override. |
| 3 | Kendaraan Rental | `/rental/vehicles` | TASK-03 | **COMPLETED** | Alokasi armada sewa berbasis CORE Vehicle (SSoT), status operasional, kelengkapan unit, dan live tracking. |
| 4 | Booking | `/rental/bookings` | TASK-04 | **COMPLETED** | Reservasi sewa multi-armada (1 Customer → N Items), validasi ketersediaan tanggal, dan snapshot tarif sewa. |
| 5 | Kontrak Rental | `/rental/contracts` | TASK-05 | **COMPLETED** | Penerbitan dokumen hukum sewa dari Booking CONFIRMED, pemantauan masa sewa multi-armada, dan cetak kontrak. |
| 6 | Template Kontrak | `/rental/templates` | TASK-06 | **COMPLETED** | Editor WYSIWYG TipTap HTML untuk mendesain format surat perjanjian sewa dengan tag variabel dinamis. |
| 7 | Serah Terima | `/rental/handovers` | TASK-07 | **COMPLETED** | Pencatatan serah terima fisik armada per unit (odometer awal, BBM, kondisi), mengaktifkan kontrak sewa. |
| 8 | Pengembalian | `/rental/contracts/[id]/return` | TASK-08 | PROPOSED | Pencatatan pengembalian fisik armada per unit (odometer akhir, cek denda/kerusakan), menyelesaikan kontrak. |
| 9 | Laporan Rental | `/rental/reports` | TASK-09 | PROPOSED | Analitik dan pelaporan utilisasi armada, pendapatan sewa, durasi sewa, dan tren operasional rental. |
| 10 | Integrasi lintas halaman | — | TASK-10 | PROPOSED | Validasi alur menyeluruh (Customer → Booking → Kontrak → Handover → Return → Laporan) dan regression test. |

## 3. Arsitektur dan batas domain

### CORE Vehicle adalah Single Source of Truth

- Data kendaraan utama hanya dimiliki CORE.
- Rental tidak membuat master kendaraan independen.
- `RentalVehicleProfile.vehicleId` harus mereferensikan `CORE Vehicle.id`.
- `RentalVehicleProfile` menyimpan atribut khusus operasional rental, bukan menduplikasi identitas kendaraan CORE.
- Bentuk data hasil enrichment dapat berupa `RentalVehicleProfile + coreVehicle`, dirakit pada service layer.

### Batas akses service

- UI Rental memanggil feature/service Rental.
- Rental service mengakses CORE melalui CORE service.
- Rental tidak boleh mengakses CORE repository secara langsung.
- CORE tidak boleh mengenal atau mengimpor Rental.
- Jangan membuat Registry Pattern.
- Jangan menambahkan state manager global atau generic component baru jika kemampuan yang dibutuhkan sudah tersedia.

### Vehicle Context dan Tracking

- VehicleContext dibangun oleh module pemanggil dan disimpan di `sessionStorage`.
- CORE hanya membaca VehicleContext generik; CORE tidak mengetahui domain Rental.
- Tracking menggunakan URL `/tracking` yang bersih.
- Navigasi konteks menggunakan `trackingNavigationService`, bukan query parameter.
- Bentuk VehicleContext:
  ```ts
  interface VehicleContextField {
    label: string;
    value: string;
    type?: 'text' | 'status' | 'date' | 'currency' | 'number';
  }

  interface VehicleContext {
    vehicleId: string;
    module: string;
    entityType: string;
    entityId: string;
    label: string;
    data: VehicleContextField[];
  }
  ```

### Arsitektur Template Dokumen (Document Template)

- Template dokumen dikelola secara terpusat melalui paket bersama `@adatrack/document-template`.
- Arsitektur resmi yang digunakan: **Web HTML WYSIWYG Editor (TipTap) + Handlebars interpolation tags + DOMPurify sanitization + `@adatrack/ui` PrintShell + Native Browser Printing**.
- Template disimpan sebagai HTML string (`contentHtml`) yang berisi placeholder Handlebars dinamis (seperti `{{contract.number}}`, `{{customer.name}}`, `{{#each vehicles}}`, `{{company.name}}`, dll.).
- Tidak menggunakan file biner DOCX maupun PDF generator eksternal/backend.
- Pratinjau dan pencetakan dokumen langsung memanfaatkan kemampuan cetak bawaan browser melalui wrapper `PrintShell`.
- Host Rental mengimplementasikan halaman manajemen di `/rental/templates` (`ContractTemplatesFeature`), servis template di `templateService.ts`, serta integrasi cetak kontrak di `/rental/contracts` via `ContractPrintModal` dan `printDataProvider.ts`.

## 4. Model dan aturan bisnis Rental

### Pelanggan
- Mendukung pelanggan individu (`INDIVIDUAL`) dan perusahaan (`COMPANY`).
- Menyimpan identitas pendukung seperti NIK, SIM, NPWP, PIC Name, dan PIC Phone.
- Master Customer di `/rental/customers` menjadi Single Source of Truth bagi transaksi Rental; Booking dan Contract merujuk pada `customerId`.
- Fitur mencakup pencarian teks, filter tipe & status, tabel data, drawer detail (`CustomerView`), form create/edit, dan dialog konfirmasi hapus.

### Kategori Tarif dan harga
- Kategori Tarif Rental adalah domain master tarif Rental, terpisah dari CORE Vehicle Group.
- Satu kategori tarif (`RentalPricingCategory`) dapat memiliki banyak kendaraan dan menyediakan tarif berjenjang (`DAILY`, `WEEKLY`, `MONTHLY`).
- Satu kendaraan rental hanya boleh terdaftar pada satu kategori tarif aktif.
- Mendukung penetapan tarif khusus per kendaraan (`VehicleRateOverride`).
- Prioritas penentuan harga (*pricing resolution hierarchy*):
  1. `VehicleRateOverride` aktif.
  2. `PricingCategoryRate` aktif.
  3. Jika keduanya tidak ditemukan, sistem melempar error eksplisit (tidak menggunakan harga fiktif).
- Harga transaksi disnapshot (`rateSnapshot`) pada saat Booking dibuat agar kebal terhadap perubahan tarif master.

### Kendaraan Rental
- Master data kendaraan utama berasal dari CORE Vehicle sebagai Single Source of Truth.
- Profil rental (`RentalVehicleProfile`) menyimpan atribut khusus operasional rental (`vehicleId = CORE Vehicle.id`):
  - Status operasional: `READY`, `RESERVED`, `RENTED`, `MAINTENANCE`, `UNAVAILABLE`;
  - Tarif sewa (harian, mingguan, bulanan) dan nilai deposit;
  - Masa berlaku dokumen (STNK, Pajak, Asuransi);
  - Kelengkapan kendaraan (`equipment`) dan kondisi fisik (`condition`);
  - Odometer saat ini (`currentOdometer`) dan odometer awal rental (`rentalStartOdometer`).
- Pendaftaran kendaraan dilakukan melalui dialog seleksi (`VehicleSelectionDialog`) dari daftar CORE Vehicle yang belum terdaftar di Rental.
- Dilengkapi dengan ringkasan status armada via `PanelShell` dan tombol integrasi "Buka Lokasi" ke peta `/tracking` via `trackingNavigationService`.

### Booking
- Transaksi awal antara Customer dan armada rental dengan arsitektur: **1 Customer → 1 Booking → N BookingItems**.
- Setiap `BookingItem` menyimpan referensi ke CORE `vehicleId`, rentang tanggal (`startDate`, `endDate`), durasi, tipe tarif (`rateType`), dan `rateSnapshot`.
- Ketersediaan kendaraan (`availability`) divalidasi per rentang tanggal dan status kendaraan via `bookingService.checkVehicleAvailability` sebelum booking dibuat.
- Lifecycle Booking: `PENDING → CONFIRMED → ACTIVE → COMPLETED / CANCELLED`.
- Booking berstatus `CONFIRMED` menjadi syarat mutlak untuk pembuatan Kontrak Rental.

### Kontrak Rental
- 1 Kontrak Rental dibuat dari 1 Booking berstatus `CONFIRMED` (`bookingId`).
- Mendukung multi-kendaraan secara terstruktur melalui relasi ke booking items (`contract.booking.items`).
- Menyimpan snapshot nilai transaksi finansial: `totalAmount`, `deposit`, `remainingAmount`, `driverFee`, `rentalType` (`SELF_DRIVE` / `WITH_DRIVER`).
- Lifecycle Kontrak: `DRAFT → CONFIRMED → ACTIVE → COMPLETED / CANCELLED`.
- Pencetakan kontrak dilakukan melalui modal `ContractPrintModal` yang mengambil template aktif dari `templateService`, merangkai data cetak melalui `printDataProvider.ts`, dan menampilkannya di `DocumentTemplatePreview` & `PrintShell`.

### Template Kontrak
- Menggunakan engine paket bersama `@adatrack/document-template` di `/rental/templates`.
- Mendukung pengelolaan banyak template per tipe dokumen (`RENTAL_CONTRACT`).
- **Aturan template aktif**: Tepat 1 template berstatus `ACTIVE` dalam satu waktu yang digunakan sebagai acuan cetak dokumen kontrak.
- **Template default sistem**: Sistem menyediakan template bawaan `DEFAULT_RENTAL_CONTRACT_TEMPLATE` (`default-rental-contract`) dengan struktur pasal perjanjian lengkap yang terlindungi (tidak dapat dihapus dan tidak dapat dinonaktifkan jika tidak ada template kustom aktif).
- Variabel placeholder Handlebars disediakan di editor untuk mempermudah penyisipan tag data kontrak, perusahaan, pelanggan, dan tabel kendaraan.

### Serah Terima

- Serah Terima dilakukan per BookingItem/kendaraan.
- Handover merekam snapshot kondisi awal dan odometer awal.
- Handover pertama mengaktifkan Contract.
- Status kendaraan berubah sesuai lifecycle yang disepakati, misalnya `RESERVED → RENTED`.
- Handover bukan sekadar tombol yang mengubah status; data snapshot harus tersimpan dan dapat dilihat kembali.
- Audit terbaru menemukan mock Handover belum konsisten menyimpan `bookingItemId`, dan ada pemanggilan `getHandoverByContractId` sementara API tersebut tidak tersedia. Verifikasi sebelum implementasi.

### Pengembalian

- Pengembalian dilakukan per BookingItem/kendaraan.
- Hanya kendaraan yang telah diserahterimakan yang dapat dikembalikan.
- Odometer akhir tidak boleh lebih kecil dari odometer awal.
- Setelah seluruh kendaraan pada BookingItem dikembalikan, status kendaraan menjadi `READY` kecuali ada kondisi lain yang secara eksplisit memerlukan status berbeda.
- Contract menjadi `COMPLETED` setelah semua BookingItems selesai dikembalikan.
- `lateFee`, `damageFee`, dan additional charges belum memiliki formula final yang disepakati. Jangan menghitung atau menetapkan nominal otomatis tanpa keputusan bisnis.
- Foto kondisi belum dipastikan tersedia; audit dan laporkan, jangan menganggap ada.

### Pembayaran dan settlement

- Payment, invoice, dan settlement belum diimplementasikan secara lengkap.
- Jangan mengarang alur DP, pelunasan, refund deposit, atau formula denda/kerusakan.
- Field `deposit`, `totalAmount`, dan `remainingAmount` yang mungkin sudah ada tidak berarti proses pembayaran sudah berfungsi.

## 5. Alur bisnis target

```text
PELANGGAN ───────────────┐
                        │
KATEGORI TARIF ─┐       │
                ├─ KENDARAAN RENTAL
CORE VEHICLE ───┘       │
                        ▼
                 BOOKING
          1 Customer → N BookingItems
                        │
                  CONFIRMED
                        │
                        ▼
                KONTRAK RENTAL
                1 Contract/Booking
                        │
                        ▼
                 SERAH TERIMA
              per BookingItem/Vehicle
                        │
                 Contract ACTIVE
                        │
                        ▼
                 PENGEMBALIAN
              per BookingItem/Vehicle
                        │
        semua item kembali dan diverifikasi
                        │
                        ▼
               Contract COMPLETED
                        │
                        ▼
                LAPORAN RENTAL
```

Template Kontrak digunakan oleh proses dokumen Contract, bukan transaksi terpisah.

## 6. Status implementasi dan catatan task

### Task yang telah selesai (COMPLETED) sesuai implementasi aktual:
- **TASK-01 (Pelanggan)**: Selesai. Route `/rental/customers`, tabel data DataTable ADATRACK, pencarian, filter, view drawer (`CustomerView`), form create/edit, dialog konfirmasi hapus, serta relasi `customerId` sebagai sumber data booking dan kontrak telah aktif.
- **TASK-02 (Kategori Tarif)**: Selesai. Route `/rental/pricing-category`, tabel kategori tarif, penetapan tarif (Daily, Weekly, Monthly), vehicle assignment dialog, vehicle custom rate override dialog, drawer detail, dan resolusi prioritas penentuan tarif (Override -> Group Rate -> Error).
- **TASK-03 (Kendaraan Rental)**: Selesai. Route `/rental/vehicles`, edit route di `/rental/vehicles/[id]/edit`, pengayaan profil rental terhadap CORE Vehicle sebagai SSoT via `coreVehicleService`, dialog pendaftaran dari CORE Vehicle, status panel (PanelShell), serta integrasi tombol "Buka Lokasi" ke `/tracking` via `trackingNavigationService`.
- **TASK-04 (Booking)**: Selesai. Route `/rental/bookings`, arsitektur multi-kendaraan (**1 Customer → 1 Booking → N BookingItems**), validasi availability kendaraan berdasarkan rentang tanggal dan status kendaraan via `bookingService.checkVehicleAvailability`, pencatatan snapshot tarif (`rateSnapshot`) saat booking dibuat, konfirmasi dan pembatalan booking.
- **TASK-05 (Kontrak Rental)**: Selesai. Route `/rental/contracts`, pembuatan kontrak dari Booking berstatus CONFIRMED (`bookingId`), dukungan multi-kendaraan melalui `booking.items`, validasi lifecycle (`DRAFT → CONFIRMED → ACTIVE → COMPLETED / CANCELLED`), serta modal cetak kontrak (`ContractPrintModal`) yang terintegrasi dengan template preview dan data provider.
- **TASK-06 (Template Kontrak)**: Selesai. Route `/rental/templates`, paket bersama `@adatrack/document-template`, teknologi Web HTML WYSIWYG Editor (TipTap) + Handlebars interpolation tags + DOMPurify sanitization + `@adatrack/ui` PrintShell + Native Browser Printing, dukungan banyak template dengan 1 template aktif, serta perlindungan template default sistem (`DEFAULT_RENTAL_CONTRACT_TEMPLATE`).

### Catatan untuk task berikutnya (TASK-07 s/d TASK-10):
- **TASK-07 (Serah Terima)**: Belum selesai / PROPOSED. Perlu menyelesaikan serah terima per item kendaraan (`bookingItemId`), update status kendaraan ke RENTED, aktivasi kontrak ke ACTIVE, pencatatan odometer awal, dan checklist kondisi fisik.
- **TASK-08 (Pengembalian)**: Belum selesai / PROPOSED. Perlu menyelesaikan pengembalian per item kendaraan (`bookingItemId`), validasi odometer akhir >= awal, pengembalian status kendaraan ke READY, penyelesaian kontrak ke COMPLETED setelah seluruh item kembali, serta kalkulasi biaya denda/kerusakan.
- **TASK-09 (Laporan Rental)**: Belum diimplementasikan / PROPOSED. Halaman `/rental/reports` untuk pelaporan performa armada, utilisasi, dan analitik rental.
- **TASK-10 (Integrasi Rental)**: Belum diimplementasikan / PROPOSED. Validasi alur end-to-end lintas halaman dari Pelanggan → Booking → Kontrak → Serah Terima → Pengembalian → Laporan.

## 7. Aturan untuk Antigravity

- Baca root `AGENTS.md` dan `docs/README.md` serta dokumentasi terkait sebelum mengubah code.
- Audit repository aktual; jangan mengandalkan nama file saja.
- Satu task aktif per eksekusi.
- Jangan mengerjakan task berikutnya secara otomatis.
- Jangan memperluas scope ke halaman lain hanya karena menemukan masalah terkait.
- Jika blocker lintas halaman ditemukan, catat sebagai blocker dan jangan melakukan refactor luas.
- Reuse DataTable, form controls, dialog, drawer, toast, i18n, dan design tokens yang sudah ada.
- Pertahankan UI compact, clean, minimal, flat, subtle borders, tanpa shadow berat atau whitespace berlebihan.
- TypeScript strict; hindari `any` baru.
- Identifiers/source code berbahasa Inggris; dokumentasi berbahasa Indonesia; UI mengikuti sistem i18n (default Indonesia).
- Jalankan typecheck/lint/test/build yang relevan dan laporkan hasil sebenarnya.
- Jangan menyatakan sukses jika command gagal atau belum dijalankan.

## 8. Definition of Done umum

Task halaman hanya boleh dinyatakan DONE bila:
- route dan akses halaman bekerja;
- data flow mengikuti pola UI → Feature → Service → Repository → Mock/API yang sudah digunakan project;
- validasi input dan business rules dalam scope berjalan;
- loading, empty, error, dan success state ditangani;
- permission mengikuti sistem otorisasi yang sudah ada;
- tidak ada mock handler palsu/console.log untuk aksi utama;
- tidak ada data duplikat yang bertentangan dengan SSoT;
- tidak ada regression pada halaman lain;
- pemeriksaan yang relevan dijalankan dan hasilnya dilaporkan.
