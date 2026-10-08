'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Key, FileText, ArrowRight, MapPin, Search, Check } from 'lucide-react';
import { getHandoverTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { useRouter } from 'next/navigation';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import { buildRentalVehicleContext } from '@/data/modules/rental/services/vehicleContextBuilder';
import type { RentalHandover } from './types/handover';
import type { RentalContract } from '../contracts/types/contract';
import { HandoverTable } from './components/HandoverTable';
import { HandoverView } from './components/HandoverView';
import { HandoverCreateFeature } from './HandoverCreateFeature';
import { Button, DataTableSearch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@adatrack/ui';
import { cn } from '@adatrack/utils';

export function HandoverFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const labels = getHandoverTranslation(locale);
  const [handovers, setHandovers] = useState<RentalHandover[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<{ condition: string }>({ condition: '' });

  // Drawer & Dialog state
  const [selectedHandover, setSelectedHandover] = useState<import('./components/HandoverTable').HandoverGroup | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Create Handover Drawer State
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [data] = await Promise.all([
        handoverService.getHandovers()
      ]);
      // Sort by newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHandovers(sorted);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterConfig = useMemo(() => {
    return {
      state: filterState,
      onStateChange: setFilterState,
      onClearAll: () => setFilterState({ condition: '' }),
      labels: {
        title: 'Filter',
        clearAll: 'Clear All',
      },
      fields: [
        {
          id: 'condition',
          label: labels.fieldCondition || 'Kondisi Kendaraan',
          type: 'pills-single',
          options: [
            { value: 'GOOD', label: labels.condGood || 'Baik', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
            { value: 'MINOR_DAMAGE', label: labels.condMinorDamage || 'Kerusakan Ringan', colorClass: 'bg-warning', activeClass: 'bg-warning/15 border-warning/40 text-warning' },
            { value: 'NEEDS_REPAIR', label: labels.condNeedsRepair || 'Perlu Perbaikan', colorClass: 'bg-danger', activeClass: 'bg-danger/15 border-danger/40 text-danger' },
          ],
        },
      ],
    };
  }, [filterState]);

  const filteredData = useMemo(() => {
    return handovers.filter((h) => {
      // Filter by Condition
      if (filterState.condition) {
        if (h.vehicleCondition !== filterState.condition) return false;
      }

      // Filter by Search (ID Handover, Contract ID, Customer Name, Vehicle Plate/Name)
      if (search) {
        const s = search.toLowerCase();
        const matchSearch =
          h.id.toLowerCase().includes(s) ||
          h.contractId.toLowerCase().includes(s) ||
          h.contract?.contractNumber?.toLowerCase().includes(s) ||
          h.customer?.name?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s);

        if (!matchSearch) return false;
      }
      return true;
    });
  }, [handovers, search, filterState]);

  const groupedHandovers = useMemo(() => {
    const groups: Record<string, any> = {};
    filteredData.forEach(h => {
      if (!groups[h.contractId]) {
        groups[h.contractId] = {
          id: h.contractId,
          contractId: h.contractId,
          contract: h.contract,
          customer: h.customer,
          handoverAt: h.handoverAt,
          handoverLatitude: h.handoverLatitude,
          handoverLongitude: h.handoverLongitude,
          handoverAddress: h.handoverAddress,
          items: []
        };
      }
      groups[h.contractId].items.push(h);
    });

    return Object.values(groups).map(g => {
      const totalBooked = g.contract?.items?.length || 0;
      const totalHandedOver = g.items.length;
      g.status = totalHandedOver >= totalBooked && totalBooked > 0 ? 'COMPLETED' : 'PARTIAL';
      return g;
    });
  }, [filteredData]);



  const handedOverItemIds = useMemo(() => {
    return new Set(handovers.map(h => h.bookingItemId));
  }, [handovers]);

  const openDetail = (group: any) => {
    setSelectedHandover(group);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedHandover(null), 300);
  };



  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative flex-col">

      <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto p-0 bg-background relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <HandoverTable
            className="border-0 rounded-none"
            data={groupedHandovers}
            searchValue={search}
            onSearchChange={setSearch}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
            onViewDetail={openDetail}
            labels={labels}
            onAdd={() => {
              setSelectedContractId(null);
              setIsHandoverOpen(true);
            }}
          />
        )}
      </div>

      <HandoverView
        open={isDetailOpen}
        onClose={closeDetail}
        handover={selectedHandover}
        labels={labels}
      />

      <HandoverCreateFeature
        contractId={selectedContractId}
        open={isHandoverOpen}
        onOpenChange={setIsHandoverOpen}
        labels={labels}
        onSuccess={() => {
          setIsHandoverOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
