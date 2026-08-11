import React from 'react';
import {
  stockFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import type { DataTableBaseProps } from './types';

export function useDataTable<TData extends RowData = RowData>(
  props: DataTableBaseProps<TData>,
) {
  const {
    data,
    columns,
    paginationConfig,
    freezeConfig,
    sorting: controlledSorting,
    onSortingChange: setControlledSorting,
    columnFilters: controlledFilters,
    onColumnFiltersChange: setControlledFilters,
    globalFilter: controlledGlobalFilter,
    onGlobalFilterChange: setControlledGlobalFilter,
    columnVisibility: controlledVisibility,
    onColumnVisibilityChange: setControlledVisibility,
    columnPinning: controlledPinning,
    onColumnPinningChange: setControlledPinning,
    onFetch,
  } = props;

  // Uncontrolled fallback states
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalFilters, setInternalFilters] = React.useState<ColumnFiltersState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState('');
  const [internalVisibility, setInternalVisibility] = React.useState<ColumnVisibilityState>({});
  const [internalPinning, setInternalPinning] = React.useState<ColumnPinningState>({
    start: freezeConfig?.start || freezeConfig?.left || [],
    end: freezeConfig?.end || freezeConfig?.right || [],
  });

  const sorting = controlledSorting ?? internalSorting;
  const columnFilters = controlledFilters ?? internalFilters;
  const globalFilter = controlledGlobalFilter ?? internalGlobalFilter;
  const columnVisibility = controlledVisibility ?? internalVisibility;
  const columnPinning = controlledPinning ?? internalPinning;

  const pageIndex = paginationConfig?.pageIndex ?? 0;
  const pageSize = paginationConfig?.pageSize ?? 10;

  // Trigger onFetch for server-side ready mode
  React.useEffect(() => {
    if (onFetch) {
      onFetch({
        pageIndex,
        pageSize,
        sorting: sorting.map((s) => ({ id: s.id, desc: s.desc })),
        globalFilter,
        columnFilters: columnFilters.map((f) => ({ id: f.id, value: f.value })),
      });
    }
  }, [pageIndex, pageSize, sorting, globalFilter, columnFilters, onFetch]);

  const table = useTable({
    features: stockFeatures,
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      if (setControlledSorting) setControlledSorting(next);
      else setInternalSorting(next);
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnFilters) : updater;
      if (setControlledFilters) setControlledFilters(next);
      else setInternalFilters(next);
    },
    onGlobalFilterChange: (updater) => {
      const next = typeof updater === 'function' ? updater(globalFilter) : updater;
      if (setControlledGlobalFilter) setControlledGlobalFilter(next);
      else setInternalGlobalFilter(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnVisibility) : updater;
      if (setControlledVisibility) setControlledVisibility(next);
      else setInternalVisibility(next);
    },
    onColumnPinningChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnPinning) : updater;
      if (setControlledPinning) setControlledPinning(next);
      else setInternalPinning(next);
    },
    // v9: Row model factories (createSortedRowModel, createFilteredRowModel, createPaginatedRowModel)
    // are registered via stockFeatures, not passed as useTable() options.
    // Manual flags are valid v9 options and are retained for server-side readiness.
    manualPagination: Boolean(onFetch),
    manualSorting: Boolean(onFetch),
    manualFiltering: Boolean(onFetch),
  });

  return table;
}
