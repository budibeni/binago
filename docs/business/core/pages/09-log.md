# HALAMAN LOG AKTIVITAS KARTU AKSES (LOG)

**Rute Aplikasi:** `/log`  
**Domain:** CORE (Access Subdomain)  
**Label UI:** Log  
**Title Dokumen:** `Log Akses - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/access/log/LogFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Log (`/log`) berfungsi sebagai **audit trail catatan riwayat penempelan kartu akses (*RFID access log & audit trail*)** pada platform ADATRACK Business. Halaman ini bersifat *read-only* (tidak dapat diubah atau dihapus) untuk merekam setiap aktivitas otentikasi identitas yang dilakukan melalui pembaca kartu (*RFID reader*) pada armada kendaraan maupun gerbang fasilitas pool.

### Ringkasan Kemampuan Utama:
1. **Perekaman Audit Trail Tak Terbantahkan (*Immutable Log*):** Mencatat stempel waktu presisi detik setiap kali kartu fisik ditempelkan pada perangkat GPS armada atau mesin absensi.
2. **Kategori Tipe Aktivitas (`CardActivityType`):**
   - **Otentikasi Mesin (*ENGINE_AUTH*):** Penempelan kartu oleh pengemudi untuk mengizinkan kontak starter mesin kendaraan menyala.
   - **Pemeriksaan Armada (*CHECKER*):** Penempelan kartu oleh petugas *checker* saat memulai atau menyelesaikan proses inspeksi serah terima armada sewa/logistik.
   - **Absensi Gerbang Pool (*ATTENDANCE*):** Penempelan kartu saat masuk atau keluar area pool/fasilitas kantor.
3. **Status Hasil Akses (`CardLogStatus`):**
   - **Berhasil (*SUCCESS*):** Kartu terdaftar, aktif, dan memiliki wewenang untuk tindakan tersebut.
   - **Gagal (*FAILED*):** Kartu ditolak (misal: kartu berstatus hilang, kartu tidak dikenal, atau driver tidak memiliki hak membawa unit tersebut).
4. **Konteks Lokasi Spasial:** Menyertakan koordinat latitude/longitude dan alamat lokasi saat kartu ditempelkan di atas unit armada.
5. **Ekspor Laporan Audit:** Memungkinkan tim kepatuhan (*compliance*) mengunduh rekapitulasi log akses ke berkas spreadsheet.

---

## 2. Struktur Antarmuka dan Tabel Log (`LogTable.tsx`)

Tabel data berbasis `@adatrack/ui` `DataTable`:

### Kolom Data:
1. **Waktu Transaksi (`timestamp`):** Tanggal dan jam kejadian penempelan kartu (*format: DD/MM/YYYY HH:mm:ss*).
2. **Nomor Kartu (`cardNumber`):** UID fisik kartu yang digunakan.
3. **Pemegang Kartu (`holderName`):** Nama pengemudi atau personel staf yang terdaftar sebagai pemilik kartu.
4. **Tipe Pemegang (`holderType`):** Badge pembeda `DRIVER` (Pengemudi) atau `PERSONEL` (Staf).
5. **Tipe Aktivitas (`activityType`):** Badge `ENGINE_AUTH`, `CHECKER`, atau `ATTENDANCE`.
6. **Status Akses (`status`):** Badge hijau `SUCCESS` atau badge merah `FAILED`.
7. **Kendaraan Terkait (`vehiclePlate`):** Plat nomor unit kendaraan tempat pembaca RFID berada (jika di armada).
8. **Lokasi GPS (`location`):** Alamat atau koordinat lokasi penempelan kartu.
9. **Keterangan / Alasan Kegagalan (`reason`):** Keterangan tambahan (misal: "Kartu tidak aktif", "Otorisasi berhasil").

### Panel Filter Lanjutan:
- **Filter Tipe Aktivitas:** `ATTENDANCE`, `CHECKER`, `ENGINE_AUTH`.
- **Filter Status:** `SUCCESS`, `FAILED`.
- **Filter Tipe Pemegang:** `DRIVER`, `PERSONEL`.

---

## 3. Model Data Teknis (`CardLog`)

```ts
export type CardActivityType = 'ATTENDANCE' | 'CHECKER' | 'ENGINE_AUTH';
export type CardLogStatus = 'SUCCESS' | 'FAILED';
export type HolderType = 'DRIVER' | 'PERSONEL';

export interface CardLog {
  id: string;                    // Format: log-xxx
  timestamp: string;             // ISO 8601
  cardNumber: string;            // Nomor UID kartu
  holderId?: string;
  holderName: string;            // Nama orang
  holderType: HolderType;
  activityType: CardActivityType;
  status: CardLogStatus;
  vehicleId?: string;
  vehiclePlate?: string;         // Plat nomor unit armada
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  reason?: string;               // Alasan jika FAILED
}
```

---

## 4. Aturan Bisnis & Batasan Scope

1. **Sifat Read-Only (Non-Modifiable):**
   - Halaman ini tidak menyediakan tombol tambah manual, edit, atau hapus entri log demi integritas audit operasional.
2. **Injeksi Data dari Telematika GPS:**
   - Dalam arsitektur sistem, entri log dihasilkan otomatis oleh event listener pembaca RFID perangkat GPS kendaraan atau terminal absensi.
