# Desain Database Modul Rental

Dokumen ini mendefinisikan rancangan skema tabel (Entity-Relationship) yang dibutuhkan untuk mendukung fungsionalitas Modul Rental. Tabel-tabel ini akan dibuat secara terisolasi (kecuali referensi ke `core_vehicles`) guna mempertahankan batas domain modul.

## 1. Master Data Pelanggan
Menyimpan data identitas pelanggan rental (Single Source of Truth untuk Booking).

**Table: `rental_customers`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Identifier unik |
| `code` | VARCHAR | UNIQUE, NOT NULL | Kode Pelanggan (Cth: CUST-001) |
| `type` | ENUM | NOT NULL | `INDIVIDUAL` atau `COMPANY` |
| `status` | ENUM | NOT NULL | `ACTIVE`, `INACTIVE` |
| `name` | VARCHAR | NOT NULL | Nama pelanggan / perusahaan |
| `phone` | VARCHAR | NOT NULL | |
| `email` | VARCHAR | NULL | |
| `address`  | TEXT | NULL | |
| `city` | VARCHAR | NULL | |
| `province` | VARCHAR | NULL | |
| `postal_code` | VARCHAR | NULL | |
| `created_by`| UUID | FK `users.id` | |
| `created_at`| TIMESTAMP | DEFAULT NOW() | |
| `updated_by`| UUID | FK `users.id` | |
| `updated_at`| TIMESTAMP | DEFAULT NOW() | |

**Atribut Khusus Individu (Jika `type` = `INDIVIDUAL`)**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `nik` | VARCHAR | NULL | Nomor Induk Kependudukan (KTP) |
| `ktp_photo` | VARCHAR | NULL | URL foto KTP |
| `birth_place` | VARCHAR | NULL | Tempat lahir |
| `birth_date` | DATE | NULL | Tanggal lahir |
| `sim_number` | VARCHAR | NULL | Nomor Surat Izin Mengemudi |
| `sim_type` | VARCHAR | NULL | Tipe SIM (A, B1, dll) |
| `sim_expired_at`| DATE | NULL | Masa berlaku SIM |
| `sim_photo` | VARCHAR | NULL | URL foto SIM |

**Atribut Khusus Perusahaan (Jika `type` = `COMPANY`)**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `nib` | VARCHAR | NULL | Nomor Induk Berusaha |
| `npwp` | VARCHAR | NULL | NPWP Perusahaan |
| `pic_name` | VARCHAR | NULL | Nama Person in Charge |
| `pic_position`| VARCHAR | NULL | Jabatan PIC |
| `pic_phone`| VARCHAR | NULL | Nomor telepon PIC |
| `pic_email`| VARCHAR | NULL | Email PIC |
| `pic_nik` | VARCHAR | NULL | NIK PIC |
| `pic_ktp_photo`| VARCHAR | NULL | URL foto KTP PIC |

**Table: `rental_customer_balances`** (Pemisahan data statistik/saldo agregat)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `customer_id` | UUID | PRIMARY KEY, FK `rental_customers.id` | Hubungan 1-ke-1 dengan pelanggan |
| `total_billing` | DECIMAL | DEFAULT 0 | Total nilai tagihan seluruh transaksi sewa |
| `total_paid` | DECIMAL | DEFAULT 0 | Total tagihan yang sudah dibayar (Lunas) |
| `total_outstanding`| DECIMAL | DEFAULT 0 | Sisa piutang / utang belum lunas (`total_billing` - `total_paid`) |
| `total_rentals` | INTEGER | DEFAULT 0 | Total frekuensi sewa (Booking yang sukses menjadi Kontrak) |
| `last_rental_date` | TIMESTAMP| NULL | Tanggal terakhir kali sewa berjalan (Handover) |
| `last_payment_date`| TIMESTAMP| NULL | Tanggal terakhir kali melakukan pembayaran |
| `created_by`| UUID | FK `users.id` | |
| `created_at`| TIMESTAMP | DEFAULT NOW() | |
| `updated_by`| UUID | FK `users.id` | |
| `updated_at`| TIMESTAMP | DEFAULT NOW() | Waktu saldo terakhir diperbarui |

## 2. Kategori Tarif & Profil Armada
Skema harga berjenjang dan pemetaan armada CORE ke operasional rental.

**Table: `rental_pricing_categories`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `code` | VARCHAR | UNIQUE, NOT NULL | Kode Kategori (Cth: CAT-A) |
| `name` | VARCHAR | NOT NULL | Nama (Cth: Premium SUV) |
| `description` | TEXT | NULL | Deskripsi Kategori |
| `rate_hourly` | DECIMAL | NOT NULL | Tarif Per Jam |
| `rate_daily` | DECIMAL | NOT NULL | Tarif Harian |
| `packages` | JSONB | NULL | Daftar paket sewa (durasi hari, harga & deposit) |
| `hourly_deposit`| DECIMAL | NOT NULL | Uang Jaminan Per Jam |
| `daily_deposit`| DECIMAL | NOT NULL | Uang Jaminan Harian |
| `status` | ENUM | NOT NULL | `ACTIVE`, `INACTIVE` |
| `created_by`| UUID | FK `users.id` | |
| `created_at`| TIMESTAMP | DEFAULT NOW() | |
| `updated_by`| UUID | FK `users.id` | |
| `updated_at`| TIMESTAMP | DEFAULT NOW() | |

