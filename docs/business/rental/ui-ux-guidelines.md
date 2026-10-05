# Panduan Antarmuka (UI/UX) Modul Rental

UI modul Rental dirancang agar memiliki impresi modern, kompak (*compact*), padat informasi, dan bergaya *enterprise*.

## 1. Tata Letak (Layouting)

Halaman utama yang menampilkan *dashboard* mini dan tabel data wajib mematuhi gaya arsitektur *Full-Height*:
- Tidak ada *scroll* global pada jendela browser. *Scroll* hanya aktif di dalam badan tabel (`overflow-y-auto`).
- Komponen dibungkus dengan utilitas tinggi `h-full flex flex-col`.

## 2. Panel Ringkasan (PanelShell)

Modul-modul analitik/laporan (`/rental/monitoring`, `/rental/productivity`, `/rental/payments`) wajib menggunakan komponen `@adatrack/ui` bernama `PanelShell` untuk merender blok ringkasan statistik.
- **Kemampuan:** Dapat diatur posisi (*docking*) ke Atas, Bawah, Kiri, Kanan, maupun disembunyikan sama sekali oleh pengguna.
- **Kepadatan (Compactness):** Kartu statistik di dalam `PanelShell` menggunakan `StatCard` mendatar. Angka ditempatkan di kanan, label/ikon di kiri, dan teks menggunakan ukuran font kecil (`text-xs` untuk nilai utama, `text-[11px]` untuk label) agar sangat hemat ruang vertikal.

## 3. Komponen Tabel (DataTable)

- Penggunaan komponen `DataTable` bersifat wajib untuk menampilkan *list*. 
- Kemampuan dasar tabel harus diaktifkan:
  - `pagination` (Paginasi Data)
  - `sortable` (Pengurutan Kolom)
  - `columnVisibility` (Menyembunyikan/Menampilkan kolom)
- **Tabel Filter:** Indikator penyaringan (*filter*) akan otomatis memunculkan warna merah (*danger*) pada ikon filter jika terdapat parameter penyaringan yang aktif (termasuk filter default seperti "Bulan Ini" pada Produktivitas).

## 4. Warna dan Ikon

- Ikon mengambil dari paket `lucide-react`.
- Hindari penggunaan warna dasar mencolok kecuali untuk *badge* status atau notifikasi penting. Gunakan palet abu-abu (*neutral/zinc*) untuk warna dasar panel dan *card*.
- Nominal pembayaran/harga dalam tabel harus rata kanan (*align: right*).
