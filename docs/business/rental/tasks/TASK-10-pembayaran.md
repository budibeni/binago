# TASK-10 — HALAMAN GLOBAL PEMBAYARAN

**Halaman/menu:** Global Pembayaran  
**Status:** COMPLETED

## 1. Requirement Umum
- Rekonsiliasi seluruh pembayaran yang terjadi (Booking Fee, DP, Pelunasan, Tambahan, Refund).
- Memisahkan antara buku besar (transaksi) dan laporan agregat per id sewa.

## 2. Output Laporan Penyelesaian
### Status
COMPLETED

### Implementasi
- Pembuatan `AllPaymentsFeature` di `/rental/payments`.
- Menggunakan `PanelShell` responsif untuk menampilkan ringkasan penerimaan (`StatCard` horizontal).
- Membuat 2 tab utama: **Riwayat Transaksi** dan **Laporan per Sewa**.
- Menyalakan fitur paginasi, sorting, dan visibilitas kolom di tabel.
- Mengatur navigasi modul agar masuk di sidebar utama sebagai rute mandiri (bukan di dalam modul dashboard umum).
