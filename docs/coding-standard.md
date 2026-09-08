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
