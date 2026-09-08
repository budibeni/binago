import { CardActivityType, CardLog, CardLogStatus, HolderType } from '@/features/core/access/log/types/log';
import { logRepository } from '../repositories/logRepository';
import { BaseQueryParams, PaginatedResponse } from '@/features/common/types/pagination';


export interface LogFilterParams extends BaseQueryParams {
  search?: string;
  activityType?: CardActivityType | 'ALL';
  status?: CardLogStatus | 'ALL';
  holderType?: HolderType | 'ALL';
  startDate?: string;
  endDate?: string;
}

export class LogService {
  async getLogs(params: LogFilterParams): Promise<PaginatedResponse<CardLog>> {
    const allLogs = await logRepository.findAll();

    let filtered = [...allLogs];

    // Filter Search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.cardUid.toLowerCase().includes(searchLower) ||
          log.cardName.toLowerCase().includes(searchLower) ||
          (log.holderName && log.holderName.toLowerCase().includes(searchLower)) ||
          (log.vehiclePlateNumber && log.vehiclePlateNumber.toLowerCase().includes(searchLower))
      );
    }

    // Filter Activity Type
    if (params.activityType && params.activityType !== 'ALL') {
      filtered = filtered.filter((log) => log.activityType === params.activityType);
    }

    // Filter Status
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((log) => log.status === params.status);
    }

    // Filter Holder Type
    if (params.holderType && params.holderType !== 'ALL') {
      if (params.holderType === null) {
        filtered = filtered.filter((log) => log.holderType === null);
      } else {
        filtered = filtered.filter((log) => log.holderType === params.holderType);
      }
    }

    // Filter Date Range
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      });
    }

    // Sorting (default descending by timestamp)
    const sortBy = params.sortBy || 'timestamp';
    const sortDir = params.sortDir || 'desc';

    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof CardLog];
      let valB: any = b[sortBy as keyof CardLog];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const items = filtered.slice(startIndex, endIndex);

    return {
      items,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async getLogById(id: string): Promise<CardLog | null> {
    return logRepository.findById(id);
  }
}

export const logService = new LogService();
