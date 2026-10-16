export interface MockDevice {
  id: string;
  imei: string;
  model: string;
  brand: string;
  type: string;
  firmware: string;
  status: 'online' | 'offline';
  lastCommunication: string;
  signal: number;
  battery: number;
  assignedVehicleId: string;
}

export const mockDevices: MockDevice[] = Array.from({ length: 50 }, (_, i) => {
  const models = [
    { brand: 'GPS Tracker', type: 'Pro 4G' },
    { brand: 'Fleet Tracker', type: 'Standard 4G' },
    { brand: 'Telematics', type: 'Advanced Eco' },
    { brand: 'Fleet Tracker', type: 'Heavy Duty' },
    { brand: 'GPS Tracker', type: 'OBD-II Smart' },
  ];
  const num = (i + 1).toString().padStart(3, '0');
  const modelInfo = models[i % models.length];
  return {
    id: `dev-${num}`,
    imei: `86800100${(1000000 + i * 7919).toString().padStart(7, '0')}`,
    model: `${modelInfo.brand} ${modelInfo.type}`,
    brand: modelInfo.brand,
    type: modelInfo.type,
    firmware: `v2.${(i % 5) + 1}.${i % 9}`,
    status: (i % 8 === 0 ? 'offline' : 'online') as 'online' | 'offline',
    lastCommunication: '2026-10-16T12:00:00Z',
    signal: 70 + ((i * 7) % 29),
    battery: 80 + ((i * 11) % 20),
    assignedVehicleId: `veh-${num}`
  };
});

export function getDeviceById(id: string) {
  return mockDevices.find(d => d.id === id);
}
