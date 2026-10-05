# Arsitektur dan Aturan Bisnis Modul Rental

## 1. Single Source of Truth (SSoT)

- **CORE Vehicle**: Modul Rental tidak membuat master kendaraan secara independen. Semua data kendaraan utama berada di domain CORE.
- Profil kendaraan rental (`RentalVehicleProfile`) hanya menyimpan informasi tambahan khusus operasional penyewaan (seperti harga sewa, deposit, status rental, dll) dan merujuk secara ketat ke ID kendaraan CORE.
- **Master Pelanggan**: Data penyewa (Customer) dikelola di `/rental/customers` dan menjadi SSoT untuk seluruh transaksi penyewaan (Booking, Contract, dll).

## 2. Batas Domain (Domain Boundaries)

- UI Rental memanggil servis Rental.
- Servis Rental dapat memanggil servis CORE (sebatas baca data terkait), namun servis CORE tidak boleh mengimpor atau mengetahui keberadaan servis Rental.
- Arsitektur tidak menggunakan *Registry Pattern* untuk menyuntikkan data lintas domain guna menjaga kemandirian modul.

## 3. Aturan Harga (Pricing Resolution)

Harga sewa yang dikenakan kepada pelanggan diputuskan berdasarkan hierarki berikut (dari prioritas tertinggi):
1. **Vehicle Rate Override**: Harga khusus yang ditetapkan untuk suatu unit kendaraan tertentu.
2. **Pricing Category Rate**: Harga bawaan (Harian/Mingguan/Bulanan) dari kategori tarif kendaraan tersebut.
Sistem tidak memperbolehkan transaksi jika tidak ada harga yang ditemukan di kedua hierarki di atas.

Harga akan di-*snapshot* ketika `Booking` dibuat (sebagai `rateSnapshot`) sehingga nilai sewa kebal (immune) terhadap perubahan tarif master (kategori/override) di masa mendatang.

## 4. Vehicle Context dan Live Tracking

Sistem memanfaatkan state generik `VehicleContext` di `sessionStorage` untuk membawa informasi lintas modul (misal: saat melihat rute live di `/tracking`).
- Parameter dikirim via `trackingNavigationService` (bukan query params), sehingga URL `/tracking` tetap bersih.
- Komponen di modul Rental wajib membangkitkan `VehicleContext` sebelum mengalihkan (*redirect*) pengguna ke peta.
