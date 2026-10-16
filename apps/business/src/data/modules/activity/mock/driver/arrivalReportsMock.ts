import type {
  ArrivalReportRecord,
} from '@/features/modules/activity/driver/arrival-reports/types/arrivalReport';

/**
 * Helper untuk membuat foto selfie dummy dengan watermark ADATRACK untuk Laporan Tiba di Tujuan
 */
export function generateArrivalSelfieSvg(
  driverName: string,
  destinationName: string,
  vehiclePlate: string,
  timeStr: string,
  location: string,
  coords: string
): string {
  const badgeColor = '#059669'; // Emerald for arrival
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#064e3b"/>
      </linearGradient>
      <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0.7)"/>
        <stop offset="20%" stop-color="rgba(0,0,0,0.1)"/>
        <stop offset="65%" stop-color="rgba(0,0,0,0.2)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.92)"/>
      </linearGradient>
    </defs>

    <!-- Background Simulated Camera View -->
    <rect width="600" height="750" fill="url(#bg)"/>

    <!-- Simulated Driver Silhouette -->
    <g opacity="0.45" transform="translate(180, 200)">
      <circle cx="120" cy="110" r="70" fill="#94a3b8"/>
      <path d="M120 75 C100 75 80 85 75 105 C75 130 95 145 120 145 C145 145 165 130 165 105 C160 85 140 75 120 75 Z" fill="#64748b"/>
      <path d="M40 320 C40 230 80 190 120 190 C160 190 200 230 200 320 Z" fill="#475569"/>
      <!-- Uniform Collar -->
      <polygon points="120,240 90,190 150,190" fill="#334155"/>
      <!-- Cap / Topi -->
      <path d="M60 80 C60 50 180 50 180 80 L200 90 L40 90 Z" fill="#1e293b"/>
    </g>

    <!-- Camera Grid Lines -->
    <line x1="200" y1="0" x2="200" y2="750" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>
    <line x1="400" y1="0" x2="400" y2="750" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>
    <line x1="0" y1="250" x2="600" y2="250" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>
    <line x1="0" y1="500" x2="600" y2="500" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>

    <!-- Full Image Gradient Overlay -->
    <rect width="600" height="750" fill="url(#overlay)"/>

    <!-- Top Watermark Bar -->
    <g transform="translate(24, 30)">
      <!-- ADATRACK Logo Badge -->
      <rect x="0" y="0" width="130" height="32" rx="6" fill="#dc2626"/>
      <text x="65" y="21" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900" letter-spacing="1.5" text-anchor="middle">ADATRACK</text>
      
      <!-- GPS Verified Badge -->
      <rect x="400" y="0" width="152" height="32" rx="16" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="1.5"/>
      <circle cx="416" cy="16" r="4" fill="#10b981"/>
      <text x="480" y="21" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">ARRIVAL VERIFIED</text>
    </g>

    <!-- Bottom Watermark Panel -->
    <g transform="translate(24, 520)">
      <!-- Panel Glass Background -->
      <rect x="0" y="0" width="552" height="200" rx="16" fill="rgba(15, 23, 42, 0.9)" stroke="#334155" stroke-width="1"/>
      
      <!-- Action & Destination Header -->
      <rect x="20" y="20" width="130" height="26" rx="6" fill="${badgeColor}"/>
      <text x="85" y="37" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">TIBA DI TUJUAN</text>
      
      <text x="165" y="38" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="15" font-weight="800">${destinationName}</text>
      <text x="440" y="38" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="14" font-weight="700">${vehiclePlate}</text>

      <line x1="20" y1="58" x2="532" y2="58" stroke="#334155" stroke-width="1"/>

      <!-- Driver & Location Info -->
      <text x="20" y="82" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Pengemudi & Alamat:</text>
      <text x="20" y="103" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">${driverName} • ${location}</text>

      <text x="20" y="130" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Koordinat & Waktu:</text>
      <text x="20" y="151" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="700">${coords} • ${timeStr} WIB</text>

      <!-- Status Tag -->
      <g transform="translate(320, 125)">
        <rect x="0" y="0" width="212" height="34" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1"/>
        <text x="106" y="21" fill="#34d399" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Kedatangan Valid GPS</text>
      </g>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ─── DUMMY SEED DATA ──────────────────────────────────────────────────────────

