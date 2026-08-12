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

# 12. STOP

Setelah Definition of Done dan Completion Report terpenuhi:

> **BERHENTI.**

Tidak ada task Personal berikutnya yang dikerjakan tanpa instruksi baru.
