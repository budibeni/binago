import { StatisticSummary, StatisticPeriod } from '../types';

// Simple deterministic PRNG based on string seed to avoid hydration errors
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0 / 4294967296;
  };
}

function createMockSummary(
  vehicleId: string, 
  period: StatisticPeriod, 
  dateStr: string,
  baseDistance: number,
  baseDuration: number,
  baseTrips: number,
  trendLabels: string[]
): StatisticSummary {
  const prng = seededRandom(`${vehicleId}-${period}`);
  const getRand = () => prng() / 4294967296;

  const trendData = trendLabels.map(label => ({
    label,
    value: Math.floor(getRand() * (baseDistance / trendLabels.length) * 1.5)
  }));
  
  const totalDistance = parseFloat(trendData.reduce((acc, curr) => acc + curr.value, 0).toFixed(1));
  const diffLabel = period === 'daily' ? 'dibanding kemarin' : period === 'weekly' ? 'dibanding minggu lalu' : 'dibanding bulan lalu';

  return {
    vehicleId,
    period,
    dateStr,
    totalDistance: {
      value: totalDistance,
      diff: { value: 12, isPositive: true, label: diffLabel, unit: '%' }
    },
    totalDuration: {
      value: baseDuration + Math.floor(getRand() * 60),
      diff: { value: 8, isPositive: true, label: diffLabel, unit: '%' }
    },
    tripCount: {
      value: baseTrips + Math.floor(getRand() * 5),
      diff: { value: 1, isPositive: true, label: diffLabel }
    },
    avgSpeed: {
      value: 30 + Math.floor(getRand() * 20),
      diff: { value: 2, isPositive: false, label: diffLabel, unit: 'km/j' }
    },
    maxSpeed: {
      value: 80 + Math.floor(getRand() * 40),
      diff: { value: 5, isPositive: true, label: diffLabel, unit: 'km/j' }
    },
    trendData,
  };
}

const todayStr = new Date().toISOString();
const weekStartStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const monthStartStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

// Daily trends (hours)
const dailyLabels = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
// Weekly trends (days)
const weeklyLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
// Monthly trends (weeks)
const monthlyLabels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];

export const mockStatisticsData: StatisticSummary[] = [
  // Vehicle v-001
  createMockSummary('v-001', 'daily', todayStr, 120, 180, 4, dailyLabels),
  createMockSummary('v-001', 'weekly', weekStartStr, 800, 1200, 25, weeklyLabels),
  createMockSummary('v-001', 'monthly', monthStartStr, 3200, 4800, 100, monthlyLabels),

  // Vehicle v-002
  createMockSummary('v-002', 'daily', todayStr, 80, 120, 2, dailyLabels),
  createMockSummary('v-002', 'weekly', weekStartStr, 500, 750, 15, weeklyLabels),
  createMockSummary('v-002', 'monthly', monthStartStr, 2100, 3100, 60, monthlyLabels),

  // Vehicle v-003
  createMockSummary('v-003', 'daily', todayStr, 40, 60, 1, dailyLabels),
  createMockSummary('v-003', 'weekly', weekStartStr, 250, 400, 8, weeklyLabels),
  createMockSummary('v-003', 'monthly', monthStartStr, 1100, 1700, 35, monthlyLabels),

  // Vehicle v-004
  createMockSummary('v-004', 'daily', todayStr, 0, 0, 0, dailyLabels),
  createMockSummary('v-004', 'weekly', weekStartStr, 0, 0, 0, weeklyLabels),
  createMockSummary('v-004', 'monthly', monthStartStr, 0, 0, 0, monthlyLabels),
];
