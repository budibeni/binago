# ADATRACK â€” Task 05

## Tracking

**Scope:** Frontend ADATRACK  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun fondasi Halaman Pemantauan ADATRACK dengan component yang reusable untuk:

- daftar kendaraan
- pencarian kendaraan
- filter kendaraan
- status kendaraan
- Live Tracking
- Playback
- Heatmap
- Overview / detail kendaraan
- dummy tracking data
- responsive layout

Task ini hanya mengerjakan scope yang disebutkan dalam dokumen ini dan dokumentasi terkait.

Implementasi dilakukan secara bertahap per component.

Jangan mengimplementasikan seluruh feature Tracking sekaligus apabila instruksi hanya meminta satu step.

---

# 2. Prasyarat

Sebelum bekerja:

1. Baca `AGENTS.md`.
2. Baca dokumentasi project yang relevan.
3. Baca Task sebelumnya yang menjadi dependency.
4. Periksa source code yang sudah ada.
5. Periksa component foundation yang tersedia di `packages/ui`.
6. Periksa foundation `packages/maps` yang tersedia dari TASK-02.
7. Periksa component Tracking yang sudah dibuat pada step sebelumnya.
8. Jangan membuat ulang component yang sudah tersedia.
9. Jangan memperluas scope.
10. Jangan mengerjakan step berikutnya tanpa instruksi baru.

---

# 3. Aturan Umum

- Source code menggunakan English.
- UI menggunakan i18n Indonesia/English.
- Default UI Indonesia.
- Gunakan Tailwind CSS.
- Gunakan reusable component.
- Gunakan design token ADATRACK.
- Gunakan dummy/mock data.
- Jangan membuat backend/API production.
- Jangan membuat database production.
- Jangan menggunakan Global Search pada Header.
- Jangan mengerjakan Task berikutnya.
- Jangan membuat component melakukan fetch data sendiri.
- Jangan membuat component memiliki sumber data sendiri.
- Data dan state utama dikelola oleh parent/page/feature.
- Component menerima data melalui props.
- Event dari component dikirim kembali melalui callback props.
- Jangan membuat business logic di dalam presentation component jika logic tersebut seharusnya berada pada parent/feature.
- Jangan membuat generic component baru jika component foundation yang sesuai sudah tersedia.

---

# 4. Scope

Task 05 mencakup fondasi frontend Tracking:

1. VehicleList
2. LiveMap
3. PlaybackPanel
4. HeatmapPanel
5. VehicleOverview
6. Dummy tracking data
7. Filter dan status kendaraan
8. Composition component pada halaman Tracking
9. Responsive behavior
10. Internationalization
11. Accessibility dasar

Component tersebut dibuat secara terpisah dan reusable.

Tidak ada kewajiban untuk membuat satu parent component yang menggabungkan Live, Playback, dan Heatmap.

---

# 5. Component Architecture

## 5.1 Prinsip

Tracking menggunakan pendekatan:

```text
Page / Feature
    â”‚
    â”œâ”€â”€ Data
    â”œâ”€â”€ State
    â”œâ”€â”€ Event Handler
    â””â”€â”€ Component Composition
             â”‚
             â”œâ”€â”€ VehicleList
             â”œâ”€â”€ LiveMap
             â”œâ”€â”€ PlaybackPanel

> **BERHENTI.**

Jangan mengerjakan Task berikutnya tanpa instruksi baru.
