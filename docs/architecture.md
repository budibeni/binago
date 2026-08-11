# BINAGO — Architecture

## 1. Prinsip

Architecture harus sederhana, modular, reusable, dan dapat berkembang.

Jangan membuat abstraction sebelum ada kebutuhan.

## 2. Application

```text
BINAGO Platform
├── Business
└── Personal
```

Application Business dan Personal terpisah.

## 3. Monorepo

Target struktur:

```text
apps/
├── business/
└── personal/

packages/
├── ui/
├── design-system/
├── maps/
├── icons/
├── utils/
└── types/
```

## 4. Frontend Boundary

Saat ini:

```text
UI
↓
Feature Logic
↓
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
