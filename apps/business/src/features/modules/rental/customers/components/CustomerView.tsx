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
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge, DetailShell } from '@adatrack/ui';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

// ─── Helper Components ──────────────────────────────────────────────────────────
function CompactField({ label, value, highlight, colSpan = 1 }: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  colSpan?: 1 | 2;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", colSpan === 2 && "col-span-2")}>
      <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider">{label}</span>
      <span className={cn("text-[12px]", highlight ? "font-semibold text-foreground" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, colorClass = "text-danger" }: { icon: any; title: string; colorClass?: string }) {
  return (
    <h4 className="text-[12px] font-bold text-foreground mb-1.5 flex items-center gap-1.5 tracking-wide uppercase">
      <Icon className={cn("w-3.5 h-3.5", colorClass)} /> {title}
    </h4>
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
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 bg-neutral-50/50 dark:bg-neutral-900">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-bold text-foreground tracking-widest uppercase truncate">
                {customer.name}
              </h2>
              <Badge variant={customer.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                {customer.status === 'ACTIVE' ? labels.statusActive : labels.statusInactive}
              </Badge>
            </div>
            <p className="text-[12px] text-foreground-muted flex items-center gap-1.5 mt-0.5 truncate">
              {isIndiv ? <User className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
              {isIndiv ? labels.typeIndividual : labels.typeCompany} &bull; {customer.code}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-4">
          <div className="flex flex-col gap-4">
            
            {/* Kontak */}
            <SectionHeader icon={Phone} title="Kontak Utama" colorClass="text-green-500" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CompactField 
                label="Telepon" 
                value={
                  customer.phone ? (
                    <a 
                      href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                      {customer.phone}
                    </a>
                  ) : '-'
                } 
              />
              <CompactField label="Email" value={customer.email || '-'} />
            </div>

            {/* Identitas */}
            <SectionHeader icon={FileText} title={isIndiv ? 'Identitas Pribadi' : 'Legalitas Perusahaan'} />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              {isIndiv ? (
                <>
                  <CompactField label="NIK" value={cIndiv.nik || '-'} colSpan={2} />
                  <CompactField label="Tempat Lahir" value={cIndiv.birthPlace || '-'} />
                  <CompactField label="Tanggal Lahir" value={cIndiv.birthDate ? new Date(cIndiv.birthDate).toLocaleDateString('id-ID') : '-'} />
                </>
              ) : (
                <>
                  <CompactField label="NIB" value={cComp.nib || '-'} />
                  <CompactField label="NPWP" value={cComp.npwp || '-'} />
                </>
              )}
            </div>

            {/* SIM / PIC */}
            <SectionHeader icon={Briefcase} title={isIndiv ? 'Lisensi (SIM)' : 'Informasi PIC'} />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              {isIndiv ? (
                <>
                  <CompactField label="Tipe SIM" value={cIndiv.simType || '-'} />
                  <CompactField label="Nomor SIM" value={cIndiv.simNumber || '-'} />
                  <CompactField label="Berlaku Hingga" value={cIndiv.simExpiredAt ? new Date(cIndiv.simExpiredAt).toLocaleDateString('id-ID') : '-'} colSpan={2} />
                </>
              ) : (
                <>
                  <CompactField label="Nama PIC" value={cComp.picName || '-'} colSpan={2} />
                  <CompactField label="Jabatan" value={cComp.picPosition || '-'} colSpan={2} />
                  <CompactField label="Telepon PIC" value={cComp.picPhone || '-'} />
                  <CompactField label="Email PIC" value={cComp.picEmail || '-'} />
                </>
              )}
            </div>

            {/* Alamat */}
            <SectionHeader icon={MapPin} title="Detail Alamat" colorClass="text-blue-500" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CompactField label="Alamat Lengkap" value={customer.address || '-'} colSpan={2} />
              <CompactField label="Kota" value={customer.city || '-'} />
              <CompactField label="Provinsi" value={customer.province || '-'} />
              <CompactField label="Kode Pos" value={customer.postalCode || '-'} colSpan={2} />
            </div>

          </div>
        </div>
        <div className="h-4" />
      </div>
    </DetailShell>
  );
}
