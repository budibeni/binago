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
| `created_at`| TIMESTAMP | DEFAULT NOW() | |
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

## 2. Kategori Tarif & Profil Armada
Skema harga berjenjang dan pemetaan armada CORE ke operasional rental.

**Table: `rental_pricing_categories`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `code` | VARCHAR | UNIQUE, NOT NULL | Kode Kategori (Cth: CAT-A) |
| `name` | VARCHAR | NOT NULL | Nama (Cth: Premium SUV) |
| `description` | TEXT | NULL | Deskripsi Kategori |
| `rate_daily` | DECIMAL | NOT NULL | Tarif Harian |
| `rate_weekly` | DECIMAL | NULL | Tarif Mingguan |
| `rate_monthly` | DECIMAL | NULL | Tarif Bulanan |
| `default_deposit`| DECIMAL | NOT NULL | Uang Jaminan Default |
| `status` | ENUM | NOT NULL | `ACTIVE`, `INACTIVE` |

**Table: `rental_vehicle_profiles`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `vehicle_id` | UUID | UNIQUE, FK `core_vehicles.id`| SSoT dari Core |
| `category_id` | UUID | FK `rental_pricing_categories.id`| |
| `status` | ENUM | NOT NULL | `READY`, `RESERVED`, `RENTED`, `MAINTENANCE` |
| `current_odometer`| INTEGER | NOT NULL | Pembaruan rutin |
| `rate_override_daily` | DECIMAL | NULL | Timpa harga master |
| `rate_override_weekly`| DECIMAL | NULL | Timpa harga master |
| `rate_override_monthly`| DECIMAL| NULL | Timpa harga master |

## 3. Transaksi Sewa (Booking & Kontrak)
Pencatatan reservasi (*multi-armada*) dan dokumen legalnya.

**Table: `rental_bookings`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `booking_number` | VARCHAR | UNIQUE, NOT NULL | (Cth: BKG-202410-001) |
| `customer_id` | UUID | FK `rental_customers.id`| |
| `start_date` | TIMESTAMP | NOT NULL | Waktu mulai sewa |
| `end_date` | TIMESTAMP | NOT NULL | Waktu akhir sewa |
| `total_amount` | DECIMAL | NOT NULL | Total Tagihan awal |
| `status` | ENUM | NOT NULL | `DRAFT`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |

**Table: `rental_booking_items`** (Menampung armada di dalam Booking)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `booking_id` | UUID | FK `rental_bookings.id` | |
| `vehicle_id` | UUID | FK `core_vehicles.id` | |
| `rate_snapshot` | JSONB | NOT NULL | Bekuan harga (`daily`, `deposit`) saat booking |
| `subtotal` | DECIMAL | NOT NULL | |

**Table: `rental_contracts`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `booking_id` | UUID | UNIQUE, FK `rental_bookings.id`| 1 Booking = 1 Kontrak |
| `contract_number`| VARCHAR | UNIQUE, NOT NULL | (Cth: CTR-202410-001) |
| `content_html` | TEXT | NULL | Hasil render Tiptap/Handlebars |
| `status` | ENUM | NOT NULL | `DRAFT`, `ACTIVE`, `COMPLETED`, `VOID` |

## 4. Operasional (Serah Terima & Pengembalian)
Pencatatan kondisi fisik unit.

**Table: `rental_handovers`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `contract_id` | UUID | FK `rental_contracts.id` | |
| `vehicle_id` | UUID | FK `core_vehicles.id` | |
| `start_odometer`| INTEGER | NOT NULL | Jarak Tempuh Awal |
| `fuel_level` | VARCHAR | NOT NULL | (Cth: 100%, 75%, 50%) |
| `conditions` | JSONB | NULL | Log goresan / interior |
| `handover_date` | TIMESTAMP | DEFAULT NOW() | |

**Table: `rental_returns`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `contract_id` | UUID | FK `rental_contracts.id` | |
| `vehicle_id` | UUID | FK `core_vehicles.id` | |
| `end_odometer` | INTEGER | NOT NULL | Jarak Tempuh Akhir |
| `fuel_level` | VARCHAR | NOT NULL | |
| `additional_fee`| DECIMAL | NULL | Denda (Jika ada) |
| `return_date` | TIMESTAMP | DEFAULT NOW() | |

## 5. Global Pembayaran
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
