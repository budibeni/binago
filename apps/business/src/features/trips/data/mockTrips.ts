import { Trip } from '../types/trips';
import { mockTrips as centralTrips } from '../../../data/mock';

export const mockTrips: Trip[] = centralTrips as unknown as Trip[];
