# TASK-10 — INTEGRASI DAN REGRESSION MODUL RENTAL

**Halaman/menu:** Integrasi Rental  
**Status:** PROPOSED  
**Tujuan:** Memvalidasi keseluruhan alur setelah task per halaman diselesaikan.

## 1. Aturan eksekusi
- Baca `AGENTS.md` dan `docs/README.md` terlebih dahulu.
- Baca `docs/business/rental/00-current-state-and-rules.md`.
- Audit source aktual sebelum menyimpulkan kondisi.
- Jangan mengerjakan task lain di luar halaman ini.
- Jika route atau komponen ternyata berbeda, ikuti implementasi aktual dan dokumentasikan temuannya.
- Reuse komponen, service, form, DataTable, dialog, drawer, toast, dan design tokens yang sudah ada.
- Jangan menambahkan dependency atau mengubah arsitektur tanpa alasan yang jelas.

## 2. Audit awal wajib
- Temukan route halaman dan seluruh entry point navigasinya.
- Petakan UI → Feature → Service → Repository → Mock/API.
- Identifikasi type/schema, validasi, permission, i18n, dan state loading/empty/error.
- Catat TODO, handler kosong, route 404, data hardcoded, dan mock yang tidak konsisten.
- Catat dependency halaman lain dan CORE tanpa mengubahnya.

## 3. Ruang lingkup implementasi
- Audit kembali relasi Customer → Booking → BookingItems → Contract → Handover → Return.
- Pastikan setiap BookingItem menggunakan CORE Vehicle ID yang konsisten dari Pricing/Vehicle Profile sampai Handover dan Return.
- Pastikan lifecycle Booking, Contract, dan Rental Vehicle tidak saling bertentangan.
- Pastikan Contract selesai hanya setelah semua BookingItems dikembalikan.
- Pastikan VehicleContext dari Rental dibangun oleh module Rental dan dibaca CORE tanpa CORE mengenal Rental.
- Pastikan navigasi ke Tracking menggunakan /tracking dan trackingNavigationService, bukan query parameters.
- Validasi template Contract terhadap data Contract/Booking multi-vehicle.
- Periksa permission, i18n, loading/empty/error state, dan navigasi antar halaman.
- Jalankan typecheck, lint, automated tests yang tersedia, dan build; catat semua error aktual.
- Periksa regression pada halaman di luar Rental hanya jika perubahan task sebelumnya berpotensi memengaruhinya.

## 4. Batasan / bukan ruang lingkup
- Task ini bukan kesempatan untuk refactor seluruh monorepo.
- Jangan mengubah CORE contract atau shared architecture tanpa persetujuan.
- Jangan mengimplementasikan Payment/Settlement yang belum diputuskan.

## 5. Dependensi
- TASK-01 sampai TASK-09.

## 6. Acceptance criteria
- Alur Rental lintas halaman konsisten dan hasil verifikasi akhir terdokumentasi.
- Aksi utama benar-benar bekerja dan memiliki feedback yang sesuai.
- Tidak ada business rule baru yang diciptakan tanpa keputusan.
- Tidak ada duplikasi master data yang melanggar SSoT.
- Tidak ada perubahan di luar scope tanpa alasan dan laporan.
- Typecheck/lint/test/build yang relevan dijalankan; hasil sebenarnya dicantumkan.

## 7. Output laporan Antigravity
1. **Audit aktual:** route, file, komponen, service, repository, model, mock.
2. **Temuan:** kondisi awal dan gap terhadap acceptance criteria.
3. **Implementasi:** ringkasan perubahan dan daftar file.
4. **Business rules:** aturan yang dipastikan berjalan dan hal yang masih BLOCKED.
5. **Verifikasi:** command yang dijalankan beserta hasilnya.
6. **Risiko/blocker:** dependensi lintas halaman atau keputusan bisnis yang belum ada.
7. **Status:** DONE / PARTIAL / BLOCKED beserta alasan.

## 8. Instruksi berhenti
**Setelah task ini selesai, laporkan hasil dan STOP. Jangan lanjut ke task berikutnya tanpa instruksi baru.**
