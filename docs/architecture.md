# ADATRACK - Architecture

## 1. Prinsip

Architecture harus sederhana, modular, reusable, dan dapat berkembang.

Jangan membuat abstraction sebelum ada kebutuhan.

## 2. Application

```text
ADATRACK Platform
â"œâ"€â"€ Business
â""â"€â"€ Personal
```

Application Business dan Personal terpisah.

## 3. Monorepo

Target struktur:

```text
apps/
â"œâ"€â"€ business/
â""â"€â"€ personal/

packages/
â"œâ"€â"€ ui/
â"œâ"€â"€ design-system/
â"œâ"€â"€ maps/
â"œâ"€â"€ icons/
â"œâ"€â"€ utils/
â""â"€â"€ types/
```

## 4. Frontend Boundary

Saat ini:

```text
UI
â†"
Feature Logic
â†"
Dummy / Mock Data
```

Backend integration akan dibuat pada pekerjaan terpisah.

## 5. Shared Layer

Shared package hanya untuk kebutuhan yang benar-benar generic.

Jangan memindahkan business logic ke shared package hanya untuk mengurangi jumlah file.

## 6. Feature Boundary

Feature sebaiknya memiliki boundary yang jelas dan tidak bergantung langsung pada feature lain tanpa alasan.

## 7. Architecture Change

Perubahan architecture besar harus dihentikan dan dikonsultasikan.
