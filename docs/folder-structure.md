# ADATRACK - Folder Structure

## 1. Aturan Penamaan

Folder, file, route internal, feature, component, hook, store, type, function, variable, dan constant menggunakan English.

UI menggunakan Bahasa Indonesia/English melalui i18n.

## 2. Struktur Target

```text
adatrack/
â"œâ"€â"€ apps/
â"‚   â"œâ"€â"€ business/
â"‚   â"‚   â""â"€â"€ src/
â"‚   â"‚       â"œâ"€â"€ app/
â"‚   â"‚       â"œâ"€â"€ components/
â"‚   â"‚       â"œâ"€â"€ features/
â"‚   â"‚       â"œâ"€â"€ hooks/
â"‚   â"‚       â"œâ"€â"€ stores/
â"‚   â"‚       â"œâ"€â"€ types/
â"‚   â"‚       â"œâ"€â"€ utils/
â"‚   â"‚       â""â"€â"€ config/
â"‚   â"‚
â"‚   â""â"€â"€ personal/
â"‚       â""â"€â"€ src/
â"‚
â"œâ"€â"€ packages/
â"‚   â"œâ"€â"€ ui/
â"‚   â"œâ"€â"€ design-system/
â"‚   â"œâ"€â"€ maps/
â"‚   â"œâ"€â"€ icons/
â"‚   â"œâ"€â"€ utils/
â"‚   â""â"€â"€ types/
â"‚
â""â"€â"€ docs/
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
tracking â†' Pemantauan
vehicles â†' Armada
drivers â†' Pengemudi
deliveries â†' Pengiriman
maintenance â†' Perawatan
devices â†' Perangkat
geofences â†' Geofence
reports â†' Laporan
administration â†' Administrasi
```

## 5. Prinsip

Jangan membuat folder Bahasa Indonesia untuk source code.
