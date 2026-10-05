# Monitoring & Keuangan

## 1. Pemantauan Armada (Live Monitoring)
Rute: `/rental/monitoring`
- Menampilkan armada yang saat ini berstatus `RENTED`.
- Menyediakan *progress bar* visual sisa durasi kontrak.
- Memiliki fitur peringatan "*Overdue*" (waktu sewa habis namun belum dikembalikan).
- Aksi Cepat: Integrasi *Live Tracking* kendaraan di peta, serta tombol *WhatsApp* langsung ke pelanggan.

## 2. Global Pembayaran (Payments)
Rute: `/rental/payments`
- Menampilkan rekapitulasi seluruh mutasi finansial lintas *Booking* dan *Kontrak*.
- Tab 1: **Riwayat Transaksi** (Buku Besar).
- Tab 2: **Laporan per Sewa** (Menampilkan agregat DP, Pembayaran, Denda, dan Refund per ID Booking).
- Komponen Ringkasan diatur posisinya via `PanelShell`.

## 3. Produktivitas Armada (Productivity Report)
Rute: `/rental/productivity`
- Modul *Business Intelligence* untuk menghitung Utilisasi Armada.
- Pemfilteran dilakukan berbasis **Bulan** dan **Tahun**.
- Matriks Laporan: Menghitung **Total Jam Sewa** dan **Total Frekuensi Sewa** yang berjalan dan berpotongan (overlap) dengan bulan/tahun yang difilter.
- Digunakan untuk melihat armada mana yang paling produktif menghasilkan uang dan waktu.
