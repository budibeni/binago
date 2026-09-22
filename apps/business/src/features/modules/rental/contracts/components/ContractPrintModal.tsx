'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DocumentTemplatePreview, type DocumentTemplate } from '@adatrack/document-template';
import type { RentalContract } from '../types/contract';
import { templateService } from '../../templates/api/templateService';
import { getRentalContractPrintData } from '../utils/printDataProvider';
import { Loader2 } from 'lucide-react';

interface ContractPrintModalProps {
  contract: RentalContract | null;
  open: boolean;
  onClose: () => void;
}

export function ContractPrintModal({ contract, open, onClose }: ContractPrintModalProps) {
  const [activeTemplate, setActiveTemplate] = useState<DocumentTemplate | null>(null);
  const [printData, setPrintData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preparePrint = useCallback(async () => {
    if (!contract || !open) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Resolve Active Template
      const template = await templateService.getActiveContractTemplate();
      setActiveTemplate(template);

      // 2. Build Print Data
      const data = getRentalContractPrintData(contract);
      setPrintData(data);

    } catch (err: any) {
      console.error('Failed to prepare print template:', err);
      setError(err.message || 'Terjadi kesalahan saat menyiapkan cetakan kontrak.');
    } finally {
      setLoading(false);
    }
  }, [contract, open]);

  useEffect(() => {
    if (open) {
      preparePrint();
    } else {
      // Reset state on close
      setActiveTemplate(null);
      setPrintData(null);
      setError(null);
    }
  }, [open, preparePrint]);

  if (!contract || !open) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg flex flex-col items-center shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-4" />
          <p className="font-medium text-neutral-800">Menyiapkan dokumen kontrak...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
          <h3 className="text-lg font-bold text-red-600 mb-2">Gagal Mencetak</h3>
          <p className="text-neutral-700 text-sm mb-6">{error}</p>
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeTemplate || !printData) {
    return null;
  }

  return (
    <DocumentTemplatePreview
      open={open}
      onClose={onClose}
      template={activeTemplate}
      data={printData}
    />
  );
}
