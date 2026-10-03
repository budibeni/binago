# TASK-08 — HALAMAN PENGEMBALIAN

**Halaman/menu:** Pengembalian  
**Status:** PROPOSED  
**Tujuan:** Mencatat return per BookingItem dan menyelesaikan lifecycle rental.

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
- Audit route list/create/detail, Return type/form, service/repository/mock, Contract, Handover, dan RentalVehicleProfile.
- Pastikan Return mengacu ke handover/bookingItem yang benar; jangan hanya mengandalkan contractId jika satu Contract memiliki banyak kendaraan.
- Pastikan hanya kendaraan yang telah diserahterimakan dan belum dikembalikan yang dapat diproses.
- Pastikan informasi Contract, Customer, Vehicle, dan Handover ditampilkan dari relasi yang benar.
- Validasi odometer akhir >= odometer awal dan hitung distanceUsed = odometerEnd - odometerStart bila field/aturan ini memang bagian dari model.
- Pastikan snapshot waktu, odometer akhir, kondisi, fuel/equipment/notes/lokasi hanya sesuai field yang telah disepakati dan tersedia.
- Pastikan status kendaraan menjadi READY setelah return berhasil, dengan pengecualian hanya jika ada status/aturan existing yang eksplisit.
- Pastikan Contract COMPLETED hanya setelah seluruh BookingItems telah dikembalikan.
- Audit route Return yang pernah 404 dan mock Return yang pernah tidak memiliki bookingItemId.
- lateFee, damageFee, additionalCharges tetap manual/apa adanya sampai formula dan aturan bisnis diputuskan.

## 4. Batasan / bukan ruang lingkup
- Jangan mengarang formula denda keterlambatan/kerusakan.
- Jangan menambahkan payment/refund/settlement.
- Jangan menyelesaikan Contract setelah satu kendaraan kembali jika masih ada BookingItem aktif.

## 5. Dependensi
- TASK-07 Serah Terima.

## 6. Acceptance criteria
- Return per BookingItem valid, odometer tervalidasi, status kendaraan dan penyelesaian Contract konsisten.
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
