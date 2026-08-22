# ADATRACK Personal - PERSONAL-06

## Settings

**Scope:** Frontend ADATRACK Personal  
**Data:** Dummy/Mock  
**Bahasa dokumentasi:** Indonesia

---

# 1. Tujuan

Membangun halaman Pengaturan ADATRACK Personal.

Pengaturan merupakan primary navigation:

```text
Pemantauan | Statistik | Pengaturan
```

---

# 2. Scope

Menu:

```text
Pengaturan
â"œâ"€â"€ Kendaraan Saya
â"œâ"€â"€ Perangkat GPS
â"œâ"€â"€ Akun
â"œâ"€â"€ Bantuan
â""â"€â"€ Tentang Aplikasi
```

Notifikasi dan Geofence memiliki task khusus dan tidak diimplementasikan sebagai feature penuh pada task ini.

---

# 3. Kendaraan Saya

Menampilkan daftar kendaraan pengguna.

Dapat menyediakan:

- nama kendaraan
- nomor kendaraan
- tipe
- status
- edit/detail jika sesuai scope

Gunakan dummy data.

---

# 4. Perangkat GPS

Menampilkan informasi perangkat GPS secara presentation layer.

Contoh:

- nama perangkat
- status koneksi
- kendaraan terkait
- last update

Tidak ada integrasi hardware/API production.

---

# 5. Akun

Menampilkan informasi akun dummy.

Contoh:

- nama
- email/nomor HP
- foto/avatar jika diperlukan

---

# 6. Bantuan & Tentang

Sediakan halaman sederhana untuk:

- Bantuan
- FAQ jika diperlukan
- versi aplikasi
- informasi ADATRACK Personal

---

# 7. Responsive

Mobile-first.

Pengaturan harus nyaman digunakan dengan touch.

Desktop menggunakan layout yang lebih luas tanpa mengubah struktur informasi secara berlebihan.

---

# 8. Accessibility

Perhatikan:

- semantic HTML
- keyboard navigation
- focus state
- accessible labels
- touch target
- contrast

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

---

# 10. Definition of Done

- [ ] Kendaraan Saya selesai.
- [ ] Perangkat GPS selesai.
- [ ] Akun selesai.
- [ ] Bantuan selesai.
- [ ] Tentang Aplikasi selesai.
- [ ] Dummy data berfungsi.
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
# Laporan Penyelesaian PERSONAL-06

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

> **BERHENTI.**

Jangan mengerjakan PERSONAL-07 tanpa instruksi baru.
