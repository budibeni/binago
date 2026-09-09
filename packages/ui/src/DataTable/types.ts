import type { ReactNode } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnVisibilityState,
  ReactTable,
  Row,
  RowData,
  SortingState,
  StockFeatures,
} from '@tanstack/react-table';
import type { DataTableMode, FetchParams, FetchState } from '@adatrack/types';

export type {
  ColumnDef,
  ColumnVisibilityState,
  ReactTable,
  Row,
  RowData,
  SortingState,
  StockFeatures,
};

export type DataTableColumnDef<
  TData extends RowData = RowData,
  TValue = unknown,
> = ColumnDef<StockFeatures, TData, TValue>;

export type DataTableInstance<TData extends RowData = RowData> =
  ReactTable<StockFeatures, TData>;

export type DataTableRowInstance<TData extends RowData = RowData> =
  Row<StockFeatures, TData>;

export type DataTableFilterFieldType = 'pills-single' | 'pills-multi' | 'checkbox-group';

export interface DataTableExportConfig {
  filename?: string;
  enabled?: boolean;
}

export interface DataTableFilterOption {
  value: string;
  label: string;
  count?: number;
  colorClass?: string;
  activeClass?: string;
}

export interface DataTableFilterField {
  id: string; // Used as key in the filter state
  label: string; // e.g., "Status", "Group"
  type: DataTableFilterFieldType;
  options: DataTableFilterOption[];
}

export interface DataTableFilterConfig {
  fields: DataTableFilterField[];
  state: Record<string, string | string[]>; // Record of field.id -> selected value(s)
  onStateChange: (state: Record<string, string | string[]>) => void;
  onClearAll?: () => void;
  labels?: {
    title?: string;
    clearAll?: string;
  };
}

export interface DataTableLabels {
  // Pagination
  paginationShowing?: (from: number, to: number, total: number) => string;
  paginationPerPage?: string;
  paginationNext?: string;
  paginationPrev?: string;
  paginationFilterToggle?: string;
  paginationListToggle?: string;

  // Toolbar
  toolbarRefresh?: string;
  toolbarFilter?: string;
  toolbarColumns?: string;
  toolbarExport?: string;

  // Active Filters
  activeFilterActive?: string;
  activeFilterClear?: string;

  // Column Panel
  columnPanelHideAll?: string;
  columnPanelShowAll?: string;

  // Body / Errors
  errorLoadData?: string;
  errorTryAgain?: string;
  errorTitle?: string;
  noResultTitle?: string;
  noResultDesc?: string;
}

export interface DataTableProps<TData extends RowData = RowData> {
  // Core
  data: TData[];
  columns: DataTableColumnDef<TData>[];

  // Capabilities
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  columnVisibility?: boolean;
  selectable?: boolean;
  exportable?: boolean;

  // Search State
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Pagination State
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];

  // Filter State
  filterConfig?: DataTableFilterConfig;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  activeFilterCount?: number;

  // Sorting State
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  // Column Visibility State
  columnVisibilityState?: ColumnVisibilityState;
  onColumnVisibilityChange?: (visibility: ColumnVisibilityState) => void;

  // Status (UI)
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onRefresh?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ElementType;
  labels?: DataTableLabels;

  // Customization
  className?: string;
  tableClassName?: string;
  toolbarActions?: ReactNode; // Secondary actions (e.g., Export, Add Button)
  exportFilename?: string;
}
