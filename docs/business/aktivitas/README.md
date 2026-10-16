# Rencana Implementasi: Modul Aktivitas Pengemudi

## Ringkasan
Membuat modul baru **AKTIVITAS PENGEMUDI** (`/activity`), memindahkan Laporan Darurat dari modul Safety, menghapus modul Safety, dan membangun 3 halaman admin baru secara bertahap.

---

## TAHAP 1 — Fondasi & Migrasi

**Tujuan:** Modul baru muncul di navigasi, route `/activity/emergency-reports` berjalan, modul Safety dihapus.

### Pekerjaan:

**1.1 Navigasi & i18n** · `BusinessShellLayout.tsx` + `i18n/index.ts`
- Hapus nav group `safety` (beserta item: safety, incidents, emergencyReports)
- Tambah nav group `activity` (Aktivitas Pengemudi) dengan 4 menu:
  - Absensi Tugas → `/activity/task-attendance`
  - Absen Geofence → `/activity/geofence-attendance`
  - Laporan Tiba di Tujuan → `/activity/arrival-reports`
  - Laporan Darurat → `/activity/emergency-reports`
- Tambah key i18n baru (`navGroup.activity`, `nav.taskAttendance`, `nav.geofenceAttendance`, `nav.arrivalReports`)
- Hapus key i18n lama (`navGroup.safety`, `nav.safety`, `nav.incidents`)
- Hapus import icon: `ShieldCheck`, `CircleAlert`, `Siren` (jika tidak dipakai lain)

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
