# ADATRACK - AGENTS.md

## AI Development Instructions

Dokumen ini adalah **acuan utama Antigravity AI** ketika bekerja pada project ADATRACK.

Antigravity AI **WAJIB membaca file ini sebelum melakukan perubahan apa pun pada project**.

Detail architecture, design system, business rules, UI guidelines, dan requirement setiap Task berada di dalam dokumentasi project.

---

# 1. LOKASI REPOSITORY DAN DOKUMENTASI

`AGENTS.md` berada di root repository ADATRACK.

Seluruh dokumentasi resmi project ADATRACK berada di:

```text
/docs
```

Struktur utamanya:

```text
ADATRACK/
â"œâ"€â"€ AGENTS.md
â"‚
â""â"€â"€ docs/
    â"œâ"€â"€ README.md
    â"œâ"€â"€ project-overview.md
    â"œâ"€â"€ architecture.md
    â"œâ"€â"€ folder-structure.md
    â"œâ"€â"€ development-rules.md
    â"œâ"€â"€ business-rules.md
    â"œâ"€â"€ design-system.md
    â"œâ"€â"€ ui-guidelines.md
    â"œâ"€â"€ database-design.md
    â"œâ"€â"€ api-standard.md
    â"œâ"€â"€ coding-standard.md
    â"œâ"€â"€ deployment.md
    â"œâ"€â"€ task-roadmap.md
    â"‚
    â""â"€â"€ tasks/
        â"œâ"€â"€ TASK-01-foundation.md
        â"œâ"€â"€ TASK-02-design-system.md
        â"œâ"€â"€ TASK-03-application-shell.md
        â"œâ"€â"€ TASK-04-home.md
        â"œâ"€â"€ TASK-05-tracking.md
        â"œâ"€â"€ TASK-06-vehicles.md
        â"œâ"€â"€ TASK-07-drivers.md
        â"œâ"€â"€ TASK-08-deliveries.md
        â"œâ"€â"€ TASK-09-maintenance.md
        â"œâ"€â"€ TASK-10-devices.md
        â"œâ"€â"€ TASK-11-geofences.md
        â"œâ"€â"€ TASK-12-reports.md
        â"œâ"€â"€ TASK-13-administration.md
        â""â"€â"€ TASK-14-production-readiness.md
```

### Aturan lokasi dokumentasi

1. Baca `/AGENTS.md` terlebih dahulu.
2. Dokumentasi resmi project dicari di `/docs`.
3. Task dicari di `/docs/tasks/`.
4. Jangan mencari atau membuat dokumentasi project di folder lain tanpa instruksi eksplisit.
5. Jika AI dijalankan dari subdirectory, gunakan **root repository** sebagai acuan untuk menemukan `AGENTS.md` dan `/docs`.
6. Jika dokumentasi yang dibutuhkan tidak ditemukan di `/docs`, jangan mengarang isinya. Laporkan kondisi tersebut.

---

# 2. IDENTITAS PROJECT

Nama project:

```text
ADATRACK
```

ADATRACK memiliki dua application:

```text
ADATRACK Business
ADATRACK Personal
```

Business dan Personal merupakan application yang terpisah, tetapi dapat menggunakan shared foundation yang memang bersifat reusable.

Scope saat ini adalah frontend menggunakan dummy/mock data.

---

# 3. SCOPE SAAT INI

Task frontend berfokus pada:

- UI
- UX
- Component
- Layout
- Interaction
- Dummy Data
- State UI
- Responsive
- Accessibility
- Internationalization
- Frontend Validation

Task frontend saat ini TIDAK membuat:

- Production Backend
- Production Database
- Production API
- GPS Engine
- Real-time GPS Server
- Real Device Integration
- MQTT
- TCP GPS Protocol
- WebSocket GPS Backend
- Device Provisioning Production
- Production Authentication Backend

Jangan membuat architecture production yang belum diperlukan.

---

# 4. TASK

Istilah resmi adalah **Task**, bukan Fase atau Phase.

```text
Task 01 - Foundation
Task 02 - Design System
Task 03 - Application Shell
Task 04 - Home
Task 05 - Tracking
Task 06 - Vehicles
Task 07 - Drivers
Task 08 - Deliveries
Task 09 - Maintenance
Task 10 - Devices
Task 11 - Geofences
Task 12 - Reports
Task 13 - Administration
Task 14 - Production Readiness
```

Nama Task internal menggunakan English. Label UI menggunakan Bahasa Indonesia.

AI hanya mengerjakan Task aktif dan tidak otomatis mengerjakan Task berikutnya.

---

# 5. BAHASA DAN PENAMAAN

Dokumentasi wajib menggunakan Bahasa Indonesia.

