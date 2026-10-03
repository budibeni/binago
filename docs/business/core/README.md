# ADATRACK — Dokumentasi Modul CORE (`apps/business/src/app/(core)`)

Dokumentasi ini adalah acuan resmi arsitektur, spesifikasi halaman, dan alur operasional untuk seluruh fitur inti (**CORE**) pada aplikasi **ADATRACK Business** yang terletak di folder rute `apps/business/src/app/(core)`.

---

## 1. Ikhtisar Domain CORE

Modul CORE merupakan **fondasi operasional dan telematika utama** dari platform ADATRACK Business. Modul ini menyediakan layanan pelacakan langsung (*live GPS tracking*), manajemen armada (*fleet management*), manajemen pengemudi, pembatasan wilayah (*geofencing*), rute perjalanan, serta kontrol akses identifikasi fisik (*RFID / Smart Card Access*).

Modul bisnis vertikal seperti **Rental** dan **Logistik/Transport** bertindak sebagai *consumer* yang memperkaya data dari CORE tanpa menduplikasi data master kendaraan maupun pengemudi.

---

## 2. Struktur Menu, Rute, dan Kegunaan Halaman

Folder `apps/business/src/app` menaungi Beranda serta 9 halaman operasional inti:

| No | Halaman | Rute URL | Feature Orchestrator | Service Layer | Fungsi & Kegunaan Utama |
|:---:|---|---|---|---|---|
| 0 | **Beranda (Home)** | `/` | `features/core/home/components/BusinessHomePage.tsx` | `homeService.ts` | Ringkasan telematika armada waktu-nyata (total armada, bergerak, alert, trips), hero greeting, dan pengelola shortcut favorit yang dapat dipersonalisasi (*Favorite Shortcuts*). |
| 1 | **Pemantauan (Tracking)** | `/tracking` | `features/core/tracking/TrackingFeature.tsx` | `trackingService.ts`, `trackingNavigationService.ts` | Pemantauan posisi armada secara real-time di peta interaktif, status telemetri GPS (kecepatan, odometer, status kontak mesin/ACC, baterai, BBM), dan pemutaran riwayat rute (*playback*). |
| 2 | **Armada (Vehicles)** | `/vehicles` | `features/core/vehicles/VehiclesFeature.tsx` | `vehicleService.ts` | **Single Source of Truth (SSoT)** master kendaraan platform. Menyimpan spesifikasi teknis (plat nomor, nomor rangka/VIN, nomor mesin, merk/model, kapasitas, tahun), penugasan driver, grup, dan dokumen. |
| 3 | **Pengemudi (Drivers)** | `/drivers`, `/drivers/[id]/edit` | `features/core/drivers/DriversFeature.tsx` | `driverService.ts` | Manajemen profil pengemudi resmi perusahaan, verifikasi lisensi mengemudi (SIM A/B/B1/B2 beserta masa berlaku), penugasan kartu akses RFID pengemudi, dan riwayat penugasan unit. |
| 4 | **Grup Armada (Groups)** | `/groups` | `features/core/groups/GroupsFeature.tsx` | `groupService.ts` | Pengelompokan armada internal bisnis (divisi operasional, cabang kantor, area kerja, atau tipe armada) untuk memudahkan filter multi-unit dan pembagian hak akses. |
| 5 | **Geofence** | `/geofences` | `features/core/geofences/GeofenceFeature.tsx` | `geofenceService.ts` | Pembuatan dan pemantauan batas wilayah virtual di atas peta (Poligon, Lingkaran radius, dan Koridor jalur) guna mendeteksi serta membunyikan alarm saat armada masuk/keluar area penting. |
| 6 | **Rute Operasional (Routes)** | `/routes` | `features/core/routes/RouteFeature.tsx` | `routeService.ts` | Perancangan jalur rute resmi dan koridor toleransi perjalanan armada beserta waypoint/titik singgah wajib untuk memantau kepatuhan perjalanan pengemudi. |
| 7 | **Kartu Akses (Card)** | `/card` | `features/core/access/card/CardFeature.tsx` | `data/core/access/card/services/cardService.ts` | Pengelolaan kartu identitas fisik (RFID Card, Smart Card, iButton) untuk sistem otentikasi pengemudi (*Driver ID reader*) di unit kendaraan atau akses gerbang pool. |
| 8 | **Personel (Personel)** | `/personel` | `features/core/access/personel/PersonelFeature.tsx` | `data/core/access/personel/services/personelService.ts` | Manajemen staf operasional non-pengemudi (misal: mekanik pool, staf gudang, inspektur serah terima) yang memiliki hak akses fisik menggunakan kartu RFID. |
| 9 | **Log Aktivitas Akses (Log)** | `/log` | `features/core/access/log/LogFeature.tsx` | `data/core/access/log/services/logService.ts` | Audit trail riwayat penempelan kartu akses (*tap-in / tap-out*) pada perangkat GPS armada, mencatat stempel waktu, nomor kartu, pemegang, unit kendaraan, dan koordinat kejadian. |

