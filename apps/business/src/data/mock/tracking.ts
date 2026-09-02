export const mockTrackingState = Array.from({ length: 50 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  const baseLat = -6.1751;
  const baseLng = 106.8271;
  const latOffset = (Math.random() - 0.5) * 0.5;
  const lngOffset = (Math.random() - 0.5) * 0.5;
  const statuses = ['driving', 'idle', 'parking', 'offline'];
  const status = statuses[i % statuses.length] as 'driving' | 'idle' | 'parking' | 'offline';
  
  let geofenceName = undefined;
  if (num === '016' || num === '017') {
    geofenceName = 'Gudang Pusat Jakarta'; // geo-001
  } else if (num === '018' || num === '019') {
    geofenceName = 'Gudang Pasteur'; // geo-011
  }

  return {
    vehicleId: `veh-${num}`,
    location: { 
      lat: baseLat + latOffset, 
      lng: baseLng + lngOffset, 
      address: `Jl. Dummy Location ${i + 1}, Jakarta`
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
