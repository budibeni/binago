/**
 * Activity Module Data Layer Exports
 * Standardized Centralized Mock & Data Management for ADATRACK Business
 */

// Services (Public API for UI Features)
export { taskAttendanceService } from './services/taskAttendanceService';
export { geofenceAttendanceService } from './services/geofenceAttendanceService';
export { arrivalReportService } from './services/arrivalReportService';
export { emergencyReportService } from './services/emergencyReportService';

// Repositories (In-Memory State Stores)
export { taskAttendanceRepository } from './repositories/taskAttendanceRepository';
export { geofenceAttendanceRepository } from './repositories/geofenceAttendanceRepository';
export { arrivalReportRepository } from './repositories/arrivalReportRepository';
export { emergencyReportRepository } from './repositories/emergencyReportRepository';

// Mock Seed Data & Generators
export {
  SEED_TASK_ATTENDANCE,
  generateWatermarkedSelfieSvg,
} from './mock/taskAttendanceMock';

export {
  SEED_GEOFENCE_ATTENDANCE,
  generateGeofenceSelfieSvg,
} from './mock/geofenceAttendanceMock';

export {
  SEED_ARRIVAL_REPORTS,
  generateArrivalSelfieSvg,
} from './mock/arrivalReportsMock';

export { SEED_EMERGENCY_REPORTS } from './mock/emergencyReportsMock';
