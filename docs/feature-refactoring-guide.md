# ADATRACK - Panduan Standar Refaktor Fitur & Modul (Feature Refactoring Guide)

Dokumen ini adalah **panduan langkah-demi-langkah resmi (Standard Operating Procedure)** untuk melakukan refaktor menyeluruh pada modul-modul di ADATRACK (seperti `/drivers`, `/groups`, `/geofences`, `/routes`, `/card`, `/personel`, dll.) agar mencapai standar kualitas 100% yang sama persis seperti yang telah diterapkan pada modul **`/vehicles`** dan modul referensi **`/rental/pricing-category`**.

---

## 1. Arsitektur Struktur File & Konvensi Penamaan

Setiap modul fitur wajib mengikuti struktur file yang konsisten sesuai [docs/coding-standard.md](coding-standard.md) Bagian 5:

```text
apps/business/src/features/core/[domain]/
├── [Domain]Feature.tsx         ← Orchestrator utama (DataTable + Drawer Form & View)
├── [Domain]CreateFeature.tsx   ← Halaman mandiri Tambah (Fallback deep-link / refresh)
├── [Domain]EditFeature.tsx     ← Halaman mandiri Edit (Fallback deep-link / refresh)
├── i18n.ts                     ← Dictionary dwi-bahasa lengkap (ID default & EN)
├── components/
│   ├── [Domain]Table.tsx       ← Komponen tabel data berbasis DataTable Foundation
│   ├── [Domain]Form.tsx        ← Komponen form add/edit (mendukung layout drawer & default)
│   └── [Domain]View.tsx        ← Komponen detail read-only (berbasis DetailShell)
└── types/
    └── [domain].ts             ← TypeScript interfaces, types, & Zod validation schema
```

### Struktur Routing Halaman di Next.js (`apps/business/src/app/(core)/[domain]/`)

```text
apps/business/src/app/(core)/[domain]/
├── page.tsx                    ← Route utama: merender <[Domain]Feature />
├── create/
│   └── page.tsx                ← Route direct URL: merender <[Domain]CreateFeature />
└── edit/[id]/
    └── page.tsx                ← Route direct URL: merender <[Domain]EditFeature id={id} />
```

> **Catatan Penamaan `[Domain]`**:
> Gunakan format **PascalCase singular** (contoh: `Vehicle`, `Driver`, `Group`, `Geofence`, `Route`).
> Jika route URL berupa jamak (`/vehicles`, `/drivers`), file orchestrator dapat menyediakan alias ekspor ganda:
> ```ts
> export function DriverFeature() { ... }
> export const DriversFeature = DriverFeature;
> ```

---

## 2. Pola Navigasi CRUD: Drawer Overlay + Deep-Link Fallback

Sesuai aturan arsitektur **AGENTS.md (Bagian 13B)** dan modul referensi **`/rental/pricing-category`**:

### A. Di dalam Orchestrator Utama (`[Domain]Feature.tsx`)

Ketika pengguna melakukan aksi Tambah, Edit, atau Lihat Detail di atas tabel:
1. **JANGAN gunakan `router.push()`** karena akan men-unmount tabel data.
2. Tampilkan komponen form/view sebagai **Drawer / Modal overlay**.
3. Sinkronkan URL browser secara visual menggunakan `window.history.pushState`:

```tsx
// 1. Tambah Data
const handleAdd = React.useCallback(() => {
  window.history.pushState(null, '', '/[domain]/create');
  setEditItem(null);
  setIsAddOpen(true);
}, []);

// 2. Edit Data
const handleEdit = React.useCallback((item: [Domain]) => {
  window.history.pushState(null, '', `/[domain]/edit/${item.id}`);
  setDrawerOpen(false);
  setIsAddOpen(false);
  setEditItem(item);
}, []);

// 3. Lihat Detail
const handleViewDetail = React.useCallback((item: [Domain]) => {
  window.history.pushState(null, '', `/[domain]/${item.id}`);
  setDetailItem(item);
  setDrawerOpen(true);
}, []);

// 4. Tutup / Batal / Selesai Simpan
const handleClose = React.useCallback(() => {
  window.history.pushState(null, '', '/[domain]');
  setIsAddOpen(false);
  setEditItem(null);
  setDrawerOpen(false);
}, []);
```

### B. Handler Simpan Form di Orchestrator

```tsx
const handleSave = (formData: Partial<[Domain]>) => {
  if (editItem) {
    domainService.update[Domain](editItem.id, formData);
    toast.success(locale === 'en' ? 'Data updated successfully' : 'Data berhasil diperbarui');
  } else {
    domainService.create[Domain](formData);
    toast.success(locale === 'en' ? 'Data created successfully' : 'Data berhasil ditambahkan');
  }
  window.history.pushState(null, '', '/[domain]');
  setEditItem(null);
  setIsAddOpen(false);
};
```

