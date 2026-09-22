import React, { useState, useEffect } from 'react';
import { PrintShell, Spinner, Alert } from '@adatrack/ui';
import { AlertCircle } from 'lucide-react';
import { HtmlEngine } from '../engine/HtmlEngine';
import { DocumentTemplate } from '../types';

export interface DocumentTemplatePreviewProps {
  /** The open state controlled by the parent */
  open: boolean;
  /** Callback fired when the preview/print dialog is closed */
  onClose: () => void;
  /** The template metadata */
  template: DocumentTemplate | null;
  /** The generic JSON data to merge into the template placeholders */
  data: Record<string, unknown>;
  /** Optional paper size (default to 'auto' to let OS reflow natively) */
  paperSize?: 'A4' | 'LETTER' | 'LEGAL' | 'auto';
  /** Optional page orientation */
  orientation?: 'portrait' | 'landscape';
  /** Margin for the print layout */
  margin?: string;
}

export function DocumentTemplatePreview({
  open,
  onClose,
  template,
  data,
  paperSize = 'auto',
  orientation = 'portrait',
  margin = '15mm'
}: DocumentTemplatePreviewProps) {
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !template?.contentHtml) {
      setRenderedHtml(null);
      return;
    }

    let isMounted = true;
    
    const processTemplate = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use HtmlEngine to compile Handlebars placeholders and sanitize
        const html = HtmlEngine.renderTemplate(template.contentHtml!, data);
        
        if (isMounted) {
          setRenderedHtml(html);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Gagal merender dokumen.');
          setRenderedHtml(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    processTemplate();

    return () => {
      isMounted = false;
    };
  }, [open, template, data]);

  if (error && open) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white p-8 flex flex-col items-center justify-center">
        <Alert variant="danger" className="max-w-md w-full">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error Merender Dokumen</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </Alert>
        <button 
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-md text-sm font-medium transition-colors"
        >
          Tutup
        </button>
      </div>
    );
  }

  if (isLoading && open) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <Spinner className="w-10 h-10 text-blue-600 mb-4" />
        <p className="text-sm font-medium text-neutral-600">Sedang memproses dokumen...</p>
      </div>
    );
  }

  const printStyles = `
    .document-template-content {
      font-family: "Times New Roman", Times, serif;
      color: #000;
      line-height: 1.5;
      font-size: 12pt;
    }
    .document-template-content h2 { 
      text-align: center; 
      font-size: 16pt; 
      font-weight: bold; 
      margin-bottom: 0.5em; 
      text-transform: uppercase;
    }
    .document-template-content h3 { 
      font-size: 12pt; 
      font-weight: bold; 
      margin-top: 1em; 
      margin-bottom: 0.25em; 
    }
    .document-template-content h3[style*="text-align: center"] {
      font-size: 14pt;
    }
    .document-template-content p { 
      margin-bottom: 0.25em; 
      margin-top: 0; 
      line-height: 1.3;
    }
    .document-template-content table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1em;
      margin-bottom: 1em;
    }
    .document-template-content table.bordered-table th,
    .document-template-content table.bordered-table td {
      border: 1px solid #000;
      padding: 8px;
      vertical-align: top;
      text-align: left;
    }
    .document-template-content table.borderless-table th,
    .document-template-content table.borderless-table td {
      border: none;
      padding: 2px 8px;
      vertical-align: top;
      text-align: left;
    }
    
    /* FORM TABLE (Perfect Colon Alignment) */
    .document-template-content table.form-table {
      table-layout: fixed;
    }
    .document-template-content table.form-table th,
    .document-template-content table.form-table td {
      border: none;
      padding: 2px 8px;
      vertical-align: top;
      text-align: left;
    }
    .document-template-content table.form-table td:first-child { width: 28%; }
    .document-template-content table.form-table td:nth-child(2) { width: 3%; text-align: center; }
    .document-template-content table.form-table td:nth-child(3) { width: 69%; }

    .document-template-content table.bordered-table th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    .document-template-content ol, .document-template-content ul {
      margin-top: 0.5em;
      margin-bottom: 1em;
      padding-left: 2em;
    }
    .document-template-content li {
      margin-bottom: 0.5em;
    }
    .document-template-content p:empty::before {
      content: "";
      display: inline-block;
    }
  `;

  // Once the HTML is successfully rendered, we pass it to the existing PrintShell!
  if (open && renderedHtml) {
    return (
      <PrintShell
        open={open}
        onClose={onClose}
        title={template?.name || 'Dokumen'}
        paperSize={paperSize}
        orientation={orientation}
        margin={margin}
      >
        <style dangerouslySetInnerHTML={{ __html: printStyles }} />
        <div 
          className="document-template-content print-break-inside-avoid"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </PrintShell>
    );
  }

  return null;
}
