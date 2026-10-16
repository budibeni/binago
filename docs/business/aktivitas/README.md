# Rencana & Dokumentasi: Modul Aktivitas

## Ringkasan
Modul **AKTIVITAS** (`/activity`) mencakup aktivitas operasional armada yang terbagi dalam kategori:
1. **Pengemudi** (`/activity/driver/...`): Presensi tugas, absen geofence, laporan tiba di tujuan, dan laporan darurat.
2. **Kendaraan** (`/activity/vehicles`): Log aktivitas, utilisasi, dan inspeksi armada kendaraan.
3. **Customer** (`/activity/customers`): Riwayat interaksi, kunjungan, dan serah terima kargo/layanan pelanggan.

---

## Struktur Navigasi & Halaman

### 1. Laporan Darurat (`/activity/emergency-reports`)
### 2. Aktivitas Pengemudi (`/activity/driver/`)
- Absensi Tugas → `/activity/driver/task-attendance`
- Absen Geofence → `/activity/driver/geofence-attendance`
- Laporan Tiba di Tujuan → `/activity/driver/arrival-reports`
### 3. Aktivitas Kendaraan (`/activity/vehicles`)
### 4. Aktivitas Customer (`/activity/customers`)

---

**1.2 Pindahkan file Emergency Reports**
- `PINDAH` feature: `features/modules/safety/emergency-reports/EmergencyReportsFeature.tsx`  
  → `features/modules/activity/emergency-reports/EmergencyReportsFeature.tsx`
- `PINDAH` store: `features/modules/portal/driver/emergencyReportStore.ts`  
  → `features/modules/activity/emergency-reports/emergencyReportStore.ts`
- Update semua import di `DriverPortalFeature.tsx` dan `EmergencyReportsFeature.tsx`

**1.3 Buat route baru `/activity/emergency-reports`**
- `BUAT` `app/(modules)/activity/emergency-reports/page.tsx`
- Import dari lokasi baru

**1.4 Buat route placeholder untuk 3 menu lainnya**
- `BUAT` `app/(modules)/activity/task-attendance/page.tsx` (placeholder: "Segera Hadir")
- `BUAT` `app/(modules)/activity/geofence-attendance/page.tsx` (placeholder)
- `BUAT` `app/(modules)/activity/arrival-reports/page.tsx` (placeholder)

**1.5 Hapus modul Safety**
- `HAPUS` direktori `app/(modules)/safety/` (beserta semua subdirektori)
- `HAPUS` direktori `features/modules/safety/` (setelah file dipindah)

**1.6 Validasi**
- Typecheck: `pnpm --filter business exec tsc --noEmit`
- Verifikasi navigasi baru tampil benar
- Verifikasi `/activity/emergency-reports` berjalan
- Verifikasi `/safety/emergency-reports` mengembalikan 404

---

## TAHAP 2 — Absensi Tugas (Admin View)

**Tujuan:** Halaman admin untuk melihat rekap **Mulai / Selesai Tugas** dari pengemudi.

**File yang dibuat:**
- `features/modules/activity/task-attendance/TaskAttendanceFeature.tsx`
- `features/modules/activity/task-attendance/taskAttendanceStore.ts` (dummy data)
- Update `app/(modules)/activity/task-attendance/page.tsx`

**Konten halaman:**
- DataTable rekap pasangan check-in / check-out per pengemudi
- Kolom: Pengemudi, Kendaraan, Waktu Mulai, Waktu Selesai, Durasi, Lokasi Mulai, Lokasi Selesai, Foto
- Filter: Tanggal, Pengemudi, Kendaraan
- Modal detail: foto selfie watermark, peta lokasi (Google Maps link), metadata lengkap
- Status pasangan: Lengkap (ada check-in + check-out) / Belum Selesai (hanya check-in)

---

## TAHAP 3 — Absen Geofence (Admin View)

**Tujuan:** Halaman admin untuk melihat rekap **Absen Geofence** dari pengemudi.

**File yang dibuat:**
- `features/modules/activity/geofence-attendance/GeofenceAttendanceFeature.tsx`
- `features/modules/activity/geofence-attendance/geofenceAttendanceStore.ts` (dummy data)
- Update `app/(modules)/activity/geofence-attendance/page.tsx`

**Konten halaman:**
- DataTable rekap absen geofence
- Kolom: Pengemudi, Geofence, Waktu, Koordinat, Foto, Jarak ke Geofence
- Filter: Tanggal, Pengemudi, Geofence
- Modal detail: foto selfie watermark, peta lokasi + area geofence, metadata

---

## TAHAP 4 — Laporan Tiba di Tujuan (Admin View)

**Tujuan:** Halaman admin untuk melihat rekap **Laporan Tiba di Tujuan** dari pengemudi.

**File yang dibuat:**
- `features/modules/activity/arrival-reports/ArrivalReportsFeature.tsx`
- `features/modules/activity/arrival-reports/arrivalReportStore.ts` (dummy data)
- Update `app/(modules)/activity/arrival-reports/page.tsx`

**Konten halaman:**
- DataTable rekap laporan tiba
- Kolom: Pengemudi, Kendaraan, Waktu, Alamat Tujuan, Koordinat, Foto
- Filter: Tanggal, Pengemudi
- Modal detail: foto selfie watermark, Google Maps link, Street View link, metadata

---

## Ringkasan File per Tahap

| Tahap | File Dibuat | File Diubah | File Dihapus/Dipindah |
|-------|------------|-------------|----------------------|
| **1** | 4 page.tsx baru, EmergencyReportsFeature.tsx (pindah), emergencyReportStore.ts (pindah) | BusinessShellLayout.tsx, i18n/index.ts, DriverPortalFeature.tsx | app/(modules)/safety/**, features/modules/safety/** |
| **2** | TaskAttendanceFeature.tsx, taskAttendanceStore.ts | task-attendance/page.tsx | — |
| **3** | GeofenceAttendanceFeature.tsx, geofenceAttendanceStore.ts | geofence-attendance/page.tsx | — |
| **4** | ArrivalReportsFeature.tsx, arrivalReportStore.ts | arrival-reports/page.tsx | — |

---

## Status

| Tahap | Status |
|-------|--------|
| Tahap 1 — Fondasi & Migrasi | ✅ Selesai |
| Tahap 2 — Absensi Tugas | ✅ Selesai |
| Tahap 3 — Absen Geofence | ✅ Selesai |
| Tahap 4 — Laporan Tiba di Tujuan | ✅ Selesai |
