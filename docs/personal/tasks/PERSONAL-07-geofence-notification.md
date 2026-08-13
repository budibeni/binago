# BINAGO Personal — PERSONAL-07

## Geofence & Notification

**Scope:** Frontend BINAGO Personal  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun Geofence dan konfigurasi Notifikasi sebagai bagian dari Pengaturan.

Struktur:

```text
Pengaturan
├── Geofence
└── Notifikasi
```

Keduanya bukan primary navigation.

---

# 2. Geofence

Geofence dapat menampilkan:

- nama area
- radius
- status aktif/nonaktif
- kendaraan terkait jika diperlukan

Contoh:

```text
Rumah
Radius 100 m
Aktif

Kantor
Radius 200 m
Aktif

Sekolah
Radius 150 m
Nonaktif
```

---

# 3. Geofence Interaction

Minimal:

- list geofence
- enable/disable
- tambah geofence jika termasuk scope implementasi
- edit geofence jika termasuk scope implementasi
- hapus/nonaktifkan sesuai aturan project

Semua data dummy/mock.

Tidak ada backend production.

---

# 4. Notification

Konfigurasi:

```text
Kendaraan mulai bergerak     ON
Kendaraan berhenti           ON
Kendaraan offline            ON
Masuk Geofence               ON
Keluar Geofence              ON
```

Gunakan Switch/foundation component yang sudah tersedia.

---

# 5. Header Indicator

Jika sesuai dengan shell Personal, notification indicator dapat ditampilkan pada header.

Indicator hanya presentation layer.

Tidak ada notification service production.

---

# 6. Responsive

Mobile-first.

Konfigurasi harus mudah digunakan dengan touch.

Desktop tetap nyaman digunakan.

---

# 7. Accessibility

Perhatikan:

- label
- keyboard navigation
- focus
- switch accessibility
- semantic HTML
- contrast
- touch target

---

# 8. Internationalization

Minimal:

```text
Indonesia
English
```

Default Indonesia.

Semua label UI menggunakan i18n.

---

# 9. Validation

- Typecheck
- ESLint
- Build
- Mobile
- Tablet
- Desktop
- i18n
- Accessibility
- Geofence toggle
- Notification toggle

---

# 10. Definition of Done

- [ ] Geofence selesai.
- [ ] Notification settings selesai.
- [ ] Dummy data berfungsi.
- [ ] Toggle berfungsi.
- [ ] Responsive diperiksa.
- [ ] i18n diperiksa.
- [ ] Accessibility diperiksa.
- [ ] Typecheck PASS.
- [ ] ESLint PASS.
- [ ] Build PASS.
- [ ] Completion Report dibuat.

---

# 11. Completion Report

```text
# Laporan Penyelesaian PERSONAL-07

## Status
COMPLETED

## Implementasi
- Menambahkan mock data latitude dan longitude pada `mockSettingsData.ts`.
- Menambahkan translasi form Geofence pada `i18n/index.ts`.
- Refactor `NotificationsSection.tsx` menggunakan komponen `Switch` dari `@binago/ui`.
- Implementasi penuh `GeofenceSection.tsx` mencakup List, form Tambah/Edit dengan validasi, representasi visual peta menggunakan `MapContainer`, dan Dialog Hapus dari `@binago/ui`. Semua menggunakan local state sesuai arahan dummy/mock data.
- Memperbarui UI form Tambah/Edit Geofence agar sesuai dengan visual direction BINAGO Personal (mobile-first, bottom-sheet style di mobile, layout input yang lebih lega, penyesuaian tombol dan elemen map).
- Melakukan RE-DESIGN pada Geofence List menjadi UI yang lebih compact (Card to List Item), mengubah prioritas action button, merapikan hierarchy header utama (menghapus heading redundant), dan mengubah interaksi (klik item untuk masuk mode edit) sehingga terasa lebih "personal app" alih-alih "admin dashboard".

## File Dibuat
- (Tidak ada file baru, semua di-update)

## File Diubah
- `apps/personal/src/features/settings/data/mockSettingsData.ts`
- `apps/personal/src/features/settings/components/NotificationsSection.tsx`
- `apps/personal/src/features/settings/components/GeofenceSection.tsx`
- `apps/personal/src/i18n/index.ts`

## Component
- `@binago/ui`: Switch, Button, Dialog, Input, Label
- `@binago/maps`: MapContainer

## Dummy Data
- Memperbarui `GeofenceData` dengan `latitude` dan `longitude`
- State lokal digunakan untuk operasi CRUD Geofence (Add, Edit, Delete, Toggle).

## Validation
- [x] Typecheck PASS
- [x] ESLint PASS
- [x] Build PASS
- [x] Fungsi Tambah, Edit, Hapus, Toggle Geofence berfungsi
- [x] Fungsi Toggle Notifikasi berfungsi
- [x] Responsive dipertahankan dengan UI mobile-first

## Masalah
- (Tidak ada)

## Catatan
- Lokasi peta belum menggunakan Map Picker interaktif yang dapat di-drag, melainkan input manual text, namun `MapContainer` tetap menampilkan indikator visual (MapPin) di titik yang sesuai. Tampilan koordinat default disembunyikan untuk memberikan look yang lebih clean.
- State hanya berjalan di level komponen dan akan reset jika direfresh.

## Task Berikutnya
- Selesai (Menunggu instruksi selanjutnya).
```

---

# 12. STOP

Setelah Definition of Done dan Completion Report terpenuhi:

> **BERHENTI.**

Tidak ada task Personal berikutnya yang dikerjakan tanpa instruksi baru.
