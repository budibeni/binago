export const mockDevices = Array.from({ length: 20 }, (_, i) => {
  const models = ['Teltonika FMC130', 'Teltonika FMB920', 'Teltonika FMB125', 'GT06N', 'TK905'];
  const num = (i + 1).toString().padStart(3, '0');
  return {
    id: `dev-${num}`,
    imei: `868${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
    model: models[i % models.length],
    firmware: `v${(Math.random() * 2 + 1).toFixed(1)}.${Math.floor(Math.random() * 10)}`,
    status: 'online' as const,
    lastCommunication: new Date().toISOString(),
    signal: Math.floor(Math.random() * 40 + 60), // 60-100
    battery: Math.floor(Math.random() * 30 + 70), // 70-100
    assignedVehicleId: `veh-${num}`
  };
});

export function getDeviceById(id: string) {
  return mockDevices.find(d => d.id === id);
}
