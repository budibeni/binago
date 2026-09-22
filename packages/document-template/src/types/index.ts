export type DocumentSourceType = 'SYSTEM' | 'CUSTOM';
export type DocumentStatus = 'ACTIVE' | 'INACTIVE';
export type DocumentType = string;

export interface DocumentTemplate {
  id: string;
  name: string;
  documentType: DocumentType;
  sourceType: DocumentSourceType;
  /** Nama file (misal: kontrak-sewa.docx) - Boleh kosong jika dibuat dari Editor Web */
  fileName?: string;
  status: DocumentStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Storage reference depends on host implementation (could be URL, file path, base64)
  /** URL atau path storage referensi file - Boleh kosong jika dibuat dari Editor Web */
  storageRef?: string;
  /** Konten HTML Murni dari Web Editor (opsional jika masih memakai sistem lama) */
  contentHtml?: string;
}

export interface DocumentTemplateMetadata {
  name: string;
  documentType: DocumentType;
  fileName: string;
  sizeBytes: number;
}
