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

- `[Domain]Feature.tsx` — orchestrator: mengelola state, data loading, dan layout halaman.
- `[Domain]Table.tsx` — presentasi data tabular menggunakan DataTable Foundation.
- `[Domain]Form.tsx` — form untuk add/edit, biasanya ditampilkan sebagai drawer.
- `[Domain]View.tsx` — tampilan detail read-only, biasanya sebagai drawer (opsional).

Jika feature memerlukan halaman create/edit terpisah (form kompleks, navigasi sendiri),
gunakan `[Domain]CreateFeature.tsx` dan `[Domain]EditFeature.tsx` sebagai pengganti `[Domain]Form.tsx`.

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
local â†' feature â†' global
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
