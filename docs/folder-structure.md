# ADATRACK - Folder Structure

## 1. Aturan Penamaan

Folder, file, route internal, feature, component, hook, store, type, function, variable, dan constant menggunakan English.

UI menggunakan Bahasa Indonesia/English melalui i18n.

## 2. Struktur Target

```text
adatrack/
├── apps/
│   ├── business/
│   │   └── src/
│   │       ├── app/
│   │       ├── components/
│   │       ├── features/
│   │       ├── hooks/
│   │       ├── stores/
│   │       ├── types/
│   │       ├── utils/
│   │       └── config/
│   │
│   └── personal/
│       └── src/
│
├── packages/
│   ├── ui/
│   ├── design-system/
│   ├── maps/
│   ├── icons/
│   ├── utils/
│   └── types/
│
└── docs/
```

## 3. Feature Naming

Gunakan English:

```text
tracking
vehicles
drivers
deliveries
maintenance
devices
geofences
reports
administration
```

## 4. Feature Structure

Setiap feature mengikuti struktur standar berikut:

```text
features/[domain]/
├── [Domain]Feature.tsx     ← Orchestrator utama
├── i18n.ts                 ← Dictionary terjemahan ID + EN
├── types/
│   └── [model].ts          ← Type/interface domain
└── components/
    ├── [Domain]Table.tsx   ← Tabel data (DataTable Foundation)
    ├── [Domain]Form.tsx    ← Form add/edit (drawer atau halaman)
    └── [Domain]View.tsx    ← Detail read-only (opsional)
```

Jika feature memiliki halaman create/edit terpisah (bukan drawer):

```text
features/[domain]/
├── [Domain]sFeature.tsx        ← Halaman list utama
├── [Domain]CreateFeature.tsx   ← Halaman tambah baru
├── [Domain]EditFeature.tsx     ← Halaman edit
├── i18n.ts
├── types/
└── components/
```

Gunakan pola drawer (`[Domain]Form.tsx`) jika form cukup sederhana.
Gunakan pola halaman terpisah jika form kompleks atau membutuhkan navigasi sendiri.

## 5. UI Label

Gunakan translation key:

```text
tracking → Pemantauan
vehicles → Armada
drivers → Pengemudi
deliveries → Pengiriman
maintenance → Perawatan
devices → Perangkat
geofences → Geofence
reports → Laporan
administration → Administrasi
```

## 6. Prinsip

Jangan membuat folder Bahasa Indonesia untuk source code.
