import type { GeofenceAttendanceRecord } from '@/features/modules/activity/geofence-attendance/types/geofenceAttendance';

/**
 * Helper untuk membuat foto selfie dummy dengan watermark ADATRACK untuk Absen Geofence
 */
export function generateGeofenceSelfieSvg(
  driverName: string,
  geofenceName: string,
  vehiclePlate: string,
  timeStr: string,
  location: string,
  coords: string,
  distance: number
): string {
  const isInside = distance <= 100;
  const badgeColor = '#d97706';
  const distanceColor = isInside ? '#10b981' : '#f59e0b';
  const distanceLabel = isInside ? `Di Dalam Radius: ${distance}m (Aman)` : `Toleransi: ${distance}m`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0b1120"/>
      </linearGradient>
      <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0.7)"/>
        <stop offset="20%" stop-color="rgba(0,0,0,0.1)"/>
        <stop offset="65%" stop-color="rgba(0,0,0,0.2)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.92)"/>
      </linearGradient>
    </defs>

    <rect width="600" height="750" fill="url(#bg)"/>

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

    <g transform="translate(24, 30)">
      <rect x="0" y="0" width="130" height="32" rx="6" fill="#dc2626"/>
      <text x="65" y="21" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900" letter-spacing="1.5" text-anchor="middle">ADATRACK</text>
      
      <rect x="390" y="0" width="162" height="32" rx="16" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="406" cy="16" r="4" fill="#f59e0b"/>
      <text x="480" y="21" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">GEOFENCE CHECK</text>
    </g>

    <g transform="translate(24, 520)">
      <rect x="0" y="0" width="552" height="200" rx="16" fill="rgba(15, 23, 42, 0.88)" stroke="#334155" stroke-width="1"/>
      
      <rect x="20" y="20" width="135" height="26" rx="6" fill="${badgeColor}"/>
      <text x="87" y="37" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">ABSEN GEOFENCE</text>
      
      <text x="170" y="38" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="16" font-weight="800">${geofenceName}</text>
      <text x="440" y="38" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="14" font-weight="700">${vehiclePlate}</text>

      <line x1="20" y1="58" x2="532" y2="58" stroke="#334155" stroke-width="1"/>

      <text x="20" y="82" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Pengemudi & Lokasi:</text>
      <text x="20" y="103" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">${driverName} • ${location}</text>

      <text x="20" y="130" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Koordinat & Waktu:</text>
      <text x="20" y="151" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="700">${coords} • ${timeStr} WIB</text>

      <g transform="translate(320, 125)">
        <rect x="0" y="0" width="212" height="34" rx="8" fill="rgba(245, 158, 11, 0.15)" stroke="${distanceColor}" stroke-width="1"/>
        <text x="106" y="21" fill="${distanceColor}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">${distanceLabel}</text>
      </g>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SEED_GEOFENCE_ATTENDANCE: GeofenceAttendanceRecord[] = [
  {
    id: 'GA-2026-001',
    driverId: 'DRV-001',
    driverName: 'Ahmad Fauzi',
    driverPhone: '0812-3456-7890',
    vehiclePlate: 'B 1001 GHI',
    vehicleModel: 'Hino Dutro Box 130 HD',
    geofenceId: 'geo-003',
    geofenceName: 'Pool Cakung',
    geofenceCategory: 'Pool',
    date: '2026-10-16',
    timestamp: '2026-10-16T07:10:00+07:00',
    locationAddress: 'Jl. Raya Bekasi KM 21, Cakung, Jakarta Timur',
    coordinates: { lat: -6.1856, lng: 106.9405 },
    distanceMeters: 14,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Ahmad Fauzi',
      'Pool Cakung',
      'B 1001 GHI',
      '16 Okt 2026 07:10',
      'Pool Cakung, Jakarta Timur',
      '-6.1856, 106.9405',
      14
    ),
    notes: 'Presensi kedatangan pagi sebelum jadwal muat ekspedisi.',
  },
  {
    id: 'GA-2026-002',
    driverId: 'DRV-002',
    driverName: 'Budi Santoso',
    driverPhone: '0821-9876-5432',
    vehiclePlate: 'B 1234 CD',
    vehicleModel: 'Mitsubishi Fuso Canter FE 74',
    geofenceId: 'geo-005',
    geofenceName: 'Pool Utama Balaraja',
    geofenceCategory: 'Pool',
    date: '2026-10-16',
    timestamp: '2026-10-16T07:55:00+07:00',
    locationAddress: 'Jl. Raya Serang KM 28, Balaraja, Tangerang',
    coordinates: { lat: -6.2118, lng: 106.4529 },
    distanceMeters: 28,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Budi Santoso',
      'Pool Utama Balaraja',
      'B 1234 CD',
      '16 Okt 2026 07:55',
      'Pool Utama Balaraja, Tangerang',
      '-6.2118, 106.4529',
      28
    ),
    notes: 'Check-in titik geofence pool sebelum armada berangkat ke Karawang.',
  },
  {
    id: 'GA-2026-003',
    driverId: 'DRV-003',
    driverName: 'Siti Rahayu',
    driverPhone: '0831-2345-6789',
    vehiclePlate: 'B 5678 DEF',
    vehicleModel: 'Toyota Hilux Single Cabin',
    geofenceId: 'geo-006',
    geofenceName: 'Bandara Soekarno Hatta',
    geofenceCategory: 'Bandara/Pelabuhan',
    date: '2026-10-16',
    timestamp: '2026-10-16T08:35:00+07:00',
    locationAddress: 'Terminal Kargo Bandara Soekarno-Hatta, Tangerang',
    coordinates: { lat: -6.1258, lng: 106.6562 },
    distanceMeters: 35,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Siti Rahayu',
      'Bandara Soekarno Hatta',
      'B 5678 DEF',
      '16 Okt 2026 08:35',
      'Terminal Kargo Bandara Soetta',
      '-6.1258, 106.6562',
      35
    ),
    notes: 'Tiba di area kargo bandara untuk serah terima paket prioritas.',
  },
  {
    id: 'GA-2026-004',
    driverId: 'DRV-004',
    driverName: 'Rizky Pratama',
    driverPhone: '0852-3344-5566',
    vehiclePlate: 'B 9012 JKL',
    vehicleModel: 'Isuzu Giga Wingbox FVM',
    geofenceId: 'geo-008',
    geofenceName: 'Kawasan Industri MM2100',
    geofenceCategory: 'Kawasan Industri',
    date: '2026-10-16',
    timestamp: '2026-10-16T09:20:00+07:00',
    locationAddress: 'Jl. Irian Blok EE, Kawasan Industri MM2100, Cikarang Barat',
    coordinates: { lat: -6.3065, lng: 107.0872 },
    distanceMeters: 45,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Rizky Pratama',
      'Kawasan Industri MM2100',
      'B 9012 JKL',
      '16 Okt 2026 09:20',
      'MM2100 Cikarang Barat',
      '-6.3065, 107.0872',
      45
    ),
    notes: 'Presensi gerbang inbound pabrik komponen elektronik.',
  },
  {
    id: 'GA-2026-005',
    driverId: 'DRV-005',
    driverName: 'Dewi Ratnasari',
    driverPhone: '0878-1122-3344',
    vehiclePlate: 'B 3456 MNO',
    vehicleModel: 'Daihatsu Gran Max Blind Van',
    geofenceId: 'geo-001',
    geofenceName: 'Gudang Pusat Jakarta',
    geofenceCategory: 'Gudang',
    date: '2026-10-15',
    timestamp: '2026-10-15T08:10:00+07:00',
    locationAddress: 'Jl. Medan Merdeka Timur No. 1, Jakarta Pusat',
    coordinates: { lat: -6.1753, lng: 106.8275 },
    distanceMeters: 18,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Dewi Ratnasari',
      'Gudang Pusat Jakarta',
      'B 3456 MNO',
      '15 Okt 2026 08:10',
      'Gudang Pusat Jakarta',
      '-6.1753, 106.8275',
      18
    ),
    notes: 'Pengambilan surat berharga dan dokumen perbankan.',
  },
  {
    id: 'GA-2026-006',
    driverId: 'DRV-006',
    driverName: 'Hendra Wijaya',
    driverPhone: '0813-7788-9900',
    vehiclePlate: 'B 7890 PQR',
    vehicleModel: 'Hino Ranger FLX 260 JW',
    geofenceId: 'geo-002',
    geofenceName: 'Pelabuhan Tanjung Priok',
    geofenceCategory: 'Bandara/Pelabuhan',
    date: '2026-10-15',
    timestamp: '2026-10-15T10:15:00+07:00',
    locationAddress: 'Terminal Petikemas Koja, Tanjung Priok, Jakarta Utara',
    coordinates: { lat: -6.1092, lng: 106.8835 },
    distanceMeters: 60,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Hendra Wijaya',
      'Pelabuhan Tanjung Priok',
      'B 7890 PQR',
      '15 Okt 2026 10:15',
      'Terminal Koja, Tanjung Priok',
      '-6.1092, 106.8835',
      60
    ),
    notes: 'Presensi gerbang timur terminal petikemas untuk antrean bongkar.',
  },
  {
    id: 'GA-2026-007',
    driverId: 'DRV-007',
    driverName: 'Agus Setiawan',
    driverPhone: '0822-4455-6677',
    vehiclePlate: 'B 2345 STU',
    vehicleModel: 'Mitsubishi Colt Diesel FE 71',
    geofenceId: 'geo-007',
    geofenceName: 'Pool BSD',
    geofenceCategory: 'Pool',
    date: '2026-10-15',
    timestamp: '2026-10-15T14:40:00+07:00',
    locationAddress: 'Jl. BSD Grand Boulevard, Tangerang Selatan',
    coordinates: { lat: -6.3025, lng: 106.6525 },
    distanceMeters: 22,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Agus Setiawan',
      'Pool BSD',
      'B 2345 STU',
      '15 Okt 2026 14:40',
      'Pool BSD, Tangerang Selatan',
      '-6.3025, 106.6525',
      22
    ),
    notes: 'Kembali ke pool BSD setelah rute distribusi ritel Serpong.',
  },
  {
    id: 'GA-2026-008',
    driverId: 'DRV-008',
    driverName: 'Dedi Kusnandar',
    driverPhone: '0811-2233-4455',
    vehiclePlate: 'B 6789 VWX',
    vehicleModel: 'Toyota Dyna 130 XT Box',
    geofenceId: 'geo-010',
    geofenceName: 'Workshop Cikarang',
    geofenceCategory: 'Workshop',
    date: '2026-10-14',
    timestamp: '2026-10-14T11:25:00+07:00',
    locationAddress: 'Kawasan Industri Jababeka 1, Cikarang Utara',
    coordinates: { lat: -6.2912, lng: 107.1441 },
    distanceMeters: 85,
    isWithinGeofence: true,
    photo: generateGeofenceSelfieSvg(
      'Dedi Kusnandar',
      'Workshop Cikarang',
      'B 6789 VWX',
      '14 Okt 2026 11:25',
      'Workshop Cikarang Jababeka',
      '-6.2912, 107.1441',
      85
    ),
    notes: 'Presensi tiba untuk jadwal servis rutin berkala armada.',
  },
  {
    id: 'GA-2026-009',
    driverId: 'DRV-009',
    driverName: 'Eko Prasetyo',
    driverPhone: '0819-5566-7788',
    vehiclePlate: 'B 4321 YZA',
    vehicleModel: 'Hino Dutro Cargo 110 SD',
    geofenceId: 'geo-009',
    geofenceName: 'Gudang Tambun',
    geofenceCategory: 'Gudang',
    date: '2026-10-14',
    timestamp: '2026-10-14T16:05:00+07:00',
    locationAddress: 'Jl. Diponegoro KM 39, Tambun Selatan, Bekasi',
    coordinates: { lat: -6.2640, lng: 107.0518 },
    distanceMeters: 135,
    isWithinGeofence: false,
    photo: generateGeofenceSelfieSvg(
      'Eko Prasetyo',
      'Gudang Tambun',
      'B 4321 YZA',
      '14 Okt 2026 16:05',
      'Jl. Diponegoro KM 39, Tambun',
      '-6.2640, 107.0518',
      135
    ),
    notes: 'Presensi di area luar batas pagar karena antrean truk di luar gerbang.',
  },
];
