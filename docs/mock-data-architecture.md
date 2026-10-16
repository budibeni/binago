# ADATRACK - Mock Data & Data Layer Architecture

Dokumen ini adalah **standar resmi pengelolaan dummy/mock data dan arsitektur data layer** pada aplikasi ADATRACK Business.

---

## 1. Prinsip Utama

1. **Terpusat di Data Layer (`src/data/`):**
   Komponen UI atau folder `features/` **dilarang keras** menyimpan mock data mentah atau membuat in-memory state engine sendiri di dalam folder komponen. Seluruh data dikelola terpusat di `src/data/`.
2. **Pemisahan Tanggung Jawab (Separation of Concerns):**
   - **`mock/`** : Berisi dataset mentah (seed data), generator dummy (seperti SVG watermark foto), dan konstanta statis.
   - **`repositories/`** : Mengelola akses data, in-memory state, mutasi lokal, filtering internal, dan mekanisme reaktif (*pub/sub listener*).
   - **`services/`** : Lapisan abstraksi logika bisnis publik yang dipanggil langsung oleh UI (mempermudah transisi ke real REST/WebSocket API di masa depan tanpa mengubah kode UI).
   - **`index.ts`** : Barrel export publik untuk mempermudah impor.
3. **Single Source of Truth (SSoT):**
   Entitas dasar (Kendaraan, Pengemudi, Geofence, Rute) merujuk pada master data CORE (`@/data/services`). Modul bisnis vertikal tidak boleh menduplikasi master data fisik.
4. **Data Realistis dan Aman:**
   Data harus memiliki relasi yang masuk akal (koordinat nyata, waktu logis, nomor polisi standar Indonesia), serta tidak menggunakan data pribadi nyata.

---

## 2. Struktur Direktori Data Layer

```text
apps/business/src/data/
├── core/                       ← Data layer untuk CORE platform
├── mock/                       ← Central CORE mock data (vehicles, drivers, geofences)
├── repositories/               ← Central CORE repositories
├── services/                   ← Central CORE services
│   └── index.ts                ← Barrel export CORE services
│
└── modules/                    ← Data layer modul vertikal bisnis
    ├── rental/                 ← Modul Rental
    │   ├── mock/               ← Dataset sewa, pelanggan, tarif, kontrak
    │   ├── repositories/       ← In-memory store & CRUD rental
    │   ├── services/           ← Service publik rental
    │   └── index.ts            ← Barrel export rental services
    │
    ├── transport/              ← Modul Transport
    │   ├── mock/
    │   ├── repositories/
    │   ├── services/
    │   └── index.ts
    │
    └── activity/               ← Modul Aktivitas Pengemudi
        ├── mock/               ← Seed absensi tugas, geofence, laporan tiba, darurat
        ├── repositories/       ← In-memory store reaktif presensi & laporan
        ├── services/           ← Service publik aktivitas pengemudi
        └── index.ts
```

---

## 3. Alur Konsumsi Data (One-Way Data Flow)

```text
┌────────────────────────────────────────────────────────┐
│              UI Feature Layer (features/)              │
│       Contoh: TaskAttendanceFeature, DriverPortal      │
└───────────────────────────▲────────────────────────────┘
                            │ Mengonsumsi via service layer
                            │ (subscribe & method call)
┌───────────────────────────┴────────────────────────────┐
│              Service Layer (data/.../services/)        │
│       Contoh: taskAttendanceService, rentalService     │
└───────────────────────────▲────────────────────────────┘
                            │ Memanggil repository
┌───────────────────────────┴────────────────────────────┐
│         Repository Layer (data/.../repositories/)      │
│      Contoh: in-memory store, listener, mutasi state   │
└───────────────────────────▲────────────────────────────┘
                            │ Mengambil seed awal
┌───────────────────────────┴────────────────────────────┐
│             Mock Seed Layer (data/.../mock/)           │
│           Contoh: array SEED_*, generator SVG          │
└────────────────────────────────────────────────────────┘
```

---

## 4. Pola Implementasi Standar

### A. File Mock (`mock/[domain].ts`)
Hanya berisi data mentah (*plain objects/arrays*) dan generator dummy helper:
```ts
export const SEED_TASK_ATTENDANCE: TaskAttendanceRecord[] = [ ... ];
export function generateWatermarkedSelfieSvg(...) { ... }
```

### B. File Repository (`repositories/[domain]Repository.ts`)
Mengelola state in-memory, array aktif, dan subscriber:
```ts
let _records = [...SEED_TASK_ATTENDANCE];
const _listeners = new Set<() => void>();

export const taskAttendanceRepository = {
  getAll() { return [..._records]; },
  getById(id: string) { return _records.find(r => r.id === id); },
  add(record) { ...; notify(); },
  subscribe(fn) { ... },
};
```

### C. File Service (`services/[domain]Service.ts`)
Menyediakan method dengan return Promise atau synchronous helper untuk UI:
```ts
import { taskAttendanceRepository } from '../repositories/taskAttendanceRepository';

export const taskAttendanceService = {
  getAttendances: () => taskAttendanceRepository.getAll(),
  getStats: () => taskAttendanceRepository.getStats(),
  recordCheckIn: (payload) => taskAttendanceRepository.recordCheckIn(payload),
  subscribe: (fn) => taskAttendanceRepository.subscribe(fn),
};
```

### D. Konsumsi di Komponen UI (`features/`)
Komponen UI mengimpor langsung dari service layer:
```ts
import { taskAttendanceService } from '@/data/modules/activity';

export function TaskAttendanceFeature() {
  const [data, setData] = useState(() => taskAttendanceService.getAttendances());

  useEffect(() => {
    return taskAttendanceService.subscribe(() => {
      setData(taskAttendanceService.getAttendances());
    });
  }, []);
}
```

---

## 5. Ringkasan Aturan
1. **Dilarang** meletakkan seed data mentah di dalam `features/`.
2. **Dilarang** mengakses `repositories/` langsung dari UI; gunakan selalu `services/`.
3. Semua modul domain baru **wajib** mengikuti struktur `data/modules/[nama-modul]/{mock,repositories,services}`.
