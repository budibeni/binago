export const mockTrackingState = Array.from({ length: 50 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  const baseLat = -6.1751;
  const baseLng = 106.8271;
  const latOffset = (Math.random() - 0.5) * 0.5;
  const lngOffset = (Math.random() - 0.5) * 0.5;
  const statuses = ['driving', 'idle', 'parking', 'offline'];
  const status = statuses[i % statuses.length] as 'driving' | 'idle' | 'parking' | 'offline';
  
  let geofenceName = undefined;
  let locLat = baseLat + latOffset;
  let locLng = baseLng + lngOffset;
  let locAddress = `Jl. Dummy Location ${i + 1}, Jakarta`;

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

  return {
    vehicleId: `veh-${num}`,
    location: { 
      lat: locLat, 
      lng: locLng, 
      address: locAddress
    },
    speed: status === 'driving' ? Math.floor(Math.random() * 60 + 20) : 0,
    course: Math.floor(Math.random() * 360),
    status: status,
    isLocationShared: i % 2 === 0,
    todaysDistance: Math.floor(Math.random() * 200),
    todaysDuration: Math.floor(Math.random() * 300),
    lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString(),
    geofenceName
  };
});

export function getTrackingByVehicleId(vehicleId: string) {
  return mockTrackingState.find(t => t.vehicleId === vehicleId);
}
