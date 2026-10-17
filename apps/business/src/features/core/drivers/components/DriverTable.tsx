'use client';

import React from 'react';
import { Star, Plus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { DataTable, Button } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import type { Driver } from '../types/driver';
import { getDriversTranslation } from '../i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

export interface DriverTableLabels {
  colDriver?: string;
  colGroup?: string;
  colPlacement?: string;
  colPhone?: string;
  colEmail?: string;
  colAddress?: string;
  colKtp?: string;
  colPob?: string;
  colDob?: string;
  colLicenseNo?: string;
  colLicenseExpiry?: string;
  colJoinDate?: string;
  colStatus?: string;
  colVehicle?: string;
  colPerformance?: string;
  colActions?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  noResultTitle?: string;
  noResultDescription?: string;
  searchPlaceholder?: string;
  addDriver?: string;
  exportFilename?: string;
  actionDetail?: string;
  actionEdit?: string;
  actionDelete?: string;
  actionAdd?: string;
  statusActive?: string;
  statusInactive?: string;
  statusOnLeave?: string;
}

export interface DriverTableProps {
  labels?: DriverTableLabels;
  data: Driver[];
  onViewDetail: (driver: Driver) => void;
  onEdit?: (driver: Driver) => void;
  onDelete?: (driver: Driver) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  className?: string;
  dtLabels?: DataTableLabels;
}

function buildColumns(
  labels: DriverTableLabels,
  locale: 'id' | 'en',
  onViewDetail: (d: Driver) => void,
  _onEdit?: (d: Driver) => void,
  _onDelete?: (d: Driver) => void,
): DataTableColumnDef<Driver>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: labels.colDriver || 'Pengemudi',
      enableSorting: true,
      size: 180,
      meta: { pin: 'left' },
      cell: ({ row }) => (
        <button
          type="button"
          id={row.index === 0 ? 'drivers-first-item-btn' : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(row.original);
          }}
          className="whitespace-nowrap uppercase tracking-wider text-inherit font-inherit hover:text-primary transition-colors hover:underline text-left focus:outline-none"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus || 'Status',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => {
        const s = row.original.status;
        let label = labels.statusInactive || (locale === 'en' ? 'Inactive' : 'Nonaktif');
        let dotClass = 'bg-neutral-400 dark:bg-neutral-600';

        if (s === 'active') {
          label = labels.statusActive || (locale === 'en' ? 'Active' : 'Aktif');
          dotClass = 'bg-success';
        } else if (s === 'on_leave') {
          label = labels.statusOnLeave || (locale === 'en' ? 'On Leave' : 'Cuti');
          dotClass = 'bg-warning';
        } else if (s === 'inactive') {
          label = labels.statusInactive || (locale === 'en' ? 'Inactive' : 'Nonaktif');
          dotClass = 'bg-neutral-400 dark:bg-neutral-600';
        }

        return (
          <div className="flex items-center gap-1.5 text-inherit whitespace-nowrap">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotClass)} />
            <span className="truncate">{label}</span>
          </div>
        );
      },
    },
    {
      id: 'assignedVehiclePlate',
      accessorKey: 'assignedVehiclePlate',
      header: labels.colVehicle || 'Kendaraan',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span
          className={cn(
            'font-mono uppercase tracking-wider truncate',
            !row.original.assignedVehiclePlate && 'text-foreground-muted/50 italic',
          )}
        >
          {row.original.assignedVehiclePlate || '-'}
        </span>
      ),
    },
    {
      id: 'performanceScore',
      accessorFn: (row) => row.performanceScore || 0,
      header: labels.colPerformance || 'Performa',
      enableSorting: true,
      size: 130,
      meta: { align: 'center' },
      cell: ({ row }) => {
        const score = row.original.performanceScore || 0;
        const rating = score >= 100 ? 5 : Math.floor(score / 20);

        return (
          <div className="flex items-center justify-center gap-0.5" title={`${score} / 100`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-3.5 h-3.5',
                  star <= rating
                    ? 'fill-warning text-warning'
                    : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800',
                )}
              />
            ))}
          </div>
        );
      },
    },
    {
      id: 'groupName',
      accessorKey: 'groupName',
      header: labels.colGroup || 'Grup',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span
          className="block max-w-[130px] truncate"
          title={row.original.groupName}
        >
          {row.original.groupName || '-'}
        </span>
      ),
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: labels.colPhone || 'No. Telepon',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted whitespace-nowrap">
          {row.original.phone || '-'}
        </span>
      ),
    },
    {
      id: 'placement',
      accessorKey: 'placement',
      header: labels.colPlacement || 'Penempatan',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span
          className="block max-w-[130px] truncate text-foreground-muted"
          title={row.original.placement}
        >
          {row.original.placement || '-'}
        </span>
      ),
    },
    {
      id: 'licenseNumber',
      accessorKey: 'licenseNumber',
      header: labels.colLicenseNo || 'No. SIM',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">
          {row.original.licenseNumber || '-'}
        </span>
      ),
    },
    {
      id: 'licenseExpiry',
      accessorKey: 'licenseExpiry',
      header: labels.colLicenseExpiry || 'Masa Berlaku SIM',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        if (!row.original.licenseExpiry) return <span className="text-foreground-muted">-</span>;
        const expiry = new Date(row.original.licenseExpiry);
        const isExpired = expiry.getTime() < Date.now();
        const isExpiring = expiry.getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000;

        return (
          <span
            className={cn(
              'tabular-nums whitespace-nowrap',
              isExpired
                ? 'text-danger font-semibold'
                : isExpiring
                  ? 'text-warning font-semibold'
                  : 'text-foreground-muted',
            )}
          >
            {expiry.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: labels.colEmail || 'Email',
      enableSorting: true,
      size: 170,
      cell: ({ row }) => (
        <span
          className="block max-w-[150px] truncate text-foreground-muted"
          title={row.original.email}
        >
          {row.original.email || '-'}
        </span>
      ),
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: labels.colAddress || 'Alamat',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <span
          className="block max-w-[180px] truncate text-foreground-muted"
          title={row.original.address}
        >
          {row.original.address || '-'}
        </span>
      ),
    },
    {
      id: 'ktpNumber',
      accessorKey: 'ktpNumber',
      header: labels.colKtp || 'No. KTP',
      enableSorting: true,
      size: 160,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">
          {row.original.ktpNumber || '-'}
        </span>
      ),
    },
    {
      id: 'placeOfBirth',
      accessorKey: 'placeOfBirth',
      header: labels.colPob || 'Tempat Lahir',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => (
        <span className="text-foreground-muted truncate">
          {row.original.placeOfBirth || '-'}
        </span>
      ),
    },
    {
      id: 'dateOfBirth',
      accessorKey: 'dateOfBirth',
      header: labels.colDob || 'Tanggal Lahir',
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted whitespace-nowrap">
          {row.original.dateOfBirth
            ? new Date(row.original.dateOfBirth).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID')
            : '-'}
        </span>
      ),
    },
    {
      id: 'joinDate',
      accessorKey: 'joinDate',
      header: labels.colJoinDate || 'Tanggal Bergabung',
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted whitespace-nowrap">
          {row.original.joinDate
            ? new Date(row.original.joinDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID')
            : '-'}
        </span>
      ),
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  email: false,
  address: false,
  ktpNumber: false,
  placeOfBirth: false,
  dateOfBirth: false,
  joinDate: false,
};

