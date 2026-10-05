# ADATRACK - Modul Rental Business

Dokumentasi ini menjelaskan arsitektur, panduan antarmuka (UI/UX), dan fitur-fitur operasional untuk Modul Rental pada aplikasi ADATRACK Business. Modul ini dikembangkan khusus untuk mengelola bisnis penyewaan armada, mencakup dari hulu ke hilir (Master Data hingga Pelaporan Keuangan & Produktivitas).

## Daftar Isi Dokumentasi

1. [Arsitektur dan Aturan Bisnis](./architecture-and-rules.md)
   Menjelaskan konsep *Single Source of Truth* (SSoT), batas domain (domain boundaries), dan alur operasional dasar.
2. [Panduan UI/UX](./ui-ux-guidelines.md)
   Standar antarmuka pengguna yang diterapkan pada modul ini (seperti `PanelShell`, `StatCard` mendatar, penggunaan `DataTable` *full-height*, dll).
3. [Entitas Utama (Master Data)](./core-entities.md)
   Dokumentasi manajemen Pelanggan, Kategori Tarif (Pricing), dan Armada Rental.
4. [Alur Transaksi (Transaction Flow)](./transaction-flow.md)
   Siklus hidup penyewaan: Reservasi (Booking) → Serah Terima (Handover) → Kontrak → Pengembalian (Return). Termasuk pengelolaan Template Kontrak.
5. [Monitoring & Keuangan](./monitoring-and-finance.md)
   Penjelasan fitur pemantauan armada langsung (Live Monitoring), manajemen pembayaran (Payments), dan laporan produktivitas (Productivity).

## Status Implementasi Modul

Berikut adalah daftar fitur yang telah diselesaikan dan diintegrasikan:

- ✅ **Pelanggan** (`/rental/customers`): Manajemen penyewa Individu/Perusahaan.
- ✅ **Kategori Tarif** (`/rental/pricing-category`): Manajemen skema harga (Harian, Mingguan, Bulanan).
- ✅ **Kendaraan Rental** (`/rental/vehicles`): Manajemen alokasi armada dari CORE.
- ✅ **Booking** (`/rental/bookings`): Reservasi sewa multi-armada dengan snapshot harga.
- ✅ **Template Kontrak** (`/rental/templates`): Desain surat perjanjian sewa menggunakan Tiptap Editor & Handlebars.
- ✅ **Kontrak Rental** (`/rental/contracts`): Manajemen dan pencetakan dokumen legal sewa.
- ✅ **Serah Terima (Handover)** (`/rental/handovers`): Pencatatan kondisi awal dan odometer saat armada keluar.
- ✅ **Monitoring Armada** (`/rental/monitoring`): Pemantauan *live* masa sewa armada yang sedang berjalan, indikator sisa waktu, dan integrasi WhatsApp.
- ✅ **Global Pembayaran** (`/rental/payments`): Riwayat transaksi seluruh pembayaran dan laporan pendapatan menggunakan `PanelShell`.
- ✅ **Produktivitas Armada** (`/rental/productivity`): Laporan utilisasi dan pendapatan armada per bulan & tahun.
- 🚧 **Pengembalian (Return)** (`/rental/returns`): Pencatatan kondisi akhir dan odometer saat armada kembali. *(Dalam proses/segera diimplementasi)*

## Acuan Pengembangan
Seluruh pengembangan Modul Rental harus berpedoman pada `AGENTS.md` di *root* repositori.
