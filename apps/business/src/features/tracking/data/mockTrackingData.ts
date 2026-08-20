import type { TrackingVehicle, TrackingVehicleGroup, Trip, PlaybackData, PlaybackPoint } from '../types/tracking';


const hinoDutroVehicles: TrackingVehicle[] = [
  {
    id: 'veh-001',
    plateNumber: 'B 9027 PU',
    driverName: 'Alwi',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 45,
    location: { lat: -6.2088, lng: 106.8456, address: 'Jl. Sudirman No. 12, Jakarta Pusat' },
    lastUpdate: '2026-08-11T08:00:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: 'Geofence Gudang Utama',
    geofenceArea: 'Area A - Zona Bongkar Muat',
    gpsSerialNumber: '352625691111001',
    alarmEvent: '-',
  },
  {
    id: 'veh-002',
    plateNumber: 'B 9329 PYX',
    driverName: 'Yudi',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 38,
    location: { lat: -6.1754, lng: 106.8272, address: 'Jl. Gajah Mada No. 5, Jakarta Barat' },
    lastUpdate: '2026-08-11T08:01:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111002',
    alarmEvent: '-',
  },
  {
    id: 'veh-003',
    plateNumber: 'B 9330 PYX',
    driverName: 'Agus Mulyadi',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 52,
    location: { lat: -6.2297, lng: 106.8295, address: 'Jl. Fatmawati No. 30, Jakarta Selatan' },
    lastUpdate: '2026-08-11T08:02:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111003',
    alarmEvent: 'Overspeed 52 km/h',
  },
  {
    id: 'veh-004',
    plateNumber: 'B 9331 PYX',
    driverName: 'Romi',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'parking',
    speed: 0,
    location: { lat: -6.2146, lng: 106.8451, address: 'Jl. Rasuna Said No. 8, Jakarta Selatan' },
    lastUpdate: '2026-08-11T07:45:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: false,
    geofenceName: 'Geofence Kantor Pusat',
    geofenceArea: 'Area Parkir B',
    gpsSerialNumber: '352625691111004',
    alarmEvent: '-',
  },
  {
    id: 'veh-005',
    plateNumber: 'B 9332 PYX',
    driverName: 'Subai',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 41,
    location: { lat: -6.2641, lng: 106.8013, address: 'Jl. Ciledug Raya No. 17, Jakarta Selatan' },
    lastUpdate: '2026-08-11T08:03:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111005',
    alarmEvent: '-',
  },
  {
    id: 'veh-006',
    plateNumber: 'B 9334 PYX',
    driverName: 'Ozi Bin Yahya',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 47,
    location: { lat: -6.1944, lng: 106.8229, address: 'Jl. Daan Mogot No. 55, Jakarta Barat' },
    lastUpdate: '2026-08-11T08:04:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111006',
    alarmEvent: '-',
  },
  {
    id: 'veh-007',
    plateNumber: 'B 9335 PYX',
    driverName: 'Asep',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 36,
    location: { lat: -6.2482, lng: 106.8562, address: 'Jl. Pancoran No. 3, Jakarta Selatan' },
    lastUpdate: '2026-08-11T08:05:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111007',
    alarmEvent: '-',
  },
  {
    id: 'veh-008',
    plateNumber: 'B 9336 PYX',
    driverName: null,
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'idle',
    speed: 0,
    location: { lat: -6.1883, lng: 106.8640, address: 'Jl. Matraman No. 22, Jakarta Timur' },
    lastUpdate: '2026-08-11T07:50:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111008',
    alarmEvent: '-',
  },
  {
    id: 'veh-009',
    plateNumber: 'B 9337 PYX',
    driverName: 'Bambang',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'idle',
    speed: 0,
    location: { lat: -6.2213, lng: 106.8543, address: 'Jl. Kuningan No. 10, Jakarta Selatan' },
    lastUpdate: '2026-08-11T07:55:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111009',
    alarmEvent: '-',
  },
  {
    id: 'veh-010',
    plateNumber: 'B 9338 PYX',
    driverName: 'Dede',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'offline',
    speed: 0,
    location: { lat: -6.2000, lng: 106.8200, address: 'Gudang Pusat, Jakarta Barat' },
    lastUpdate: '2026-08-10T20:00:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: false,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111010',
    alarmEvent: '-',
  },
  {
    id: 'veh-011',
    plateNumber: 'B 9339 PYX',
    driverName: 'Fitriani',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 29,
    location: { lat: -6.3010, lng: 106.8421, address: 'Jl. TB Simatupang No. 9, Jakarta Selatan' },
    lastUpdate: '2026-08-11T08:06:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111011',
    alarmEvent: '-',
  },
  {
    id: 'veh-012',
    plateNumber: 'B 9340 PYX',
    driverName: 'Hendro',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 55,
    location: { lat: -6.1600, lng: 106.8700, address: 'Jl. Bekasi Raya No. 45, Jakarta Timur' },
    lastUpdate: '2026-08-11T08:07:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111012',
    alarmEvent: '-',
  },
  {
    id: 'veh-013',
    plateNumber: 'B 9341 PYX',
    driverName: 'Irwan',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'parking',
    speed: 0,
    location: { lat: -6.2350, lng: 106.7950, address: 'Jl. Kebon Jeruk No. 11, Jakarta Barat' },
    lastUpdate: '2026-08-11T07:30:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: false,
    geofenceName: 'Geofence Pool Kendaraan',
    geofenceArea: 'Zona Pool Utama',
    gpsSerialNumber: '352625691111013',
    alarmEvent: '-',
  },
  {
    id: 'veh-014',
    plateNumber: 'B 9342 PYX',
    driverName: 'Joko',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'driving',
    speed: 63,
    location: { lat: -6.1450, lng: 106.8100, address: 'Tol Cawang Arah Selatan' },
    lastUpdate: '2026-08-11T08:08:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111014',
    alarmEvent: 'Overspeed 63 km/h',
  },
  {
    id: 'veh-015',
    plateNumber: 'B 9343 PYX',
    driverName: 'Kodir',
    groupId: 'grp-001',
    groupName: 'Hino Dutro',
    status: 'idle',
    speed: 0,
    location: { lat: -6.2700, lng: 106.8550, address: 'Rest Area KM 15, Jakarta Selatan' },
    lastUpdate: '2026-08-11T07:58:00Z',
    vehicleType: 'Hino Dutro 130 HD',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691111015',
    alarmEvent: '-',
  },
];


