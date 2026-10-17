# ADATRACK - Coding Standard

## 1. Language

Source code menggunakan TypeScript dan English.

## 2. Type Safety

Hindari `any` jika tidak diperlukan.

Gunakan type yang jelas.

## 3. Components

Component harus memiliki API yang jelas dan tidak memiliki business logic jika bersifat generic.

## 4. Naming

```text
PascalCase → component/type
camelCase → variable/function
UPPER_SNAKE_CASE → constant tertentu jika sesuai kebutuhan
kebab-case → file/route yang memang mengikuti convention
```

## 5. Feature File Naming

Gunakan suffix yang konsisten untuk file feature:

```text
[Domain]Feature.tsx         ← Orchestrator halaman/feature
[Domain]CreateFeature.tsx   ← Halaman tambah (jika halaman terpisah)
[Domain]EditFeature.tsx     ← Halaman edit (jika halaman terpisah)
[Domain]Table.tsx           ← Komponen tabel data
[Domain]Form.tsx            ← Komponen form add/edit (drawer)
[Domain]View.tsx            ← Komponen detail read-only (drawer)
i18n.ts                     ← Dictionary terjemahan (nama tetap lowercase)
```

`[Domain]` menggunakan PascalCase sesuai nama feature (contoh: `Driver`, `Vehicle`, `Card`).


## 6. Styling

Gunakan Tailwind CSS.

## 7. State

Jangan membuat global state tanpa kebutuhan.

## 8. Error

Jangan menelan error tanpa alasan.

## 9. Maintainability

Utamakan code yang mudah dibaca dibanding abstraction yang terlalu kompleks.

## 10. Form Validation Standard (Zod & useForm)

Form input pada ADATRACK (baik di Master Data, Modul Rental, maupun modul lainnya) wajib divalidasi menggunakan kombinasi **Zod** dan hook **`useForm`** dari `@adatrack/ui`:

1. **Definisi Skema Zod**:
   - Definisikan fungsi skema di dalam file `types/[domain].ts`, misalnya `get[Domain]FormSchema(t?: Record<string, string>)`.
   - Gunakan parameter kamus `t` agar pesan error mendukung dwi-bahasa (ID dan EN).
   - Ekspor juga tipe inferensi: `export type [Domain]FormValues = z.infer<ReturnType<typeof get[Domain]FormSchema>>;`.

2. **Penggunaan Hook `useForm`**:
   - Gunakan hook `useForm<[Domain]>` dari `@adatrack/ui`.
   - Konfigurasi `schema`, `initialData`, `resetOn: [open, item]`, `onSubmit`, dan `onError`.
   - Callback `onError` wajib menampilkan `toast.error(...)` untuk memberi umpan balik visual global jika ada field yang gagal divalidasi.

3. **Binding Error ke Komponen Form UI**:
   - Setiap komponen input dari `@adatrack/ui` (`InputString`, `InputSelect`, `InputTextarea`, `InputDate`, `InputPhone`, dll.) wajib menerima prop `error={errors.[field]}`.
   - DILARANG menonaktifkan tombol simpan secara diam-diam (`disabled={!isValid}`) tanpa memberikan pesan error; biarkan tombol dapat diklik agar memicu validasi dan menyorot field yang belum lengkap.
   - Untuk form dengan peta interaktif (seperti Geofence dan Rute), sediakan banner peringatan visual jika area geometri belum digambar (`errors.geometry` / `errors.origin`).

4. **Integrasi `<FormShell>`**:
   - Selalu sertakan `onSave={() => handleSubmit()}` dan `onSubmit={handleSubmit}` pada `<FormShell>` agar tombol simpan di footer dapat memicu submit dengan benar.
