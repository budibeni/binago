# HALAMAN PERSONEL OPERASIONAL (PERSONEL)

**Rute Aplikasi:** `/personel`  
**Domain:** CORE (Access Subdomain)  
**Label UI:** Personel  
**Title Dokumen:** `Personel - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/access/personel/PersonelFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Personel (`/personel`) berfungsi sebagai **manajer staf operasional non-pengemudi yang memiliki wewenang akses fisik (*operational staff & credentials manager*)** pada platform ADATRACK Business. Halaman ini mencatat identitas teknisi, mekanik, petugas gudang, dan pemeriksa armada (*checker*) yang membutuhkan otentikasi kartu RFID saat melakukan inspeksi unit kendaraan atau akses gerbang fasilitas pool.

### Ringkasan Kemampuan Utama:
1. **Pusat Data Staf Non-Driver:** Mencatat data identitas personel lapangan (nama, NIK, nomor telepon, email, alamat domisili, dan lokasi penempatan).
2. **Kategori Jabatan Operasional (`PersonelType`):**
   - **Pemeriksa (*CHECKER*):** Petugas serah terima/inspeksi fisik armada (misal: petugas checklist handover rental atau logistik).
   - **Mekanik (*MECHANIC*):** Teknisi bengkel dan perawatan kendaraan.
   - **Staf Pool/Gudang (*STAFF*):** Petugas administrasi pool dan logistik transit.
   - **Manajemen (*MANAGEMENT*):** Pengawas operasional dan supervisor lapangan.
   - **Lainnya (*OTHER*):** Petugas keamanan gerbang pool atau vendor pihak ketiga.
3. **Penugasan Kartu Akses RFID:** Menghubungkan staf dengan nomor kartu identitas RFID (`cardNumber`) untuk otentikasi fisik.
4. **Pengawasan Hak Akses:** Memastikan staf yang berstatus `INACTIVE` tidak dapat menggunakan kartu aksesnya.

---

## 2. Struktur Antarmuka dan Tabel Data (`PersonelTable.tsx`)

Tabel data berbasis `@adatrack/ui` `DataTable`:

### Kolom Data:
1. **Aksi Pinned Kiri:** Tombol rincian staf (`View`).
2. **Personel (`colPersonel`):** Menampilkan nama lengkap staf, email, dan nomor telepon.
3. **Tipe Jabatan (`colType`):** Badge tipe profesi (*Pemeriksa, Mekanik, Staf, Manajemen, Lainnya*).
4. **NIK (`colNik`):** Nomor Induk Kependudukan / No Karyawan.
5. **Nomor Kartu RFID (`cardNumber`):** UID kartu akses yang saat ini dipegang staf.
6. **Status Staf (`colStatus`):** Badge `ACTIVE` (Hijau) atau `INACTIVE` (Abu-abu).
7. **Penempatan Cabang (`colPlacement`):** Lokasi pool atau cabang kantor staf bertugas.
8. **Catatan Tambahan (`notes`):** Keterangan spesialisasi tugas staf.

### Panel Filter Lanjutan:
- **Filter Status:** `Semua`, `Aktif`, `Tidak Aktif`.
- **Filter Tipe Jabatan:** `CHECKER`, `MECHANIC`, `STAFF`, `MANAGEMENT`, `OTHER`.

---

## 3. Komponen Pendukung Fitur

- **`PersonelForm.tsx`:** Modal dialog formulir untuk menambah atau menyunting staf operasional (Nama, NIK, Tipe Jabatan, Telepon, Email, Penempatan, dan Catatan).
- **`PersonelView.tsx`:** Drawer detail yang menampilkan profil lengkap staf, nomor kartu RFID yang ditugaskan, riwayat penugasan, dan tombol aksi ubah/hapus.

---

## 4. Model Data Teknis (`Personel`)

```ts
export type PersonelType = 'CHECKER' | 'MECHANIC' | 'STAFF' | 'MANAGEMENT' | 'OTHER';
export type PersonelStatus = 'ACTIVE' | 'INACTIVE';

export interface Personel {
  id: string;                    // Format: prs-xxx
  name: string;                  // Nama lengkap
  nik: string;                   // Nomor Induk Kependudukan / Karyawan
  personelType: PersonelType;
  status: PersonelStatus;
  phone: string;
  email?: string;
  address?: string;
  placement?: string;            // Lokasi cabang/pool
  cardNumber?: string;           // Nomor UID kartu RFID yang terikat
  notes?: string;
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

---

## 5. Aturan Bisnis & Integrasi

1. **Relasi dengan Master Kartu (`/card`):**
   - Saat kartu ditugaskan kepada Personel di halaman `/card`, nomor kartu otomatis tercatat pada profil personel.
2. **Keterkaitan dengan Modul Bisnis:**
   - Personel bertipe `CHECKER` digunakan oleh modul Rental dan Logistik sebagai petugas resmi yang menandatangani berita acara serah terima (*handover/return inspection checklist*).