// ─── Dummy Vehicles — Group: Toyota Hiace ─────────────────────────────────────

const toyotaHiaceVehicles: TrackingVehicle[] = [
  {
    id: 'veh-101',
    plateNumber: 'B 1201 KJA',
    driverName: 'Lukman',
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'driving',
    speed: 60,
    location: { lat: -6.1750, lng: 106.7900, address: 'Jl. Duri Kosambi No. 7, Jakarta Barat' },
    lastUpdate: '2026-08-11T08:09:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691222001',
    alarmEvent: '-',
  },
  {
    id: 'veh-102',
    plateNumber: 'B 1202 KJA',
    driverName: 'Marwan',
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'idle',
    speed: 0,
    location: { lat: -6.2050, lng: 106.7820, address: 'Jl. Puri Indah No. 15, Jakarta Barat' },
    lastUpdate: '2026-08-11T08:00:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691222002',
    alarmEvent: '-',
  },
  {
    id: 'veh-103',
    plateNumber: 'B 1203 KJA',
    driverName: 'Nanda',
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'driving',
    speed: 48,
    location: { lat: -6.1900, lng: 106.8100, address: 'Jl. S Parman No. 20, Jakarta Barat' },
    lastUpdate: '2026-08-11T08:10:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691222003',
    alarmEvent: '-',
  },
  {
    id: 'veh-104',
    plateNumber: 'B 1204 KJA',
    driverName: 'Oscar',
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'parking',
    speed: 0,
    location: { lat: -6.2120, lng: 106.8050, address: 'Kantor Pusat Tanah Abang, Jakarta Pusat' },
    lastUpdate: '2026-08-11T07:40:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: false,
    geofenceName: 'Geofence Kantor Pusat',
    geofenceArea: 'Area Parkir VIP',
    gpsSerialNumber: '352625691222004',
    alarmEvent: '-',
  },
  {
    id: 'veh-105',
    plateNumber: 'B 1205 KJA',
    driverName: null,
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'offline',
    speed: 0,
    location: { lat: -6.2000, lng: 106.7900, address: 'Pool Kendaraan Slipi, Jakarta Barat' },
    lastUpdate: '2026-08-10T18:00:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: false,
    geofenceName: 'Geofence Pool Kendaraan',
    geofenceArea: 'Zona Slipi',
    gpsSerialNumber: '352625691222005',
    alarmEvent: '-',
  },
  {
    id: 'veh-106',
    plateNumber: 'B 1206 KJA',
    driverName: 'Prasetyo',
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'driving',
    speed: 72,
    location: { lat: -6.1500, lng: 106.7750, address: 'Tol Kebun Jeruk Arah Timur' },
    lastUpdate: '2026-08-11T08:11:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691222006',
    alarmEvent: 'Overspeed 72 km/h',
  },
  {
    id: 'veh-107',
    plateNumber: 'B 1207 KJA',
    driverName: 'Qodir',
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'driving',
    speed: 33,
    location: { lat: -6.2250, lng: 106.8180, address: 'Jl. Bangka Raya No. 6, Jakarta Selatan' },
    lastUpdate: '2026-08-11T08:12:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691222007',
    alarmEvent: '-',
  },
  {
    id: 'veh-108',
    plateNumber: 'B 1208 KJA',
    driverName: 'Rizky',
    groupId: 'grp-002',
    groupName: 'Toyota Hiace',
    status: 'idle',
    speed: 0,
    location: { lat: -6.2320, lng: 106.8370, address: 'Jl. Mampang Prapatan No. 18, Jakarta Selatan' },
    lastUpdate: '2026-08-11T07:52:00Z',
    vehicleType: 'Toyota Hiace Premio',
    city: 'Jakarta',
    acc: true,
    geofenceName: '-',
    geofenceArea: '-',
    gpsSerialNumber: '352625691222008',
    alarmEvent: '-',
  },
];

