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
  Edit2,
  Trash2,
  Settings,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Tabs, Badge } from '@adatrack/ui';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

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
  const [activeTab, setActiveTab] = React.useState('info');

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !customer) return null;

  const isIndiv = customer.type === 'INDIVIDUAL';
  const cIndiv = customer as IndividualCustomer;
  const cComp = customer as CompanyCustomer;

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:px-4 py-2 border-b border-border bg-surface">
          <h2 className="text-sm font-semibold text-foreground">Detail Pelanggan</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 text-foreground-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Header */}
        <div className="px-4 md:px-5 pt-4 pb-1 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 border border-border/50 bg-neutral-100 dark:bg-neutral-800 text-foreground-muted">
            {isIndiv ? <User className="w-6 h-6" /> : <Building className="w-6 h-6" />}
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-base font-bold text-foreground line-clamp-1 pr-2">{customer.name}</h3>
              <Badge variant={customer.status === 'ACTIVE' ? 'success' : 'danger'} dot className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                {customer.status === 'ACTIVE' ? labels.statusActive : labels.statusInactive}
              </Badge>
            </div>
            <span className="text-xs text-foreground-muted flex items-center gap-1 mt-0.5">
              <Settings className="w-3 h-3" />
              {isIndiv ? labels.typeIndividual : labels.typeCompany} &bull; {customer.code}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-5 mt-3 border-b border-border/50">
          <Tabs
            tabs={[
              { id: 'info', label: 'Informasi' },
              { id: 'address', label: 'Alamat' }
            ]}
            activeTab={activeTab}
            // @ts-expect-error - Tabs component type has wrong onChange signature
            onChange={setActiveTab}
            variant="underline"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:px-5">
          {activeTab === 'info' && (
            <div className="flex flex-col gap-4">
              
              {/* Kontak */}
              <section>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-danger" /> Kontak Utama
                </h4>
                <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Telepon</span>
                    <span className="font-medium text-foreground">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Email</span>
                    <span className="font-medium text-foreground">{customer.email || '-'}</span>
                  </div>
                </div>
              </section>

              {/* Identitas */}
              <section>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-danger" /> {isIndiv ? 'Identitas Pribadi' : 'Legalitas Perusahaan'}
                </h4>
                <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                  {isIndiv ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">NIK</span>
                        <span className="font-medium text-foreground">{cIndiv.nik || '-'}</span>
                      </div>
                      <div className="flex justify-between mt-1 pt-1.5 border-t border-border/50">
                        <span className="text-foreground-muted">TTL</span>
                        <span className="font-medium text-foreground text-right">
                          {cIndiv.birthPlace || '-'},<br />
                          {cIndiv.birthDate ? new Date(cIndiv.birthDate).toLocaleDateString('id-ID') : '-'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">NIB</span>
                        <span className="font-medium text-foreground">{cComp.nib || '-'}</span>
                      </div>
                      <div className="flex justify-between mt-1 pt-1.5 border-t border-border/50">
                        <span className="text-foreground-muted">NPWP</span>
                        <span className="font-medium text-foreground">{cComp.npwp || '-'}</span>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* SIM / PIC */}
              <section>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-danger" /> {isIndiv ? 'Lisensi (SIM)' : 'Informasi PIC'}
                </h4>
                <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                  {isIndiv ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">Tipe SIM</span>
                        <span className="font-medium text-foreground">{cIndiv.simType || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">Nomor SIM</span>
                        <span className="font-medium text-foreground">{cIndiv.simNumber || '-'}</span>
                      </div>
                      <div className="flex justify-between mt-1 pt-1.5 border-t border-border/50">
                        <span className="text-foreground-muted">Berlaku Hingga</span>
                        <span className="font-medium text-foreground">{cIndiv.simExpiredAt ? new Date(cIndiv.simExpiredAt).toLocaleDateString('id-ID') : '-'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">Nama</span>
                        <span className="font-medium text-foreground">{cComp.picName || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">Jabatan</span>
                        <span className="font-medium text-foreground">{cComp.picPosition || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">Telepon</span>
                        <span className="font-medium text-foreground">{cComp.picPhone || '-'}</span>
                      </div>
                      <div className="flex justify-between mt-1 pt-1.5 border-t border-border/50">
                        <span className="text-foreground-muted">Email</span>
                        <span className="font-medium text-foreground">{cComp.picEmail || '-'}</span>
                      </div>
                    </>
                  )}
                </div>
              </section>

            </div>
          )}

          {activeTab === 'address' && (
            <div className="flex flex-col gap-4">
              <section>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-danger" /> Detail Alamat
                </h4>
                <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                  <div className="flex flex-col gap-0.5 mb-2">
                    <span className="text-foreground-muted">Alamat Lengkap</span>
                    <span className="font-medium text-foreground leading-relaxed mt-0.5">{customer.address || '-'}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span className="text-foreground-muted">Kota</span>
                    <span className="font-medium text-foreground">{customer.city || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Provinsi</span>
                    <span className="font-medium text-foreground">{customer.province || '-'}</span>
                  </div>
                  <div className="flex justify-between mt-1 pt-1.5 border-t border-border/50">
                    <span className="text-foreground-muted">Kode Pos</span>
                    <span className="font-medium text-foreground">{customer.postalCode || '-'}</span>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface flex items-center justify-between">
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onEdit?.(customer)}>
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 text-danger border-danger/30 hover:bg-danger/10 hover:border-danger hover:text-danger" onClick={() => onDelete?.(customer)}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </div>
    </>
  );
}
