# ADATRACK CORE — Architecture, Domain Boundaries & Rules

Dokumen ini menjadi acuan arsitektur global, batas domain, dan aturan integrasi untuk seluruh halaman dan komponen di dalam domain **CORE** (`apps/business/src/app/(core)`).

---

## 1. Posisi Domain CORE dalam Platform ADATRACK

Domain CORE adalah lapisan dasar (*foundation layer*) dari sistem telematika dan manajemen armada ADATRACK Business:

```text
┌─────────────────────────────────────────────────────────────┐
│                    VERTICAL BUSINESS MODULES                │
│    Rental Module (/rental)   │   Transport/Logistik Module  │
└───────────────────────────────┬─────────────────────────────┘
                                │ Mengonsumsi via Service Layer
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                       CORE DOMAIN                           │
│  Live Tracking  │  Master Armada (Vehicles)  │  Drivers     │
│  Groups         │  Geofences                 │  Routes      │
│  Access Cards   │  Access Personel           │  Access Logs │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   SHARED FOUNDATION PACKAGES                │
│   @adatrack/ui   │   @adatrack/maps   │   @adatrack/utils   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Prinsip Single Source of Truth (SSoT)

### A. Kendaraan (`Vehicle`)
- Seluruh entitas fisik armada kendaraan hanya dimiliki oleh CORE `Vehicle`.
- Modul bisnis lain (Rental, Transport, dll.) **dilarang membuat master kendaraan sendiri**.
- Jika modul bisnis membutuhkan atribut operasional khusus (misal: tarif harian rental, masa berlaku deposit, checklist kelengkapan sewa), modul tersebut membuat entitas profil terpisah (misal: `RentalVehicleProfile`) yang memiliki foreign reference `vehicleId = Vehicle.id`.
- Informasi fisik kendaraan (nomor polisi, merek, model, kapasitas, tahun pembuatan, transmisi, nomor mesin/rangka) selalu diambil dinamis dari CORE melalui `vehicleService`.

### B. Pengemudi (`Driver`)
- Seluruh data pengemudi resmi dikelola terpusat di CORE `Driver`.
- Lisensi mengemudi (SIM A/B/B1/B2) dan status ketersediaan kerja diverifikasi terpusat di CORE.
- Modul bisnis yang memerlukan pengemudi (misal rental *With Driver* atau penugasan armada logistik) merujuk pada `driverId` milik CORE.

---

## 3. Batas Isolasi Antar-Modul (Module Boundaries)

1. **Arah Ketergantungan Satu Arah (*One-Way Dependency*):**
   - Modul vertikal (Rental, Transport) boleh memanggil service layer CORE.
   - **CORE dilarang keras mengimpor atau mengenal modul vertikal.** CORE tidak boleh memiliki import yang merujuk ke `@/features/modules/rental` atau `@/data/modules/rental`.
2. **Akses Hanya Melalui Service Layer:**
   - Komponen UI atau service modul luar hanya boleh memanggil service publik CORE (seperti `coreVehicleService` atau `vehicleService`).
   - Dilarang mengakses repository CORE secara langsung dari luar domain CORE.
3. **Kemandirian State:**
   - CORE tidak menggunakan state manager global yang tercampur dengan data domain rental atau modul eksternal.

---

## 4. Sistem Konteks Pelacakan (`VehicleContext`)

Ketika pengguna menavigasi dari modul eksternal (misal: tombol "Buka Lokasi" pada tabel armada Rental) menuju halaman pelacakan langsung (`/tracking`), sistem menerapkan mekanisme **VehicleContext** yang bersih:

1. **URL Bersih Tanpa Query Parameter Panjang:**
   - Navigasi diarahkan langsung ke URL `/tracking`.
   - Tidak menyematkan data kompleks di URL query string.
2. **Penyimpanan Konteks Sesi:**
   - Modul pemanggil membangun payload `VehicleContext` menggunakan utilitas `trackingNavigationService.navigateToTracking(vehicleId, context)`.
   - Data konteks disimpan di `sessionStorage`.
3. **Struktur Data `VehicleContext`:**
   ```ts
   export interface VehicleContextField {
     label: string;
     value: string;
     type?: 'text' | 'status' | 'date' | 'currency' | 'number';
   }

   export interface VehicleContext {
     vehicleId: string;
     module: string;         // e.g. "rental", "transport"
     entityType: string;     // e.g. "contract", "delivery"
     entityId: string;       // e.g. ID transaksi
     label: string;          // Judul badge konteks
     data: VehicleContextField[];
   }
   ```
4. **Pembacaan Konteks oleh CORE Tracking:**
   - Halaman `/tracking` membaca konteks secara generik dari `sessionStorage`.
   - Menampilkan panel informasi ringkas (*context card*) di atas peta tanpa CORE perlu mengetahui aturan bisnis modul pemanggil.

---

## 5. Standar Komponen & Desain UI CORE

Seluruh halaman di bawah `apps/business/src/app/(core)` wajib mengikuti standar desain ADATRACK:

1. **DataTable Foundation (`@adatrack/ui`):**
   - Halaman tabel (`/vehicles`, `/drivers`, `/groups`, `/card`, `/personel`, `/log`) menggunakan DataTable Foundation ADATRACK.
   - Wajib mendukung: Sticky Header, sorting, pencarian teks, filter pills/dropdown, badge status semantik, dan pagination terintegrasi.
2. **Layout Peta Interaktif (`@adatrack/maps`):**
   - Halaman berbasis spasial (`/tracking`, `/geofences`, `/routes`) menggunakan komponen peta `@adatrack/maps`.
   - Menggunakan tata letak *split-pane* (panel daftar/kontrol di sisi samping dan kanvas peta interaktif di sisi utama).
3. **Drawer Detail (`[Domain]View.tsx`) & Form Drawer/Page (`[Domain]Form.tsx`):**
   - Tampilan rincian menggunakan panel Drawer samping agar pengguna tidak kehilangan konteks tabel utama.
   - Form input/edit menggunakan drawer untuk entitas ringkas, atau halaman mandiri (seperti `/drivers/[id]/edit`) jika form memiliki tahapan kompleks.
4. **Sistem Terjemahan (i18n):**
   - Setiap feature memiliki `i18n.ts` dengan kamus Bahasa Indonesia (`id`) dan Bahasa Inggris (`en`).
   - Default UI adalah Bahasa Indonesia.
   - Tidak ada hardcode teks UI langsung di JSX tanpa melalui fungsi lokalisasi `t.*`.

---

## 6. Ruang Lingkup Data Mock & Batasan

1. **Frontend-Only Scope:**
   - Seluruh fitur CORE saat ini beroperasi pada lingkup frontend.
   - Menggunakan dataset mock realistis yang tersimpan di `src/data/services/` dan `src/data/core/`.
2. **Larangan Infrastruktur Production Saat Ini:**
   - Jangan membuat server WebSocket backend production, database SQL nyata, atau koneksi parser protokol GPS (MQTT/TCP/Teltonika) selama masih dalam scope frontend saat ini.
   - Simulasi pergerakan kendaraan dan telemetri GPS dilakukan menggunakan generator interval mock data.
