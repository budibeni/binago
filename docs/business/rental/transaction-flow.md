# Alur Transaksi (Transaction Flow)

Siklus utama peminjaman kendaraan dalam ADATRACK Rental mengikuti *State Machine* berikut.

## 1. Reservasi / Booking
Rute: `/rental/bookings`
- **Konsep**: Pelanggan memesan satu atau beberapa kendaraan sekaligus (*Multi-Kendaraan*).
- **Mekanisme Harga**: Saat status *Booking* dibuat, harga sewa disalin permanen ke `rateSnapshot`.
- **Status Transisi**: `DRAFT` → `BOOKED` (Pesanan Masuk) → `CONTRACTED` (Kontrak Diterbitkan) → `ACTIVE` (Unit diserahterimakan) → `COMPLETED` (Unit dikembalikan) atau `CANCELLED`.

## 2. Serah Terima (Handover)
Rute: `/rental/handovers`
- **Konsep**: Serah terima fisik kendaraan dari pengelola kepada penyewa.
- **Pencatatan**: Pengisian **Odometer Awal** dan parameter BBM.
- **Dampak Sistem**: Mengubah status item menjadi `IN_USE` (dan profil kendaraan menjadi `RENTED`), serta mengubah status Booking menjadi `ACTIVE`.

## 3. Kontrak Rental (Contract)
Rute: `/rental/contracts`
- **Konsep**: Bukti ikatan hukum antara penyewa dan perusahaan rental, diterbitkan dari *Booking* yang sudah berstatus `BOOKED`. Memicu perubahan status menjadi `CONTRACTED`.
- **Template Dinamis**: Kontrak dicetak menggunakan *Template HTML WYSIWYG* yang dikonfigurasi di `/rental/templates`. Atribut dinamis disisipkan via *Handlebars* (`{{customer.name}}`, dll).

## 4. Pengembalian (Return)
Rute: `/rental/returns`
- **Konsep**: Pencatatan fisik kembalinya kendaraan.
- **Pencatatan**: Pengisian **Odometer Akhir** (untuk menghitung kelebihan pemakaian jika ada batasan km) dan inspeksi kondisi (goresan, bbm kurang).
- **Dampak Sistem**: Mengubah status item menjadi `RETURNED` (dan profil kendaraan menjadi `READY`). Jika semua unit telah kembali, menutup tagihan *Booking* (menjadi `COMPLETED`).
