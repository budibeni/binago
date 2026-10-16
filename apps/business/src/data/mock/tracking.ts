export const mockTrackingState = Array.from({ length: 50 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  const baseLat = -6.1751;
  const baseLng = 106.8271;
  const latOffset = (((i * 17) % 100) / 100 - 0.5) * 0.3;
  const lngOffset = (((i * 23) % 100) / 100 - 0.5) * 0.3;
  const statuses = ['driving', 'idle', 'parking', 'offline'];
  const status = statuses[i % statuses.length] as 'driving' | 'idle' | 'parking' | 'offline';
  
  let geofenceName: string | undefined = undefined;
  let locLat = Number((baseLat + latOffset).toFixed(6));
  let locLng = Number((baseLng + lngOffset).toFixed(6));
  let locAddress = `Jl. Raya Logistik No. ${i + 1}, Jakarta`;

  if (num === '016') {
    geofenceName = 'Gudang Pusat Jakarta'; // geo-001
    locLat = -6.1755;
    locLng = 106.8275;
    locAddress = 'Gudang Pusat Jakarta, Gambir';
  } else if (num === '017') {
    geofenceName = 'Gudang Pusat Jakarta'; // geo-001
    locLat = -6.1758;
    locLng = 106.8278;
    locAddress = 'Gudang Pusat Jakarta, Gambir';
  } else if (num === '018') {
    geofenceName = 'Gudang Pasteur'; // geo-011
    locLat = -6.8895;
    locLng = 107.5901;
    locAddress = 'Gudang Pasteur, Sukajadi, Bandung';
  } else if (num === '019') {
    geofenceName = 'Gudang Pasteur'; // geo-011
    locLat = -6.8898;
    locLng = 107.5903;
    locAddress = 'Gudang Pasteur, Sukajadi, Bandung';
  } else if (num === '001') {
    locLat = -6.2300;
    locLng = 106.8500;
    locAddress = 'Tol Dalam Kota KM 5, Jakarta';
  }

  const baseTime = new Date('2026-10-16T18:00:00Z').getTime();
  const lastUpdateTime = new Date(baseTime - ((i * 7) % 60) * 60000).toISOString();

  return {
    vehicleId: `veh-${num}`,
    location: { 
      lat: locLat, 
      lng: locLng, 
      address: locAddress
    },
    speed: status === 'driving' ? 35 + ((i * 13) % 45) : 0,
    course: (i * 47) % 360,
    status: status,
    isLocationShared: i % 2 === 0,
    todaysDistance: 25 + ((i * 29) % 180),
    todaysDuration: 40 + ((i * 37) % 260),
    lastUpdate: lastUpdateTime,
    geofenceName
  };
});

export function getTrackingByVehicleId(vehicleId: string) {
  return mockTrackingState.find(t => t.vehicleId === vehicleId);
}
