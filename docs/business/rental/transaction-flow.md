# Alur Transaksi (Transaction Flow)

Siklus utama peminjaman kendaraan dalam ADATRACK Rental mengikuti *State Machine* berikut.

## 1. Reservasi / Booking
Rute: `/rental/bookings`
- **Konsep**: Pelanggan memesan satu atau beberapa armada sekaligus (*Multi-Armada*).
- **Mekanisme Harga**: Saat status *Booking* dibuat, harga sewa disalin permanen ke `rateSnapshot`.
- **Status Transisi**: `DRAFT` → `CONFIRMED` (Siap diserahterimakan) → `CANCELLED`.

## 2. Serah Terima (Handover)
Rute: `/rental/handovers`
- **Konsep**: Serah terima fisik armada dari pengelola kepada penyewa.
- **Pencatatan**: Pengisian **Odometer Awal** dan parameter BBM.
- **Dampak Sistem**: Mengubah status kendaraan menjadi `RENTED` dan memicu dimulainya durasi nyata sewa.

## 3. Kontrak Rental (Contract)
Rute: `/rental/contracts`
- **Konsep**: Bukti ikatan hukum antara penyewa dan perusahaan rental, diterbitkan dari *Booking* yang sudah `CONFIRMED`.
- **Template Dinamis**: Kontrak dicetak menggunakan *Template HTML WYSIWYG* yang dikonfigurasi di `/rental/templates`. Atribut dinamis disisipkan via *Handlebars* (`{{customer.name}}`, dll).

## 4. Pengembalian (Return)
Rute: `/rental/returns`
- **Konsep**: Pencatatan fisik kembalinya armada.
- **Pencatatan**: Pengisian **Odometer Akhir** (untuk menghitung kelebihan pemakaian jika ada batasan km) dan inspeksi kondisi (goresan, bbm kurang).
- **Dampak Sistem**: Mengembalikan kendaraan menjadi `READY` dan menutup tagihan *Booking*.