// ─── Groups ────────────────────────────────────────────────────────────────────


export const mockVehicleGroups: TrackingVehicleGroup[] = [
  {
    id: 'grp-001',
    name: 'Hino Dutro',
    vehicles: hinoDutroVehicles,
  },
  {
    id: 'grp-002',
    name: 'Toyota Hiace',
    vehicles: toyotaHiaceVehicles,
  },
];

// ─── Flat vehicle list (all vehicles) ─────────────────────────────────────────

export const mockVehicles: TrackingVehicle[] = [
  ...hinoDutroVehicles,
  ...toyotaHiaceVehicles,
];

// ─── Date helpers ─────────────────────────────────────────────────────────────

const _today = new Date();
const _getLocalDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const _dateToday = _getLocalDate(_today);
const _dateYesterday = _getLocalDate(new Date(_today.getTime() - 24 * 60 * 60 * 1000));
const _date2DaysAgo = _getLocalDate(new Date(_today.getTime() - 2 * 24 * 60 * 60 * 1000));

// ─── Mock Trips by Vehicle ID ──────────────────────────────────────────────────

export const mockTripsByVehicleId: Record<string, Trip[]> = {
  // ─ veh-001 (B 9027 PU — Alwi — Hino Dutro)
  'veh-001': [
    {
      id: 'trip-001-1',
      vehicleId: 'veh-001',
      date: _dateToday,
      startTime: new Date(_today.getTime() - 1000 * 60 * 60 * 5).toISOString(),
      endTime: new Date(_today.getTime() - 1000 * 60 * 60 * 4.1).toISOString(),
      distance: 32.4,
      duration: 54,
      avgSpeed: 36,
      maxSpeed: 68,
      startAddress: 'Gudang Pusat, Jakarta Barat',
      endAddress: 'Geofence Pelabuhan, Tanjung Priok',
    },
    {
      id: 'trip-001-2',
      vehicleId: 'veh-001',
      date: _dateToday,
      startTime: new Date(_today.getTime() - 1000 * 60 * 60 * 2.5).toISOString(),
      endTime: new Date(_today.getTime() - 1000 * 60 * 60 * 1.8).toISOString(),
      distance: 18.7,
      duration: 42,
      avgSpeed: 27,
      maxSpeed: 55,
      startAddress: 'Geofence Pelabuhan, Tanjung Priok',
      endAddress: 'Jl. Sudirman No. 12, Jakarta Pusat',
    },
    {
      id: 'trip-001-3',
      vehicleId: 'veh-001',
      date: _dateYesterday,
      startTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 7).toISOString(),
      endTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 6).toISOString(),
      distance: 28.1,
      duration: 60,
      avgSpeed: 28,
      maxSpeed: 60,
      startAddress: 'Gudang Pusat, Jakarta Barat',
      endAddress: 'Geofence Gudang Utama, Cawang',
    },
    {
      id: 'trip-001-4',
      vehicleId: 'veh-001',
      date: _date2DaysAgo,
      startTime: new Date(_today.getTime() - 2 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 9).toISOString(),
      endTime: new Date(_today.getTime() - 2 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 7.5).toISOString(),
      distance: 44.2,
      duration: 90,
      avgSpeed: 29,
      maxSpeed: 72,
      startAddress: 'Gudang Pusat, Jakarta Barat',
      endAddress: 'Komp. Pergudangan Marunda, Kav. 12',
    },
  ],

  // ─ veh-002 (B 9329 PYX — Yudi — Hino Dutro)
  'veh-002': [
    {
      id: 'trip-002-1',
      vehicleId: 'veh-002',
      date: _dateToday,
      startTime: new Date(_today.getTime() - 1000 * 60 * 60 * 6).toISOString(),
      endTime: new Date(_today.getTime() - 1000 * 60 * 60 * 5).toISOString(),
      distance: 21.5,
      duration: 60,
      avgSpeed: 22,
      maxSpeed: 50,
      startAddress: 'Gudang Pusat, Jakarta Barat',
      endAddress: 'Jl. Gajah Mada No. 5, Jakarta Barat',
    },
    {
      id: 'trip-002-2',
      vehicleId: 'veh-002',
      date: _dateYesterday,
      startTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 8).toISOString(),
      endTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 6.8).toISOString(),
      distance: 35.0,
      duration: 72,
      avgSpeed: 29,
      maxSpeed: 65,
      startAddress: 'Jl. Gajah Mada No. 5, Jakarta Barat',
      endAddress: 'Geofence Pelabuhan, Tanjung Priok',
    },
  ],

  // ─ veh-003 (B 9330 PYX — Agus) — sedang driving, belum ada trip hari ini selesai
  'veh-003': [
    {
      id: 'trip-003-1',
      vehicleId: 'veh-003',
      date: _dateYesterday,
      startTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 10).toISOString(),
      endTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 9).toISOString(),
      distance: 19.8,
      duration: 60,
      avgSpeed: 20,
      maxSpeed: 45,
      startAddress: 'Gudang Pusat, Jakarta Barat',
      endAddress: 'Jl. Fatmawati No. 30, Jakarta Selatan',
    },
  ],

  // ─ veh-101 (B 1201 KJA — Lukman — Toyota Hiace)
  'veh-101': [
    {
      id: 'trip-101-1',
      vehicleId: 'veh-101',
      date: _dateToday,
      startTime: new Date(_today.getTime() - 1000 * 60 * 60 * 4).toISOString(),
      endTime: new Date(_today.getTime() - 1000 * 60 * 60 * 3.2).toISOString(),
      distance: 24.6,
      duration: 48,
      avgSpeed: 31,
      maxSpeed: 70,
      startAddress: 'Pool Kendaraan Slipi, Jakarta Barat',
      endAddress: 'Jl. Duri Kosambi No. 7, Jakarta Barat',
    },
    {
      id: 'trip-101-2',
      vehicleId: 'veh-101',
      date: _dateYesterday,
      startTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 6).toISOString(),
      endTime: new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 5.2).toISOString(),
      distance: 15.3,
      duration: 48,
      avgSpeed: 19,
      maxSpeed: 55,
      startAddress: 'Pool Kendaraan Slipi, Jakarta Barat',
      endAddress: 'Kantor Pusat Tanah Abang, Jakarta Pusat',
    },
  ],

  // ─ veh-102, 103, 104, 105 — kosong (vehicle terbatas trip-nya)
  'veh-102': [],
  'veh-103': [],
  'veh-104': [],
  'veh-105': [],
  'veh-106': [
    {
      id: 'trip-106-1',
      vehicleId: 'veh-106',
      date: _dateToday,
      startTime: new Date(_today.getTime() - 1000 * 60 * 60 * 3).toISOString(),
      endTime: new Date(_today.getTime() - 1000 * 60 * 60 * 2.2).toISOString(),
      distance: 38.4,
      duration: 48,
      avgSpeed: 48,
      maxSpeed: 90,
      startAddress: 'Pool Kendaraan Slipi, Jakarta Barat',
      endAddress: 'Tol Kebun Jeruk Arah Timur',
    },
  ],
};

