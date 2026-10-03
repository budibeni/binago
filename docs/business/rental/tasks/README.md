# Indeks Task Rental

Urutan pengerjaan mengikuti menu halaman:

| Task | Halaman | Rute | Dependensi utama | Status | Fungsi & Kegunaan Halaman |
|---|---|---|---|---|---|
| TASK-01 | Pelanggan | `/rental/customers` | — | **COMPLETED** | Kelola data master penyewa (Individu & Perusahaan), dokumen identitas, dan kontak sebagai SSoT transaksi. |
| TASK-02 | Kategori Tarif | `/rental/pricing-category` | — | **COMPLETED** | Kelola tarif sewa berjenjang (Daily, Weekly, Monthly), deposit, penugasan armada, dan tarif override. |
| TASK-03 | Kendaraan Rental | `/rental/vehicles` | TASK-02 | **COMPLETED** | Alokasi profil armada sewa berbasis CORE Vehicle (SSoT), status operasional unit, dan navigasi tracking. |
| TASK-04 | Booking | `/rental/bookings` | TASK-01, TASK-02, TASK-03 | **COMPLETED** | Reservasi sewa multi-armada (1 Customer → N Items), cek ketersediaan tanggal, dan snapshot tarif sewa. |
| TASK-05 | Kontrak Rental | `/rental/contracts` | TASK-04 | **COMPLETED** | Penerbitan kontrak hukum sewa dari Booking CONFIRMED, pemantauan masa sewa multi-armada, dan cetak kontrak. |
| TASK-06 | Template Kontrak | `/rental/templates` | TASK-05 | **COMPLETED** | Desain visual template kontrak perjanjian sewa via TipTap HTML WYSIWYG Editor dengan tag dinamis Handlebars. |
| TASK-07 | Serah Terima | `/rental/contracts/[id]/handover` | TASK-05 | PROPOSED | Pencatatan serah terima fisik unit (odometer awal, BBM, kondisi), aktivasi kontrak sewa ke status ACTIVE. |
| TASK-08 | Pengembalian | `/rental/contracts/[id]/return` | TASK-07 | PROPOSED | Pencatatan pengembalian fisik unit (odometer akhir, cek denda/kerusakan), penyelesaian kontrak ke COMPLETED. |
| TASK-09 | Laporan Rental | `/rental/reports` | TASK-04 s.d. TASK-08 | PROPOSED | Pelaporan analitik utilisasi armada, pendapatan rental, tren masa sewa, dan evaluasi operasional rental. |
| TASK-10 | Integrasi Rental | — | TASK-01 s.d. TASK-09 | PROPOSED | Validasi alur menyeluruh (Customer → Booking → Kontrak → Handover → Return → Laporan) dan regression test. |

Urutan ini adalah urutan dependensi yang disarankan. TASK-01 s.d. TASK-06 telah diimplementasikan sesuai kode aktual. TASK-07 s.d. TASK-10 merupakan tahapan berikutnya.
