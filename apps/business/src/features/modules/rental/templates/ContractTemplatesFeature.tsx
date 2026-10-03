'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentTemplatePage, DocumentTemplateEditor, DocumentTemplatePreview, type DocumentTemplate } from '@adatrack/document-template';
import { templateService, DEFAULT_RENTAL_CONTRACT_TEMPLATE } from './api/templateService';
import { FormShell } from '@adatrack/ui';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { templateTranslations } from './i18n';

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
  const locale = useBusinessLocale();
  const t = templateTranslations[locale as keyof typeof templateTranslations] || templateTranslations.id;

  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  // Ref to trigger save from FormShell footer
  const editorSaveRef = useRef<(() => Promise<void>) | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getContractTemplates();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message || t.errLoad);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreateClick = () => {
    setEditingTemplate(null);
    setIsCopying(false);
    setIsEditorOpen(true);
  };

  const handleCopyClick = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setIsCopying(true);
    setIsEditorOpen(true);
  };

  const handleEditClick = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setIsCopying(false);
    setIsEditorOpen(true);
  };

  const handleEditorSave = async (name: string, contentHtml: string) => {
    if (editingTemplate && !isCopying) {
      await templateService.updateContractTemplate(editingTemplate.id, name, contentHtml);
    } else {
      await templateService.createContractTemplate(name, contentHtml);
    }
    await fetchTemplates();
    setIsEditorOpen(false);
    setEditingTemplate(null);
  };

  const handleFormShellSave = async () => {
    if (editorSaveRef.current) {
      setIsSaving(true);
      try {
        await editorSaveRef.current();
      } finally {
        setIsSaving(false);
      }
    }
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

  const handleEditorCancel = () => {
    setIsEditorOpen(false);
    setEditingTemplate(null);
  };

  return (
    <>
      <DocumentTemplatePage
        title={t.pageTitle}
        description={t.pageSubtitle}
        templates={templates}
        documentType="RENTAL_CONTRACT"
        isLoading={loading}
        onUploadClick={handleCreateClick}
        onPreview={handlePreview}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
        onCopy={handleCopyClick}
        onEdit={handleEditClick}
        labels={t}
      />

      <FormShell
        layout="default"
        open={isEditorOpen}
        onOpenChange={(open) => { if (!open) handleEditorCancel(); }}
        title={editingTemplate && !isCopying ? t.editorTitleEdit : t.editorTitleNew}
        onCancel={handleEditorCancel}
        onSave={handleFormShellSave}
        saveText={isSaving ? t.btnSaving : t.btnSave}
        cancelText={t.btnCancel}
        isSubmitting={isSaving}
      >
        {isEditorOpen && (
          <DocumentTemplateEditor
            documentType="RENTAL_CONTRACT"
            initialContent={editingTemplate ? editingTemplate.contentHtml : DEFAULT_RENTAL_CONTRACT_TEMPLATE.contentHtml}
            initialName={editingTemplate ? (isCopying ? `${editingTemplate.name} (Copy)` : editingTemplate.name) : t.defaultRentalContract}
            onSave={handleEditorSave}
            onSaveRef={editorSaveRef}
            hideFooter={true}
            labels={t}
          />
        )}
      </FormShell>

      <DocumentTemplatePreview
        open={!!previewTemplate}
        onClose={() => {
          setPreviewTemplate(null);
        }}
        template={previewTemplate}
        data={PREVIEW_MOCK_DATA}
        titleFallback={t.previewTitle}
      />
    </>
  );
}
