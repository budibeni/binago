# ADATRACK - Dokumentasi Project

Folder `/docs` berisi seluruh dokumentasi resmi project ADATRACK.

## Urutan membaca

Untuk Antigravity AI:

```text
/AGENTS.md
↓
/docs/README.md → Dokumentasi arsitektur & panduan teknis yang relevan
↓
Spesifikasi halaman di /docs/business/core/ atau Task aktif di /docs/business/<modul>/tasks/
```

`AGENTS.md` adalah instruksi utama untuk perilaku AI.  
File ini adalah indeks dokumentasi project, bukan pengganti `AGENTS.md`.

## Dokumentasi utama

```text
project-overview.md
architecture.md
folder-structure.md
development-rules.md
business-rules.md
design-system.md
ui-guidelines.md
database-design.md
api-standard.md
coding-standard.md
deployment.md
task-roadmap.md
```

## Dokumentasi Modul Domain Business

Tersedia di `/docs/business/`:

- [`docs/business/core/README.md`](docs/business/core/README.md) — Modul inti CORE (`apps/business/src/app`): Beranda (Home), Pemantauan (Tracking), Armada (Vehicles SSoT), Pengemudi (Drivers), Grup Armada (Groups), Geofence, Rute (Routes), serta Akses Fisik RFID (Card, Personel, Log).
- [`docs/business/rental/README.md`](docs/business/rental/README.md) — Modul bisnis Rental Kendaraan: Pelanggan, Kategori Tarif, Kendaraan Rental, Booking, Kontrak Sewa, Template Kontrak (TipTap Editor), Serah Terima, Pengembalian, dan Laporan.
- `docs/business/logistik/` — Modul bisnis Logistik & Distribusi.

## Dokumentasi Aplikasi Personal

Tersedia di [`docs/personal/`](docs/personal/):
- `adatrack-personal.md` — Spesifikasi fungsional dan arsitektur aplikasi ADATRACK Personal.
- `tasks/` (`PERSONAL-01` s.d. `PERSONAL-07`) — Task pengembangan frontend Personal.

## Task & Roadmap

Daftar roadmap lengkap terangkum di [`docs/task-roadmap.md`](docs/task-roadmap.md).

### 1. Dokumentasi Fitur CORE Operasional
Seluruh fitur operasional CORE didokumentasikan di [`/docs/business/core/`](docs/business/core):
- Home (`/`), Tracking (`/tracking`), Vehicles SSoT (`/vehicles`), Drivers (`/drivers`), Groups (`/groups`), Geofences (`/geofences`), Routes (`/routes`), Card (`/card`), Personel (`/personel`), Log (`/log`).

### 2. Task Modul Bisnis Rental
Task operasional modul Rental berada di [`/docs/business/rental/tasks/`](docs/business/rental/tasks):
- `TASK-01-pelanggan.md` sampai `TASK-06-template-kontrak.md` (Completed)
- `TASK-07-serah-terima.md` sampai `TASK-10-integrasi-rental.md` (Proposed)

## Prinsip project saat ini

- Dokumentasi menggunakan Bahasa Indonesia.
- Identifier teknis menggunakan English.
- Label UI default menggunakan Bahasa Indonesia.
- ADATRACK Business dan ADATRACK Personal adalah application terpisah.
- Scope saat ini berfokus pada frontend.
- Data yang digunakan adalah dummy/mock data.
- Jangan membuat production backend, database, API, GPS engine, atau integrasi perangkat nyata pada scope frontend saat ini.
- Gunakan dokumentasi sebagai acuan sebelum mengambil keputusan implementasi.

Untuk aturan kerja Antigravity AI, selalu baca `/AGENTS.md`.
