# ADATRACK Personal - PERSONAL-03

## Vehicle Detail & Trip History

**Scope:** Frontend ADATRACK Personal  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun detail kendaraan dan riwayat perjalanan sebagai kelanjutan dari Pemantauan.

Flow:

```text
Pemantauan
    â†"
Pilih Kendaraan
    â†"
Vehicle Detail
    â†"
Riwayat Perjalanan
```

---

# 2. Scope

Vehicle Detail menampilkan:

- kendaraan
- nomor kendaraan
- tipe
- status
- kecepatan
- lokasi
- waktu update
- ringkasan perjalanan

Trip History menampilkan:

- tanggal
- waktu mulai
- waktu selesai
- jarak
- durasi
- kecepatan rata-rata
- kecepatan maksimum

---

# 3. Data Flow

Parent/feature mengelola:

- selected vehicle
- vehicle detail
- trip history
- selected trip

Component menerima data melalui props.

Tidak ada fetch di component.

---

# 4. Playback Boundary

Task ini hanya menyediakan entry point menuju Playback.

Contoh:

```text
Riwayat Perjalanan
      â†"
Pilih Perjalanan
      â†"
Playback
```

Implementasi Playback dikerjakan di PERSONAL-04.

---

# 5. UI

Gunakan component foundation ADATRACK.

Mobile-first.

Detail kendaraan harus mudah dipahami tanpa information density seperti ADATRACK Business.

---

# 6. Validation

- Typecheck
- ESLint
- Build
- Mobile
- Tablet
- Desktop
- i18n
- Accessibility
- Vehicle selection
- Trip selection

---

# 7. Definition of Done

- [ ] Vehicle Detail selesai.
- [ ] Trip History selesai.
- [ ] Dummy data berfungsi.
- [ ] Entry point Playback tersedia.
- [ ] Playback engine belum dibuat.
- [ ] Responsive diperiksa.
- [ ] i18n diperiksa.
- [ ] Accessibility diperiksa.
- [ ] Typecheck PASS.
- [ ] ESLint PASS.
- [ ] Build PASS.
- [ ] Completion Report dibuat.

---

# 8. Completion Report

```text
# Laporan Penyelesaian PERSONAL-03

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

# 9. STOP

> **BERHENTI.**

Jangan mengerjakan PERSONAL-04 tanpa instruksi baru.