// ─── Helper: generate dummy playback points ────────────────────────────────────

function generateDummyPoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  pointsCount: number,
  baseTime: Date,
  durationMinutes: number,
): PlaybackPoint[] {
  const points: PlaybackPoint[] = [];
  const timeStep = (durationMinutes * 60 * 1000) / pointsCount;

  for (let i = 0; i <= pointsCount; i++) {
    const fraction = i / pointsCount;
    // Tambahkan noise ringan agar terlihat seperti jalur jalan, bukan garis lurus
    const noiseLat = Math.sin(fraction * Math.PI) * 0.006;
    const noiseLng = Math.cos(fraction * Math.PI * 1.3) * 0.004;

    const lat = startLat + (endLat - startLat) * fraction + noiseLat;
    const lng = startLng + (endLng - startLng) * fraction + noiseLng;

    // Hitung heading dari titik sebelumnya
    let heading = 0;
    if (i > 0) {
      const prev = points[i - 1];
      const dLng = lng - prev.lng;
      const dLat = lat - prev.lat;
      heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;
    }

    points.push({
      lat,
      lng,
      timestamp: new Date(baseTime.getTime() + timeStep * i).toISOString(),
      speed: Math.floor(25 + Math.random() * 45), // 25–70 km/h
      heading: Math.round(heading),
    });
  }

  return points;
}

