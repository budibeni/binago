import { api } from '@adatrack/utils';
import type { GroupData } from '@/features/core/groups/data/mockGroupsData';

export const groupService = {
  async getVehicleGroups(): Promise<GroupData[]> {
    const res: any = await api.get('/groups');
    return (res.data || res)
      .filter((g: any) => g.type === 'vehicle' || !g.type)
      .map((g: any) => ({
      id: g.id.toString(),
      name: g.name,
      description: g.description || '',
      unitCount: 0
    }));
  },

  async getDriverGroups(): Promise<GroupData[]> {
    const res: any = await api.get('/groups');
    return (res.data || res)
      .filter((g: any) => g.type === 'driver')
      .map((g: any) => ({
      id: g.id.toString(),
      name: g.name,
      description: g.description || '',
      unitCount: 0
    }));
  },

  async getGeofenceGroups(): Promise<GroupData[]> {
    const res: any = await api.get('/groups');
    return (res.data || res)
      .filter((g: any) => g.type === 'geofence')
      .map((g: any) => ({
      id: g.id.toString(),
      name: g.name,
      description: g.description || '',
      unitCount: 0
    }));
  },

  async getRouteGroups(): Promise<GroupData[]> {
    const res: any = await api.get('/groups');
    return (res.data || res)
      .filter((g: any) => g.type === 'route')
      .map((g: any) => ({
      id: g.id.toString(),
      name: g.name,
      description: g.description || '',
      unitCount: 0
    }));
  },
};
