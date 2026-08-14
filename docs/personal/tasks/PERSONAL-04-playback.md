# ADATRACK Personal â€” PERSONAL-04

## Playback

**Scope:** Frontend ADATRACK Personal  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun halaman Playback untuk memutar kembali perjalanan kendaraan yang dipilih.

Flow:

```text
Vehicle Detail
    â†“
Riwayat Perjalanan
    â†“
Pilih Perjalanan
    â†“
Playback
```

Playback bukan tab dari Live Monitoring.

---

# 2. Scope

Playback dapat menampilkan:

- kendaraan
- route/path
- map
- vehicle marker
- timeline
- play
- pause
- progress
- waktu
- jarak
- durasi
- kecepatan

---

# 3. Data

Gunakan dummy perjalanan yang memiliki:

- titik koordinat
- timestamp
- speed
- distance
- heading jika diperlukan

Data dikelola parent/feature.

Playback component tidak membuat dummy data sendiri.

---

# 4. Interaction

Minimal:

- Play
- Pause
- Reset
- progress/timeline
- perubahan posisi marker berdasarkan progress
- informasi perjalanan

Kecepatan playback dapat dipertimbangkan jika tidak memperluas scope secara signifikan.

---

# 5. Responsive

Mobile-first.

Pastikan kontrol playback mudah digunakan dengan touch.

Desktop menggunakan ruang map yang lebih besar.

---

# 6. Accessibility

Perhatikan:

- accessible button labels
- keyboard controls
- focus state
- contrast
- touch target

---

# 7. Validation

- Typecheck
- ESLint
- Build
- Functional playback
- Mobile
- Tablet
- Desktop
- i18n
- Accessibility

---

# 8. Definition of Done

- [ ] Playback page selesai.
- [ ] Route dummy ditampilkan.
- [ ] Marker dapat bergerak mengikuti timeline.
- [ ] Play/Pause berfungsi.
- [ ] Progress berfungsi.
- [ ] Informasi perjalanan tampil.
- [ ] Responsive diperiksa.
- [ ] i18n diperiksa.
- [ ] Accessibility diperiksa.
- [ ] Typecheck PASS.
- [ ] ESLint PASS.
- [ ] Build PASS.
- [ ] Completion Report dibuat.

---

# 9. Completion Report

```text
# Laporan Penyelesaian PERSONAL-04

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

# 10. STOP

> **BERHENTI.**

Jangan mengerjakan PERSONAL-05 tanpa instruksi baru.
