export const mockGeofences = [
  // Jakarta (grp-001)
  {
    id: 'geo-001', groupId: 'grp-001', name: 'Gudang Pusat Jakarta', description: 'Gudang logistik utama', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -6.1751, lng: 106.8271 }, { lat: -6.1751, lng: 106.8281 }, { lat: -6.1761, lng: 106.8281 }, { lat: -6.1761, lng: 106.8271 }] }
  },
  {
    id: 'geo-002', groupId: 'grp-001', name: 'Pelabuhan Tanjung Priok', description: 'Pelabuhan bongkar muat', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -6.1086, lng: 106.8821 }, { lat: -6.1086, lng: 106.8851 }, { lat: -6.1116, lng: 106.8851 }, { lat: -6.1116, lng: 106.8821 }] }
  },
  {
    id: 'geo-003', groupId: 'grp-001', name: 'Pool Cakung', description: 'Pool armada timur', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.1856, lng: 106.9405}, {lat: -6.1856, lng: 106.9405+0.01}, {lat: -6.1856+0.01, lng: 106.9405+0.01}, {lat: -6.1856+0.01, lng: 106.9405}, {lat: -6.1856, lng: 106.9405}] }
  },
  {
    id: 'geo-004', groupId: 'grp-001', name: 'Customer A - Sudirman', description: 'Klien korporat', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.2215, lng: 106.8048}, {lat: -6.2215, lng: 106.8048+0.01}, {lat: -6.2215+0.01, lng: 106.8048+0.01}, {lat: -6.2215+0.01, lng: 106.8048}, {lat: -6.2215, lng: 106.8048}] }
  },
  
  // Tangerang (grp-002)
  {
    id: 'geo-005', groupId: 'grp-002', name: 'Gudang Tangerang', description: 'Distribusi area barat', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -6.1823, lng: 106.6277 }, { lat: -6.1823, lng: 106.6307 }, { lat: -6.1853, lng: 106.6307 }, { lat: -6.1853, lng: 106.6277 }] }
  },
  {
    id: 'geo-006', groupId: 'grp-002', name: 'Bandara Soekarno Hatta', description: 'Kargo udara', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.1256, lng: 106.6558}, {lat: -6.1256, lng: 106.6558+0.01}, {lat: -6.1256+0.01, lng: 106.6558+0.01}, {lat: -6.1256+0.01, lng: 106.6558}, {lat: -6.1256, lng: 106.6558}] }
  },
  {
    id: 'geo-007', groupId: 'grp-002', name: 'Pool BSD', description: 'Pool armada selatan', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.3023, lng: 106.6521}, {lat: -6.3023, lng: 106.6521+0.01}, {lat: -6.3023+0.01, lng: 106.6521+0.01}, {lat: -6.3023+0.01, lng: 106.6521}, {lat: -6.3023, lng: 106.6521}] }
  },
  
  // Bekasi (grp-003)
  {
    id: 'geo-008', groupId: 'grp-003', name: 'Kawasan Industri MM2100', description: 'Pabrik perakitan', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -6.3061, lng: 107.0865 }, { lat: -6.3061, lng: 107.0905 }, { lat: -6.3101, lng: 107.0905 }, { lat: -6.3101, lng: 107.0865 }] }
  },
  {
    id: 'geo-009', groupId: 'grp-003', name: 'Gudang Tambun', description: 'Area transit', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.2625, lng: 107.0505}, {lat: -6.2625, lng: 107.0505+0.01}, {lat: -6.2625+0.01, lng: 107.0505+0.01}, {lat: -6.2625+0.01, lng: 107.0505}, {lat: -6.2625, lng: 107.0505}] }
  },
  {
    id: 'geo-010', groupId: 'grp-003', name: 'Workshop Cikarang', description: 'Bengkel armada utama', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.2905, lng: 107.1436}, {lat: -6.2905, lng: 107.1436+0.01}, {lat: -6.2905+0.01, lng: 107.1436+0.01}, {lat: -6.2905+0.01, lng: 107.1436}, {lat: -6.2905, lng: 107.1436}] }
  },

  // Bandung (grp-004)
  {
    id: 'geo-011', groupId: 'grp-004', name: 'Gudang Pasteur', description: 'Gerbang tol utama', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.8895, lng: 107.5901}, {lat: -6.8895, lng: 107.5901+0.01}, {lat: -6.8895+0.01, lng: 107.5901+0.01}, {lat: -6.8895+0.01, lng: 107.5901}, {lat: -6.8895, lng: 107.5901}] }
  },
  {
    id: 'geo-012', groupId: 'grp-004', name: 'Pool Gedebage', description: 'Pool timur Bandung', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -6.9455, lng: 107.6823 }, { lat: -6.9455, lng: 107.6853 }, { lat: -6.9485, lng: 107.6853 }, { lat: -6.9485, lng: 107.6823 }] }
  },
  {
    id: 'geo-013', groupId: 'grp-004', name: 'Customer B - Dago', description: 'Drop point retail', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.8778, lng: 107.6163}, {lat: -6.8778, lng: 107.6163+0.01}, {lat: -6.8778+0.01, lng: 107.6163+0.01}, {lat: -6.8778+0.01, lng: 107.6163}, {lat: -6.8778, lng: 107.6163}] }
  },

  // Surabaya (grp-005)
  {
    id: 'geo-014', groupId: 'grp-005', name: 'Gudang Rungkut', description: 'Pusat distribusi timur', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -7.3204, lng: 112.7719}, {lat: -7.3204, lng: 112.7719+0.01}, {lat: -7.3204+0.01, lng: 112.7719+0.01}, {lat: -7.3204+0.01, lng: 112.7719}, {lat: -7.3204, lng: 112.7719}] }
  },
  {
    id: 'geo-015', groupId: 'grp-005', name: 'Pelabuhan Tanjung Perak', description: 'Bongkar muat kapal laut', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -7.1953, lng: 112.7335 }, { lat: -7.1953, lng: 112.7385 }, { lat: -7.2003, lng: 112.7385 }, { lat: -7.2003, lng: 112.7335 }] }
  },
  {
    id: 'geo-016', groupId: 'grp-005', name: 'Pool Margomulyo', description: 'Workshop Surabaya', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -7.2443, lng: 112.6713}, {lat: -7.2443, lng: 112.6713+0.01}, {lat: -7.2443+0.01, lng: 112.6713+0.01}, {lat: -7.2443+0.01, lng: 112.6713}, {lat: -7.2443, lng: 112.6713}] }
  },

  // Banten (grp-006)
  {
    id: 'geo-017', groupId: 'grp-006', name: 'Gudang Serang', description: 'Distribusi Banten', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.1165, lng: 106.1558}, {lat: -6.1165, lng: 106.1558+0.01}, {lat: -6.1165+0.01, lng: 106.1558+0.01}, {lat: -6.1165+0.01, lng: 106.1558}, {lat: -6.1165, lng: 106.1558}] }
  },
  {
    id: 'geo-018', groupId: 'grp-006', name: 'Pelabuhan Merak', description: 'Penyeberangan Sumatera', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -5.9282, lng: 105.9983 }, { lat: -5.9282, lng: 106.0023 }, { lat: -5.9322, lng: 106.0023 }, { lat: -5.9322, lng: 105.9983 }] }
  },
  {
    id: 'geo-019', groupId: 'grp-006', name: 'Kawasan Industri Cilegon', description: 'Pabrik baja', status: 'active' as const,
    geometry: { type: 'polygon' as const, coordinates: [{lat: -6.0125, lng: 106.0463}, {lat: -6.0125, lng: 106.0463+0.01}, {lat: -6.0125+0.01, lng: 106.0463+0.01}, {lat: -6.0125+0.01, lng: 106.0463}, {lat: -6.0125, lng: 106.0463}] }
  },
  {
    id: 'geo-020', groupId: 'grp-001', name: 'Area Terlarang Monas', description: 'Zona larangan melintas kargo', status: 'inactive' as const,
    geometry: { type: 'polygon' as const, coordinates: [{ lat: -6.1725, lng: 106.8242 }, { lat: -6.1725, lng: 106.8292 }, { lat: -6.1775, lng: 106.8292 }, { lat: -6.1775, lng: 106.8242 }] }
  }
];

export function getGeofenceById(id: string) {
  return mockGeofences.find(g => g.id === id);
}

