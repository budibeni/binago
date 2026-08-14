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

export interface DataTablePaginationConfig {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions?: number[];
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableInfiniteConfig {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
}

export interface DataTableFreezeConfig {
  left?: string[];
  right?: string[];
  start?: string[];
  end?: string[];
}

export interface DataTableExportConfig {
  filename?: string;
  enabled?: boolean;
}

export type DataTableFilterFieldType = 'pills-single' | 'pills-multi' | 'checkbox-group';

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

export interface DataTableBaseProps<TData extends RowData = RowData> {
  data: TData[];
  columns: DataTableColumnDef<TData>[];
  mode?: DataTableMode;
  fetchState?: FetchState;
  errorMessage?: string;
  onRetry?: () => void;
  onFetch?: (params: FetchParams) => void;

  // Features configuration
  paginationConfig?: DataTablePaginationConfig;
  infiniteConfig?: DataTableInfiniteConfig;
  freezeConfig?: DataTableFreezeConfig;
  exportConfig?: DataTableExportConfig;
  filterConfig?: DataTableFilterConfig;

  // Controlled states
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  columnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: (visibility: ColumnVisibilityState) => void;
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;

  // Custom UI slots
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ElementType;
  noResultTitle?: string;
  noResultDescription?: string;
  className?: string;
  tableClassName?: string;
  toolbarSlot?: ReactNode | ((props: {
    table: DataTableInstance<TData>;
    showFilter?: boolean;
    isFilterOpen?: boolean;
    onFilterOpenChange?: (open: boolean) => void;
    activeFilterCount?: number;
  }) => ReactNode);
  paginationSlot?: ReactNode;
}
