import type { TaskAttendanceRecord } from '@/features/modules/activity/driver/task-attendance/types/taskAttendance';

/**
 * Helper untuk membuat foto selfie dummy dengan watermark ADATRACK realistis
 */
export function generateWatermarkedSelfieSvg(
  driverName: string,
  action: 'Mulai Tugas' | 'Selesai Tugas',
  vehiclePlate: string,
  timeStr: string,
  location: string,
  coords: string,
  distance: number
): string {
  const isStart = action === 'Mulai Tugas';
  const badgeColor = isStart ? '#2563eb' : '#16a34a';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#090d16"/>
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
      <polygon points="120,240 90,190 150,190" fill="#334155"/>
      <path d="M60 80 C60 50 180 50 180 80 L200 90 L40 90 Z" fill="#1e293b"/>
    </g>

    <line x1="200" y1="0" x2="200" y2="750" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>
    <line x1="400" y1="0" x2="400" y2="750" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>
    <line x1="0" y1="250" x2="600" y2="250" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>
    <line x1="0" y1="500" x2="600" y2="500" stroke="#334155" stroke-dasharray="4,6" opacity="0.3"/>

    <rect width="600" height="750" fill="url(#overlay)"/>

    <!-- Top Watermark Bar -->
    <g transform="translate(24, 30)">
      <rect x="0" y="0" width="130" height="32" rx="6" fill="#dc2626"/>
      <text x="65" y="21" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900" letter-spacing="1.5" text-anchor="middle">ADATRACK</text>
      
      <rect x="420" y="0" width="132" height="32" rx="16" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="1.5"/>
      <circle cx="436" cy="16" r="4" fill="#10b981"/>
      <text x="490" y="21" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">GPS VERIFIED</text>
    </g>

    <!-- Bottom Watermark Panel -->
    <g transform="translate(24, 530)">
      <rect x="0" y="0" width="552" height="190" rx="16" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" stroke-width="1"/>
      
      <rect x="20" y="20" width="110" height="26" rx="6" fill="${badgeColor}"/>
      <text x="75" y="37" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">${action.toUpperCase()}</text>
      
      <text x="145" y="38" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="16" font-weight="800">${driverName}</text>
      <text x="440" y="38" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="14" font-weight="700">${vehiclePlate}</text>

      <line x1="20" y1="58" x2="532" y2="58" stroke="#334155" stroke-width="1"/>

      <text x="20" y="82" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Lokasi Presensi:</text>
      <text x="20" y="103" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">${location}</text>

      <text x="20" y="130" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Koordinat & Waktu:</text>
      <text x="20" y="151" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="700">${coords} • ${timeStr} WIB</text>

      <g transform="translate(340, 125)">
        <rect x="0" y="0" width="192" height="34" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1"/>
        <text x="96" y="21" fill="#34d399" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Jarak Armada: ${distance}m (Aman)</text>
      </g>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SEED_TASK_ATTENDANCE: TaskAttendanceRecord[] = [
  {
    id: 'TA-2026-001',
    driverId: 'DRV-001',
    driverName: 'Ahmad Fauzi',
    driverPhone: '0812-3456-7890',
    vehiclePlate: 'B 1001 GHI',
    vehicleModel: 'Hino Dutro Box 130 HD',
    date: '2026-10-16',
    startTime: '2026-10-16T07:15:00+07:00',
    startLocation: {
      address: 'Pool Pusat Cakung, Jl. Raya Bekasi KM 21, Jakarta Timur',
      coordinates: { lat: -6.1852, lng: 106.9421 },
      distanceMeters: 18,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Ahmad Fauzi',
      'Mulai Tugas',
      'B 1001 GHI',
      '16 Okt 2026 07:15',
      'Pool Pusat Cakung, Jakarta Timur',
      '-6.1852, 106.9421',
      18
    ),
    status: 'in_progress',
    notes: 'Rute pengiriman ekspedisi area Bekasi - Karawang.',
  },
  {
    id: 'TA-2026-002',
    driverId: 'DRV-002',
    driverName: 'Budi Santoso',
    driverPhone: '0821-9876-5432',
    vehiclePlate: 'B 1234 CD',
    vehicleModel: 'Mitsubishi Fuso Canter FE 74',
    date: '2026-10-16',
    startTime: '2026-10-16T08:00:00+07:00',
    startLocation: {
      address: 'Pool Utama Balaraja, Jl. Raya Serang KM 28, Tangerang',
      coordinates: { lat: -6.2118, lng: 106.4529 },
      distanceMeters: 25,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Budi Santoso',
      'Mulai Tugas',
      'B 1234 CD',
      '16 Okt 2026 08:00',
      'Pool Utama Balaraja, Tangerang',
      '-6.2118, 106.4529',
      25
    ),
    status: 'in_progress',
    notes: 'Pengangkutan logistik manufaktur ke Kawasan GIIC Cikarang.',
  },
  {
    id: 'TA-2026-003',
    driverId: 'DRV-003',
    driverName: 'Siti Rahayu',
    driverPhone: '0831-2345-6789',
    vehiclePlate: 'B 5678 DEF',
    vehicleModel: 'Toyota Hilux Single Cabin 4x2',
    date: '2026-10-16',
    startTime: '2026-10-16T06:45:00+07:00',
    endTime: '2026-10-16T09:15:00+07:00',
    durationMinutes: 150,
    startLocation: {
      address: 'Hub Logistik Pluit, Jl. Pluit Selatan No. 8, Jakarta Utara',
      coordinates: { lat: -6.1245, lng: 106.7891 },
      distanceMeters: 12,
      isNearVehicle: true,
    },
    endLocation: {
      address: 'DC Cengkareng, Kawasan Pergudangan Soewarna, Tangerang',
      coordinates: { lat: -6.1302, lng: 106.6645 },
      distanceMeters: 30,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Siti Rahayu',
      'Mulai Tugas',
      'B 5678 DEF',
      '16 Okt 2026 06:45',
      'Hub Logistik Pluit, Jakarta Utara',
      '-6.1245, 106.7891',
      12
    ),
    endPhoto: generateWatermarkedSelfieSvg(
      'Siti Rahayu',
      'Selesai Tugas',
      'B 5678 DEF',
      '16 Okt 2026 09:15',
      'DC Cengkareng, Soewarna, Tangerang',
      '-6.1302, 106.6645',
      30
    ),
    status: 'completed',
    notes: 'Distribusi suku cadang mendesak bandara selesai tanpa kendala.',
  },
  {
    id: 'TA-2026-004',
    driverId: 'DRV-004',
    driverName: 'Rizky Pratama',
    driverPhone: '0852-3344-5566',
    vehiclePlate: 'B 9012 JKL',
    vehicleModel: 'Isuzu Giga Wingbox FVM',
    date: '2026-10-15',
    startTime: '2026-10-15T07:30:00+07:00',
    endTime: '2026-10-15T17:15:00+07:00',
    durationMinutes: 585,
    startLocation: {
      address: 'Pool Pusat Cakung, Jl. Raya Bekasi KM 21, Jakarta Timur',
      coordinates: { lat: -6.1852, lng: 106.9421 },
      distanceMeters: 22,
      isNearVehicle: true,
    },
    endLocation: {
      address: 'Pool Pusat Cakung, Jl. Raya Bekasi KM 21, Jakarta Timur',
      coordinates: { lat: -6.1855, lng: 106.9419 },
      distanceMeters: 19,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Rizky Pratama',
      'Mulai Tugas',
      'B 9012 JKL',
      '15 Okt 2026 07:30',
      'Pool Pusat Cakung, Jakarta Timur',
      '-6.1852, 106.9421',
      22
    ),
    endPhoto: generateWatermarkedSelfieSvg(
      'Rizky Pratama',
      'Selesai Tugas',
      'B 9012 JKL',
      '15 Okt 2026 17:15',
      'Pool Pusat Cakung, Jakarta Timur',
      '-6.1855, 106.9419',
      19
    ),
    status: 'completed',
    notes: 'Pengiriman muatan semen curah Cikarang - Karawang PP.',
  },
  {
    id: 'TA-2026-005',
    driverId: 'DRV-005',
    driverName: 'Dewi Ratnasari',
    driverPhone: '0878-1122-3344',
    vehiclePlate: 'B 3456 MNO',
    vehicleModel: 'Daihatsu Gran Max Blind Van',
    date: '2026-10-15',
    startTime: '2026-10-15T08:15:00+07:00',
    endTime: '2026-10-15T16:45:00+07:00',
    durationMinutes: 510,
    startLocation: {
      address: 'Kantor Cabang Kemayoran, Jl. Angkasa No. 12, Jakarta Pusat',
      coordinates: { lat: -6.1582, lng: 106.8431 },
      distanceMeters: 15,
      isNearVehicle: true,
    },
    endLocation: {
      address: 'Kantor Cabang Kemayoran, Jl. Angkasa No. 12, Jakarta Pusat',
      coordinates: { lat: -6.1580, lng: 106.8430 },
      distanceMeters: 14,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Dewi Ratnasari',
      'Mulai Tugas',
      'B 3456 MNO',
      '15 Okt 2026 08:15',
      'Kantor Cabang Kemayoran, Jakarta Pusat',
      '-6.1582, 106.8431',
      15
    ),
    endPhoto: generateWatermarkedSelfieSvg(
      'Dewi Ratnasari',
      'Selesai Tugas',
      'B 3456 MNO',
      '15 Okt 2026 16:45',
      'Kantor Cabang Kemayoran, Jakarta Pusat',
      '-6.1580, 106.8430',
      14
    ),
    status: 'completed',
    notes: 'Antar dokumen dan paket VIP korporat Jakarta Selatan.',
  },
  {
    id: 'TA-2026-006',
    driverId: 'DRV-006',
    driverName: 'Hendra Wijaya',
    driverPhone: '0813-7788-9900',
    vehiclePlate: 'B 7890 PQR',
    vehicleModel: 'Hino Ranger FLX 260 JW',
    date: '2026-10-15',
    startTime: '2026-10-15T09:00:00+07:00',
    endTime: '2026-10-15T19:30:00+07:00',
    durationMinutes: 630,
    startLocation: {
      address: 'Depot Minyak Tanjung Priok, Jakarta Utara',
      coordinates: { lat: -6.1042, lng: 106.8839 },
      distanceMeters: 35,
      isNearVehicle: true,
    },
    endLocation: {
      address: 'Depot Minyak Tanjung Priok, Jakarta Utara',
      coordinates: { lat: -6.1040, lng: 106.8835 },
      distanceMeters: 28,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Hendra Wijaya',
      'Mulai Tugas',
      'B 7890 PQR',
      '15 Okt 2026 09:00',
      'Depot Minyak Tanjung Priok, Jakarta Utara',
      '-6.1042, 106.8839',
      35
    ),
    endPhoto: generateWatermarkedSelfieSvg(
      'Hendra Wijaya',
      'Selesai Tugas',
      'B 7890 PQR',
      '15 Okt 2026 19:30',
      'Depot Minyak Tanjung Priok, Jakarta Utara',
      '-6.1040, 106.8835',
      28
    ),
    status: 'completed',
    notes: 'Pengantaran tangki BBM industri ke kawasan industri Cikande.',
  },
  {
    id: 'TA-2026-007',
    driverId: 'DRV-007',
    driverName: 'Agus Setiawan',
    driverPhone: '0822-4455-6677',
    vehiclePlate: 'B 2345 STU',
    vehicleModel: 'Mitsubishi Colt Diesel FE 71',
    date: '2026-10-14',
    startTime: '2026-10-14T07:00:00+07:00',
    endTime: '2026-10-14T15:30:00+07:00',
    durationMinutes: 510,
    startLocation: {
      address: 'Pool Utama Balaraja, Jl. Raya Serang KM 28, Tangerang',
      coordinates: { lat: -6.2118, lng: 106.4529 },
      distanceMeters: 20,
      isNearVehicle: true,
    },
    endLocation: {
      address: 'Pool Utama Balaraja, Jl. Raya Serang KM 28, Tangerang',
      coordinates: { lat: -6.2120, lng: 106.4530 },
      distanceMeters: 17,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Agus Setiawan',
      'Mulai Tugas',
      'B 2345 STU',
      '14 Okt 2026 07:00',
      'Pool Utama Balaraja, Tangerang',
      '-6.2118, 106.4529',
      20
    ),
    endPhoto: generateWatermarkedSelfieSvg(
      'Agus Setiawan',
      'Selesai Tugas',
      'B 2345 STU',
      '14 Okt 2026 15:30',
      'Pool Utama Balaraja, Tangerang',
      '-6.2120, 106.4530',
      17
    ),
    status: 'completed',
    notes: 'Kargo retail harian mall Tangerang Raya.',
  },
  {
    id: 'TA-2026-008',
    driverId: 'DRV-008',
    driverName: 'Dedi Kusnandar',
    driverPhone: '0811-2233-4455',
    vehiclePlate: 'B 6789 VWX',
    vehicleModel: 'Toyota Dyna 130 XT Box',
    date: '2026-10-14',
    startTime: '2026-10-14T08:30:00+07:00',
    endTime: '2026-10-14T18:00:00+07:00',
    durationMinutes: 570,
    startLocation: {
      address: 'Pergudangan Marunda Center, Bekasi Barat',
      coordinates: { lat: -6.1102, lng: 106.9821 },
      distanceMeters: 26,
      isNearVehicle: true,
    },
    endLocation: {
      address: 'Pergudangan Marunda Center, Bekasi Barat',
      coordinates: { lat: -6.1105, lng: 106.9825 },
      distanceMeters: 22,
      isNearVehicle: true,
    },
    startPhoto: generateWatermarkedSelfieSvg(
      'Dedi Kusnandar',
      'Mulai Tugas',
      'B 6789 VWX',
      '14 Okt 2026 08:30',
      'Pergudangan Marunda Center, Bekasi',
      '-6.1102, 106.9821',
      26
    ),
    endPhoto: generateWatermarkedSelfieSvg(
      'Dedi Kusnandar',
      'Selesai Tugas',
      'B 6789 VWX',
      '14 Okt 2026 18:00',
      'Pergudangan Marunda Center, Bekasi',
      '-6.1105, 106.9825',
      22
    ),
    status: 'completed',
    notes: 'Pengiriman FMCG ke 6 supermarket di Jabodetabek.',
  },
];
