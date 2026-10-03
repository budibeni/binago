# ADATRACK — Dokumentasi dan Task Modul Rental

Dokumentasi ini menggunakan **task per halaman sesuai menu Rental di aplikasi**, bukan task besar yang mencampur beberapa halaman.

## Struktur menu dan kegunaan masing-masing halaman

1. **Pelanggan (`/rental/customers`)**: Mengelola master database penyewa (Individu & Perusahaan), dokumen identitas (NIK/SIM/NPWP), kontak PIC, dan riwayat penyewaan sebagai sumber data transaksi.
2. **Kategori Tarif (`/rental/pricing-category`)**: Mengatur skema harga sewa armada berdasarkan kategori unit (Daily, Weekly, Monthly), penetapan deposit, penugasan armada, dan tarif khusus (*rate override*).
3. **Kendaraan Rental (`/rental/vehicles`)**: Mengelola alokasi armada rental berbasis CORE Vehicle (SSoT), memantau status operasional (*Ready, Reserved, Rented, Maintenance*), kelengkapan unit, masa berlaku dokumen (STNK/Pajak), dan navigasi ke live tracking.
4. **Booking (`/rental/bookings`)**: Menangani reservasi pemesanan armada rental dengan dukungan multi-kendaraan (**1 Customer → 1 Booking → N BookingItems**), pengecekan ketersediaan tanggal (*availability check*), kalkulasi harga, dan konfirmasi pemesanan.
5. **Kontrak Rental (`/rental/contracts`)**: Mengelola dokumen hukum perjanjian sewa dari booking terkonfirmasi, menaungi multi-armada dalam kontrak, memantau masa sewa, dan mencetak dokumen fisik/PDF kontrak perjanjian sewa.
6. **Template Kontrak (`/rental/templates`)**: Mengatur format dan redaksi surat perjanjian sewa menggunakan TipTap HTML WYSIWYG Editor, penyisipan tag dinamis Handlebars, dan pengelolaan template aktif serta template default sistem.
7. **Serah Terima (`/rental/contracts/[id]/handover`)**: Mencatat inspeksi dan serah terima fisik armada per unit kepada penyewa, mencatat odometer awal, level BBM, checklist fisik, serta mengaktifkan kontrak sewa.
8. **Pengembalian (`/rental/contracts/[id]/return`)**: Mencatat inspeksi pengembalian fisik armada per unit, mencatat odometer akhir, mengecek kerusakan/keterlambatan, dan menyelesaikan kontrak sewa setelah seluruh unit kembali.
9. **Laporan Rental (`/rental/reports`)**: Menyajikan analitik dan rekapitulasi data operasional rental (utilisasi armada, pendapatan sewa, durasi sewa, dan riwayat penyewa).

Dashboard Rental tidak dimasukkan karena tidak tampil pada struktur menu yang diberikan sebagai acuan revisi ini.

## Struktur dokumen

- `00-current-state-and-rules.md` — konteks, arsitektur, business rules, temuan audit, dan batasan.
- `tasks/TASK-01-pelanggan.md` sampai `TASK-09-laporan-rental.md` — satu task untuk satu halaman.
- `tasks/TASK-10-integrasi-rental.md` — validasi lintas halaman setelah task halaman selesai.

## Cara menjalankan workflow

Kerjakan **satu task dalam satu waktu**. Jangan mengerjakan task berikutnya sebelum task aktif selesai dan dilaporkan.

Setiap task:
1. Audit halaman dan implementasi aktual terlebih dahulu.
2. Catat route, komponen, feature, service, repository, mock, dan dependency yang ditemukan.
3. Cocokkan dengan aturan bisnis di dokumen ini.
4. Implementasikan hanya ruang lingkup halaman aktif.
5. Jalankan pemeriksaan yang relevan.
6. Laporkan file yang berubah, hasil verifikasi, keterbatasan, dan blocker.
7. STOP. Tunggu instruksi untuk task berikutnya.

## Status task

- **TASK-01 s.d. TASK-06**: Berstatus **COMPLETED** (telah diimplementasikan pada codebase aktual: Pelanggan, Kategori Tarif, Kendaraan Rental, Booking multi-vehicle, Kontrak Rental, dan Template Kontrak WYSIWYG HTML TipTap).
- **TASK-07 s.d. TASK-10**: Berstatus **PROPOSED / PENDING** (tahap lanjutan: Serah Terima, Pengembalian, Laporan Rental, dan Integrasi Lintas Alur).

## Prinsip penting

- Jangan mengarang business rules yang belum diputuskan.
- Jangan melakukan refactor lintas halaman di luar kebutuhan task aktif.
- Jangan mengubah CORE atau kontrak antar-package tanpa persetujuan.
- Reuse komponen dan pola ADATRACK yang sudah ada.
- Jangan mengganti mock dengan API/backend/production infrastructure selama scope masih menggunakan mock.
- Jangan menandai task DONE hanya karena UI terlihat selesai; alur dan validasi terkait juga harus bekerja.
