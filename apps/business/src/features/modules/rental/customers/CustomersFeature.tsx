'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getRentalCustomersTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { rentalCustomerService } from '@/data/modules/rental';
import { CustomerTable } from './components/CustomerTable';
import { CustomerView } from './components/CustomerView';
import { ConfirmDialog, toast } from '@adatrack/ui';
import { CustomerForm } from './components/CustomerForm';
import type { Customer, CustomerStatusFilter, CustomerTypeFilter } from './types/customer';
import type { DataTableFilterConfig } from '@adatrack/ui';
import { Button } from '@adatrack/ui';
import { Plus, List, Building, User } from 'lucide-react';
import { cn, formatNumber } from '@adatrack/utils';

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

  const tC = getRentalCustomersTranslation(locale);

  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: '',
    type: '',
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const statusFilter = (filterState.status || 'all') as CustomerStatusFilter;
  const typeFilter = (filterState.type || 'all') as CustomerTypeFilter;

  // Modals state
  const [detailCustomer, setDetailCustomer] = React.useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [deleteCustomer, setDeleteCustomer] = React.useState<Customer | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // Force re-render on data change
  const [dataVersion, setDataVersion] = React.useState(0);
  const editCustomer = React.useMemo(() => editId ? rentalCustomerService.getCustomerById(editId) : null, [editId, dataVersion]);

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
    setDrawerOpen(false);
    window.history.pushState(null, '', '/rental/customers/edit');
    setEditId(customer.id);
  }, []);

  const handleDelete = React.useCallback((customer: Customer) => {
    setDeleteCustomer(customer);
    setDeleteOpen(true);
  }, []);

  const handleCreateNew = () => {
    window.history.pushState(null, '', '/rental/customers/create');
    setIsCreateOpen(true);
  };



  const handleConfirmDelete = (id: string) => {
    rentalCustomerService.deleteCustomer(id);
    setDeleteOpen(false);
    toast.success(tC.deleteSuccess);
    refreshData();
  };

  const tableLabels = React.useMemo(() => ({
    locale,
    colEmail: locale === 'en' ? 'Email' : 'Email',
    colCode: tC.colCode,
    colCustomer: tC.colCustomer,
    colType: tC.colType,
    colContact: tC.colContact,
    colPic: tC.colPic,
    colAddress: tC.colAddress,
    colCity: tC.colCity,
    colStatus: tC.colStatus,
    colBilling: tC.colBilling,
    colPaid: tC.colPaid,
    colLastRental: tC.colLastRental,
    colLastPayment: tC.colLastPayment,
    colOutstanding: tC.colOutstanding,
    colRentals: tC.colRentals,
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
    addCustomer: tC.addCustomer,
  }), [tC]);

  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: '', type: '' }),
    labels: {
      title: 'Filter',
      clearAll: tC.clearFilters,
    },
    fields: [
      {
        id: 'type',
        label: tC.filterType,
        type: 'pills-single',
        options: [
          { value: 'COMPANY', label: tC.typeCompany, colorClass: 'bg-info', activeClass: 'bg-info/15 border-info/40 text-info dark:text-info' },
          { value: 'INDIVIDUAL', label: tC.typeIndividual, colorClass: 'bg-secondary', activeClass: 'bg-secondary/15 border-secondary/40 text-secondary-foreground dark:text-secondary' },
        ],
      },
      {
        id: 'status',
        label: tC.filterStatus,
        type: 'pills-single',
        options: [
          { value: 'ACTIVE', label: tC.statusActive, colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'INACTIVE', label: tC.statusInactive, colorClass: 'bg-neutral-400', activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground' },
        ],
      },
    ],
  }), [filterState, tC]);

  const dtLabels = React.useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) => isEn
        ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items`
        : `Menampilkan ${from}-${to} dari ${formatNumber(total)} data`,
      paginationPerPage: isEn ? '/ page' : '/ halaman',
      toolbarFilter: 'Filter',
      toolbarColumns: isEn ? 'Columns' : 'Kolom',
      toolbarExport: isEn ? 'Export' : 'Ekspor',
      activeFilterClear: isEn ? 'Clear Filters' : 'Reset Filter',
      columnPanelHideAll: isEn ? 'Hide all' : 'Sembunyikan semua',
      columnPanelShowAll: isEn ? 'Show all' : 'Tampilkan semua',
      noResultTitle: isEn ? 'No results found' : 'Hasil Tidak Ditemukan',
      noResultDesc: isEn ? 'No data matches your search or filters.' : 'Tidak ada data yang sesuai.',
    };
  }, [locale]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <CustomerTable
          data={filteredCustomers}
          labels={tableLabels}
          onViewDetail={handleViewDetail}
          searchValue={search}
          onSearchChange={setSearch}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          dtLabels={dtLabels}
          onAdd={handleCreateNew}
        />
      </div>

      {/* Modals & Drawers */}
      <CustomerView
        customer={detailCustomer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        labels={tC}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={tC.confirmDelete}
        description={
          <div className="flex flex-col">
            <span>{tC.confirmDeleteDesc}</span>
            <div className="mt-3 text-center">
              <strong className="text-danger text-[15px]">{deleteCustomer?.name}</strong> <span className="text-danger/80">({deleteCustomer?.code})</span>
            </div>
          </div>
        }
        confirmLabel={tC.confirm || 'Ya, Hapus'}
        cancelLabel={tC.cancel || 'Batal'}
        onConfirm={() => {
          if (deleteCustomer) handleConfirmDelete(deleteCustomer.id);
        }}
        variant="danger"
      />

      <CustomerForm
        customer={null}
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) window.history.pushState(null, '', '/rental/customers');
          setIsCreateOpen(open);
        }}
        onCancel={() => {
          window.history.pushState(null, '', '/rental/customers');
          setIsCreateOpen(false);
        }}
        onSave={(data) => {
          // Implement save
          console.log('Saved new customer', data);
          toast.success(tC.createSuccess || 'Pelanggan berhasil ditambahkan');
          window.history.pushState(null, '', '/rental/customers');
          setIsCreateOpen(false);
          refreshData();
        }}
      />

      {editCustomer && (
        <CustomerForm
          customer={editCustomer}
          open={!!editId}
          onOpenChange={(open) => {
            if (!open) window.history.pushState(null, '', '/rental/customers');
            if (!open) setEditId(null);
          }}
          onCancel={() => {
            window.history.pushState(null, '', '/rental/customers');
            setEditId(null);
          }}
          onSave={(data) => {
            // Implement update
            console.log('Updated customer', data);
            toast.success(tC.updateSuccess || 'Pelanggan berhasil diperbarui');
            window.history.pushState(null, '', '/rental/customers');
            setEditId(null);
            refreshData();
          }}
        />
      )}

    </div>
  );
}