export const SEED_ARRIVAL_REPORTS: ArrivalReportRecord[] = [
  {
    id: 'AR-2026-001',
    driverId: 'DRV-001',
    driverName: 'Ahmad Fauzi',
    driverPhone: '0812-3456-7890',
    vehiclePlate: 'B 1001 GHI',
    vehicleModel: 'Hino Dutro Box 130 HD',
    destinationName: 'PT Unilever Indonesia',
    destinationType: 'Gudang Klien',
    date: '2026-10-16',
    timestamp: '2026-10-16T08:50:00+07:00',
    address: 'Kawasan Industri Jababeka V Blok U No. 1, Cikarang',
    coordinates: { lat: -6.3125, lng: 107.1512 },
    photo: generateArrivalSelfieSvg(
      'Ahmad Fauzi',
      'PT Unilever Indonesia',
      'B 1001 GHI',
      '16 Okt 2026 08:50',
      'Jababeka V Cikarang',
      '-6.3125, 107.1512'
    ),
    recipientName: 'Bpk. Triyono (Staff Gudang Inbound)',
    recipientPhone: '0813-2233-4455',
    status: 'verified',
    notes: 'Muatan 40 koli bahan baku diterima lengkap tanpa kerusakan.',
  },
  {
    id: 'AR-2026-002',
    driverId: 'DRV-002',
    driverName: 'Budi Santoso',
    driverPhone: '0821-9876-5432',
    vehiclePlate: 'B 1234 CD',
    vehicleModel: 'Mitsubishi Fuso Canter FE 74',
    destinationName: 'DC Indomarco Cakung Barat',
    destinationType: 'Pusat Distribusi',
    date: '2026-10-16',
    timestamp: '2026-10-16T09:15:00+07:00',
    address: 'Jl. Raya Cakung Cilincing KM 3, Jakarta Timur',
    coordinates: { lat: -6.1721, lng: 106.9531 },
    photo: generateArrivalSelfieSvg(
      'Budi Santoso',
      'DC Indomarco Cakung',
      'B 1234 CD',
      '16 Okt 2026 09:15',
      'Cakung Cilincing KM 3',
      '-6.1721, 106.9531'
    ),
    recipientName: 'Ibu Ratna (Logistik DC)',
    recipientPhone: '0822-3344-5566',
    status: 'verified',
    notes: 'Tiba di loading dock 4. Antrean bongkar muat kargo retail.',
  },
  {
    id: 'AR-2026-003',
    driverId: 'DRV-003',
    driverName: 'Siti Rahayu',
    driverPhone: '0831-2345-6789',
    vehiclePlate: 'B 5678 DEF',
    vehicleModel: 'Toyota Hilux Single Cabin',
    destinationName: 'Proyek Tol Cibitung - Cilincing KM 18',
    destinationType: 'Proyek / Konstruksi',
    date: '2026-10-16',
    timestamp: '2026-10-16T09:40:00+07:00',
    address: 'Akses Seksi 3 Simpang Susun Setu Utara, Bekasi',
    coordinates: { lat: -6.2842, lng: 107.0789 },
    photo: generateArrivalSelfieSvg(
      'Siti Rahayu',
      'Proyek Tol Cibitung KM 18',
      'B 5678 DEF',
      '16 Okt 2026 09:40',
      'Seksi 3 SS Setu Utara',
      '-6.2842, 107.0789'
    ),
    recipientName: 'Ir. Hendro (Site Supervisor)',
    recipientPhone: '0812-8899-0011',
    status: 'verified',
    notes: 'Pengantaran suku cadang excavator proyek dan oli mesin darurat.',
  },
  {
    id: 'AR-2026-004',
    driverId: 'DRV-004',
    driverName: 'Rizky Pratama',
    driverPhone: '0852-3344-5566',
    vehiclePlate: 'B 9012 JKL',
    vehicleModel: 'Isuzu Giga Wingbox FVM',
    destinationName: 'Mall Kelapa Gading Loading Dock',
    destinationType: 'Retail / Mall',
    date: '2026-10-15',
    timestamp: '2026-10-15T11:05:00+07:00',
    address: 'Jl. Boulevard Kelapa Gading, Jakarta Utara',
    coordinates: { lat: -6.1578, lng: 106.9082 },
    photo: generateArrivalSelfieSvg(
      'Rizky Pratama',
      'Mall Kelapa Gading',
      'B 9012 JKL',
      '15 Okt 2026 11:05',
      'Loading Dock Basement 1',
      '-6.1578, 106.9082'
    ),
    recipientName: 'Bpk. Agus (Chief Security Dock)',
    status: 'verified',
    notes: 'Kargo fashion & display musiman toko ritel.',
  },
  {
    id: 'AR-2026-005',
    driverId: 'DRV-005',
    driverName: 'Dewi Ratnasari',
    driverPhone: '0878-1122-3344',
    vehiclePlate: 'B 3456 MNO',
    vehicleModel: 'Daihatsu Gran Max Blind Van',
    destinationName: 'RS Siloam Lippo Village',
    destinationType: 'Fasilitas Umum',
    date: '2026-10-15',
    timestamp: '2026-10-15T13:30:00+07:00',
    address: 'Jl. Siloam No. 6, Lippo Karawaci, Tangerang',
    coordinates: { lat: -6.2251, lng: 106.6112 },
    photo: generateArrivalSelfieSvg(
      'Dewi Ratnasari',
      'RS Siloam Karawaci',
      'B 3456 MNO',
      '15 Okt 2026 13:30',
      'Apotek Instalasi Farmasi',
      '-6.2251, 106.6112'
    ),
    recipientName: 'Apt. Sarah (Farmasi Pusat)',
    recipientPhone: '0856-7788-9900',
    status: 'verified',
    notes: 'Obat-obatan suhu dingin khusus cold chain tiba dalam kondisi terukur 4°C.',
  },
  {
    id: 'AR-2026-006',
    driverId: 'DRV-006',
    driverName: 'Hendra Wijaya',
    driverPhone: '0813-7788-9900',
    vehiclePlate: 'B 7890 PQR',
    vehicleModel: 'Hino Ranger FLX 260 JW',
    destinationName: 'PT Astra Honda Motor KIIC',
    destinationType: 'Gudang Klien',
    date: '2026-10-15',
    timestamp: '2026-10-15T15:20:00+07:00',
    address: 'Kawasan Industri KIIC Lot B-1, Telukjambe, Karawang',
    coordinates: { lat: -6.3458, lng: 107.2842 },
    photo: generateArrivalSelfieSvg(
      'Hendra Wijaya',
      'PT Astra Honda Motor',
      'B 7890 PQR',
      '15 Okt 2026 15:20',
      'Plant 3 KIIC Karawang',
      '-6.3458, 107.2842'
    ),
    recipientName: 'Bpk. Joko (Penerimaan Sub-Assy)',
    status: 'verified',
    notes: 'Muatan bodi stamping tiba tepat waktu sesuai jadwal produksi malam.',
  },
  {
    id: 'AR-2026-007',
    driverId: 'DRV-007',
    driverName: 'Agus Setiawan',
    driverPhone: '0822-4455-6677',
    vehiclePlate: 'B 2345 STU',
    vehicleModel: 'Mitsubishi Colt Diesel FE 71',
    destinationName: 'Grand Indonesia East Mall Dock',
    destinationType: 'Retail / Mall',
    date: '2026-10-14',
    timestamp: '2026-10-14T07:45:00+07:00',
    address: 'Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat',
    coordinates: { lat: -6.1952, lng: 106.8214 },
    photo: generateArrivalSelfieSvg(
      'Agus Setiawan',
      'Grand Indonesia East Mall',
      'B 2345 STU',
      '14 Okt 2026 07:45',
      'Loading Bay B2 Timur',
      '-6.1952, 106.8214'
    ),
    recipientName: 'Bpk. Deni (Tenant Coordinator)',
    status: 'verified',
    notes: 'Bongkar muat pagi sebelum jam operasional mal.',
  },
  {
    id: 'AR-2026-008',
    driverId: 'DRV-008',
    driverName: 'Dedi Kusnandar',
    driverPhone: '0811-2233-4455',
    vehiclePlate: 'B 6789 VWX',
    vehicleModel: 'Toyota Dyna 130 XT Box',
    destinationName: 'Proyek LRT Jabodebek Stasiun Halim',
    destinationType: 'Proyek / Konstruksi',
    date: '2026-10-14',
    timestamp: '2026-10-14T10:10:00+07:00',
    address: 'Akses Stasiun Kereta Cepat Halim, Jakarta Timur',
    coordinates: { lat: -6.2441, lng: 106.8856 },
    photo: generateArrivalSelfieSvg(
      'Dedi Kusnandar',
      'Proyek Stasiun Halim',
      'B 6789 VWX',
      '14 Okt 2026 10:10',
      'Area Drop Zone Proyek',
      '-6.2441, 106.8856'
    ),
    recipientName: 'Bpk. Ramlan (Staff Logistik KCIC)',
    status: 'verified',
    notes: 'Serah terima modul elektrikal dan perkabelan panel.',
  },
  {
    id: 'AR-2026-009',
    driverId: 'DRV-009',
    driverName: 'Eko Prasetyo',
    driverPhone: '0819-5566-7788',
    vehiclePlate: 'B 4321 YZA',
    vehicleModel: 'Hino Dutro Cargo 110 SD',
    destinationName: 'DC Alfamart Balaraja Barat',
    destinationType: 'Pusat Distribusi',
    date: '2026-10-14',
    timestamp: '2026-10-14T14:35:00+07:00',
    address: 'Jl. Raya Serang KM 32, Cikande, Balaraja',
    coordinates: { lat: -6.2052, lng: 106.3982 },
    photo: generateArrivalSelfieSvg(
      'Eko Prasetyo',
      'DC Alfamart Balaraja',
      'B 4321 YZA',
      '14 Okt 2026 14:35',
      'Jl. Raya Serang KM 32',
      '-6.2052, 106.3982'
    ),
    recipientName: 'Bpk. Syaiful (Checker Inbound)',
    status: 'pending_review',
    notes: 'Laporan tiba di lokasi dengan dokumen fisik menunggu tanda tangan SPK.',
  },
];
