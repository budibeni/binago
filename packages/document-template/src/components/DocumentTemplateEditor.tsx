import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button, Alert } from '@adatrack/ui';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight, Table as TableIcon, Save, Undo, Redo, Heading1, Heading2, Heading3, List, ListOrdered, Minus, LayoutGrid } from 'lucide-react';

const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'bordered-table',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          return {
            class: attributes.class,
          }
        },
      },
    }
  },
})

export interface DocumentTemplateEditorProps {
  initialContent?: string;
  initialName?: string;
  onSave: (name: string, contentHtml: string) => Promise<void>;
  onCancel?: () => void;
  documentType: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-neutral-200 bg-neutral-50 rounded-t-md items-center">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-neutral-200' : ''}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-neutral-200' : ''}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-neutral-200' : ''}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-neutral-200' : ''}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-neutral-200' : ''}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-neutral-200' : ''}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-neutral-200' : ''}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-neutral-200' : ''}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-neutral-200' : ''}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-neutral-200' : ''}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-neutral-200' : ''}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-neutral-200' : ''}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Line"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-neutral-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).updateAttributes('table', { class: 'bordered-table' }).run();
        }}
        title="Insert Table"
      >
        <TableIcon className="w-4 h-4 mr-2" />
        Sisip Tabel
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.chain().focus().insertTable({ rows: 2, cols: 3, withHeaderRow: false }).updateAttributes('table', { class: 'form-table' }).run();
        }}
        title="Layout Formulir Tanpa Garis"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Tabel Form
      </Button>
      
      {/* Table Utils (Only show when table is active) */}
      {editor.isActive('table') && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            + Kolom
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            + Baris
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Hapus Tabel
          </Button>
        </>
      )}
    </div>
  );
};

export function DocumentTemplateEditor({
  initialContent = '',
  initialName = '',
  onSave,
  onCancel,
  documentType
}: DocumentTemplateEditorProps) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CustomTable.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent || '<p>Ketik dokumen Anda di sini...</p>',
    editorProps: {
      attributes: {
        className: 'document-template-content focus:outline-none min-h-[400px] p-6 bg-white rounded-b-md border-x border-b border-neutral-200',
      },
    },
  });

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Nama template tidak boleh kosong.');
      return;
    }
    if (!editor) return;

    try {
      setIsSaving(true);
      setError(null);
      const htmlContent = editor.getHTML();
      await onSave(name.trim(), htmlContent);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan template.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-neutral-200 shadow-sm shrink-0">
        <div>
          <label htmlFor="template-name" className="block text-sm font-semibold text-neutral-700 mb-1">
            Nama Template <span className="text-red-500">*</span>
          </label>
          <input
            id="template-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm border border-neutral-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Kontrak Rental PT ABC"
            disabled={isSaving}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1">
            Tipe Dokumen
          </label>
          <input
            type="text"
            value={documentType}
            disabled
            className="w-full text-sm border border-neutral-300 rounded-md px-2 py-1.5 bg-neutral-100 text-neutral-500 cursor-not-allowed"
          />
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="shrink-0">
          <span>{error}</span>
        </Alert>
      )}

      <div className="flex flex-col flex-grow shadow-sm overflow-hidden border border-neutral-200 rounded-lg">
        <div className="shrink-0">
          <MenuBar editor={editor} />
        </div>
        <div className="editor-container overflow-y-auto flex-grow bg-neutral-100 p-3 relative">
            <style dangerouslySetInnerHTML={{ __html: `
              .document-template-content, .tiptap, .ProseMirror {
                font-family: "Times New Roman", Times, serif;
                color: #000;
                line-height: 1.3;
                font-size: 12pt;
              }
              .document-template-content h2, .tiptap h2 { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 0.5em; text-transform: uppercase; }
              .document-template-content h3, .tiptap h3 { font-size: 12pt; font-weight: bold; margin-top: 1em; margin-bottom: 0.25em; }
              .document-template-content h3[style*="text-align: center"], .tiptap h3[style*="text-align: center"] { font-size: 14pt; }
              .document-template-content p, .tiptap p { margin-bottom: 0.25em; margin-top: 0; }
              .document-template-content table, .tiptap table { width: 100%; border-collapse: collapse; margin-top: 1em; margin-bottom: 1em; }
              .document-template-content table.bordered-table th, .document-template-content table.bordered-table td, .tiptap table.bordered-table th, .tiptap table.bordered-table td { border: 1px solid #000; padding: 8px; vertical-align: top; text-align: left; }
              .document-template-content table.borderless-table th, .document-template-content table.borderless-table td, .tiptap table.borderless-table th, .tiptap table.borderless-table td { border: 1px dashed #ccc; padding: 2px 8px; vertical-align: top; text-align: left; }
              
              /* FORM TABLE (Perfect Colon Alignment) */
              .document-template-content table.form-table, .tiptap table.form-table { table-layout: fixed; }
              .document-template-content table.form-table th, .document-template-content table.form-table td, .tiptap table.form-table th, .tiptap table.form-table td { border: 1px dashed #ccc; padding: 2px 8px; vertical-align: top; text-align: left; }
              .document-template-content table.form-table td:first-child, .tiptap table.form-table td:first-child { width: 28%; }
              .document-template-content table.form-table td:nth-child(2), .tiptap table.form-table td:nth-child(2) { width: 3%; text-align: center; }
              .document-template-content table.form-table td:nth-child(3), .tiptap table.form-table td:nth-child(3) { width: 69%; }

              .document-template-content table.bordered-table th, .tiptap table.bordered-table th { background-color: #f3f4f6; font-weight: bold; }
              .document-template-content ol, .document-template-content ul, .tiptap ol, .tiptap ul { margin-top: 0.5em; margin-bottom: 1em; padding-left: 2em; }
              .document-template-content li, .tiptap li { margin-bottom: 0.5em; }
              .document-template-content p:empty::before, .tiptap p:empty::before { content: ""; display: inline-block; }
              
              /* TipTap specific table styles for resizer */
              .tiptap table { table-layout: fixed; }
              .tiptap table td, .tiptap table th { position: relative; }
              .tiptap table .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: 0; width: 4px; z-index: 20; background-color: #adf; pointer-events: none; }
              .tiptap.resize-cursor { cursor: ew-resize; cursor: col-resize; }
            `}} />
            <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-2 pt-2 border-t border-neutral-200 shrink-0">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Batal
          </Button>
        )}
        <Button 
          onClick={handleSave} 
          disabled={!name.trim() || isSaving}
          loading={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Menyimpan...' : 'Simpan Template'}
        </Button>
      </div>
    </div>
  );
}
