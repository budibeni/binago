'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Key, FileText, ArrowRight, MapPin, Search, Check, Printer } from 'lucide-react';
import { getHandoverTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
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
  const [selectedContractId, setSelectedContractId] = useState<string | null>(searchParams?.get('contractId') || null);
  const [isHandoverOpen, setIsHandoverOpen] = useState(searchParams?.get('create') === 'true');

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
      const sorted = [...data].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
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
      const groupId = h.handoverNumber || h.contractId;
      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          handoverNumber: h.handoverNumber,
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
      groups[groupId].items.push(h);
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

  const handlePrint = (group: import('./components/HandoverTable').HandoverGroup) => {
    // Buka tab baru untuk cetak dokumen Bukti Serah Terima
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const items = group.items || [];
    const contract = group.contract;
    const customer = group.customer;

    const itemRows = items.map((item: any) => {
      const cv = item.vehicle?.coreVehicle || item.vehicleSnapshot;
      const plate = cv?.plateNumber || cv?.licensePlate || '-';
      const brand = cv?.brand || '-';
      const model = cv?.model || cv?.vehicleName || '-';
      const fuelMap: Record<string, string> = { EMPTY: 'Kosong', QUARTER: '1/4', HALF: '1/2', THREE_QUARTER: '3/4', FULL: 'Penuh' };
      const condMap: Record<string, string> = { GOOD: 'Baik', MINOR_DAMAGE: 'Kerusakan Ringan', NEEDS_REPAIR: 'Perlu Perbaikan' };
      return `
        <tr>
          <td>${plate}</td>
          <td>${brand} ${model}</td>
          <td>${item.odometerStart?.toLocaleString('id-ID') || '-'} km</td>
          <td>${fuelMap[item.fuelLevel] || item.fuelLevel || '-'}</td>
          <td>${condMap[item.vehicleCondition] || item.vehicleCondition || '-'}</td>
          <td>${item.notes || '-'}</td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html lang="id"><head>
      <meta charset="UTF-8"><title>Bukti Serah Terima ${group.handoverNumber || group.id}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 30px; color: #000; }
        h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
        .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-bottom: 20px; }
        .info-row { display: flex; gap: 4px; }
        .info-label { font-weight: bold; min-width: 120px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #f0f0f0; padding: 6px 8px; text-align: left; border: 1px solid #ccc; font-size: 11px; }
        td { padding: 6px 8px; border: 1px solid #ddd; font-size: 11px; vertical-align: top; }
        .signature { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .sign-box { text-align: center; }
        .sign-line { border-top: 1px solid #000; margin-top: 60px; padding-top: 4px; font-size: 11px; }
        @media print { body { margin: 15px; } }
      </style>
    </head><body>
      <h1>BUKTI SERAH TERIMA KENDARAAN</h1>
      <p class="subtitle">No. ${group.handoverNumber || group.id}</p>
      <div class="info-grid">
        <div class="info-row"><span class="info-label">Tanggal:</span><span>${new Date(group.handoverAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
        <div class="info-row"><span class="info-label">No. Kontrak:</span><span>${contract?.contractNumber || group.contractId}</span></div>
        <div class="info-row"><span class="info-label">Pelanggan:</span><span>${customer?.name || '-'}</span></div>
        <div class="info-row"><span class="info-label">Petugas:</span><span>${items[0]?.staffName || '-'}</span></div>
        <div class="info-row"><span class="info-label">Lokasi:</span><span>${group.handoverAddress || '-'}</span></div>
        <div class="info-row"><span class="info-label">Jenis Layanan:</span><span>${contract?.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Pengemudi'}</span></div>
      </div>
      <table>
        <thead><tr><th>Plat Nomor</th><th>Kendaraan</th><th>Odometer</th><th>BBM</th><th>Kondisi</th><th>Catatan</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div class="signature">
        <div class="sign-box"><p>Diserahkan oleh,</p><div class="sign-line">Petugas / Admin</div></div>
        <div class="sign-box"><p>Diterima oleh,</p><div class="sign-line">${customer?.name || 'Pelanggan'}</div></div>
      </div>
    </body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
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
        onPrint={handlePrint}
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
