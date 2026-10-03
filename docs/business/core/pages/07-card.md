# HALAMAN KARTU AKSES FISIK (CARD)

**Rute Aplikasi:** `/card`  
**Domain:** CORE (Access Subdomain)  
**Label UI:** Kartu Akses (Card)  
**Title Dokumen:** `Kartu Akses - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/access/card/CardFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Kartu Akses (`/card`) berfungsi sebagai **pusat inventaris kartu identifikasi fisik (*physical RFID / Smart Card credential manager*)** pada platform ADATRACK Business. Halaman ini mengelola perangkat kartu nirkabel yang digunakan oleh pengemudi dan personel staf untuk melakukan otentikasi identitas (*Driver ID reader*) saat menyalakan armada kendaraan atau mengakses gerbang pool.

### Ringkasan Kemampuan Utama:
1. **Inventaris Kartu Fisik:** Mencatat nomor seri fisik kartu / UID (RFID Card 13.56 MHz / 125 kHz, Smart Card kontak, atau iButton magnetik).
2. **Manajemen Kepemilikan (*Holder Assignment*):**
   - Menghubungkan nomor kartu dengan **Pengemudi (*DRIVER*)** dari master `driverService`.
   - Menghubungkan nomor kartu dengan **Personel Staf (*PERSONEL*)** dari master `personelService`.
   - Kartu yang belum digunakan berstatus `NONE` (*Unassigned*).
3. **Siklus Status Kartu (*Lifecycle*):**
   - **Aktif (*ACTIVE*):** Kartu sah dan dapat digunakan untuk otentikasi mesin.
   - **Tidak Aktif (*INACTIVE*):** Kartu diblokir sementara.
   - **Hilang (*LOST*):** Kartu dilaporkan hilang dan dilarang digunakan sistem.
4. **Pencegahan Duplikasi:** Memastikan satu kartu aktif hanya dipegang oleh satu individu pada satu waktu.
5. **Kaitan dengan Log Telematika:** Setiap penempelan kartu ini di unit kendaraan otomatis dicatat pada halaman `/log`.

---

## 2. Struktur Antarmuka dan Tabel Data (`CardTable.tsx`)

Tabel data berbasis `@adatrack/ui` `DataTable`:

### Kolom Data:
1. **Aksi Pinned Kiri:** Tombol rincian kartu (`View`).
2. **Nomor Kartu (`cardNumber`):** UID fisik kartu (format monospace/tebal).
3. **Tipe Kartu (`type`):** Badge tipe (`RFID`, `SMART_CARD`, atau `IBUTTON`).
4. **Pemegang Kartu (`holderName`):** Nama Pengemudi atau Personel staf yang memegang kartu beserta subtitel jabatannya.
5. **Tipe Pemegang (`holderType`):** Label identifikasi `Pengemudi`, `Personel`, atau `Belum Ditugaskan`.
6. **Status Kartu (`status`):** Badge `ACTIVE` (Hijau), `INACTIVE` (Abu-abu), atau `LOST` (Merah).
7. **Tanggal Penugasan (`assignedAt`):** Tanggal kartu diserahkan kepada pemegang.
8. **Catatan Tambahan (`notes`):** Keterangan nomor batch atau kondisi fisik kartu.

### Panel Filter Lanjutan:
- **Filter Status:** `Semua`, `ACTIVE`, `INACTIVE`, `LOST`.
- **Filter Tipe Kartu:** `RFID`, `SMART_CARD`, `IBUTTON`.
- **Filter Pemegang:** `DRIVER`, `PERSONEL`, `NONE`.

---

## 3. Komponen Pendukung Fitur

- **`CardForm.tsx`:** Dialog modal untuk mengatur kepemilikan kartu. Pengguna memilih apakah kartu akan diserahkan kepada Pengemudi atau Personel, memilih nama orangnya dari dropdown pencarian, serta mengubah status kartu.
- **`CardView.tsx`:** Drawer detail yang menampilkan profil lengkap pemegang kartu, riwayat stempel waktu penugasan, dan catatan fisik kartu.

---

## 4. Model Data Teknis (`CardModel`)

```ts
export type CardType = 'RFID' | 'SMART_CARD' | 'IBUTTON';
export type CardStatus = 'ACTIVE' | 'INACTIVE' | 'LOST';
export type HolderType = 'NONE' | 'DRIVER' | 'PERSONEL';

export interface CardModel {
  id: string;                    // Format: crd-xxx
  cardNumber: string;            // Contoh: "RF-88291039"
  type: CardType;
  status: CardStatus;
  holderType: HolderType;
  holderId?: string;             // ID driver atau personel
  holderName?: string;           // Nama yang di-resolve
  holderSubtitle?: string;
  assignedAt?: string;           // Tanggal penyerahan
  notes?: string;
}
```

---

## 5. Aturan Bisnis & Integrasi

1. **Otentikasi Pengemudi pada Armada:**
   - Perangkat GPS armada yang dilengkapi RFID Driver ID reader akan memverifikasi nomor kartu yang ditempel terhadap tabel ini sebelum mengizinkan mesin dinyalakan.
2. **Pencatatan Audit Otomatis:**
   - Saat kartu yang valid ditempel, sistem telematika secara otomatis membuat entri log baru di `/log` dengan mengaitkan identitas pengemudi dan koordinat kendaraan.
