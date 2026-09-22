import type { DocumentTemplate } from '@adatrack/document-template';
import { v4 as uuidv4 } from 'uuid';

const defaultHtml = `
<h2 style="text-align: center">PERJANJIAN SEWA KENDARAAN</h2>
<h3 style="text-align: center">PT. ADATRACK INDONESIA</h3>
<table class="form-table">
  <tbody>
    <tr>
      <td><p><strong>Nomor Kontrak</strong></p></td>
      <td><p>:</p></td>
      <td><p>{{contract.number}}</p></td>
    </tr>
    <tr>
      <td><p><strong>Tanggal</strong></p></td>
      <td><p>:</p></td>
      <td><p>{{contract.contractDate}}</p></td>
    </tr>
  </tbody>
</table>
<p><strong>PIHAK PERTAMA (Yang Menyewakan):</strong></p>
<table class="form-table">
  <tbody>
    <tr><td><p>Nama Perusahaan</p></td><td><p>:</p></td><td><p>{{company.name}}</p></td></tr>
    <tr><td><p>Alamat Lengkap</p></td><td><p>:</p></td><td><p>{{company.address}}</p></td></tr>
    <tr><td><p>No. Telepon</p></td><td><p>:</p></td><td><p>{{company.phone}}</p></td></tr>
    <tr><td><p>Alamat Email</p></td><td><p>:</p></td><td><p>{{company.email}}</p></td></tr>
  </tbody>
</table>
<p><strong>PIHAK KEDUA (Penyewa):</strong></p>
<table class="form-table">
  <tbody>
    <tr><td><p>Nama Lengkap</p></td><td><p>:</p></td><td><p>{{customer.name}}</p></td></tr>
    <tr><td><p>No. Identitas (KTP)</p></td><td><p>:</p></td><td><p>{{customer.identity}}</p></td></tr>
    <tr><td><p>Alamat Lengkap</p></td><td><p>:</p></td><td><p>{{customer.address}}</p></td></tr>
    <tr><td><p>No. Telepon</p></td><td><p>:</p></td><td><p>{{customer.phone}}</p></td></tr>
    <tr><td><p>Alamat Email</p></td><td><p>:</p></td><td><p>{{customer.email}}</p></td></tr>
  </tbody>
</table>
<h3>PASAL 1: KENDARAAN YANG DISEWA</h3>
<p>Pihak Pertama menyewakan kendaraan kepada Pihak Kedua dengan rincian sebagai berikut:</p>
<table class="bordered-table">
  <tbody>
    <tr>
      <th><p><strong>No</strong></p></th>
      <th><p><strong>Merek / Model</strong></p></th>
      <th><p><strong>Plat Nomor</strong></p></th>
      <th><p><strong>Odometer</strong></p></th>
    </tr>
    {{#each vehicles}}
    <tr>
      <td><p>{{no}}</p></td>
      <td><p>{{brand}} {{model}}</p></td>
      <td><p>{{plateNumber}}</p></td>
      <td><p>{{odometer}}</p></td>
    </tr>
    {{/each}}
  </tbody>
</table>
<h3>PASAL 2: PERIODE DAN TARIF SEWA</h3>
<table class="form-table">
  <tbody>
    <tr><td><p>Tipe Rental</p></td><td><p>:</p></td><td><p>{{contract.rentalType}}</p></td></tr>
    <tr><td><p>Tanggal Mulai</p></td><td><p>:</p></td><td><p>{{contract.startDate}}</p></td></tr>
    <tr><td><p>Tanggal Selesai</p></td><td><p>:</p></td><td><p>{{contract.endDate}}</p></td></tr>
  </tbody>
</table>
<p><strong>Rincian Biaya:</strong></p>
<table class="form-table">
  <tbody>
    <tr><td><p>Total Biaya Sewa</p></td><td><p>:</p></td><td><p>{{contract.totalAmount}}</p></td></tr>
    <tr><td><p>Deposit / Jaminan</p></td><td><p>:</p></td><td><p>{{contract.deposit}}</p></td></tr>
    <tr><td><p>Sisa Pembayaran</p></td><td><p>:</p></td><td><p><strong>{{contract.remainingAmount}}</strong></p></td></tr>
  </tbody>
</table>
<h3>PASAL 3: SYARAT DAN KETENTUAN</h3>
<ol>
  <li><p>Kendaraan wajib dikembalikan tepat pada waktunya dan dalam kondisi yang sama seperti saat diserahterimakan.</p></li>
  <li><p>Pihak Kedua bertanggung jawab sepenuhnya atas segala kerusakan, kehilangan, atau kecelakaan selama masa sewa.</p></li>
  <li><p>Segala bentuk pelanggaran lalu lintas dan denda yang ditimbulkan menjadi tanggung jawab Pihak Kedua.</p></li>
</ol>
<table class="form-table">
  <tbody>
    <tr><td><p>Ketentuan Khusus</p></td><td><p>:</p></td><td><p>{{contract.terms}}</p></td></tr>
    <tr><td><p>Catatan Tambahan</p></td><td><p>:</p></td><td><p>{{contract.notes}}</p></td></tr>
  </tbody>
</table>
<p><em>Demikian Perjanjian ini dibuat dalam keadaan sadar dan tanpa paksaan dari pihak manapun.</em></p>
<table class="borderless-table">
  <tbody>
    <tr>
      <td>
        <p style="text-align: center"><strong>PIHAK PERTAMA</strong></p>
        <p></p>
        <p></p>
        <p style="text-align: center"><strong>( _________________________ )</strong></p>
        <p style="text-align: center">PT. ADATRACK INDONESIA</p>
      </td>
      <td>
        <p style="text-align: center"><strong>PIHAK KEDUA</strong></p>
        <p></p>
        <p></p>
        <p style="text-align: center"><strong>( _________________________ )</strong></p>
        <p style="text-align: center">Penyewa</p>
      </td>
    </tr>
  </tbody>
</table>
`;

