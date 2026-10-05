# TASK-09 — HALAMAN MONITORING ARMADA

**Halaman/menu:** Monitoring  
**Status:** COMPLETED

## 1. Requirement Umum
- Menampilkan armada yang saat ini berstatus `RENTED`.
- Menyediakan progress bar sisa durasi kontrak.
- Memiliki fitur peringatan *Overdue* (telat kembali).

## 2. Output Laporan Penyelesaian
### Status
COMPLETED

### Implementasi
- Membuat layout *Full-height* `MonitoringFeature` di `/rental/monitoring`.
- Panel ringkasan statistik (Armada Aktif, Segera Berakhir, Overdue) dibungkus menggunakan `PanelShell`.
- Kolom "Estimasi Selesai" memiliki progres bar yang menghitung sisa waktu penyewaan secara *real-time*.
- Fitur peringatan visual `bg-danger` untuk yang *overdue*.
- Terintegrasi dengan tombol "Lacak" dan tautan WhatsApp langsung ke pelanggan.
- Modifikasi tabel agar mendukung navigasi baris klik langsung ke rute `tracking`.