// ─── Mock Playback Data ────────────────────────────────────────────────────────

export const mockPlaybackData: PlaybackData[] = [
  // veh-001 trips
  {
    tripId: 'trip-001-1',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Gudang Pusat, Jakarta Barat
      -6.1100, 106.8700,   // Tanjung Priok
      25,
      new Date(_today.getTime() - 1000 * 60 * 60 * 5),
      54,
    ),
  },
  {
    tripId: 'trip-001-2',
    points: generateDummyPoints(
      -6.1100, 106.8700,   // Tanjung Priok
      -6.2088, 106.8456,   // Jl. Sudirman
      18,
      new Date(_today.getTime() - 1000 * 60 * 60 * 2.5),
      42,
    ),
  },
  {
    tripId: 'trip-001-3',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Gudang Pusat
      -6.2300, 106.8550,   // Cawang
      22,
      new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 7),
      60,
    ),
  },
  {
    tripId: 'trip-001-4',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Gudang Pusat
      -6.1050, 106.9200,   // Marunda
      30,
      new Date(_today.getTime() - 2 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 9),
      90,
    ),
  },

  // veh-002 trips
  {
    tripId: 'trip-002-1',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Gudang Pusat
      -6.1754, 106.8272,   // Jl. Gajah Mada
      20,
      new Date(_today.getTime() - 1000 * 60 * 60 * 6),
      60,
    ),
  },
  {
    tripId: 'trip-002-2',
    points: generateDummyPoints(
      -6.1754, 106.8272,   // Jl. Gajah Mada
      -6.1100, 106.8700,   // Tanjung Priok
      25,
      new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 8),
      72,
    ),
  },

  // veh-003 trips
  {
    tripId: 'trip-003-1',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Gudang Pusat
      -6.2297, 106.8295,   // Jl. Fatmawati
      20,
      new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 10),
      60,
    ),
  },

  // veh-101 trips
  {
    tripId: 'trip-101-1',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Pool Slipi
      -6.1750, 106.7900,   // Duri Kosambi
      20,
      new Date(_today.getTime() - 1000 * 60 * 60 * 4),
      48,
    ),
  },
  {
    tripId: 'trip-101-2',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Pool Slipi
      -6.2120, 106.8050,   // Tanah Abang
      18,
      new Date(_today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 6),
      48,
    ),
  },

  // veh-106 trips
  {
    tripId: 'trip-106-1',
    points: generateDummyPoints(
      -6.2000, 106.7900,   // Pool Slipi
      -6.1500, 106.7750,   // Tol Kebun Jeruk
      22,
      new Date(_today.getTime() - 1000 * 60 * 60 * 3),
      48,
    ),
  },
];
