# ADATRACK Personal â€” PERSONAL-01

## Personal Shell & Navigation

**Scope:** Frontend ADATRACK Personal  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun Application Shell khusus ADATRACK Personal yang mobile-first, berbeda dari Shell ADATRACK Business, dan menjadi fondasi seluruh halaman Personal.

Shell harus mendukung:

- Header Personal
- Top Navigation pada desktop
- Bottom Navigation pada mobile
- responsive layout
- language toggle
- theme toggle
- user menu
- content area

Task ini hanya mengerjakan Personal Shell dan navigation.

---

# 2. Prasyarat

Sebelum bekerja:

1. Baca `AGENTS.md`.
2. Baca `docs/adatrack-personal.md`.
3. Baca dokumentasi project yang relevan.
4. Periksa implementasi `apps/personal` yang sudah ada.
5. Periksa component generic yang tersedia di `packages/ui`.
6. Jangan membuat ulang component generic yang sudah tersedia.
7. Jangan memperluas scope.

---

# 3. Aturan Umum

- Source code menggunakan English.
- UI menggunakan i18n Indonesia/English.
- Default UI Indonesia.
- Gunakan Tailwind CSS.
- Gunakan reusable component.
- Jangan membuat backend/API/database production.
- Jangan menggunakan Sidebar Business sebagai navigation utama Personal.
- Jangan membuat Global Search.
- Jangan mengerjakan PERSONAL-02 atau task berikutnya.
- Component tidak boleh melakukan fetch data sendiri.
- Data/state utama dikelola oleh page/layout/feature dan dikirim melalui props.

---

# 4. Navigation

ADATRACK Personal memiliki tiga primary navigation:

1. Pemantauan
2. Statistik
3. Pengaturan

## Mobile

Gunakan Bottom Navigation.

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                 â”‚
â”‚          CONTENT AREA           â”‚
â”‚                                 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Pemantauan  Statistik  Pengaturanâ”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Desktop

Gunakan Top Navigation.

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ ADATRACK Personal                              â”‚
â”‚                                              â”‚
â”‚ Pemantauan    Statistik    Pengaturan       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Jangan menggunakan Sidebar Business sebagai navigation utama Personal.

---

# 5. Component Architecture

Gunakan component generic dari `@adatrack/ui` jika tersedia.

Component khusus Personal berada di:

```text
apps/personal/src/components/
```

atau feature terkait jika memang feature-specific.

Jangan memindahkan component ke `packages/ui` hanya karena digunakan oleh beberapa halaman Personal.

---

# 6. Shell Responsibilities

Shell bertanggung jawab terhadap:

- struktur halaman
- header
- navigation
- responsive composition
- theme
- language
- user menu
- content slot

Shell tidak bertanggung jawab terhadap business data.

---

# 7. Responsive

Validasi minimal:

- Mobile
- Tablet
- Desktop

Mobile menjadi baseline.

Desktop tidak boleh sekadar memperbesar layout mobile.

---

# 8. Accessibility

Perhatikan:

- semantic HTML
- keyboard navigation
- focus state
- accessible labels
- active navigation state
- touch target
- contrast

---

# 9. Internationalization

Minimal:

```text
Indonesia
English
```

Default:

```text
Indonesia
```

Semua label navigation dan shell yang terlihat pengguna harus melalui i18n.

---

# 10. Validation

Setelah implementasi:

```text
Typecheck
ESLint
Build
Functional validation
```

Validasi:

- navigation aktif
- mobile bottom navigation
- desktop top navigation
- language toggle
- theme toggle
- user menu
- responsive layout

---

# 11. Definition of Done

- [ ] Personal Shell selesai.
- [ ] Bottom Navigation mobile berfungsi.
- [ ] Top Navigation desktop berfungsi.
- [ ] Tidak menggunakan Sidebar Business.
- [ ] i18n ID/EN berfungsi.
- [ ] Theme toggle berfungsi.
- [ ] User menu berfungsi.
- [ ] Responsive diperiksa.
- [ ] Accessibility dasar diperiksa.
- [ ] Typecheck PASS jika tersedia.
- [ ] ESLint PASS.
- [ ] Build PASS.
- [ ] Tidak ada perubahan di luar scope.
- [ ] Completion Report dibuat.

---

# 12. Completion Report

Gunakan:

```text
# Laporan Penyelesaian PERSONAL-01

## Status

## Implementasi

## File Dibuat

## File Diubah

## Component

## Validation

## Masalah

## Catatan

## Task Berikutnya
```

`Task Berikutnya` hanya informasi.

---

# 13. STOP

Setelah Definition of Done dan Completion Report terpenuhi:

> **BERHENTI.**

Jangan mengerjakan PERSONAL-02 tanpa instruksi baru.
