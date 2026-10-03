import React, { useMemo, useState } from 'react';
import { 
  DataTable, 
  DataTableColumnDef, 
  Badge,
  Button,
  Dialog,
} from '@adatrack/ui';
import { FileText, MoreVertical, Trash2, CheckCircle, XCircle, Eye, UploadCloud, Copy, Edit } from 'lucide-react';
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
  onCopy?: (template: DocumentTemplate) => void;
  onEdit?: (template: DocumentTemplate) => void;
  labels?: Record<string, string>;
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
  onDelete,
  onCopy,
  onEdit,
  labels = {}
}: DocumentTemplatePageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<DocumentTemplate | null>(null);
  const [search, setSearch] = useState('');

  const t = (key: string, fallback: string) => labels[key] || fallback;

  const columns = useMemo<DataTableColumnDef<DocumentTemplate>[]>(
    () => [
      {
        id: 'name',
        header: t('colName', 'Nama Template'),
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span className="font-semibold text-foreground">{row.original.name}</span>
            {row.original.isDefault && (
              <Badge variant="default" className="text-xs ml-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {t('badgeDefault', 'Default')}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: 'sourceType',
        header: t('colSource', 'Sumber'),
        accessorKey: 'sourceType',
        cell: ({ row }) => (
          <Badge variant={row.original.sourceType === 'SYSTEM' ? 'info' : 'default'}>
            {row.original.sourceType === 'SYSTEM' ? t('sourceSystem', 'Sistem') : t('sourceCustom', 'Kustom')}
          </Badge>
        ),
      },
      {
        id: 'status',
        header: t('colStatus', 'Status'),
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge 
            variant={row.original.status === 'ACTIVE' ? 'success' : 'default'}
            className={row.original.status === 'INACTIVE' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-none' : ''}
          >
            {row.original.status === 'ACTIVE' ? t('statusActive', 'Aktif') : t('statusInactive', 'Nonaktif')}
          </Badge>
        ),
      },
      {
        id: 'updatedAt',
        header: t('colUpdatedAt', 'Diperbarui'),
        accessorKey: 'updatedAt',
        cell: ({ row }) => {
          const date = new Date(row.original.updatedAt);
          return (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {date.toLocaleDateString(t('locale', 'id-ID'), { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: t('colActions', 'Aksi'),
        cell: ({ row }) => {
          const template = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPreview(template)}
                title={t('btnPreview', 'Pratinjau Template')}
              >
                <Eye className="w-4 h-4" />
              </Button>

              {onCopy && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(template)}
                  title={t('btnDuplicate', 'Duplikat Template')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}

              {onEdit && !template.isDefault && template.sourceType !== 'SYSTEM' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  onClick={() => onEdit(template)}
                  title={t('btnEdit', 'Edit Template')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              
              {template.status === 'INACTIVE' ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                  onClick={async () => {
                    setIsProcessing(true);
                    await onActivate(template);
                    setIsProcessing(false);
                  }}
                  disabled={isProcessing}
                  title={t('btnActivate', 'Aktifkan Template')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {t('lblActivate', 'Aktifkan')}
                </Button>
              ) : (
                // Only allow deactivation if it's not the default system template
                // Or if it is custom
                !template.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                    onClick={async () => {
                      setIsProcessing(true);
                      await onDeactivate(template);
                      setIsProcessing(false);
                    }}
                    disabled={isProcessing}
                    title={t('btnDeactivate', 'Nonaktifkan Template')}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    {t('lblDeactivate', 'Nonaktifkan')}
                  </Button>
                )
              )}

              {!template.isDefault && template.sourceType !== 'SYSTEM' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                  onClick={() => setTemplateToDelete(template)}
                  disabled={isProcessing}
                  title={t('btnDelete', 'Hapus Template')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onPreview, onActivate, onDeactivate, isProcessing, labels]
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <DataTable
          className="border-none shadow-none h-full"
          data={templates}
          columns={columns}
          isLoading={isLoading}
          searchable
          sortable
          pagination
          columnVisibility
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('searchPlaceholder', 'Cari template...')}
          emptyTitle={t('emptyTitle', 'Tidak Ada Template')}
          emptyDescription={t('emptyDesc', 'Belum ada template dokumen yang tersedia.')}
          toolbarActions={
            <Button variant="destructive" onClick={onUploadClick} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{t('btnCreate', 'Buat Template Baru')}</span>
            </Button>
          }
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!templateToDelete} 
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
        title={t('confirmDeleteTitle', 'Hapus Template?')}
        description={t('confirmDeleteDesc', `Apakah Anda yakin ingin menghapus template ${templateToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`)}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setTemplateToDelete(null)} disabled={isProcessing}>
            {t('btnCancel', 'Batal')}
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
            {t('btnConfirmDelete', 'Ya, Hapus')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
