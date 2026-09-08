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
import type { DataTableProps } from './types';

export function useDataTable<TData extends RowData = RowData>(
  props: DataTableProps<TData>,
) {
  const {
    data,
    columns,
    // Capabilities
    searchable,
    sortable,
    filterable,
    pagination,
    
    // Controlled sorting
    sorting: controlledSorting,
    onSortingChange: setControlledSorting,
    
    // Search
    searchValue: controlledGlobalFilter,
    onSearchChange: setControlledGlobalFilter,
    
    // Controlled visibility
    columnVisibilityState: controlledVisibility,
    onColumnVisibilityChange: setControlledVisibility,
    
    // Pagination
    pageIndex: controlledPageIndex = 0,
    pageSize: controlledPageSize = 10,
  } = props;

  // Uncontrolled fallback states
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalFilters, setInternalFilters] = React.useState<ColumnFiltersState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState('');
  const [internalVisibility, setInternalVisibility] = React.useState<ColumnVisibilityState>({});
  const [internalPinning, setInternalPinning] = React.useState<ColumnPinningState>({
    start: [],
    end: [],
  });

  const sorting = controlledSorting ?? internalSorting;
  const columnFilters = internalFilters; // Filter state is managed manually via DataTableFilterPanel for now, but we keep it here for standard tanstack integration if needed
  const globalFilter = controlledGlobalFilter ?? internalGlobalFilter;
  const columnVisibility = controlledVisibility ?? internalVisibility;
  const columnPinning = internalPinning;

  const pageIndex = controlledPageIndex;
  const pageSize = controlledPageSize;

  // We detect if server-side by checking if totalCount is provided
  // If totalCount is undefined, we assume client-side pagination
  const isServerSide = typeof props.totalCount !== 'undefined';

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
      setInternalFilters(next);
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
      setInternalPinning(next);
    },
    
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
  });

  return table;
}
