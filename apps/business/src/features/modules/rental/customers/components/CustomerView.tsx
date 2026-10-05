'use client';

import React from 'react';
import {
  User,
  Building,
  MapPin,
  FileText,
  Briefcase,
  Phone,
  Settings,
  CreditCard,
  Mail,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge, DetailShell } from '@adatrack/ui';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

// ─── Helper Components ──────────────────────────────────────────────────────────

const InfoItem = ({ label, value, highlight = false, valueClassName, colSpan = 1 }: { 
  label: string; 
  value: React.ReactNode; 
  highlight?: boolean; 
  valueClassName?: string;
  colSpan?: 1 | 2;
}) => (
  <div className={cn("flex flex-col gap-0.5", colSpan === 2 && "col-span-2")}>
    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
    <span className={cn("text-[11px] font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100", valueClassName)}>
      {value}
    </span>
  </div>
);

function SectionCard({ 
  icon: Icon, 
  title, 
  colorClass = "text-muted-foreground",
  bgClass = "",
  children 
}: { 
  icon: any; 
  title: string; 
  colorClass?: string;
  bgClass?: string;
  children: React.ReactNode 
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
      <div className="px-3 py-2 flex items-center gap-2 border-b border-border/40 bg-neutral-50/80 dark:bg-neutral-900/40">
        <div className={cn("flex items-center justify-center rounded-md p-1", bgClass)}>
          <Icon className={cn("w-3.5 h-3.5", colorClass)} />
        </div>
        <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider pt-[2px]">{title}</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-4">
        {children}
      </div>
    </div>
  );
}

interface CustomerViewProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (c: Customer) => void;
  onDelete?: (c: Customer) => void;
  labels: {
    detailTitle: string;
    detailClose: string;
    tabPersonalInfo: string;
    tabCompanyInfo: string;
    tabAddress: string;
    tabLegal: string;
    tabPic: string;
    tabSim: string;
    statusActive: string;
    statusInactive: string;
    typeIndividual: string;
    typeCompany: string;
  };
}

