# BINAGO Personal — PERSONAL-05

## Statistics

**Scope:** Frontend BINAGO Personal  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun halaman Statistik BINAGO Personal.

Statistik menjadi salah satu dari tiga primary navigation:

```text
Pemantauan | Statistik | Pengaturan
```

---

# 2. Scope

Statistik menyediakan:

- Ringkasan
- Harian
- Mingguan
- Bulanan

Metrik dapat mencakup:

- total jarak
- total waktu berkendara
- jumlah perjalanan
- kecepatan rata-rata
- kecepatan maksimum
- kendaraan paling aktif

---

# 3. Statistik Harian

Contoh:

```text
Hari ini

127,4 km
3j 42m
8 perjalanan

Kecepatan rata-rata
35 km/jam

Kecepatan maksimum
96 km/jam
```

---

# 4. UI

Gunakan:

- Card
- Tabs jika sesuai
- Chart/visualisasi jika diperlukan
- design tokens BINAGO

DataTable bukan komponen utama untuk statistik Personal.

---

# 5. Data

Gunakan dummy/mock data realistis.

Data harus memiliki relasi tanggal, kendaraan, dan perjalanan yang masuk akal.

Tidak ada API production.

---

# 6. Responsive

Mobile-first.

Chart dan card harus tetap terbaca pada layar kecil.

Desktop dapat menggunakan grid yang lebih luas.

---

# 7. Validation

- Typecheck
- ESLint
- Build
- Mobile
- Tablet
- Desktop
- i18n
- Accessibility

---

# 8. Definition of Done

- [ ] Statistik selesai.
- [ ] Ringkasan tersedia.
- [ ] Harian tersedia.
- [ ] Mingguan tersedia.
- [ ] Bulanan tersedia.
- [ ] Dummy data berfungsi.
- [ ] Visualisasi responsive.
- [ ] i18n diperiksa.
- [ ] Accessibility diperiksa.
- [ ] Typecheck PASS.
- [ ] ESLint PASS.
- [ ] Build PASS.
- [ ] Completion Report dibuat.

---

# 9. Completion Report

```text
# Laporan Penyelesaian PERSONAL-05

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

Jangan mengerjakan PERSONAL-06 tanpa instruksi baru.