UI ADATRACK mendukung:

```text
Indonesia
English
```

Default UI:

```text
Indonesia
```

Source code dan identifier teknis wajib menggunakan English.

Ini mencakup:

- folder
- file
- route internal
- feature
- component
- hook
- store
- type
- interface
- function
- variable
- constant
- API endpoint
- database table/field jika nantinya dibuat

Contoh:

```text
features/
â"œâ"€â"€ tracking/
â"œâ"€â"€ vehicles/
â"œâ"€â"€ drivers/
â"œâ"€â"€ deliveries/
â"œâ"€â"€ maintenance/
â"œâ"€â"€ devices/
â"œâ"€â"€ geofences/
â"œâ"€â"€ reports/
â""â"€â"€ administration/
```

Label UI:

```text
tracking       â†' Pemantauan
vehicles       â†' Armada
drivers        â†' Pengemudi
deliveries     â†' Pengiriman
maintenance    â†' Perawatan
devices        â†' Perangkat
geofences      â†' Geofence
reports        â†' Laporan
administration â†' Administrasi
```

Jangan menggunakan Bahasa Indonesia untuk identifier teknis.

---

# 6. HIERARKI DOKUMENTASI

Gunakan urutan:

```text
1. AGENTS.md
2. Dokumentasi project yang relevan dari /docs
3. Task aktif dari /docs/tasks/
4. Source code yang sudah ada
```

Dokumentasi tidak perlu dibaca seluruhnya jika tidak relevan, tetapi AI wajib memastikan aturan yang diperlukan sudah dipahami.

---

# 7. SUMBER KEBENARAN

Prioritas:

1. Keputusan terbaru yang secara eksplisit disepakati
2. AGENTS.md
3. Architecture / Business Rules
4. Design System / UI Guidelines
5. Task aktif
6. Task sebelumnya yang relevan
7. Source code
8. Keputusan teknis AI

Jika terdapat konflik yang menyangkut business rule, architecture, scope, navigation, data model, role/permission, atau application boundary dan tidak dapat diselesaikan dari dokumentasi:

> **STOP dan minta arahan.**

---

# 8. AUTONOMI AI

Gunakan **guided autonomy**.

AI boleh mengambil keputusan teknis selama:

- masih dalam scope Task
- tidak mengubah business rule
- tidak mengubah architecture besar
- tidak mengubah design direction
- tidak menambah dependency penting tanpa alasan
- tidak memengaruhi Task lain secara berbahaya

AI boleh menentukan:

- struktur component internal
- nama function/variable
- internal helper
- refactoring kecil
- dummy data
- local state
- perbaikan bug yang jelas
- detail implementasi teknis

AI tidak boleh menentukan sendiri:

- business rule baru
- architecture baru
- perubahan navigation utama
- perubahan application boundary
- perubahan role/permission
- feature baru
- perubahan scope Task
- penghapusan feature yang sudah ditetapkan

---

# 9. WORKFLOW AI

Setiap Task:

```text
Baca AGENTS.md
â†"
Identifikasi Task aktif
â†"
Baca dokumentasi relevan dari /docs
â†"
Baca Task aktif dari /docs/tasks/
â†"
Periksa source code
â†"
Buat implementation plan
â†"
Implementasi
â†"
Validation
â†"
Periksa Definition of Done
â†"
Completion Report
â†"
STOP
```

Planning wajib dilakukan sebelum coding, tetapi tidak perlu meminta approval jika masih dalam scope.

---

# 10. COMPONENT

Sebelum membuat component, periksa apakah component reusable sudah tersedia.

Generic component digunakan lintas feature, misalnya:

```text
Button
Input
Select
Dialog
Card
DataTable
Tabs
Badge
Drawer
```

Feature component digunakan untuk domain tertentu, misalnya:

```text
VehicleTable
DriverTable
DeliveryTimeline
MaintenanceDetail
GeofenceEditor
```

Jangan membuat duplicate generic component.

---

# 11. DESIGN SYSTEM

Gunakan Design System ADATRACK yang telah ditentukan.

Jika kebutuhan sudah dapat dipenuhi component existing, gunakan component existing.

Jangan membuat pola UI baru tanpa kebutuhan.

---

# 12. UI / UX

UI ADATRACK harus:

- modern
- clean
- professional
- enterprise
- consistent
- responsive

Tidak ada Global Search pada Header.

Search berada pada halaman/module yang membutuhkan pencarian.

---

# 13. BUSINESS DAN PERSONAL

Business dan Personal adalah application terpisah.

Jangan mencampurkan navigation atau business logic keduanya.

Shared component boleh digunakan jika memang generic dan benar-benar shared.