---

## 3. Struktur Dokumen

- **[`00-core-architecture-and-rules.md`](docs/business/core/00-core-architecture-and-rules.md)** — Arsitektur terpadu, batas domain CORE, aturan Single Source of Truth (SSoT), mekanisme `VehicleContext`, dan standar isolasi modul.
- **Folder `pages/`** — Spesifikasi fungsional, arsitektur teknis, antarmuka komponen, dan aturan bisnis terperinci untuk masing-masing halaman:
  - [`00-home.md`](docs/business/core/pages/00-home.md) — Beranda (Home Dashboard & Personalized Shortcuts)
  - [`01-tracking.md`](docs/business/core/pages/01-tracking.md) — Pemantauan Live Tracking & Playback
  - [`02-vehicles.md`](docs/business/core/pages/02-vehicles.md) — Master Kendaraan (Single Source of Truth)
  - [`03-drivers.md`](docs/business/core/pages/03-drivers.md) — Pengemudi & Lisensi Berkendara
  - [`04-groups.md`](docs/business/core/pages/04-groups.md) — Pengelompokan Armada Internal
  - [`05-geofences.md`](docs/business/core/pages/05-geofences.md) — Batas Wilayah Virtual Geofence
  - [`06-routes.md`](docs/business/core/pages/06-routes.md) — Rute Standar & Koridor Perjalanan
  - [`07-card.md`](docs/business/core/pages/07-card.md) — Manajemen Kartu Akses RFID
  - [`08-personel.md`](docs/business/core/pages/08-personel.md) — Manajemen Personel Akses
  - [`09-log.md`](docs/business/core/pages/09-log.md) — Log Audit Penempelan Kartu Akses

---

## 4. Prinsip Arsitektur Utama

1. **CORE Vehicle adalah Single Source of Truth:**
   - Tidak ada modul lain (Rental, Transport, dsb.) yang diperbolehkan membuat master kendaraan sendiri. Seluruh data identitas fisik kendaraan harus berasal dari CORE `Vehicle`.
2. **Akses Berbasis Service Layer:**
   - Modul vertikal memanggil service layer CORE (`vehicleService.ts`, `driverService.ts`, dll.). Modul dilarang mengakses repository CORE secara langsung.
   - CORE **tidak boleh mengenal atau mengimpor** modul vertikal (tidak boleh mengimpor Rental atau Transport).
3. **Navigasi Konteks Tracking Bersih:**
   - Perpindahan dari modul eksternal menuju halaman `/tracking` (misal tombol "Buka Lokasi" pada tabel armada rental) menggunakan `trackingNavigationService` dengan payload `VehicleContext` yang disimpan di `sessionStorage`, tanpa mencemari URL dengan query parameter panjang.
4. **Kepatuhan Desain & Bahasa:**
   - Seluruh identifier teknis menggunakan Bahasa Inggris.
   - Seluruh dokumentasi menggunakan Bahasa Indonesia.
   - UI default menggunakan Bahasa Indonesia dengan dukungan i18n Bahasa Inggris.
   - Seluruh tabel data menggunakan DataTable Foundation ADATRACK (`@adatrack/ui`).
