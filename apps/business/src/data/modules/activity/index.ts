/**
 * Activity Module Data Layer Exports
 * Standardized Centralized Mock & Data Management for ADATRACK Business
 */

// Services (Public API for UI Features)
export { taskAttendanceService } from './services/driver/taskAttendanceService';
export { geofenceAttendanceService } from './services/driver/geofenceAttendanceService';
export { arrivalReportService } from './services/driver/arrivalReportService';
export { emergencyReportService } from './services/emergencyReportService';

// Repositories (In-Memory State Stores)
export { taskAttendanceRepository } from './repositories/driver/taskAttendanceRepository';
export { geofenceAttendanceRepository } from './repositories/driver/geofenceAttendanceRepository';
export { arrivalReportRepository } from './repositories/driver/arrivalReportRepository';
export { emergencyReportRepository } from './repositories/emergencyReportRepository';

// Mock Seed Data & Generators
export {
  SEED_TASK_ATTENDANCE,
  generateWatermarkedSelfieSvg,
} from './mock/driver/taskAttendanceMock';

export {
  SEED_GEOFENCE_ATTENDANCE,
  generateGeofenceSelfieSvg,
} from './mock/driver/geofenceAttendanceMock';

export {
  SEED_ARRIVAL_REPORTS,
  generateArrivalSelfieSvg,
} from './mock/driver/arrivalReportsMock';

export { SEED_EMERGENCY_REPORTS } from './mock/emergencyReportsMock';
