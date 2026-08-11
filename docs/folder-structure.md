# BINAGO — Folder Structure

## 1. Aturan Penamaan

Folder, file, route internal, feature, component, hook, store, type, function, variable, dan constant menggunakan English.

UI menggunakan Bahasa Indonesia/English melalui i18n.

## 2. Struktur Target

```text
binago/
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

## 4. UI Label

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

## 5. Prinsip

Jangan membuat folder Bahasa Indonesia untuk source code.
