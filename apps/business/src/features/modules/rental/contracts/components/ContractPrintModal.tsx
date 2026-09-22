'use client';

import React from 'react';
import { PrintShell } from '@adatrack/ui';
import type { RentalContract } from '../types/contract';

interface ContractPrintModalProps {
  contract: RentalContract | null;
  open: boolean;
  onClose: () => void;
}

export function ContractPrintModal({ contract, open, onClose }: ContractPrintModalProps) {
  if (!contract) return null;

  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <PrintShell 
      open={open} 
      onClose={onClose} 
      title={`Cetak Kontrak: ${contract.contractNumber}`}
      margin="15mm"
    >
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-8 text-center">
        <h1 className="text-3xl font-black uppercase tracking-wider mb-1">ADATRACK</h1>
        <h2 className="text-xl font-bold text-neutral-700">KONTRAK RENTAL KENDARAAN</h2>
        {contract.status !== 'ACTIVE' && contract.status !== 'COMPLETED' && (
          <p className="mt-2 text-sm font-semibold inline-block px-3 py-1 border border-black rounded-md uppercase">
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
          <div className="col-span-2 flex"><span className="text-neutral-500 font-semibold inline-block w-32 shrink-0">Alamat:</span> <span className="font-medium flex-1">{contract.customer?.address}</span></div>
        </div>
      </div>

      {/* Data Kendaraan */}
      <div className="mb-8">
        <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Data Kendaraan</h3>
        {contract.booking?.items?.map((item, idx) => (
          <div key={item.id} className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm mb-4 pb-4 border-b border-neutral-100 last:border-0 last:mb-0 last:pb-0">
            <div className="col-span-2 font-bold text-neutral-800">Unit {idx + 1}</div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Plat Nomor:</span> <span className="font-medium">{item.vehicle?.coreVehicle?.plateNumber}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Merk & Model:</span> <span className="font-medium">{item.vehicle?.coreVehicle?.brand} {item.vehicle?.coreVehicle?.vehicleName}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Tahun:</span> <span className="font-medium">{item.vehicle?.coreVehicle?.year}</span></div>
            <div><span className="text-neutral-500 font-semibold inline-block w-32">Kilometer Awal:</span> <span className="font-medium">{item.vehicle?.currentOdometer?.toLocaleString('id-ID') || 0} KM</span></div>
          </div>
        ))}
      </div>

      {/* Periode Rental */}
      <div className="mb-8">
        <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Periode Rental</h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
          <div><span className="text-neutral-500 font-semibold inline-block w-32">Tanggal Mulai:</span> <span className="font-medium">{formatDate(contract.startDate)}</span></div>
          <div><span className="text-neutral-500 font-semibold inline-block w-32">Tanggal Selesai:</span> <span className="font-medium">{formatDate(contract.endDate)}</span></div>
          <div><span className="text-neutral-500 font-semibold inline-block w-32">Durasi:</span> <span className="font-medium">{contract.booking?.duration || '-'} Hari</span></div>
          <div><span className="text-neutral-500 font-semibold inline-block w-32">Tipe Rental:</span> <span className="font-medium">{contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Pengemudi'}</span></div>
        </div>
      </div>

      {/* Nilai Kontrak */}
      <div className="mb-8">
        <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Nilai Kontrak</h3>
        <div className="w-full max-w-lg text-sm">
          <div className="flex justify-between py-1 border-b border-neutral-100">
            <span className="text-neutral-500 font-semibold">Dasar Tarif:</span>
            <span className="font-medium">{contract.rateType}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-100">
            <span className="text-neutral-500 font-semibold">Total Biaya:</span>
            <span className="font-medium">{formatCurrency(contract.totalAmount || 0)}</span>
          </div>
          {(contract.driverFee || 0) > 0 && (
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500 font-semibold">Biaya Pengemudi:</span>
              <span className="font-medium">{formatCurrency(contract.driverFee || 0)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-b border-neutral-100">
            <span className="text-neutral-500 font-semibold">Uang Muka (Deposit):</span>
            <span className="font-medium">{formatCurrency(contract.deposit || 0)}</span>
          </div>
          <div className="flex justify-between py-2 mt-1 font-bold text-black border-t border-black">
            <span>Sisa Tagihan:</span>
            <span>{formatCurrency(contract.remainingAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Syarat & Ketentuan */}
      {contract.terms && (
        <div className="mb-8">
          <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Syarat & Ketentuan</h3>
          <div className="text-sm whitespace-pre-wrap leading-relaxed text-justify">
            {contract.terms}
          </div>
        </div>
      )}

      {/* Catatan */}
      {contract.notes && (
        <div className="mb-12">
          <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Catatan Khusus</h3>
          <div className="text-sm whitespace-pre-wrap leading-relaxed italic text-neutral-700">
            {contract.notes}
          </div>
        </div>
      )}

      {/* Signature Area */}
      <div className="mt-16 pt-8 grid grid-cols-2 gap-8 text-center text-sm print-break-inside-avoid">
        <div>
          <p className="font-bold mb-24">Pihak Rental</p>
          <p className="font-bold uppercase">( ________________________ )</p>
          <div className="mt-3 text-left w-max mx-auto">
            <p><span className="text-neutral-500 font-semibold inline-block w-16">Nama:</span> __________________</p>
            <p className="mt-1.5"><span className="text-neutral-500 font-semibold inline-block w-16">Tanggal:</span> __________________</p>
          </div>
        </div>
        <div>
          <p className="font-bold mb-24">Pihak Penyewa</p>
          <p className="font-bold uppercase">( ________________________ )</p>
          <div className="mt-3 text-left w-max mx-auto">
            <p><span className="text-neutral-500 font-semibold inline-block w-16">Nama:</span> __________________</p>
            <p className="mt-1.5"><span className="text-neutral-500 font-semibold inline-block w-16">Tanggal:</span> __________________</p>
          </div>
        </div>
      </div>
    </PrintShell>
  );
}
