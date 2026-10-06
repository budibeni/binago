# ADATRACK - Development Rules

## 1. General

Pahami source code sebelum membuat perubahan.

Gunakan component existing jika tersedia.

## 2. Naming

Source code menggunakan English.

UI menggunakan translation.

## 3. Component

Generic component harus reusable dan bebas business logic.

Feature component boleh mengandung logic domain feature.

### Feature Components

Setiap feature menggunakan pola component standar:

- `[Domain]Feature.tsx` — orchestrator utama: mengelola state, render DataTable, dan Overlay Drawer (tambah/edit/detail).
- `[Domain]Table.tsx` — presentasi data tabular menggunakan DataTable Foundation.
- `[Domain]Form.tsx` — form utama yang di-render sebagai Drawer di dalam `[Domain]Feature.tsx`. Datatable akan tetap terlihat di latar belakang.
- `[Domain]View.tsx` — tampilan detail read-only, di-render sebagai Drawer di dalam `[Domain]Feature.tsx`.

### Aturan Navigasi Overlay vs Halaman Terpisah

1. **Overlay / Drawer Mode (Standar ADATRACK):**
   Jika UI mengharuskan form muncul sebagai dialog/drawer di atas tabel, **JANGAN MENGGUNAKAN `router.push()`** yang menyebabkan tabel ter-unmount.
   Sebaliknya, buka *state* drawer dari dalam `[Domain]Feature.tsx` dan manipulasi URL secara visual menggunakan:
   ```ts
   window.history.pushState(null, '', '/domain-route/edit');
   setEditId(id); // atau setFormOpen(true)
   ```
   Lalu, pulihkan URL saat drawer ditutup menggunakan pushState yang sama.

2. **Standalone Page Mode (Direct URL / Refresh):**
   Meskipun menggunakan Drawer Mode (seperti penjelasan di atas), Anda diizinkan membuat rute terpisah (misal `app/.../edit/[id]/page.tsx` dan `[Domain]EditFeature.tsx`) **HANYA** untuk menangani kasus di mana *user* mengakses URL tersebut secara langsung (*deep-linking* / *refresh* halaman). Dalam mode ini, datatable memang tidak ditampilkan.
   Jika form benar-benar dirancang eksklusif sebagai halaman penuh (bukan drawer sama sekali), maka `[Domain]CreateFeature.tsx` dan `[Domain]EditFeature.tsx` digunakan secara utuh bersama `router.push()`.

## 4. i18n

Setiap feature yang memiliki teks UI wajib menyertakan `i18n.ts`.

Struktur `i18n.ts`:

```ts
export const [domain]Dictionaries = {
  id: { /* terjemahan Bahasa Indonesia */ },
  en: { /* terjemahan English */ },
};

export function get[Domain]Translation(locale: Locale = 'id') {
  return [domain]Dictionaries[locale] ?? [domain]Dictionaries.id;
}
```

Aturan penggunaan:

- Locale dibaca menggunakan `useBusinessLocale()` (atau hook locale yang relevan) di `[Domain]Feature.tsx`.
- Hasil terjemahan (`t`) di-pass sebagai prop ke `[Domain]Table`, `[Domain]Form`, dan `[Domain]View`.
- Jangan hardcode teks UI Indonesia atau English langsung di JSX — selalu gunakan `t.*`.

## 5. State

Prioritas:

```text
local ↓ feature ↓ global
```

Gunakan global state hanya jika diperlukan.

## 6. Forms

Gunakan React Hook Form dan Zod jika form membutuhkan validation.

## 7. Styling

Gunakan Tailwind CSS.

Jangan menambahkan UI framework lain.

## 8. Dummy Data

Gunakan dummy data selama frontend-only development.

Dummy data harus realistis dan konsisten.

## 9. Dependency

Jangan menambah dependency tanpa kebutuhan nyata.

## 10. Validation

Jalankan typecheck, lint, build, dan functional validation sesuai Task.

## 11. Refactoring

Refactoring kecil diperbolehkan.
Refactoring besar harus dikonsultasikan.

## 12. Overengineering

Pilih solusi sederhana yang cukup untuk kebutuhan saat ini.
