# TASK-09 — HALAMAN LAPORAN RENTAL

**Halaman/menu:** Laporan Rental  
**Status:** PROPOSED  
**Tujuan:** Menyediakan laporan berdasarkan data transaksi Rental yang benar-benar tersedia.

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
- Audit route Reports, tab/section, query/service/repository, mock data, filter, export, dan permission.
- Mulai dari inventarisasi field dan relasi yang benar-benar tersedia; jangan mengasumsikan payment/reporting data sudah lengkap.
- Bangun ringkasan dan filter hanya dari data yang telah tersedia dan dapat dihitung secara konsisten.
- Pastikan laporan menghormati permission dan cakupan data pengguna sesuai sistem otorisasi.
- Pastikan filter periode, status, customer, dan kendaraan hanya ditambahkan jika didukung oleh data serta requirement.
- Pastikan export hanya disediakan jika mekanisme export tersedia/diimplementasikan dalam scope.
- Audit route laporan yang pernah dilaporkan 404.
- Jika metrik pembayaran, deposit, pendapatan bersih, denda, atau refund belum memiliki sumber data dan definisi, tandai BLOCKED dan jangan membuat angka estimasi seolah-olah data aktual.

## 4. Batasan / bukan ruang lingkup
- Jangan membuat modul Payment/Settlement.
- Jangan mengarang KPI atau formula keuangan.
- Jangan membuat laporan berbasis field yang tidak ada.

## 5. Dependensi
- TASK-04 sampai TASK-08 untuk sumber transaksi yang relevan.

## 6. Acceptance criteria
- Laporan dapat dibuka dan menyajikan metrik yang sumber serta definisinya jelas; metrik tanpa data/keputusan ditandai BLOCKED.
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
