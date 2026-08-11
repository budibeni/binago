# BINAGO — Design System Reference

Dokumentasi resmi Design System BINAGO mencakup design tokens, komponen UI foundation, UI patterns, DataTable foundation, dan Maps foundation.

---

## 1. Design Tokens

Design tokens BINAGO didefinisikan secara tersentralisasi pada `@binago/design-system` melalui CSS custom properties (`base.css`) dan didaftarkan pada konfigurasi Tailwind CSS (`tailwind.config.js`).

### Typography
- **Font Family**: Inter (`font-sans`), dengan fallback `system-ui, sans-serif`.
- **Font Sizes**:
  - `xs`: 12px / line-height 16px
  - `sm`: 14px / line-height 20px
  - `base`: 16px / line-height 24px
  - `lg`: 18px / line-height 28px
  - `xl`: 20px / line-height 28px
  - `2xl`: 24px / line-height 32px

### Color Tokens
Menggunakan skala Zinc Tailwind untuk netral, dengan warna brand dan semantik yang dikurasi:

- **Brand & Primary**:
  - `primary`: `#18181b` (`zinc-900`) / `primary-foreground`: `#ffffff`
  - `accent`: `#2563eb` (`blue-600`) / `accent-foreground`: `#ffffff`
- **Semantic Colors**:
  - `danger`: `#dc2626` (`red-600`) / `danger-light`: `#fef2f2`
  - `success`: `#16a34a` (`green-600`) / `success-light`: `#f0fdf4`
  - `warning`: `#d97706` (`amber-600`) / `warning-light`: `#fffbeb`
  - `info`: `#0284c7` (`sky-600`) / `info-light`: `#f0f9ff`
- **Surface & Background**:
  - `background`: `#ffffff`
  - `surface`: `#f4f4f5` (`zinc-100`)
  - `border`: `#e4e4e7` (`zinc-200`)
- **Foreground (Text)**:
  - `foreground`: `#09090b` (`zinc-950`)
  - `foreground-muted`: `#71717a` (`zinc-500`)
  - `foreground-subtle`: `#a1a1aa` (`zinc-400`)

### Spacing & Radius
- **Border Radius**:
  - `sm`: 4px (`rounded-sm`)
  - `md`: 6px (`rounded-md` — default)
  - `lg`: 8px (`rounded-lg`)
  - `full`: 9999px (`rounded-full`)

### Shadows
- `shadow-sm`: subtle card/button shadow
- `shadow-md`: dropdown/popover/modal shadow
- `shadow-lg`: dialog overlay shadow

