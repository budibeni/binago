# TASK-11 — HALAMAN PRODUKTIVITAS ARMADA

**Halaman/menu:** Produktivitas  
**Status:** COMPLETED

## 1. Requirement Umum
- Menghitung utilisasi (tingkat penggunaan) kendaraan dalam periode bulan dan tahun tertentu.
- Menampilkan total frekuensi dan total jam kendaraan digunakan.

## 2. Output Laporan Penyelesaian
### Status
COMPLETED

### Implementasi
- Membuat `ProductivityReportFeature` di `/rental/productivity`.
- Mengimplementasikan filter dinamis **Bulan** (multi-select) dan **Tahun** (dropdown, diletakkan di atas bulan).
- Menghitung persentase ketersediaan (*availability rate*) berdasarkan jumlah jam disewa berbanding jumlah jam di bulan/tahun terpilih.
- Pembuatan layout responsif dengan `PanelShell` mendatar dan indikator visual (ikon filter merah) ketika tabel memuat filter default periode bulan berjalan.
- Tabel mendukung paginasi penuh dan menyembunyikan kolom jika diperlukan.