export function CustomerView({
  customer,
  open,
  onClose,
  onEdit,
  onDelete,
  labels,
}: CustomerViewProps) {
  if (!open || !customer) return null;

  const isIndiv = customer.type === 'INDIVIDUAL';
  const cIndiv = customer as IndividualCustomer;
  const cComp = customer as CompanyCustomer;

  return (
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title="Detail Pelanggan"
      onEdit={onEdit ? () => onEdit(customer) : undefined}
      onDelete={onDelete ? () => onDelete(customer) : undefined}
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20 pb-8">
        
        {/* Header Section */}
        <div className="px-4 py-3 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground uppercase truncate">
              {customer.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                {isIndiv ? <User className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                {isIndiv ? labels.typeIndividual : labels.typeCompany} &bull; {customer.code}
              </span>
            </div>
          </div>
          <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5", customer.status === 'ACTIVE' ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400")}>
            <span className={cn('h-1.5 w-1.5 rounded-full', customer.status === 'ACTIVE' ? 'bg-green-500' : 'bg-neutral-500')} />
            {customer.status === 'ACTIVE' ? labels.statusActive : labels.statusInactive}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          
          {/* Statistik & Keuangan */}
          <SectionCard 
            icon={CreditCard} 
            title="Statistik & Keuangan"
            colorClass="text-amber-600 dark:text-amber-400"
            bgClass="bg-amber-100 dark:bg-amber-900/40"
          >
            <InfoItem 
              label="Sisa Tagihan (Utang)" 
              value={customer.balance?.totalOutstanding ? `Rp ${customer.balance.totalOutstanding.toLocaleString('id-ID')}` : 'Rp 0'} 
              highlight={!!(customer.balance?.totalOutstanding && customer.balance.totalOutstanding > 0)} 
            />
            <InfoItem 
              label="Total Tagihan" 
              value={customer.balance?.totalBilling ? `Rp ${customer.balance.totalBilling.toLocaleString('id-ID')}` : 'Rp 0'} 
            />
            <InfoItem 
              label="Total Dibayar" 
              value={customer.balance?.totalPaid ? `Rp ${customer.balance.totalPaid.toLocaleString('id-ID')}` : 'Rp 0'} 
              valueClassName="text-success"
            />
            <InfoItem 
              label="Jml Sewa Sukses" 
              value={`${customer.balance?.totalRentals || 0} Kali`} 
            />
            <InfoItem 
              label="Sewa Terakhir" 
              value={customer.balance?.lastRentalDate ? new Date(customer.balance.lastRentalDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} 
            />
            <InfoItem 
              label="Bayar Terakhir" 
              value={customer.balance?.lastPaymentDate ? new Date(customer.balance.lastPaymentDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} 
            />
          </SectionCard>

          {/* Kontak & Alamat */}
          <SectionCard 
            icon={MapPin} 
            title="Kontak & Alamat"
            colorClass="text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-100 dark:bg-blue-900/40"
          >
            <InfoItem 
              label="Telepon" 
              value={
                customer.phone ? (
                  <a 
                    href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-green-600 dark:hover:text-green-400 transition-colors text-foreground"
                  >
                    <Phone className="w-3 h-3 text-green-500 shrink-0" />
                    {customer.phone}
                  </a>
                ) : '-'
              } 
            />
            <InfoItem 
              label="Email" 
              value={
                customer.email ? (
                  <a href={`mailto:${customer.email}`} className="flex items-start gap-1.5 hover:text-blue-600 transition-colors text-foreground break-all">
                     <Mail className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                     <span className="flex-1">{customer.email}</span>
                  </a>
                ) : '-'
              } 
            />
            <InfoItem label="Alamat Lengkap" value={customer.address || '-'} colSpan={2} />
            <InfoItem label="Kota" value={customer.city || '-'} />
            <InfoItem label="Provinsi" value={customer.province || '-'} />
            <InfoItem label="Kode Pos" value={customer.postalCode || '-'} colSpan={2} />
          </SectionCard>

          {/* Identitas */}
          <SectionCard 
            icon={FileText} 
            title={isIndiv ? 'Identitas Pribadi' : 'Legalitas Perusahaan'}
            colorClass="text-purple-600 dark:text-purple-400"
            bgClass="bg-purple-100 dark:bg-purple-900/40"
          >
            {isIndiv ? (
              <>
                <InfoItem label="NIK" value={cIndiv.nik || '-'} colSpan={2} />
                <InfoItem label="Tempat Lahir" value={cIndiv.birthPlace || '-'} />
                <InfoItem label="Tanggal Lahir" value={cIndiv.birthDate ? new Date(cIndiv.birthDate).toLocaleDateString('id-ID') : '-'} />
              </>
            ) : (
              <>
                <InfoItem label="NIB" value={cComp.nib || '-'} />
                <InfoItem label="NPWP" value={cComp.npwp || '-'} />
              </>
            )}
          </SectionCard>

          {/* SIM / PIC */}
          <SectionCard 
            icon={Briefcase} 
            title={isIndiv ? 'Lisensi Mengemudi (SIM)' : 'Informasi Penanggung Jawab (PIC)'}
            colorClass="text-emerald-600 dark:text-emerald-400"
            bgClass="bg-emerald-100 dark:bg-emerald-900/40"
          >
            {isIndiv ? (
              <>
                <InfoItem label="Tipe SIM" value={cIndiv.simType || '-'} />
                <InfoItem label="Nomor SIM" value={cIndiv.simNumber || '-'} />
                <InfoItem label="Berlaku Hingga" value={cIndiv.simExpiredAt ? new Date(cIndiv.simExpiredAt).toLocaleDateString('id-ID') : '-'} colSpan={2} />
              </>
            ) : (
              <>
                <InfoItem label="Nama PIC" value={cComp.picName || '-'} colSpan={2} />
                <InfoItem label="Jabatan" value={cComp.picPosition || '-'} colSpan={2} />
                <InfoItem label="Telepon PIC" value={cComp.picPhone || '-'} />
                <InfoItem 
                  label="Email PIC" 
                  value={cComp.picEmail ? <span className="break-all">{cComp.picEmail}</span> : '-'} 
                />
              </>
            )}
          </SectionCard>

        </div>
      </div>
    </DetailShell>
  );
}