export function DriverTable({
  labels: propLabels,
  data,
  onViewDetail,
  onEdit,
  onDelete,
  onAdd,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  className,
  dtLabels,
}: DriverTableProps) {
  const locale = useBusinessLocale();
  const labels = React.useMemo(() => {
    const tD = getDriversTranslation(locale);
    return {
      colDriver: tD.table.colDriver,
      colGroup: tD.filterGroup,
      colPlacement: tD.labels.placement,
      colPhone: tD.labels.phone,
      colEmail: tD.labels.email,
      colAddress: tD.labels.address,
      colKtp: tD.labels.ktp,
      colPob: tD.labels.pob,
      colDob: tD.labels.dob,
      colLicenseNo: tD.labels.licenseNo,
      colLicenseExpiry: tD.labels.licenseExpiry,
      colJoinDate: tD.labels.joinDate,
      colStatus: tD.table.colStatus,
      colVehicle: tD.table.colVehicle,
      colPerformance: tD.table.colPerformance,
      emptyTitle: tD.table.emptyTitle,
      emptyDescription: tD.table.emptyDescription,
      noResultTitle: tD.table.noResultTitle,
      noResultDescription: tD.table.noResultDescription,
      searchPlaceholder: tD.searchPlaceholder,
      addDriver: tD.addDriver,
      exportFilename: tD.exportFilename,
      actionAdd: locale === 'en' ? 'Add' : 'Tambah',
      statusActive: tD.status.active,
      statusInactive: tD.status.inactive,
      statusOnLeave: tD.status.onLeave,
      ...propLabels,
    };
  }, [propLabels, locale]);

  const columns = React.useMemo(
    () => buildColumns(labels, locale, onViewDetail, onEdit, onDelete),
    [labels, locale, onViewDetail, onEdit, onDelete],
  );

  return (
    <div id="drivers-table-container" className="h-full w-full">
      <DataTable<Driver>
        className={className}
        data={data}
        columns={columns}
        onRowActionClick={onViewDetail}
        // Capabilities
        searchable
        sortable
        pagination
        columnVisibility
        exportable
        // Initial state
        columnVisibilityState={DEFAULT_COLUMN_VISIBILITY}
        // Search
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={labels.searchPlaceholder}
        // Filter
        filterConfig={filterConfig}
        isFilterOpen={isFilterOpen}
        onFilterOpenChange={onFilterOpenChange}
        // Export
        exportFilename={labels.exportFilename}
        // UI Customizations
        emptyTitle={labels.emptyTitle}
        emptyDescription={labels.emptyDescription}
        toolbarActions={
          onAdd ? (
            <Button
              id="drivers-btn-add"
              variant="destructive"
              onClick={onAdd}
              className="h-8 gap-1.5 text-[12px] font-medium shadow-none"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.actionAdd || labels.addDriver || 'Tambah'}</span>
            </Button>
          ) : undefined
        }
        labels={dtLabels}
      />
    </div>
  );
}