**Table: `rental_vehicle_profiles`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `vehicle_id` | UUID | UNIQUE, FK `core_vehicles.id`| SSoT dari Core |
| `category_id` | UUID | FK `rental_pricing_categories.id`| |
| `status` | ENUM | NOT NULL | `READY`, `RESERVED`, `RENTED`, `MAINTENANCE`, `UNAVAILABLE` |
| `current_odometer`| INTEGER | NOT NULL | Pembaruan rutin |
| `fuel_level_percent` | INTEGER | DEFAULT 100 | Level BBM saat ini (0-100%) |
| `condition_notes` | TEXT | NULL | Catatan kondisi fisik kendaraan |
| `completeness_checklist` | JSONB | NOT NULL | Status STNK, Kunci Cadangan, Dongkrak, dll. |
| `current_booking_id` | UUID | FK `rental_bookings.id` | Booking aktif (jika RESERVED atau RENTED) |
| `created_by`| UUID | FK `users.id` | |
| `created_at`| TIMESTAMP | DEFAULT NOW() | |
| `updated_by`| UUID | FK `users.id` | |
| `updated_at`| TIMESTAMP | DEFAULT NOW() | |

## 3. Transaksi Sewa (Booking & Kontrak)
Pencatatan reservasi (*multi-armada*) dan dokumen legalnya.

**Table: `rental_bookings`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `booking_number` | VARCHAR | UNIQUE, NOT NULL | (Cth: BKG-202410-001) |
| `customer_id` | UUID | FK `rental_customers.id`| |
| `start_date` | TIMESTAMP | NOT NULL | Waktu mulai sewa (Global) |
| `rental_type` | ENUM | NOT NULL | `WITH_DRIVER`, `SELF_DRIVE` |
| `total_amount` | DECIMAL | NOT NULL | Total Tagihan awal |
| `status` | ENUM | NOT NULL | `DRAFT`, `BOOKED`, `CONTRACTED`, `ACTIVE`, `COMPLETED`, `CANCELLED` |
| `customer_snapshot` | JSONB | NOT NULL | Bekuan data detail pelanggan (nama, tipe, kontak) |
| `contract_number` | VARCHAR | NULL | (Cth: CTR-202410-001) Diisi saat `CONTRACTED` |
| `contract_date` | TIMESTAMP | NULL | Tanggal kontrak disetujui |
| `contract_notes` | TEXT | NULL | Catatan kontrak / Terms & Conditions |
| `contract_issued_by` | UUID | FK `users.id` | Admin yang menerbitkan kontrak |
| `contract_issued_at` | TIMESTAMP | NULL | Waktu sistem saat kontrak diterbitkan |
| `created_by` | UUID | FK `users.id` | Admin yang membuat booking |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Waktu booking dibuat |
| `updated_by` | UUID | FK `users.id` | Admin yang terakhir mengubah |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Waktu terakhir diubah |

**Table: `rental_booking_items`** (Menampung armada di dalam Booking)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `booking_id` | UUID | FK `rental_bookings.id` | |
| `vehicle_id` | UUID | FK `core_vehicles.id` | |
| `rate_type` | ENUM | NOT NULL | `HOURLY`, `DAILY`, `PACKAGE` |
| `package_id` | UUID | NULL | FK ke `packages` milik kategori kendaraan |
| `package_name` | VARCHAR | NULL | Nama paket saat transaksi (snapshot) |
| `unit_price` | DECIMAL | NOT NULL | Harga bekuan (snapshot tarif harian/jam/paket) |
| `deposit_snapshot` | DECIMAL | NOT NULL | Uang jaminan untuk kendaraan ini |
| `vehicle_snapshot` | JSONB | NOT NULL | Bekuan data kendaraan (plat, merek, model, kategori) |
| `duration` | INTEGER | NOT NULL | Durasi (jam/hari) sesuai rate_type |
| `subtotal` | DECIMAL | NOT NULL | Total harga (rate * durasi) untuk unit ini |
| `handover_date` | TIMESTAMP | NULL | Tanggal serah terima unit |
| `handover_by` | UUID | FK `users.id` | Admin/Petugas yang menyerahkan |
| `handover_odometer` | INTEGER | NULL | Jarak Tempuh Awal (saat Handover) |
| `handover_condition` | JSONB | NULL | Log kondisi/bahan bakar saat diserahkan |
| `return_date` | TIMESTAMP | NULL | Tanggal pengembalian unit |
| `return_by` | UUID | FK `users.id` | Admin/Petugas yang menerima kembali |
| `return_odometer` | INTEGER | NULL | Jarak Tempuh Akhir (saat Return) |
| `return_condition` | JSONB | NULL | Log kondisi/bahan bakar saat dikembalikan |
| `extra_charges` | DECIMAL | NULL | Denda (Jika ada, dihitung saat return) |

## 4. Global Pembayaran
Rekonsiliasi arus kas.

**Table: `rental_payments`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `booking_id` | UUID | FK `rental_bookings.id` | Asosiasi ke transaksi |
| `customer_id` | UUID | FK `rental_customers.id`| |
| `amount` | DECIMAL | NOT NULL | Nominal Uang |
| `type` | ENUM | NOT NULL | `BOOKING_FEE`, `DOWN_PAYMENT`, `RENTAL_PAYMENT`, `DEPOSIT`, `ADDITIONAL_FEE`, `REFUND` |
| `stage` | ENUM | NOT NULL | `BOOKING`, `HANDOVER`, `CONTRACT`, `RETURN` |
| `method` | VARCHAR | NOT NULL | `TRANSFER`, `CASH`, `CREDIT_CARD` |
| `status` | ENUM | NOT NULL | `PENDING`, `VERIFIED`, `CANCELLED` |
| `reference_number`| VARCHAR | NULL | Referensi Bukti Transfer |
| `payment_date` | TIMESTAMP | NOT NULL | |
| `created_by`| UUID | FK `users.id` | |
| `created_at`| TIMESTAMP | DEFAULT NOW() | |
| `updated_by`| UUID | FK `users.id` | |
| `updated_at`| TIMESTAMP | DEFAULT NOW() | |
