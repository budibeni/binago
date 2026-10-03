# ADATRACK — Roadmap Task & Domain

Dokumentasi ini merangkum status pengerjaan seluruh fondasi teknis, modul operasional CORE, dan modul bisnis vertikal pada platform ADATRACK.

---

## 1. Fondasi Platform & Desain Sistem (*Platform Foundation*)

Seluruh fondasi arsitektur dan komponen reusable platform telah selesai diimplementasikan dan didokumentasikan di:
- Arsitektur Monorepo, Shell & Paket: [`docs/architecture.md`](docs/architecture.md) & [`docs/folder-structure.md`](docs/folder-structure.md)
- Design Tokens, Typography & UI Library: [`docs/design-system.md`](docs/design-system.md) & [`docs/design-system-reference.md`](docs/design-system-reference.md)
- Standar Kode & Aturan Validasi: [`docs/development-rules.md`](docs/development-rules.md) & [`docs/coding-standard.md`](docs/coding-standard.md)

| Fondasi | Lingkup | Status |
|---|---|:---:|
| **Monorepo & Packages** | pnpm workspace, Next.js, TypeScript, package `@adatrack/ui` | ✅ Completed |
| **Design System** | Tokens warna tailwind, typography, DataTable, Drawer, Modal, UI components | ✅ Completed |
| **Application Shell** | `BusinessShellLayout`, Header, Sidebar responsif, i18n switcher | ✅ Completed |

---

## 2. Modul Operasional CORE (`apps/business/src/app` & `(core)`)

Dokumentasi spesifikasi lengkap dan acuan implementasi berada di [`docs/business/core/`](docs/business/core):

| Fitur | Rute | Lingkup & Kemampuan | Status |
|---|---|---|:---:|
| **Beranda (Home)** | `/` | Ringkasan metrik telematika aktual, Hero greeting, Favorite shortcuts manager terpersonalisasi | ✅ Completed |
| **Pemantauan (Tracking)** | `/tracking` | Live GPS tracking, Playback, Heatmap, 6 sub-tabel data, feed notifikasi alarm, share lokasi | ✅ Completed |
| **Armada (Vehicles)** | `/vehicles` | Single Source of Truth (SSoT) armada, legalitas STNK/KIR/BPKB, GPS IMEI/SIM, selection dialog | ✅ Completed |
| **Pengemudi (Drivers)** | `/drivers` | Master pengemudi, kualifikasi SIM, penugasan armada, metrik keselamatan mengemudi | ✅ Completed |
| **Grup Armada (Groups)** | `/groups` | Pengelompokan 4 entitas: Kendaraan, Pengemudi, Geofence, dan Rute | ✅ Completed |
| **Batas Wilayah (Geofences)** | `/geofences` | Boundary virtual (Polygon & Circle), visual map editor, perimeter alarm | ✅ Completed |
| **Rute Jalur (Routes)** | `/routes` | Rute resmi multititik (Origin, Stops, Destination), koridor multiline, estimasi km/jam | ✅ Completed |
| **Kartu Akses (Card)** | `/card` | Inventaris kredensial fisik RFID/Smart Card/iButton, penugasan ke Driver/Personel | ✅ Completed |
| **Personel (Personel)** | `/personel` | Master staf lapangan non-driver (Checker, Mechanic, Staff, Management) | ✅ Completed |
| **Log Akses (Log)** | `/log` | Audit trail immutable penempelan kartu akses RFID (Engine Auth, Checker, Attendance) | ✅ Completed |

---

## 3. Modul Bisnis Rental (`apps/business/src/app/(modules)/rental/`)

Task pengerjaan modular berada di [`docs/business/rental/tasks/`](docs/business/rental/tasks):

| Task | Fitur | Lingkup & Kemampuan | Status |
|---|---|---|:---:|
| **TASK-01** | Pelanggan | Master penyewa individu & perusahaan (SSoT transaksi) | ✅ Completed |
| **TASK-02** | Kategori Tarif | Tiered pricing (Daily, Weekly, Monthly, Deposit), override & resolver | ✅ Completed |
| **TASK-03** | Kendaraan Rental | Alokasi armada dari CORE SSoT, status operasional, integrasi live tracking | ✅ Completed |
| **TASK-04** | Booking | Multi-vehicle booking engine (1 Customer → N Items), cek ketersediaan | ✅ Completed |
| **TASK-05** | Kontrak Rental | Multi-armada sewa, konversi booking, cetak surat perjanjian PDF | ✅ Completed |
| **TASK-06** | Template Kontrak | Editor TipTap WYSIWYG HTML, tag dinamis Handlebars, template resmi | ✅ Completed |
| **TASK-07** | Serah Terima | Checklist inspeksi handover, pencatatan odometer & BBM awal | ⏳ Proposed |
| **TASK-08** | Pengembalian | Checklist inspeksi return, cek keterlambatan & denda kerusakan | ⏳ Proposed |
| **TASK-09** | Laporan Rental | Analitik utilisasi armada, rekap pendapatan, riwayat penyewa | ⏳ Proposed |
| **TASK-10** | Integrasi Rental | Pengujian validasi alur transaksi menyeluruh end-to-end | ⏳ Proposed |

---

## 4. Modul Bisnis Transport / Logistik (`apps/business/src/app/(modules)/transport/`)

Dokumentasi dan alur operasional pengiriman logistik berada di `docs/business/logistik/`:
- Manajemen Jadwal (*Schedules*)
- Keberangkatan Armada (*Departures*)
- Pemeriksaan Muatan (*Checker*)
- Alokasi Armada Transport dari CORE SSoT (*Vehicles*)