### Transitions
- `duration-fast`: 150ms `cubic-bezier(0.4, 0, 0.2, 1)`
- `duration-base`: 200ms `cubic-bezier(0.4, 0, 0.2, 1)`
- `duration-slow`: 300ms `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 2. UI Components (`@binago/ui`)

Seluruh 21 komponen foundation dibangun secara accessible menggunakan semantik HTML5 dan primitive Radix UI:

1. **Button**: Variasi `primary`, `secondary`, `outline`, `ghost`, `destructive`. Mendukung `size` (`sm`, `md`, `lg`), `loading` state dengan spinner, `leftIcon`, dan `rightIcon`.
2. **Input**: Form input dengan dukungan `error` state, `helperText`, `prefixIcon`, `suffixIcon`, dan ARIA attributes.
3. **Textarea**: Multi-line input dengan dukungan resizing vertikal, error state, dan helper text.
4. **Card**: Container fleksibel dengan varian `default`, `bordered`, `flat` dan opsi padding.
5. **Badge**: Label status semantik (`default`, `secondary`, `outline`, `destructive`, `success`, `warning`, `info`) dengan opsi `dot` indicator.
6. **Avatar**: Komponen gambar profil dengan fallback inisial teks dan opsi ukuran (`sm`, `md`, `lg`).
7. **Spinner**: Indicator loading (`sm`, `md`, `lg`) bersemantik `role="status"`.
8. **Skeleton**: Placeholder animasi pulsa untuk loading state (`bg-neutral-200`).
9. **Label**: Form label ber-token dengan indikator wajib diisi (`required` prop).
10. **Alert**: Peringatan semantik dengan ikon otomatis per varian (`info`, `success`, `warning`, `danger`) dan action dismiss.
11. **Separator**: Garis pemisah horizontal/vertikal berbasis Radix UI Separator.
12. **Tabs**: Tab navigasi interaktif (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) berbasis Radix UI Tabs.
13. **Checkbox**: Input centang berlabel berbasis Radix UI Checkbox dengan dukungan keyboard navigation.
14. **Radio & RadioGroup**: Input pilihan tunggal berbasis Radix UI RadioGroup.
15. **Switch**: Toggle sakelar animasi berbasis Radix UI Switch.
16. **Select**: Dropdown pemilih nilai (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, dll) berbasis Radix UI Select.
17. **Icon**: Wrapper Lucide React konsisten dengan ukuran design system.
18. **Dialog**: Modal dialog terakses (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, dll) dengan focus trap dan tombol Escape.
19. **Dropdown**: Dropdown menu bertingkat berbasis Radix UI DropdownMenu dengan keyboard shortcut support.
20. **Popover**: Floating content container berbasis Radix UI Popover.
21. **Tooltip**: Informasi bantuan melayang berbasis Radix UI Tooltip.

---

## 3. UI Patterns (`@binago/ui/patterns`)

Komponen layout dan komposisi reusable:

- **Panel**: Container terstruktur (`Panel`, `PanelHeader`, `PanelBody`, `PanelFooter`).
- **Toolbar**: Baris aksi (`Toolbar`, `ToolbarGroup`, `ToolbarButton`) ber-role `toolbar`.
- **SearchBar**: Input pencarian terintegrasi ikon cari, clear button, dan status loading.
- **FilterBar**: Container filter dengan active filter chips yang dapat dihapus.
- **ActionBar**: Tata letak dua sisi (`leftActions` dan `rightActions`) untuk aksi modul/tabel.
- **ContentHeader**: Header halaman dengan judul, deskripsi, aksi, dan slot breadcrumb.
- **EmptyState**: Tampilan state kosong dengan ikon, judul, deskripsi, dan tombol CTA.
- **LoadingState**: State memuat data terpusat dengan spinner besar dan pesan status.
- **SplitView**: Master-detail layout (`SplitViewSidebar`, `SplitViewContent`) yang responsif.
- **ResizablePanel**: Panel samping yang dapat di-drag ukurannya dengan batas min/max.

---

## 4. DataTable Foundation (`@binago/ui/DataTable`)

Mesin tabel berbasis **TanStack Table v9.1.2** yang fleksibel dan server-side ready.

### Komponen Utama
- `DataTable`: Master orchestrator dengan dukungan mode `pagination` dan `infinite`.
- `DataTableHeader`: Header tabel dengan indikator sorting, sticky header, dan column pinning.
- `DataTableBody`: Body tabel yang menangani state `idle`, `loading`, `error`, `empty`, dan `no-result`.
- `DataTableRow`: Baris data dengan dukungan sticky column pinning.
- `DataTablePagination`: Kontrol navigasi halaman, range data (`1–10 dari 120 baris`), dan pemilih `pageSize`.
- `DataTableSearch`: Wrapper SearchBar ter-debounce (300ms) untuk pencarian teks global.
- `DataTableColumnToggle`: Dropdown pemilih visibilitas kolom dengan counter kolom tersembunyi.
- `DataTableExport`: Export data ter-filter & ter-lihat ke format CSV (UTF-8 BOM).
- `DataTableToolbar`: Orkestrasi top toolbar yang menggabungkan Search, Column Toggle, Export, dan slot kustom.
- `useInfiniteScroll`: Hook IntersectionObserver untuk scroll tanpa batas.

### Server-Side Contract
DataTable mendukung mode server-side tanpa mengorbankan type safety:

```ts
export interface FetchParams {
  pageIndex: number;
  pageSize: number;
  sorting: Array<{ id: string; desc: boolean }>;
  globalFilter: string;
  columnFilters: Array<{ id: string; value: unknown }>;
}

// Opsi props pada DataTable:
onFetch?: (params: FetchParams) => void;
fetchState?: 'idle' | 'loading' | 'loading-more' | 'error';
onRetry?: () => void;
```

Bila `onFetch` disediakan:
- `manualPagination`, `manualSorting`, dan `manualFiltering` diaktifkan secara otomatis.
- Perubahan pagination, sorting, atau pencarian memicu callback `onFetch` dengan parameter terbaru.

---

## 5. Maps Foundation (`@binago/maps`)

Package skeleton provider-agnostic untuk peta interaktif:

- **`MapContainer`**: Layout container fleksibel dengan dukungan `viewport`, `controlsSlot`, `toolbarSlot`, `overlaySlot`, serta placeholder visual saat provider peta belum di-mount.
- **`MapControls`**: Panel kontrol mengambang untuk perbesar/perkecil (`onZoomIn`/`onZoomOut`), reset tampilan (`onResetView`), dan ganti layer (`onToggleLayer`).
- **`MapToolbar`**: Baris aksi mengambang di atas peta (`leftActions` dan `rightActions`).
- **`MapOverlay`**: Panel samping / info card melayang dengan header, tombol tutup, dan area scroll.

---

## 6. Penggunaan Package Workspace

Monorepo BINAGO mengorganisir package sebagai berikut:

```ts
import '@binago/design-system/src/base.css'; // Di-import pada app/globals.css
import { Button, Input, Dialog, Select } from '@binago/ui';
import { SearchBar, EmptyState } from '@binago/ui/patterns'; // atau via '@binago/ui'
import { DataTable, DataTableToolbar, DataTablePagination } from '@binago/ui/DataTable';
import { MapContainer, MapControls, MapOverlay } from '@binago/maps';
import type { Size, FetchState, FetchParams } from '@binago/types';
import { cn } from '@binago/utils';
```

---

## 7. Accessibility Foundation

Seluruh komponen mematuhi standar aksesibilitas dasar (WCAG 2.1 AA):
- **Keyboard Navigation**: Seluruh elemen interaktif dapat dijangkau via Tab, Enter, Space, dan panah keyboard.
- **Focus States**: Indikator fokus yang jelas (`focus-visible:ring-2 focus-visible:ring-offset-2`).
- **ARIA Semantics**: `role="alert"`, `role="status"`, `role="toolbar"`, `role="region"`, `aria-label`, `aria-hidden`, dan attributes ARIA Radix UI.
- **Form Association**: Input terikat dengan `Label` melalui `id` dan `htmlFor`.
