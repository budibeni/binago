# HALAMAN GRUP OPERASIONAL (GROUPS)

**Rute Aplikasi:** `/groups`  
**Domain:** CORE  
**Label UI:** Grup (Groups)  
**Title Dokumen:** `Grup Armada - ADATRACK Business`  
**Komponen Utama:** `apps/business/src/features/core/groups/GroupsFeature.tsx`

---

## 1. Fungsi dan Kegunaan Halaman

Halaman Grup (`/groups`) berfungsi sebagai **manajer struktur organisasi dan pengelompokan hierarkis aset operasional** pada platform ADATRACK Business. Halaman ini memungkinkan pengelola armada mengorganisasikan ribuan entitas menjadi kelompok-kelompok kerja yang terstruktur guna mempermudah pemfilteran massal di modul Tracking, pembagian wewenang pengguna, dan laporan analitik.

### Empat Tipe Grup yang Dikelola (`GroupType`):
1. **Grup Kendaraan (*Vehicle Groups*):** Mengelompokkan unit armada fisik berdasarkan divisi bisnis, cabang kantor, area kerja, atau tipe operasional (contoh: "Armada Rental", "Logistik Jabodetabek", "Heavy Haulage").
2. **Grup Pengemudi (*Driver Groups*):** Mengelompokkan personil sopir berdasarkan penempatan cabang, vendor mitra, atau shift kerja (contoh: "Driver Reguler Jakarta", "Driver Antar-Kota").
3. **Grup Geofence (*Geofence Groups*):** Mengelompokkan batas wilayah virtual berdasarkan fungsi lokasi (contoh: "Area Gudang & DC", "Pelabuhan & Terminal", "Zona Terlarang / Blackzone").
4. **Grup Rute (*Route Groups*):** Mengelompokkan rute perjalanan resmi armada berdasarkan koridor jalur (contoh: "Rute Distribusi Pantura", "Rute Pengiriman Intra-Kota Bandung").

---

## 2. Struktur Antarmuka dan Tab Pengelompokan

Pengguna dapat memilih tipe entitas yang ingin dikelola menggunakan tab navigasi atau selector tipe grup:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [ 🚚 Grup Kendaraan ]  [ 👤 Grup Pengemudi ]  [ 📍 Grup Geofence ]  [ 🛣 Grup Rute ] │
├────────────────────────────────────────────────────────────────────────┤
│  [🔍 Cari Nama / Deskripsi Grup...]      [+ Tambah Grup Baru]          │
├────────────────────────────────────────────────────────────────────────┤
│  DataTable Master Grup:                                                │
│  Nama Grup              | Deskripsi                  | Jumlah Anggota  │
│  ───────────────────────┼────────────────────────────┼─────────────────┤
│  Armada Rental Mobil    | Unit khusus layanan sewa   | 42 Kendaraan    │
│  Logistik Jabodetabek   | Distribusi area Jadetabek  | 28 Kendaraan    │
│  Zona Depo & Gudang     | Titik hub transit logistik | 15 Geofence     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Komponen Antarmuka Fitur

- **`GroupTable.tsx`:**
  - Menampilkan daftar grup sesuai tipe aktif (`activeType`).
  - Kolom Data:
    - **Nama Grup (`name`):** Nama identifikasi kelompok.
    - **Deskripsi (`description`):** Keterangan tujuan operasional grup.
    - **Jumlah Anggota (`memberCount`):** Counter jumlah entitas kendaraan/pengemudi/geofence/rute yang terdaftar.
    - **Aksi:** Tombol rincian anggota (`View`), ubah data (`Edit`), dan hapus grup (`Delete`).
  - Fitur DataTable: Pencarian, visibilitas kolom, pagination, dan ekspor.
- **`GroupForm.tsx`:**
  - Dialog modal untuk membuat grup baru atau menyunting grup yang ada.
  - Input: Nama Grup, Tipe Entitas, dan Deskripsi Grup.
- **`GroupView.tsx`:**
  - Modal drawer yang menampilkan ringkasan informasi grup dan daftar lengkap anggota entitas yang bernaung di bawah grup tersebut.

---

## 4. Model Data Teknis (`Group`)

```ts
export type GroupType = 'vehicles' | 'drivers' | 'geofences' | 'routes';

export interface BaseGroup {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
}

export interface VehicleGroup extends BaseGroup {
  type: 'vehicles';
}

export interface DriverGroup extends BaseGroup {
  type: 'drivers';
}

export interface GeofenceGroup extends BaseGroup {
  type: 'geofences';
}

export interface RouteGroup extends BaseGroup {
  type: 'routes';
}
```

---

## 5. Aturan Bisnis & Integrasi

1. **Konsumsi di Modul Pemantauan (`/tracking`):**
   - Struktur folder pada sidebar `VehicleList` di halaman Tracking dibangun langsung berdasarkan `groupService.getLiveVehicleGroups()`.
2. **Penetapan Mandatory:**
   - Setiap pendaftaran kendaraan baru di `/vehicles` wajib menetapkan salah satu grup kendaraan (`groupId`).
3. **Pencegahan Penghapusan Berbahaya:**
   - Grup yang masih memiliki anggota kendaraan aktif dilarang dihapus sebelum anggotanya dipindahkan ke grup lain.
