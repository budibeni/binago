/**
 * Emergency Report Store (dummy in-memory store)
 * 
 * Digunakan sebagai shared state antara:
 * - DriverPortalFeature (producer) — driver mengirim laporan
 * - EmergencyReportsFeature (consumer) — admin melihat laporan
 * 
 * Pada production, ini akan digantikan oleh API + WebSocket.
 */

export type EmergencyCategory = 'kerusakan' | 'kehilangan' | 'kecelakaan' | 'lainnya';
export type EmergencyStatus = 'baru' | 'ditangani' | 'selesai';

export interface EmergencyReportNote {
  id: string;
  timestamp: string;  // ISO string
  author: string;     // e.g. "Supervisor Doni"
  content: string;    // Isi catatan
}

export interface EmergencyReport {
  id: string;
  timestamp: string;        // ISO string
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  vehicleType: string;
  category: EmergencyCategory;
  description: string;
  location: string;          // Human-readable address
  coordinates: { lat: number; lng: number };
  status: EmergencyStatus;
  handledBy?: string;        // Nama admin yang menangani
  handledAt?: string;        // ISO string
  resolvedAt?: string;       // ISO string
  notes?: string;            // Ringkasan catatan terakhir
  activityLog?: EmergencyReportNote[]; // Timeline log catatan berkala
}

// ─── DUMMY SEED DATA ──────────────────────────────────────────────────────────
const SEED_REPORTS: EmergencyReport[] = [
  {
    id: 'ER-2026-001',
    timestamp: '2026-10-15T08:30:00+07:00',
    driverName: 'Ahmad Fauzi',
    driverPhone: '08123456789',
    vehiclePlate: 'B 1234 ABC',
    vehicleType: 'Truk Box',
    category: 'kerusakan',
    description: 'Ban belakang kiri pecah di tol. Kendaraan tidak bisa melanjutkan perjalanan. Butuh bantuan segera.',
    location: 'Rest Area KM 42, Tol Jakarta-Cikampek',
    coordinates: { lat: -6.3012, lng: 107.1234 },
    status: 'selesai',
    handledBy: 'Supervisor Doni',
    handledAt: '2026-10-15T08:45:00+07:00',
    resolvedAt: '2026-10-15T10:20:00+07:00',
    notes: 'Ban telah diganti. Kendaraan dicek aman dan sudah bisa melanjutkan perjalanan.',
    activityLog: [
      {
        id: 'note-001-1',
        timestamp: '2026-10-15T08:45:00+07:00',
        author: 'Supervisor Doni',
        content: 'Teknisi dari pos Cikarang dihubungi dan segera meluncur ke Rest Area KM 42.',
      },
      {
        id: 'note-001-2',
        timestamp: '2026-10-15T09:30:00+07:00',
        author: 'Supervisor Doni',
        content: 'Teknisi tiba di lokasi. Proses pelepasan dan penggantian ban serep berlangsung.',
      },
      {
        id: 'note-001-3',
        timestamp: '2026-10-15T10:20:00+07:00',
        author: 'Supervisor Doni',
        content: 'Ban telah diganti. Kendaraan dicek aman dan sudah bisa melanjutkan perjalanan.',
      },
    ],
  },
  {
    id: 'ER-2026-002',
    timestamp: '2026-10-15T13:15:00+07:00',
    driverName: 'Budi Santoso',
    driverPhone: '08234567890',
    vehiclePlate: 'B 5678 DEF',
    vehicleType: 'Pickup',
    category: 'kecelakaan',
    description: 'Tabrakan ringan dengan kendaraan lain di persimpangan. Tidak ada korban jiwa. Kendaraan penyok di bagian depan.',
    location: 'Jl. Raya Bekasi KM 18, Cibitung',
    coordinates: { lat: -6.2891, lng: 107.0231 },
    status: 'ditangani',
    handledBy: 'Supervisor Rina',
    handledAt: '2026-10-15T13:30:00+07:00',
    notes: 'Koordinasi asuransi diproses. Driver dalam kondisi sehat.',
    activityLog: [
      {
        id: 'note-002-1',
        timestamp: '2026-10-15T13:30:00+07:00',
        author: 'Supervisor Rina',
        content: 'Menerima laporan kecelakaan ringan. Driver dan pihak lawan sepakat berdamai secara musyawarah.',
      },
      {
        id: 'note-002-2',
        timestamp: '2026-10-15T14:15:00+07:00',
        author: 'Supervisor Rina',
        content: 'Foto kerusakan dikirim ke bagian klaim asuransi armada. Menunggu persetujuan SPK bengkel.',
      },
    ],
  },
  {
    id: 'ER-2026-003',
    timestamp: '2026-10-15T16:45:00+07:00',
    driverName: 'Siti Rahayu',
    driverPhone: '08345678901',
    vehiclePlate: 'B 9012 GHI',
    vehicleType: 'Van',
    category: 'kehilangan',
    description: 'Tas berisi dokumen pengiriman hilang ketika berhenti di SPBU. Dicurigai terlupa di SPBU atau dicuri.',
    location: 'SPBU Shell, Jl. Cikarang Utama No. 55',
    coordinates: { lat: -6.3301, lng: 107.1421 },
    status: 'ditangani',
    handledBy: 'Manajer Operasional',
    handledAt: '2026-10-15T17:00:00+07:00',
    notes: 'Sedang koordinasi dengan pihak SPBU dan CCTV.',
    activityLog: [
      {
        id: 'note-003-1',
        timestamp: '2026-10-15T17:00:00+07:00',
        author: 'Manajer Operasional',
        content: 'Sedang berkoordinasi dengan pengelola SPBU Shell untuk membuka rekaman CCTV area parkir.',
      },
    ],
  },
  {
    id: 'ER-2026-004',
    timestamp: '2026-10-16T07:20:00+07:00',
    driverName: 'Rizky Pratama',
    driverPhone: '08456789012',
    vehiclePlate: 'B 3456 JKL',
    vehicleType: 'Truk Box',
    category: 'kerusakan',
    description: 'Mesin tidak bisa dinyalakan setelah berhenti di tujuan pengiriman. Sudah mencoba beberapa kali tapi tidak berhasil.',
    location: 'Kawasan Industri Jababeka, Cikarang Selatan',
    coordinates: { lat: -6.3555, lng: 107.1678 },
    status: 'baru',
  },
  {
    id: 'ER-2026-005',
    timestamp: '2026-10-16T09:05:00+07:00',
    driverName: 'Dewi Ratnasari',
    driverPhone: '08567890123',
    vehiclePlate: 'B 7890 MNO',
    vehicleType: 'Minibus',
    category: 'lainnya',
    description: 'Penumpang mengalami sakit mendadak. Perlu arahan apakah harus ke rumah sakit terdekat atau melanjutkan rute.',
    location: 'Tol Jakarta Outer Ring Road, Seksi E, KM 33',
    coordinates: { lat: -6.2011, lng: 106.8921 },
    status: 'baru',
  },
];