### C. Komponen Standalone Fallback (`[Domain]CreateFeature.tsx` & `[Domain]EditFeature.tsx`)

File ini hanya aktif jika user membuka link langsung atau me-refresh browser di halaman `/create` atau `/edit/[id]`:
- Menggunakan `layout="default"` pada `[Domain]Form`.
- Saat simpan atau batal, arahkan kembali menggunakan `router.push('/[domain]')`.

---

## 3. Standarisasi Lapisan Data (Mock, Repository, Service)

Sesuai [docs/mock-data-architecture.md](mock-data-architecture.md):

1. **Hapus File Mock Redundan**:
   - Jika ada file mock data lama di dalam folder feature (misal `features/[domain]/data/mock*.ts`), **hapus file tersebut**.
   - Pusatkan mock data di `apps/business/src/data/mock/[domain]s.ts`.
2. **Kualitas Mock Data**:
   - Gunakan nama Indonesia yang realistis dan autentik.
   - Hindari nama komersial atau data testing asal-asalan (seperti "TEST", "BENI", atau placeholder sembarangan).
   - Gunakan generator angka/koordinat deterministik (hindari `Math.random()` tanpa seed agar data tidak berubah-ubah saat sorting/render).
3. **Metode Lengkap pada Repository & Service**:
   - **Repository** (`data/repositories/[domain]Repository.ts`):
     - `getAll(): [Domain][]`
     - `getById(id: string): [Domain] | undefined`
     - `create(data: Partial<[Domain]>): [Domain]`
     - `update(id: string, data: Partial<[Domain]>): [Domain] | undefined`
     - `delete(id: string): boolean`
   - **Service** (`data/services/[domain]Service.ts`):
     - Menjadi pintu masuk tunggal yang dipanggil oleh komponen UI.

---

## 4. Standarisasi Tampilan DataTable

Sesuai panduan UI ADATRACK:

1. **Tipografi & Ukuran Teks**:
   - Teks sel tabel standar menggunakan `text-[13px]`.
   - Header kolom menggunakan `text-[11px] font-bold uppercase tracking-wider`.
2. **Kolom Angka**:
   - Selalu rata kanan (`text-right` / `headerClassName: 'justify-end'`).
   - Gunakan helper `formatNumber(value)` dari `@adatrack/utils`.
3. **Kolom Identitas / Kode**:
   - Gunakan `font-mono uppercase font-bold text-[12px]` (misal: pelat nomor, ID aset, kode grup).
4. **Indikator Status**:
   - Tampilkan dengan status dot (`h-1.5 w-1.5 rounded-full`) atau badge halus dengan warna semantik:
     - Hijau (`bg-success` / `text-green-700`) untuk Aktif/Berjalan.
     - Kuning (`bg-warning` / `text-yellow-700`) untuk Idle/Menunggu.
     - Biru (`bg-blue-500` / `text-blue-700`) untuk Parkir.
     - Merah (`bg-danger` / `text-red-700`) untuk Offline/Kedaluwarsa.
5. **Kolom Teks Panjang & Grup**:
   - Jangan gunakan warna mencolok tanpa alasan (hindari warna teks biru jika bukan link).
   - Terapkan pemotongan teks rapi (`truncate max-w-[140px]`) disertai atribut `title` untuk aksesibilitas hover.
6. **Toolbar & Fitur Wajib DataTable**:
   - Kotak pencarian terintegrasi (`searchValue`, `onSearchChange`).
   - Tombol dan panel filter multi-dimensi (`filterConfig`, `isFilterOpen`, `onFilterOpenChange`).
   - Tombol toggle kolom (`toolbarColumns`).
   - Tombol ekspor data (`onExport`).
   - Paginasi rapi di bagian bawah (`DataTablePagination`).

---

## 5. Pembuatan Tur Panduan Interaktif (Interactive Tour)

Sesuai [docs/tour-rules.md](tour-rules.md):

### A. Standar Pemberian ID Target Semantik (DOM Selector)
Setiap elemen yang disorot tur wajib memiliki atribut `id` yang unik:
- Container tabel: `#[domain]-table-container`
- Tombol item baris pertama: `#[domain]-first-item-btn`
- Tombol tambah data: `#[domain]-btn-add`
- Komponen generic DataTable (otomatis tersedia):
  - `#data-table-search-input`
  - `#data-table-filter-btn`
  - `#data-table-filter-panel`
  - `#data-table-columns-btn`
  - `#data-table-export-btn`
  - `#data-table-pagination`
