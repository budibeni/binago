import React, { useMemo, useState } from 'react';
import { 
  DataTable, 
  DataTableColumnDef, 
  Badge,
  Button,
  Dialog,
} from '@adatrack/ui';
import { FileText, MoreVertical, Trash2, CheckCircle, XCircle, Eye, UploadCloud } from 'lucide-react';
import { DocumentTemplate, DocumentType } from '../types';

export interface DocumentTemplatePageProps {
  documentType: DocumentType;
  title?: string;
  description?: string;
  templates: DocumentTemplate[];
  isLoading?: boolean;
  onUploadClick: () => void;
  onPreview: (template: DocumentTemplate) => void;
  onActivate: (template: DocumentTemplate) => Promise<void>;
  onDeactivate: (template: DocumentTemplate) => Promise<void>;
  onDelete: (template: DocumentTemplate) => Promise<void>;
}

export function DocumentTemplatePage({
  documentType,
  title = 'Manajemen Template Dokumen',
  description = 'Kelola template dokumen yang akan digunakan oleh sistem untuk dicetak.',
  templates,
  isLoading = false,
  onUploadClick,
  onPreview,
  onActivate,
  onDeactivate,
  onDelete
}: DocumentTemplatePageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<DocumentTemplate | null>(null);

  const columns = useMemo<DataTableColumnDef<DocumentTemplate>[]>(
    () => [
      {
        id: 'name',
        header: 'Nama Template',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <span className="font-semibold text-neutral-800">{row.original.name}</span>
            {row.original.isDefault && (
              <Badge variant="default" className="text-xs ml-2 bg-neutral-100">
                Default
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: 'sourceType',
        header: 'Sumber',
        accessorKey: 'sourceType',
        cell: ({ row }) => (
          <Badge variant={row.original.sourceType === 'SYSTEM' ? 'info' : 'default'}>
            {row.original.sourceType === 'SYSTEM' ? 'Sistem' : 'Kustom'}
          </Badge>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge 
            variant={row.original.status === 'ACTIVE' ? 'success' : 'default'}
            className={row.original.status === 'INACTIVE' ? 'bg-neutral-200 text-neutral-700 border-none' : ''}
          >
            {row.original.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
          </Badge>
        ),
      },
      {
        id: 'updatedAt',
        header: 'Diperbarui',
        accessorKey: 'updatedAt',
        cell: ({ row }) => {
          const date = new Date(row.original.updatedAt);
          return (
            <span className="text-sm text-neutral-600">
              {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const template = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPreview(template)}
                title="Pratinjau Template"
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              {template.status === 'INACTIVE' ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={async () => {
                    setIsProcessing(true);
                    await onActivate(template);
                    setIsProcessing(false);
                  }}
                  disabled={isProcessing}
                  title="Aktifkan Template"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Aktifkan
                </Button>
              ) : (
                // Only allow deactivation if it's not the default system template
                // Or if it is custom
                !template.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={async () => {
                      setIsProcessing(true);
                      await onDeactivate(template);
                      setIsProcessing(false);
                    }}
                    disabled={isProcessing}
                    title="Nonaktifkan Template"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Nonaktifkan
                  </Button>
                )
              )}

              {!template.isDefault && template.sourceType !== 'SYSTEM' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setTemplateToDelete(template)}
                  disabled={isProcessing}
                  title="Hapus Template"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onPreview, onActivate, onDeactivate, isProcessing]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
        <Button onClick={onUploadClick} className="bg-blue-600 hover:bg-blue-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Buat Template Baru
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <DataTable
          data={templates}
          columns={columns}
          isLoading={isLoading}
          emptyTitle="Tidak Ada Template"
          emptyDescription="Belum ada template dokumen yang tersedia."
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!templateToDelete} 
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
        title="Hapus Template?"
        description={`Apakah Anda yakin ingin menghapus template ${templateToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setTemplateToDelete(null)} disabled={isProcessing}>
            Batal
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={async () => {
              if (templateToDelete) {
                setIsProcessing(true);
                await onDelete(templateToDelete);
                setIsProcessing(false);
                setTemplateToDelete(null);
              }
            }}
            disabled={isProcessing}
            loading={isProcessing}
          >
            Ya, Hapus
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
