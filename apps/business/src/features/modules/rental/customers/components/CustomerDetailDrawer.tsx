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
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '@adatrack/ui';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

interface CustomerDetailDrawerProps {
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

export function CustomerDetailDrawer({ customer, open, onClose, onEdit, onDelete, labels }: CustomerDetailDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!customer) return null;

  const renderStatus = () => {
    const s = customer.status;
    const label = s === 'ACTIVE' ? labels.statusActive : labels.statusInactive;
    const badgeClass = s === 'ACTIVE' 
      ? 'bg-success/10 text-success border border-success/20'
      : 'bg-neutral-100 text-neutral-500 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700';

    return <div className={cn("px-3 py-1 rounded-full text-[11px] font-semibold w-fit", badgeClass)}>{label}</div>;
  };

  const isIndiv = customer.type === 'INDIVIDUAL';
  const cIndiv = customer as IndividualCustomer;
  const cComp = customer as CompanyCustomer;

  return (
    <>
      <div 
        className={cn("fixed inset-0 bg-black/40 z-50 transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={onClose} 
      />
      <aside 
        className={cn("fixed top-0 right-0 h-full w-[300px] sm:w-[360px] bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300", open ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-border/40 bg-background">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold">Detail Pelanggan</h2>
          </div>
          <Button variant="ghost" onClick={onClose} className="h-7 w-7 rounded-full p-0 flex items-center justify-center text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Main Title Area */}
          <div className="px-4 py-3.5 border-b border-border/40 flex justify-between items-start bg-background">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[15px] font-bold text-foreground">{customer.name}</h2>
              <p className="text-xs text-muted-foreground">{customer.code}</p>
            </div>
            {renderStatus()}
          </div>

          <div className="p-4 flex flex-col gap-4">
            
            {/* DATA UTAMA CARD */}
            <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="p-3.5 flex items-center gap-2">
                {isIndiv ? <User className="w-3.5 h-3.5 text-danger" /> : <Building className="w-3.5 h-3.5 text-danger" />}
                <h3 className="text-[11px] font-bold text-danger uppercase tracking-wide">
                  {isIndiv ? labels.tabPersonalInfo : labels.tabCompanyInfo}
                </h3>
              </div>

              <div className="px-3.5 pb-3.5 flex flex-col">
                {isIndiv ? (
                  <>
                    <div className="grid grid-cols-2 py-2 border-b border-border/40">
                      <div className="flex gap-2.5">
                        <CreditCard className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">NIK</span>
                          <span className="text-xs font-semibold">{cIndiv.nik}</span>
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Telepon</span>
                          <span className="text-xs font-semibold">{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b border-border/40">
                      <div className="flex gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Tempat Lahir</span>
                          <span className="text-xs font-semibold">{cIndiv.birthPlace}</span>
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Tanggal Lahir</span>
                          <span className="text-xs font-semibold">{cIndiv.birthDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 py-2">
                      <div className="flex gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Email</span>
                          <span className="text-xs font-semibold">{customer.email || '-'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Foto KTP</span>
                          <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Lihat Foto</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 py-2 border-b border-border/40">
                      <div className="flex gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Telepon</span>
                          <span className="text-xs font-semibold">{customer.phone}</span>
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Email</span>
                          <span className="text-xs font-semibold">{customer.email || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* DATA LEGAL / SIM / NPWP CARD */}
            <div className="border border-border/60 rounded-xl bg-transparent">
              <div className="p-3.5 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-danger" />
                <h3 className="text-[11px] font-bold text-danger uppercase tracking-wide">
                  {isIndiv ? labels.tabSim : labels.tabLegal}
                </h3>
              </div>

              <div className="px-3.5 pb-3.5 flex flex-col">
                {isIndiv ? (
                  <>
                    <div className="grid grid-cols-2 py-2 border-b border-border/40">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Nomor SIM</span>
                        <span className="text-xs font-semibold">{cIndiv.simNumber}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Jenis SIM</span>
                        <span className="text-xs font-semibold">{cIndiv.simType}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Masa Berlaku</span>
                        <span className="text-xs font-semibold">{cIndiv.simExpiredAt}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Foto SIM</span>
                        <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Lihat Foto</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">NIB</span>
                        <span className="text-xs font-semibold">{cComp.nib}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">NPWP</span>
                        <span className="text-xs font-semibold">{cComp.npwp}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* PIC CARD (For Company Only) */}
            {!isIndiv && (
              <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
                <div className="p-3.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-danger" />
                  <h3 className="text-[11px] font-bold text-danger uppercase tracking-wide">{labels.tabPic}</h3>
                </div>
                <div className="px-3.5 pb-3.5 flex flex-col">
                  <div className="grid grid-cols-2 py-2 border-b border-border/40">
                    <div className="flex gap-2.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Nama PIC</span>
                        <span className="text-xs font-semibold">{cComp.picName}</span>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Jabatan</span>
                        <span className="text-xs font-semibold">{cComp.picPosition}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-border/40">
                    <div className="flex gap-2.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">No HP</span>
                        <span className="text-xs font-semibold">{cComp.picPhone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Email</span>
                        <span className="text-xs font-semibold">{cComp.picEmail || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <div className="flex gap-2.5">
                      <CreditCard className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">NIK PIC</span>
                        <span className="text-xs font-semibold">{cComp.picNik}</span>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Foto KTP PIC</span>
                        <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Lihat Foto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ALAMAT CARD */}
            <div className="border border-border/60 rounded-xl bg-transparent">
              <div className="p-3.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-danger" />
                <h3 className="text-[11px] font-bold text-danger uppercase tracking-wide">{labels.tabAddress}</h3>
              </div>
              <div className="px-3.5 pb-3.5 flex flex-col">
                <div className="py-2 border-b border-border/40">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Alamat Lengkap</span>
                    <span className="text-xs font-semibold leading-relaxed">{customer.address}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 py-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Kota</span>
                    <span className="text-xs font-semibold">{customer.city}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Provinsi</span>
                    <span className="text-xs font-semibold">{customer.province}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Kode Pos</span>
                    <span className="text-xs font-semibold">{customer.postalCode}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-3.5 border-t border-border/40 flex justify-between items-center bg-background">
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={onClose} className="bg-white text-foreground">
              Batal
            </Button>
            {onEdit && (
              <Button variant="primary" size="sm" className="bg-danger hover:bg-danger/90 text-white" onClick={() => { onClose(); onEdit(customer); }}>
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
            )}
          </div>
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              title="Hapus"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-8 h-8 shrink-0" 
              onClick={() => { onClose(); onDelete(customer); }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