export const DEFAULT_RENTAL_CONTRACT_TEMPLATE: DocumentTemplate = {
  id: 'default-rental-contract',
  name: 'Default Kontrak Rental',
  documentType: 'RENTAL_CONTRACT',
  sourceType: 'SYSTEM',
  isDefault: true,
  status: 'ACTIVE',
  contentHtml: defaultHtml,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// In-memory mock storage
let mockTemplates: DocumentTemplate[] = [];

export const templateService = {
  getContractTemplates: async (): Promise<DocumentTemplate[]> => {
    // If there is an active custom template, default is inactive. Otherwise default is active.
    const hasActiveCustom = mockTemplates.some(t => t.status === 'ACTIVE');
    const resolvedDefault: DocumentTemplate = {
      ...DEFAULT_RENTAL_CONTRACT_TEMPLATE,
      status: hasActiveCustom ? 'INACTIVE' : 'ACTIVE',
    };
    return [resolvedDefault, ...mockTemplates];
  },

  getActiveContractTemplate: async (): Promise<DocumentTemplate> => {
    const activeCustom = mockTemplates.find(t => t.status === 'ACTIVE');
    if (activeCustom) {
      return activeCustom;
    }
    return DEFAULT_RENTAL_CONTRACT_TEMPLATE;
  },

  createContractTemplate: async (name: string, contentHtml: string): Promise<DocumentTemplate> => {
    return new Promise((resolve) => {
      const newTemplate: DocumentTemplate = {
        id: uuidv4(),
        name,
        documentType: 'RENTAL_CONTRACT',
        sourceType: 'CUSTOM',
        isDefault: false,
        status: 'INACTIVE', // custom template is inactive by default
        contentHtml,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockTemplates.push(newTemplate);
      resolve(newTemplate);
    });
  },

  activateContractTemplate: async (id: string): Promise<void> => {
    if (id === DEFAULT_RENTAL_CONTRACT_TEMPLATE.id) {
      // Activating default means deactivating all custom templates
      mockTemplates = mockTemplates.map(t => ({ ...t, status: 'INACTIVE' }));
      return;
    }
    
    mockTemplates = mockTemplates.map(t => ({
      ...t,
      status: t.id === id ? 'ACTIVE' : 'INACTIVE'
    }));
  },

  deactivateContractTemplate: async (id: string): Promise<void> => {
    if (id === DEFAULT_RENTAL_CONTRACT_TEMPLATE.id) {
      throw new Error('Template default tidak dapat dinonaktifkan.');
    }
    mockTemplates = mockTemplates.map(t => {
      if (t.id === id) {
        return { ...t, status: 'INACTIVE' };
      }
      return t;
    });
  },

  deleteContractTemplate: async (id: string): Promise<void> => {
    if (id === DEFAULT_RENTAL_CONTRACT_TEMPLATE.id) {
      throw new Error('Template default tidak dapat dihapus.');
    }
    mockTemplates = mockTemplates.filter(t => t.id !== id);
  },
};
