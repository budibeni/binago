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

## 4. State

Prioritas:

```text
local â†' feature â†' global
```

Gunakan global state hanya jika diperlukan.

## 5. Forms

Gunakan React Hook Form dan Zod jika form membutuhkan validation.

## 6. Styling

Gunakan Tailwind CSS.

Jangan menambahkan UI framework lain.

## 7. Dummy Data

Gunakan dummy data selama frontend-only development.

Dummy data harus realistis dan konsisten.

## 8. Dependency

Jangan menambah dependency tanpa kebutuhan nyata.

## 9. Validation

Jalankan typecheck, lint, build, dan functional validation sesuai Task.

## 10. Refactoring

Refactoring kecil diperbolehkan.
Refactoring besar harus dikonsultasikan.

## 11. Overengineering

Pilih solusi sederhana yang cukup untuk kebutuhan saat ini.
