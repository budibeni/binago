'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { rentalCustomerService } from '@/data/modules/rental';
import { CustomerTable } from './components/CustomerTable';
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer';
import { CustomerDeleteDialog } from './components/CustomerDeleteDialog';
import type { Customer, CustomerStatusFilter, CustomerTypeFilter } from './types/customer';
import type { DataTableFilterConfig } from '@adatrack/ui';
import { Button } from '@adatrack/ui';
import { Plus, List, Building, User } from 'lucide-react';
import { cn } from '@adatrack/utils';

function computeCounts(search: string) {
  const base = rentalCustomerService.getCustomers({ search });
  return {
    all: base.length,
    individual: base.filter((c: Customer) => c.type === 'INDIVIDUAL').length,
    company: base.filter((c: Customer) => c.type === 'COMPANY').length,
    active: base.filter((c: Customer) => c.status === 'ACTIVE').length,
    inactive: base.filter((c: Customer) => c.status === 'INACTIVE').length,
  };
}

export function CustomersFeature() {
  const locale = useBusinessLocale();
  const router = useRouter();

  const t = getTranslation(locale);
  const tC = t.rentalCustomers;

  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: 'all',
    type: 'all',
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  const statusFilter = filterState.status as CustomerStatusFilter;
  const typeFilter = filterState.type as CustomerTypeFilter;

  // Modals state
  const [detailCustomer, setDetailCustomer] = React.useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [deleteCustomer, setDeleteCustomer] = React.useState<Customer | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // Force re-render on data change
  const [dataVersion, setDataVersion] = React.useState(0);
  const refreshData = () => setDataVersion(v => v + 1);

  const filteredCustomers = React.useMemo(
    () => rentalCustomerService.getCustomers({ search, status: statusFilter, type: typeFilter }),
    [search, statusFilter, typeFilter, dataVersion],
  );

  const counts = React.useMemo(
    () => computeCounts(search),
    [search, dataVersion],
  );

  const handleViewDetail = React.useCallback((customer: Customer) => {
    setDetailCustomer(customer);
    setDrawerOpen(true);
  }, []);

  const handleEdit = React.useCallback((customer: Customer) => {
    router.push(`/rental/customers/${customer.id}/edit`);
  }, [router]);

  const handleDelete = React.useCallback((customer: Customer) => {
    setDeleteCustomer(customer);
    setDeleteOpen(true);
  }, []);

  const handleCreateNew = () => {
    router.push('/rental/customers/create');
  };



  const handleConfirmDelete = (id: string) => {
    rentalCustomerService.deleteCustomer(id);
    setDeleteOpen(false);
    refreshData();
  };

  const tableLabels = React.useMemo(() => ({
    colCode: tC.colCode,
    colCustomer: tC.colCustomer,
    colType: tC.colType,
    colContact: tC.colContact,
    colPic: tC.colPic,
    colActiveVehicles: tC.colActiveVehicles,
    colActiveContracts: tC.colActiveContracts,
    colStatus: tC.colStatus,
    colActions: tC.colActions,
    typeIndividual: tC.typeIndividual,
    typeCompany: tC.typeCompany,
    statusActive: tC.statusActive,
    statusInactive: tC.statusInactive,
    emptyTitle: tC.emptyTitle,
    emptyDescription: tC.emptyDescription,
    noResultTitle: tC.noResultTitle,
    noResultDescription: tC.noResultDescription,
    searchPlaceholder: tC.searchPlaceholder,
    exportFilename: tC.exportFilename,
    actionDetail: tC.actionDetail,
    actionEdit: tC.actionEdit,
    actionDelete: tC.actionDelete,
  }), [tC]);

  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: 'all', type: 'all' }),
    labels: {
      title: 'Filter Pelanggan',
      clearAll: tC.clearFilters,
    },
    fields: [
      {
        id: 'type',
        label: tC.filterType,
        type: 'pills-single',
        options: [
          { value: 'all', label: tC.filterAll, count: counts.all, activeClass: 'bg-neutral-700 dark:bg-neutral-600 border-neutral-700 dark:border-neutral-500 text-white' },
          { value: 'COMPANY', label: tC.typeCompany, count: counts.company, colorClass: 'bg-info', activeClass: 'bg-info/15 border-info/40 text-info dark:text-info' },
          { value: 'INDIVIDUAL', label: tC.typeIndividual, count: counts.individual, colorClass: 'bg-secondary', activeClass: 'bg-secondary/15 border-secondary/40 text-secondary-foreground dark:text-secondary' },
        ],
      },
      {
        id: 'status',
        label: tC.filterStatus,
        type: 'pills-single',
        options: [
          { value: 'all', label: tC.filterAll, count: counts.all, activeClass: 'bg-neutral-700 dark:bg-neutral-600 border-neutral-700 dark:border-neutral-500 text-white' },
          { value: 'ACTIVE', label: tC.statusActive, count: counts.active, colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'INACTIVE', label: tC.statusInactive, count: counts.inactive, colorClass: 'bg-neutral-400', activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground' },
        ],
      },
    ],
  }), [filterState, tC, counts]);

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 items-center overflow-hidden relative">
      <div className="w-full h-full flex flex-col min-h-0 space-y-4 pb-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setFilterState(prev => ({ ...prev, type: 'all' }))} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", typeFilter === 'all' ? "border-b-4 border-b-danger border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 shrink-0">
               <List className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">Semua Pelanggan</p>
               <p className="text-lg font-bold leading-none my-0.5">{counts.all}</p>
               <p className="text-[9px] text-muted-foreground truncate">Total Pelanggan</p>
            </div>
          </button>
          
          <button onClick={() => setFilterState(prev => ({ ...prev, type: 'COMPANY' }))} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", typeFilter === 'COMPANY' ? "border-b-4 border-b-info border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center text-info shrink-0">
               <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{tC.typeCompany}</p>
               <p className="text-lg font-bold leading-none my-0.5">{counts.company}</p>
               <p className="text-[9px] text-muted-foreground truncate">Perusahaan</p>
            </div>
          </button>
          
          <button onClick={() => setFilterState(prev => ({ ...prev, type: 'INDIVIDUAL' }))} className={cn("p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md", typeFilter === 'INDIVIDUAL' ? "border-b-4 border-b-secondary-foreground border-x-border border-t-border" : "border-border shadow-sm")}>
            <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary-foreground shrink-0">
               <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{tC.typeIndividual}</p>
               <p className="text-lg font-bold leading-none my-0.5">{counts.individual}</p>
               <p className="text-[9px] text-muted-foreground truncate">Perorangan</p>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 w-full relative">
          <CustomerTable
            data={filteredCustomers}
            labels={tableLabels}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchValue={search}
            onSearchChange={setSearch}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
            onAdd={handleCreateNew}
          />
        </div>
      </div>

      {/* Modals & Drawers */}
      <CustomerDetailDrawer
        customer={detailCustomer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        labels={tC}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CustomerDeleteDialog
        customer={deleteCustomer}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        labels={tC}
      />
    </div>
  );
}
