'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { RentalContract } from './types/contract';
import { Button } from '@adatrack/ui';
import { ChevronLeft, Printer } from 'lucide-react';

interface ContractPrintFeatureProps {
  contractId: string;
}

export function ContractPrintFeature({ contractId }: ContractPrintFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalContractFeature || {};

  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await contractService.getContractById(contractId);
        if (!data) {
          alert('Kontrak tidak ditemukan');
          router.push('/rental/contracts');
          return;
        }
        setContract(data);
      } catch (error) {
        console.error('Failed to load contract', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [contractId, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contract) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const res = contract.reservation;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pb-12 print:bg-white print:pb-0">
      
      {/* GLOBAL PRINT CSS: Hide everything outside print-container */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Action Bar (Not Printed) */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between no-print">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </Button>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Cetak Dokumen
        </Button>
      </div>

      {/* Document Container */}
      <div className="max-w-4xl mx-auto bg-white text-black p-10 md:p-14 shadow-lg print:shadow-none print-container min-h-[297mm]">
        
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-wider mb-1">ADATRACK</h1>
          <h2 className="text-xl font-bold text-neutral-700">KONTRAK RENTAL KENDARAAN</h2>
          {contract.status !== 'ACTIVE' && contract.status !== 'COMPLETED' && (
            <p className="mt-2 text-sm font-semibold inline-block px-3 py-1 border border-black rounded-md">
              STATUS: {contract.status}
            </p>
          )}
        </div>

        {/* Info Meta */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm font-semibold text-neutral-500 mb-1">Nomor Kontrak:</p>
            <p className="text-base font-bold">{contract.contractNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-neutral-500 mb-1">Tanggal Kontrak:</p>
            <p className="text-base font-bold">{formatDate(contract.contractDate)}</p>
          </div>
        </div>

        {/* Data Pelanggan */}
        <div className="mb-8">
          <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Data Pelanggan</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
            {contract.customer?.type === 'COMPANY' ? (
              <>
                <div><span className="text-neutral-500 font-semibold inline-block w-32">Nama Perusahaan:</span> <span className="font-medium">{contract.customer?.name}</span></div>
                <div><span className="text-neutral-500 font-semibold inline-block w-32">PIC:</span> <span className="font-medium">{contract.customer.picName}</span></div>
                <div><span className="text-neutral-500 font-semibold inline-block w-32">Tax ID (NPWP):</span> <span className="font-medium">{contract.customer.npwp}</span></div>
              </>
            ) : (
              <>
                <div><span className="text-neutral-500 font-semibold inline-block w-32">Nama:</span> <span className="font-medium">{contract.customer?.name}</span></div>
                <div><span className="text-neutral-500 font-semibold inline-block w-32">Jenis Customer:</span> <span className="font-medium">Individual</span></div>
                <div><span className="text-neutral-500 font-semibold inline-block w-32">No. Identitas (NIK):</span> <span className="font-medium">{contract.customer?.type === 'INDIVIDUAL' ? contract.customer.nik : ''}</span></div>
              </>
            )}
            <div><span className="text-neutral-500 font-semibold inline-block w-32">No. Telepon:</span> <span className="font-medium">{contract.customer?.phone}</span></div>
            <div className="col-span-2"><span className="text-neutral-500 font-semibold inline-block w-32">Alamat:</span> <span className="font-medium">{contract.customer?.address}</span></div>
          </div>
        </div>

        {/* Data Kendaraan */}
        <div className="mb-8">
          <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Data Kendaraan</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Nomor Polisi:</span> <span className="font-medium">{contract.vehicle?.coreVehicle?.plateNumber}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Merk:</span> <span className="font-medium">{contract.vehicle?.coreVehicle?.brand}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Model:</span> <span className="font-medium">{contract.vehicle?.coreVehicle?.vehicleName}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Tahun:</span> <span className="font-medium">{contract.vehicle?.coreVehicle?.year}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Warna:</span> <span className="font-medium">{(contract.vehicle?.coreVehicle as any)?.color || '-'}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Kilometer:</span> <span className="font-medium">{contract.vehicle?.currentOdometer?.toLocaleString('id-ID')} KM</span></div>
          </div>
        </div>

        {/* Periode Rental */}
        <div className="mb-8">
          <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Periode Rental</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Tanggal Mulai:</span> <span className="font-medium">{formatDate(contract.startDate)}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Tanggal Selesai:</span> <span className="font-medium">{formatDate(contract.endDate)}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Durasi:</span> <span className="font-medium">{contract.duration} Hari</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Tipe Rental:</span> <span className="font-medium">{contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Driver'}</span></div>
          </div>
        </div>

        {/* Nilai Kontrak */}
        <div className="mb-8">
          <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Nilai Kontrak</h3>
          <div className="w-full max-w-lg text-sm">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500 font-semibold">Tarif:</span>
              <span className="font-medium">{formatCurrency(contract.rate)} / {contract.rateType === 'DAILY' ? 'Hari' : contract.rateType === 'WEEKLY' ? 'Minggu' : 'Bulan'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500 font-semibold">Subtotal:</span>
              <span className="font-medium">{formatCurrency(contract.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500 font-semibold">Deposit:</span>
              <span className="font-medium">{formatCurrency(contract.deposit)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-300 font-bold">
              <span>Total:</span>
              <span>{formatCurrency(contract.totalAmount)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-black">
              <span>Sisa Pembayaran:</span>
              <span>{formatCurrency(contract.remainingAmount)}</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        {contract.terms && (
          <div className="mb-8">
            <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Syarat & Ketentuan</h3>
            <div className="text-sm whitespace-pre-wrap leading-relaxed text-justify">
              {contract.terms}
            </div>
          </div>
        )}

        {/* Notes */}
        {contract.notes && (
          <div className="mb-12">
            <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Catatan</h3>
            <div className="text-sm whitespace-pre-wrap leading-relaxed italic text-neutral-700">
              {contract.notes}
            </div>
          </div>
        )}

        {/* Signature Area */}
        <div className="mt-16 pt-8 grid grid-cols-2 gap-8 text-center text-sm">
          <div>
            <p className="font-bold mb-20">Pihak Rental</p>
            <p className="font-bold uppercase">(________________________)</p>
            <div className="mt-2 text-left w-max mx-auto">
              <p><span className="text-neutral-500 font-semibold inline-block w-16">Nama:</span> __________________</p>
              <p className="mt-1"><span className="text-neutral-500 font-semibold inline-block w-16">Tanggal:</span> __________________</p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-20">Pelanggan</p>
            <p className="font-bold uppercase">(________________________)</p>
            <div className="mt-2 text-left w-max mx-auto">
              <p><span className="text-neutral-500 font-semibold inline-block w-16">Nama:</span> __________________</p>
              <p className="mt-1"><span className="text-neutral-500 font-semibold inline-block w-16">Tanggal:</span> __________________</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
