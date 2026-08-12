# BINAGO Personal — PERSONAL-02

## Monitoring

**Scope:** Frontend BINAGO Personal  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun halaman Pemantauan BINAGO Personal sebagai halaman utama setelah login.

Fokus:

- Vehicle List
- Live Map
- status kendaraan
- selected vehicle
- responsive composition

Struktur utama:

```text
Pemantauan
├── VehicleList
└── LiveMap
```

Tidak membuat Playback atau Heatmap pada task ini.

---

# 2. Prasyarat

1. Baca `AGENTS.md`.
2. Baca `docs/binago-personal.md`.
3. Baca PERSONAL-01.
4. Periksa source code Personal.
5. Gunakan component yang sudah tersedia.
6. Jangan memperluas scope.

---

# 3. Aturan

- Source code English.
- UI i18n Indonesia/English.
- Default Indonesia.
- Tailwind CSS.
- Dummy/mock data.
- Tidak ada backend/API production.
- Component menerima data melalui props.
- Component tidak melakukan fetch sendiri.
- Data/state utama dikelola oleh feature/page.
- Jangan membuat Heatmap.
- Jangan membuat Playback.
- Jangan mengerjakan PERSONAL-03.

---

# 4. Scope

## 4.1 VehicleList

Menampilkan:

- kendaraan
- nomor kendaraan
- tipe kendaraan
- status
- kecepatan jika tersedia
- driver jika tersedia
- selected state

Mendukung:

- search
- filter status
- select vehicle

## 4.2 LiveMap

Menampilkan:

- map
- vehicle marker
- selected vehicle
- map controls
- informasi singkat jika diperlukan

Map menggunakan foundation `@binago/maps` jika sesuai.

---

# 5. Data Flow

```text
Monitoring Page
      │
      ├── vehicles
      ├── selectedVehicleId
      ├── filter
      └── search
             │
             ↓
        VehicleList
             │
       onVehicleSelect()
             │
             ↓
        Monitoring Page
             │
             ↓
          LiveMap
```

Tidak boleh ada dummy data yang dibuat langsung di VehicleList atau LiveMap.

---

# 6. Responsive

Mobile:

```text
Header
Map
Vehicle List
Bottom Navigation
```

Tablet/Desktop dapat menggunakan layout dua area:

```text
┌──────────────┬──────────────────────┐
│ Vehicle List │      Live Map        │
└──────────────┴──────────────────────┘
```

Composition final mengikuti hasil validasi UX.

---

# 7. Accessibility

Perhatikan:

- list semantics
- keyboard selection
- focus state
- accessible vehicle status
- map controls
- touch target
- contrast

---

# 8. Validation

- Typecheck
- ESLint
- Build
- Functional validation
- Mobile
- Tablet
- Desktop
- Search
- Filter
- Vehicle selection
- Map rendering

---

# 9. Definition of Done

- [ ] Pemantauan selesai.
- [ ] VehicleList selesai.
- [ ] LiveMap selesai.
- [ ] Dummy data berfungsi.
- [ ] Search berfungsi.
- [ ] Filter status berfungsi.
- [ ] Select vehicle berfungsi.
- [ ] Responsive diperiksa.
- [ ] i18n diperiksa.
- [ ] Accessibility dasar diperiksa.
- [ ] Typecheck PASS.
- [ ] ESLint PASS.
- [ ] Build PASS.
- [ ] Tidak ada Playback.
- [ ] Tidak ada Heatmap.
- [ ] Completion Report dibuat.

---

# 10. Completion Report

Gunakan:

```text
# Laporan Penyelesaian PERSONAL-02

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

---

# 11. STOP

> **BERHENTI.**

Jangan mengerjakan PERSONAL-03 tanpa instruksi baru.
