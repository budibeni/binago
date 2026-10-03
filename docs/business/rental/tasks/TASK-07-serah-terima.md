# TASK-07 — HALAMAN SERAH TERIMA

**Halaman/menu:** Serah Terima  
**Status:** PROPOSED  
**Tujuan:** Mencatat handover sebagai snapshot per BookingItem/kendaraan.

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
- Audit route list/create/detail/map, Handover type, form, service/repository/mock, dan status transition.
- Pastikan Handover direferensikan ke contractId dan bookingItemId; vehicleId harus konsisten dengan BookingItem CORE vehicleId.
- Pastikan hanya Contract CONFIRMED dan BookingItem yang eligible dapat diserahterimakan.
- Pastikan snapshot mencakup field yang sudah didukung model: waktu, odometer awal, kondisi, fuel/equipment/staff/notes/lokasi jika memang tersedia.
- Validasi odometer awal dan data wajib berdasarkan model serta requirement yang telah ada.
- Pastikan Handover pertama mengubah Contract menjadi ACTIVE dan kendaraan terkait menjadi RENTED melalui service/domain flow yang tepat.
- Audit mock Handover yang pernah tidak menyimpan bookingItemId dan pemanggilan getHandoverByContractId yang API-nya pernah tidak tersedia.
- Pastikan detail/history dapat dibuka; jika fitur Map/Tracking tersedia, gunakan trackingNavigationService dan VehicleContext generik.
- Pastikan aksi submit tidak hanya mengubah UI atau menampilkan toast tanpa menyimpan data.

## 4. Batasan / bukan ruang lingkup
- Jangan mengerjakan halaman Pengembalian.
- Jangan mengarang kewajiban foto atau GPS jika belum didukung requirement/model.
- Jangan menambahkan query params pada URL /tracking.

## 5. Dependensi
- TASK-05 Kontrak Rental; TASK-04 Booking.

## 6. Acceptance criteria
- Handover tersimpan sebagai snapshot per BookingItem dan status Contract/Vehicle berubah secara konsisten.
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
