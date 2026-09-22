'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DocumentTemplatePage, DocumentTemplateEditor, DocumentTemplatePreview, type DocumentTemplate } from '@adatrack/document-template';
import { templateService, DEFAULT_RENTAL_CONTRACT_TEMPLATE } from './api/templateService';
import { Dialog } from '@adatrack/ui';

const PREVIEW_MOCK_DATA = {
  company: {
    name: "PT. ADATRACK INDONESIA",
    address: "Jl. Contoh Raya No. 123, Jakarta Selatan",
    phone: "021-12345678",
    email: "info@adatrack.id"
  },
  contract: {
    number: "CTR-DEMO-001",
    contractDate: "23 September 2026",
    startDate: "25 September 2026",
    endDate: "30 September 2026",
    rentalType: "Lepas Kunci",
    rateType: "Daily",
    totalAmount: "Rp 3.000.000",
    deposit: "Rp 1.000.000",
    remainingAmount: "Rp 2.000.000",
    driverFee: "-",
    notes: "Catatan demo",
    terms: "Syarat dan ketentuan demo"
  },
  customer: {
    name: "PT Contoh Indonesia",
    type: "COMPANY",
    phone: "08123456789",
    email: "customer@example.com",
    address: "Jakarta",
    identity: "-"
  },
  vehicles: [
    { no: 1, brand: "Toyota", model: "Innova", plateNumber: "B 1234 ABC", odometer: "10.000" },
    { no: 2, brand: "Mitsubishi", model: "Xpander", plateNumber: "B 5678 DEF", odometer: "25.000" }
  ]
};

export function ContractTemplatesFeature() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getContractTemplates();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat template.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreateClick = () => {
    setIsEditorOpen(true);
  };

  const handleEditorSave = async (name: string, contentHtml: string) => {
    await templateService.createContractTemplate(name, contentHtml);
    await fetchTemplates();
    setIsEditorOpen(false);
  };

  const handlePreview = async (template: DocumentTemplate) => {
    setPreviewTemplate(template);
  };

  const handleActivate = async (template: DocumentTemplate) => {
    await templateService.activateContractTemplate(template.id);
    await fetchTemplates();
  };

  const handleDeactivate = async (template: DocumentTemplate) => {
    await templateService.deactivateContractTemplate(template.id);
    await fetchTemplates();
  };

  const handleDelete = async (template: DocumentTemplate) => {
    await templateService.deleteContractTemplate(template.id);
    await fetchTemplates();
  };

  return (
    <>
      <DocumentTemplatePage
        title="Template Kontrak"
        description="Kelola template dokumen kontrak rental yang digunakan saat pencetakan."
        templates={templates}
        documentType="RENTAL_CONTRACT"
        isLoading={loading}
        onUploadClick={handleCreateClick} // Overriding "Upload" behavior with "Create"
        onPreview={handlePreview}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />

      <Dialog 
        open={isEditorOpen} 
        onOpenChange={setIsEditorOpen}
        title="Buat Template Baru"
        description="Desain template dokumen Anda menggunakan editor di bawah ini."
        className="max-w-[100vw] w-screen h-screen rounded-none p-4 md:p-6 flex flex-col"
      >
        <div className="pt-2 flex-grow flex flex-col overflow-hidden">
          {isEditorOpen && (
            <DocumentTemplateEditor
              documentType="RENTAL_CONTRACT"
              initialContent={DEFAULT_RENTAL_CONTRACT_TEMPLATE.contentHtml}
              onSave={handleEditorSave}
              onCancel={() => setIsEditorOpen(false)}
            />
          )}
        </div>
      </Dialog>

      <DocumentTemplatePreview
        open={!!previewTemplate}
        onClose={() => {
          setPreviewTemplate(null);
        }}
        template={previewTemplate}
        data={PREVIEW_MOCK_DATA}
      />
    </>
  );
}
