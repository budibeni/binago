# TASK-05 — HALAMAN TEMPLATE SURAT PERJANJIAN SEWA (TEMPLATES)

**Halaman/Menu:** Template Kontrak (`/rental/templates`)  
**Status:** COMPLETED  
**Domain:** Rental (Document Automation Subdomain)  
**Label UI:** Template Kontrak (Contract Templates)  
**Title Dokumen:** `Template Kontrak - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/modules/rental/templates/ContractTemplatesFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Template Kontrak (`/rental/templates`) berfungsi sebagai **pusat perancangan, penyesuaian, dan standardisasi dokumen surat perjanjian sewa kendaraan secara visual (*WYSIWYG document template engine*)** pada platform ADATRACK Rental. Halaman ini menggunakan editor teks kaya TipTap HTML dari package `@adatrack/document-template` untuk memungkinkan pengelola rental mendesain tata letak kontrak, menyisipkan variabel dinamis (*dynamic merge tags*), dan menetapkan template aktif yang digunakan saat pencetakan kontrak sewa resmi.

### Ringkasan Kemampuan Utama:
1. **Editor Dokumen Visual (*HTML WYSIWYG Editor*):** Mengedit format naskah perjanjian hukum langsung secara visual menggunakan package `@adatrack/document-template` (`DocumentTemplateEditor`) dengan dukungan format paragraf, heading, tabel pasal, cetak tebal/miring, dan perataan teks.
2. **Penyisipan Tag Dinamis (*Handlebars Dynamic Tags*):** Menyediakan tag pengganti otomatis yang dievaluasi saat kontrak dicetak:
   - Data Perusahaan Rental: `{{company.name}}`, `{{company.address}}`, `{{company.phone}}`, `{{company.email}}`.
   - Data Pelanggan Penyewa: `{{customer.name}}`, `{{customer.type}}`, `{{customer.phone}}`, `{{customer.email}}`, `{{customer.address}}`, `{{customer.identity}}`.
   - Data Pokok Kontrak: `{{contract.number}}`, `{{contract.contractDate}}`, `{{contract.startDate}}`, `{{contract.endDate}}`, `{{contract.totalAmount}}`, `{{contract.deposit}}`, `{{contract.terms}}`.
   - Daftar Multi-Armada (Looping Tabel): `{{#each vehicles}}<tr><td>{{this.no}}</td><td>{{this.plateNumber}}</td><td>{{this.brand}} {{this.model}}</td><td>{{this.odometer}} km</td></tr>{{/each}}`.
3. **Template Default Standar Resmi:** Menyediakan template hukum default (`DEFAULT_RENTAL_CONTRACT_TEMPLATE`) yang mencakup seluruh klausul hukum standar perjanjian rental kendaraan di Indonesia (komparisi para pihak, hak dan kewajiban, klausul asuransi, sanksi keterlambatan/kerusakan, dan kolom tanda tangan kedua belah pihak).
4. **Pratinjau Hasil Cetak Langsung (*Live Document Preview*):** Menyediakan modal pratinjau (`DocumentTemplatePreview`) yang menyuntikkan data sampel nyata (`PREVIEW_MOCK_DATA`) ke dalam template sebelum disimpan atau diaktifkan.
5. **Manajemen Siklus Template:** Mengatur aktivasi template (*Activate*), penonaktifan (*Deactivate*), pembuatan template baru (*Create*), dan penghapusan template (*Delete*).

---

## 2. Struktur Antarmuka dan Alur Kerja Pengguna

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Katalog Template Dokumen Kontrak Rental:                              │
│  [+ Buat Template Baru]                                                │
├────────────────────────────────────────────────────────────────────────┤
│  Kartu-Kartu Template:                                                 │
│  ┌──────────────────────────────┐      ┌──────────────────────────────┐│
│  │ Surat Perjanjian Sewa Standar│      │ Kontrak Korporasi Tahunan    ││
│  │ Status: 🟢 AKTIF (Default)   │      │ Status: ⚪ Nonaktif          ││
│  │ [👁 Preview]  [⚙ Edit]       │      │ [👁 Preview]  [Aktifkan]     ││
│  └──────────────────────────────┘      └──────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       ▼ (Klik [👁 Preview])                                  ▼ (Klik [+ Buat Template Baru])
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Modal: DocumentTemplatePreview│              │ Modal Layar Penuh: Editor    │
│ • Pratinjau Tampilan Cetak A4│              │ • Toolbar TipTap WYSIWYG     │
│ • Data Sampel Pelanggan &    │              │ • Kanvas Dokumen Real-time   │
│   Tabel Kendaraan Terinjeksi │              │ • Panel Sisip Tag Dinamis    │
│ [Tombol: Tutup / Cetak]      │              │ [Tombol: Simpan Template]    │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`DocumentTemplatePage` (dari `@adatrack/document-template`):**
  - Halaman pengelola kartu template dokumen bertipe `RENTAL_CONTRACT`.
  - Menampilkan daftar template yang tersedia, indikator template aktif, tombol pratinjau, aktivasi, dan penghapusan.
- **`DocumentTemplateEditor` (dari `@adatrack/document-template`):**
  - Editor layar penuh berbasis TipTap untuk merancang konten HTML dokumen perjanjian.
  - Memungkinkan penataan tabel daftar armada, kop surat perusahaan, dan pasal-pasal syarat sewa.
- **`DocumentTemplatePreview` (dari `@adatrack/document-template`):**
  - Modal dialog pratinjau dokumen berukuran standar cetak A4.
  - Mengompilasi kode template dengan pustaka Handlebars untuk menampilkan hasil akhir dokumen dengan data nyata.

---

## 4. Daftar Tag Dinamis Resmi (*Merge Tags*)

| Kategori | Tag Handlebars | Keterangan Data yang Ditampilkan |
|---|---|---|
| **Perusahaan** | `{{company.name}}` | Nama resmi perusahaan rental |
| | `{{company.address}}` | Alamat kantor operasional perusahaan rental |
| | `{{company.phone}}` | Nomor kontak resmi perusahaan rental |
| | `{{company.email}}` | Email resmi perusahaan rental |
| **Pelanggan** | `{{customer.name}}` | Nama lengkap penyewa (perorangan / perusahaan) |
| | `{{customer.type}}` | Tipe pelanggan (`INDIVIDUAL` atau `COMPANY`) |
| | `{{customer.identity}}` | Nomor KTP/SIM penyewa atau NPWP perusahaan |
| | `{{customer.phone}}` | Nomor kontak telepon penyewa / PIC |
| | `{{customer.address}}` | Alamat domisili atau alamat kantor penyewa |
| **Kontrak** | `{{contract.number}}` | Nomor unik surat perjanjian kontrak sewa |
| | `{{contract.contractDate}}` | Tanggal resmi penerbitan kontrak sewa |
| | `{{contract.startDate}}` | Tanggal dan waktu awal penyerahan sewa |
| | `{{contract.endDate}}` | Tanggal dan waktu akhir pengembalian sewa |
| | `{{contract.totalAmount}}` | Total biaya sewa seluruh armada |
| | `{{contract.deposit}}` | Total uang jaminan (deposit) yang ditahan |
| | `{{contract.terms}}` | Klausul syarat dan ketentuan tambahan |
| **Multi-Armada** | `{{#each vehicles}}` | Pembuka perulangan daftar kendaraan yang disewa |
| | `{{this.no}}` | Nomor urut armada |
| | `{{this.plateNumber}}` | Plat nomor polisi kendaraan |
| | `{{this.brand}}` | Merek pabrikan kendaraan |
| | `{{this.model}}` | Model/tipe kendaraan |
| | `{{this.odometer}}` | Angka odometer kendaraan saat serah terima |
| | `{{/each}}` | Penutup perulangan daftar kendaraan |

---

## 5. Service Layer (`templateService.ts`)

- **`templateService.ts`:**
  - `getContractTemplates()`: Mengambil daftar seluruh template dokumen kontrak sewa yang tersimpan.
  - `createContractTemplate(name, contentHtml)`: Menyimpan template baru hasil racikan editor.
  - `activateContractTemplate(id)`: Menetapkan template terpilih sebagai template aktif untuk pencetakan kontrak sewa baru.
  - `deactivateContractTemplate(id)`: Menonaktifkan template.
  - `deleteContractTemplate(id)`: Menghapus template dari sistem.
- **`DEFAULT_RENTAL_CONTRACT_TEMPLATE`:** Template standar resmi sistem yang selalu tersedia saat aplikasi pertama kali dijalankan.

---

## 6. Status Verifikasi & Hasil

- **Status:** 
- **Verifikasi:** Editor visual TipTap, injeksi variabel dinamis Handlebars, modal pratinjau dokumen dengan mock data sewa, dan pengaktifan template telah teruji dan berjalan normal.