---

# 14. DUMMY DATA

Task frontend menggunakan dummy/mock data.

Dummy data harus:

- realistis
- konsisten antar feature
- memiliki relasi yang masuk akal
- cukup untuk menguji UI
- tidak menggunakan data pribadi nyata

Tidak perlu database/API production untuk menyediakan dummy data.

---

# 15. STATE

Prioritas:

```text
Local state
â†"
Feature state
â†"
Shared/global state
```

Jangan menggunakan global state jika local/feature state cukup.

---

# 16. DATATABLE

Gunakan DataTable Foundation ADATRACK.

Kemampuan:

- Pagination
- Infinite Scroll
- Text Search
- Sorting
- Optional Column Filter
- Show/Hide Column
- Export
- Freeze Column
- Sticky Header
- Horizontal Scroll

Header kolom harus tetap terlihat ketika data melakukan vertical scroll.

Jangan membuat table engine baru untuk feature tertentu.

---

# 17. RESPONSIVE DAN ACCESSIBILITY

Semua halaman diuji pada:

```text
Desktop
Tablet
Mobile
```

Perhatikan overflow, table, drawer, dialog, form, map, chart, dan navigation.

Accessibility mencakup:

- keyboard navigation
- focus state
- semantic HTML
- form label
- button/link semantics
- dialog accessibility
- table accessibility

---

# 18. BUSINESS RULE DAN ARCHITECTURE

AI tidak boleh mengarang business rule.

Jika business rule belum ditentukan:

> **STOP dan minta keputusan.**

AI tidak boleh mengganti architecture hanya karena memiliki pendekatan yang dianggap lebih baik.

Jika architecture existing benar-benar tidak dapat memenuhi kebutuhan:

```text
STOP
â†' jelaskan masalah
â†' jelaskan opsi
â†' minta arahan
```

---

# 19. SCOPE TASK

AI hanya mengerjakan Task aktif.

Pekerjaan Task berikutnya yang ditemukan hanya dicatat sebagai dependency/backlog.

Jangan memperluas scope.

---

# 20. KONDISI WAJIB STOP

AI wajib berhenti dan meminta arahan jika:

- requirement ambigu
- konflik dokumentasi
- perubahan architecture besar diperlukan
- perubahan business rule diperlukan
- perubahan application boundary diperlukan
- perubahan scope Task diperlukan
- keputusan role/permission belum ditentukan
- AI tidak dapat melanjutkan tanpa asumsi penting

Selain itu AI boleh mengambil keputusan teknis sendiri selama masih dalam scope.

---

# 21. VALIDATION

Jika tersedia, jalankan minimal:

```text
Typecheck
ESLint
Build
```

Tambahkan functional validation sesuai Task.

Jangan menyatakan Task selesai jika validation utama gagal.

---

# 22. DEPENDENCY

Jangan menambahkan dependency hanya karena lebih mudah.

Periksa functionality existing dan dependency yang sudah tersedia terlebih dahulu.

Dependency besar yang mengubah architecture membutuhkan arahan.

---

# 23. OVERENGINEERING

Gunakan prinsip:

> Implementasikan kebutuhan yang diperlukan sekarang dengan struktur yang dapat berkembang, bukan sistem kompleks untuk kebutuhan yang belum ada.

Hindari abstraction, framework internal, configuration engine, plugin system, state management kompleks, atau API abstraction palsu tanpa kebutuhan nyata.

---

# 24. DEFINITION OF DONE

Setiap Task harus memiliki Definition of Done.

Status:

```text
COMPLETED
PARTIALLY COMPLETED
BLOCKED
```

Jangan menyatakan COMPLETED jika requirement utama atau validation utama belum terpenuhi.

---

# 25. COMPLETION REPORT

Setelah Task selesai:

```text
# Laporan Penyelesaian Task XX

## Status

## Implementasi

## File Dibuat

## File Diubah

## Component

## Dummy Data

## Validation

## Masalah

## Catatan

## Task Berikutnya
```

Task berikutnya hanya informasi.

---

# 26. STOP RULE

Setelah Definition of Done, validation, dan Completion Report terpenuhi:

> **STOP.**

Jangan otomatis mengerjakan Task berikutnya atau menambahkan feature di luar scope.

---

# 27. PRINSIP AKHIR

```text
Pahami sebelum membuat.
Periksa sebelum membuat ulang.
Gunakan yang sudah tersedia.
Cari dokumentasi resmi di /docs.
Jangan mengarang business rule.
Jangan memperluas scope.
Jangan overengineering.
Validasi sebelum menyatakan selesai.
Dokumentasikan hasil.
STOP setelah Task selesai.
```
