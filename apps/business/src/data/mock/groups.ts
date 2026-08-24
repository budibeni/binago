export const mockGroups = [
  { id: 'grp-001', name: 'Jakarta Logistics', description: 'Area operasional Jakarta Raya', memberCount: 8, type: 'vehicle' as const },
  { id: 'grp-002', name: 'Tangerang Logistics', description: 'Area operasional Tangerang', memberCount: 5, type: 'vehicle' as const },
  { id: 'grp-003', name: 'Bekasi Logistics', description: 'Area operasional Bekasi', memberCount: 4, type: 'vehicle' as const },
  { id: 'grp-004', name: 'Bandung Logistics', description: 'Area operasional Bandung', memberCount: 6, type: 'vehicle' as const },
  { id: 'grp-005', name: 'Surabaya Logistics', description: 'Area operasional Surabaya', memberCount: 7, type: 'vehicle' as const },
  { id: 'grp-006', name: 'Banten Logistics', description: 'Area operasional Banten', memberCount: 4, type: 'vehicle' as const },
];

export function getGroupById(id: string) {
  return mockGroups.find(g => g.id === id);
}
