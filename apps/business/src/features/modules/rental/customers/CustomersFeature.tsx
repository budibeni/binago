'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { rentalCustomerService } from '@/data/modules/rental';
import { CustomerTable } from './components/CustomerTable';
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer';
import { CustomerForm } from './components/CustomerForm';
import { CustomerDeleteDialog } from './components/CustomerDeleteDialog';
import type { Customer, CustomerStatusFilter, CustomerTypeFilter } from './types/customer';
import type { DataTableFilterConfig } from '@adatrack/ui';
import { Button } from '@adatrack/ui';
import { Plus } from 'lucide-react';

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

  const [formCustomer, setFormCustomer] = React.useState<Customer | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

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
    setFormCustomer(customer);
    setFormOpen(true);
  }, []);

  const handleDelete = React.useCallback((customer: Customer) => {
    setDeleteCustomer(customer);
    setDeleteOpen(true);
  }, []);

  const handleCreateNew = () => {
    setFormCustomer(null);
    setFormOpen(true);
  };

  const handleSaveForm = (data: any) => {
    if (formCustomer) {
      rentalCustomerService.updateCustomer(formCustomer.id, data);
    } else {
      rentalCustomerService.createCustomer(data);
    }
    setFormOpen(false);
    refreshData();
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
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-foreground">{tC.title}</h1>
            <p className="text-[13px] text-foreground-muted mt-1">{tC.pageSubtitle}</p>
          </div>
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            {tC.addCustomer}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
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
        />
      </div>

      {/* Modals & Drawers */}
      <CustomerDetailDrawer
        customer={detailCustomer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        labels={tC}
      />

      <CustomerForm
        customer={formCustomer}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveForm}
        labels={tC}
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
