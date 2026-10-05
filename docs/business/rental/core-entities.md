# Entitas Utama (Master Data)

## 1. Pelanggan (Customers)
Rute: `/rental/customers`
- **Tipe**: Individu (Perseorangan) dan Perusahaan (*Company*).
- **Atribut Esensial**: NIK/SIM untuk individu, NPWP & nama PIC untuk perusahaan.

## 2. Kategori Tarif (Pricing Category)
Rute: `/rental/pricing-category`
- **Fungsi**: Wadah untuk mengelompokkan kendaraan dengan rentang tarif yang sama.
- **Struktur Harga**: Memiliki tarif dasar untuk Harian, Mingguan, dan Bulanan, serta deposit default.
- **Catatan**: Satu kendaraan hanya bisa masuk ke satu kategori aktif.

## 3. Kendaraan Rental (Rental Vehicles)
Rute: `/rental/vehicles`
- **Integrasi**: Mengambil data utama (Plat Nomor, Brand, Tahun) dari **CORE Vehicle**.
- **Data Rental**: Menyimpan *status operasional* (`READY`, `RENTED`, `MAINTENANCE`), harga khusus (*Rate Override*), dan informasi garansi/pajak kendaraan.
- **Validasi**: Mencegah kendaraan disewa jika sedang tidak *READY*.