- Bagian Drawer Detail:
  - Header detail: `#[domain]-view-header`
  - Aksi cepat: `#[domain]-view-quick-actions`
  - Kartu-kartu detail: `#[domain]-view-card-[name]`
- Bagian Drawer Form:
  - Kartu-kartu form: `#[domain]-form-[name]-card`
  - Tombol simpan: `#[domain]-form-save-btn` (di-pass via `saveProps={{ id: '...' }}` ke `FormShell`)

### B. Segmentasi Tur Terfokus (`components/tour/tours/[domain]Tour.ts`)
Jangan membuat satu tur monolitik. Buat minimal 3 atau 4 fungsi tur tersegmentasi:
1. `get[Domain]OverviewTourSteps(locale)` — Alur overview tabel & pencarian.
2. `get[Domain]FilterTourSteps(locale)` — Alur filter lanjutan & alat bantu ekspor/kolom.
3. `get[Domain]DetailTourSteps(locale)` — Alur eksplorasi laci detail.
4. `get[Domain]FormTourSteps(locale)` — Alur panduan pengisian formulir.

### C. Otomasi Event Bridge (`onHighlightStarted`)
Gunakan `window.dispatchEvent` pada step tur untuk membuka komponen tertutup:
```ts
{
  element: '#[domain]-view-header',
  popover: { ... },
  onHighlightStarted: () => {
    window.dispatchEvent(new CustomEvent('adatrack:tour-open-[domain]-detail'));
  },
}
```
Dan pasang event listener di dalam `[Domain]Feature.tsx`:
```tsx
React.useEffect(() => {
  const handleTourOpenDetail = () => {
    const item = filteredItems[0];
    if (item) {
      setDetailItem(item);
      setDrawerOpen(true);
    }
  };
  window.addEventListener('adatrack:tour-open-[domain]-detail', handleTourOpenDetail);
  return () => window.removeEventListener('adatrack:tour-open-[domain]-detail', handleTourOpenDetail);
}, [filteredItems]);
```

### D. Pendaftaran di Shell Header (`HeaderTourButton.tsx`)
1. Deteksi URL modul:
   ```ts
   const is[Domain]Page = pathname === '/[domain]' || pathname.startsWith('/[domain]');
   ```
2. Set `currentDefaultSteps` untuk modul terkait.
3. Daftarkan menu dropdown tematik dengan ikon lembut (`text-blue-500`, `text-amber-500`, `text-emerald-500`, `text-purple-500`).
4. Daftarkan di kondisi **Mulai Ulang Panduan** (*Restart Tour*).

---

## 6. Standar Kode & Type Safety (docs/coding-standard.md)

1. **Zero `any`**:
   - Seluruh props, state, form data, dan API response harus memiliki type/interface eksplisit.
2. **Validasi Form dengan Zod**:
   - Definisikan Zod schema di `types/[domain].ts`.
   - Gunakan hook `useForm` dari `@adatrack/ui`.
3. **i18n & Multi-Bahasa**:
   - Hindari hardcode string dalam JSX. Gunakan `get[Domain]Translation(locale)`.
   - Label UI default menggunakan Bahasa Indonesia; sediakan terjemahan English yang akurat.

---

## 7. Checklist Verifikasi Akhir (Definition of Done)

Sebelum menyatakan refaktor modul selesai, jalankan checklist berikut:

- [ ] Struktur file memenuhi konvensi `[Domain]Feature.tsx`, `[Domain]CreateFeature.tsx`, `[Domain]EditFeature.tsx`, `[Domain]Table.tsx`, `[Domain]Form.tsx`, `[Domain]View.tsx`, `i18n.ts`.
- [ ] Tombol Tambah membuka Drawer form dan mengubah URL ke `/[domain]/create` via `pushState`.
- [ ] Tombol Edit membuka Drawer form dan mengubah URL ke `/[domain]/edit/[id]` via `pushState`.
- [ ] Direct link ke `/[domain]/create` dan `/[domain]/edit/[id]` berfungsi normal (merender standalone page).
- [ ] DataTable memiliki tipografi rapi (`text-[13px]`, angka rata kanan, ID mono).
- [ ] Mock data telah dibersihkan dari nilai testing sembarangan, data deterministik, dan service mendukung CRUD.
- [ ] Tur interaktif terdaftar di header dengan badge konteks aktif dan event automation berfungsi membuka drawer.
- [ ] Validasi TypeScript lulus tanpa error:
  ```bash
  pnpm --filter business exec tsc --noEmit
  ```
- [ ] Validasi Linter lulus tanpa error:
  ```bash
  pnpm --filter business exec eslint <file-terkait>
  ```