// ─── IN-MEMORY STORE ──────────────────────────────────────────────────────────
let _reports: EmergencyReport[] = [...SEED_REPORTS];
const _listeners: Set<() => void> = new Set();

function notify() {
  _listeners.forEach((fn) => fn());
}

export const emergencyReportStore = {
  /** Ambil semua laporan (sorted terbaru dulu) */
  getAll(): EmergencyReport[] {
    return [..._reports].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  /** Hitung laporan dengan status 'baru' */
  countNew(): number {
    return _reports.filter((r) => r.status === 'baru').length;
  },

  /** Tambah laporan baru dari driver portal */
  add(report: Omit<EmergencyReport, 'id' | 'status'>): EmergencyReport {
    const newReport: EmergencyReport = {
      ...report,
      id: `ER-${new Date().getFullYear()}-${String(_reports.length + 1).padStart(3, '0')}`,
      status: 'baru',
    };
    _reports = [newReport, ..._reports];
    notify();
    return newReport;
  },

  /** Update status laporan & append catatan ke activity log */
  updateStatus(
    id: string,
    status: EmergencyStatus,
    meta?: { handledBy?: string; note?: string; notes?: string }
  ): void {
    _reports = _reports.map((r) => {
      if (r.id !== id) return r;
      const now = new Date().toISOString();
      const author = meta?.handledBy || 'Super Admin';
      const noteContent = (meta?.note || meta?.notes || '').trim();

      const newActivityLog = [...(r.activityLog || [])];
      if (noteContent) {
        newActivityLog.push({
          id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: now,
          author,
          content: noteContent,
        });
      }

      // Pertahankan waktu pertama kali mulai ditangani
      let handledAt = r.handledAt;
      if (status === 'ditangani' && !handledAt) {
        handledAt = now;
      }

      // Set waktu diselesaikan
      let resolvedAt = r.resolvedAt;
      if (status === 'selesai' && !resolvedAt) {
        resolvedAt = now;
      } else if (status !== 'selesai' && r.status === 'selesai') {
        resolvedAt = undefined;
      }

      return {
        ...r,
        status,
        handledBy: author,
        activityLog: newActivityLog,
        notes: noteContent || r.notes,
        handledAt,
        resolvedAt,
      };
    });
    notify();
  },

  /** Subscribe ke perubahan store */
  subscribe(listener: () => void): () => void {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
};
