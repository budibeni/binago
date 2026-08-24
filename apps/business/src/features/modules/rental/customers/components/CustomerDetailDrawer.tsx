'use client';

import React from 'react';
import {
  User,
  Building,
  MapPin,
  FileText,
  X,
  CreditCard,
  Briefcase,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge } from '@adatrack/ui';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
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

function getStatusBadge(status: Customer['status'], labels: CustomerDetailDrawerProps['labels']) {
  const isActive = status === 'ACTIVE';
  return (
    <Badge variant={isActive ? 'success' : 'default'} dot>
      {isActive ? labels.statusActive : labels.statusInactive}
    </Badge>
  );
}

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <p className="text-[13px] font-medium text-foreground truncate">
          {value ?? '-'}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1 mt-4 first:mt-0">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{title}</h3>
    </div>
  );
}

export function CustomerDetailDrawer({ customer, open, onClose, labels }: CustomerDetailDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!customer) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={labels.detailTitle}
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-[400px] flex-col bg-background shadow-xl',
          'border-l border-border',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-bold text-foreground tracking-widest uppercase truncate">
                {customer.code}
              </h2>
              {getStatusBadge(customer.status, labels)}
            </div>
            <p className="text-[12px] text-foreground-muted truncate">{customer.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50 hover:text-foreground transition-colors focus:outline-none"
            aria-label={labels.detailClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          
          {customer.type === 'INDIVIDUAL' ? (
            <>
              {/* Individual Data */}
              <SectionHeader icon={User} title={labels.tabPersonalInfo} />
              <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
                <InfoRow icon={User} label="Nama Lengkap" value={(customer as IndividualCustomer).name} />
                <InfoRow icon={CreditCard} label="NIK" value={(customer as IndividualCustomer).nik.replace(/^(\d{4})(\d{8})(\d{4})$/, '$1-XXXX-XXXX-$3')} />
                <InfoRow icon={MapPin} label="Tempat Lahir" value={(customer as IndividualCustomer).birthPlace} />
                <InfoRow icon={Calendar} label="Tanggal Lahir" value={(customer as IndividualCustomer).birthDate} />
                <InfoRow icon={Phone} label="No. Telepon" value={customer.phone} />
                <InfoRow icon={Mail} label="Email" value={customer.email} />
              </div>

              <SectionHeader icon={CreditCard} title={labels.tabSim} />
              <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
                <InfoRow icon={CreditCard} label="Nomor SIM" value={(customer as IndividualCustomer).simNumber.replace(/^(\d{4})(\d{4})(\d{4})$/, '$1-XXXX-$3')} />
                <InfoRow icon={FileText} label="Jenis SIM" value={(customer as IndividualCustomer).simType} />
                <InfoRow icon={Calendar} label="Masa Berlaku" value={(customer as IndividualCustomer).simExpiredAt} />
              </div>
            </>
          ) : (
            <>
              {/* Company Data */}
              <SectionHeader icon={Building} title={labels.tabCompanyInfo} />
              <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
                <InfoRow icon={Building} label="Nama Perusahaan" value={(customer as CompanyCustomer).name} />
                <InfoRow icon={Phone} label="Telepon" value={customer.phone} />
                <InfoRow icon={Mail} label="Email" value={customer.email} />
              </div>

              <SectionHeader icon={FileText} title={labels.tabLegal} />
              <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
                <InfoRow icon={FileText} label="NIB" value={(customer as CompanyCustomer).nib} />
                <InfoRow icon={FileText} label="NPWP" value={(customer as CompanyCustomer).npwp} />
              </div>

              <SectionHeader icon={User} title={labels.tabPic} />
              <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
                <InfoRow icon={User} label="Nama PIC" value={(customer as CompanyCustomer).picName} />
                <InfoRow icon={Briefcase} label="Jabatan" value={(customer as CompanyCustomer).picPosition} />
                <InfoRow icon={Phone} label="No. HP PIC" value={(customer as CompanyCustomer).picPhone} />
                <InfoRow icon={Mail} label="Email PIC" value={(customer as CompanyCustomer).picEmail} />
                <InfoRow icon={CreditCard} label="NIK PIC" value={(customer as CompanyCustomer).picNik.replace(/^(\d{4})(\d{8})(\d{4})$/, '$1-XXXX-XXXX-$3')} />
              </div>
            </>
          )}

          <SectionHeader icon={MapPin} title={labels.tabAddress} />
          <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
            <InfoRow icon={MapPin} label="Alamat Lengkap" value={customer.address} />
            <InfoRow icon={MapPin} label="Kota" value={customer.city} />
            <InfoRow icon={MapPin} label="Provinsi" value={customer.province} />
            <InfoRow icon={MapPin} label="Kode Pos" value={customer.postalCode} />
          </div>

          <div className="h-4" />
        </div>
      </aside>
    </>
  );
}
