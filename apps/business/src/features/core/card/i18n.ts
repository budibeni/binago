import type { Locale } from '@adatrack/types';

export const cardDictionaries = {
  id: {
    searchPlaceholder: 'Cari card...',
    filter: {
      title: 'Filter Card',
      clearAll: 'Reset',
      allStatus: 'Semua Status',
      allType: 'Semua Jenis',
      status: 'Status',
      type: 'Jenis',
      active: 'Aktif',
      inactive: 'Tidak Aktif',
    },
    table: {
      colCard: 'Card',
      colType: 'Tipe',
      colUid: 'UID / Nomor Kartu',
      colPurpose: 'Penggunaan',
      colStatus: 'Status',
      colUpdatedAt: 'Diperbarui',
      colActions: 'Aksi',
      emptyTitle: 'Belum ada card',
      emptyDescription: 'Belum ada card yang terdaftar. Registrasi card dilakukan melalui aplikasi Admin.',
      noResultTitle: 'Tidak ada hasil',
      noResultDescription: 'Coba ubah kata kunci atau filter.',
    },
    actions: {
      editCard: 'Edit Card',
    },
    purpose: {
      ATTENDANCE: 'Absensi',
      CHECKER: 'Checker',
      ENGINE_AUTH: 'Menghidupkan Mesin',
    },
    status: {
      ACTIVE: 'Aktif',
      INACTIVE: 'Tidak Aktif',
    },
    form: {
      title: 'Edit Card',
      sectionInfo: 'Informasi Card',
      descInfo: 'Identitas dan nomor kartu.',
      sectionUsage: 'Penggunaan & Status',
      descUsage: 'Fungsi dan status aktif kartu.',
      labelUid: 'UID / Nomor Kartu',
      helpUid: 'UID hanya dapat diubah melalui aplikasi Admin.',
      labelType: 'Jenis Card',
      helpType: 'Jenis card hanya dapat diubah melalui aplikasi Admin.',
      labelName: 'Nama Card',
      placeholderName: 'Contoh: CARD-DRV-001',
      labelPurposes: 'Penggunaan Kartu',
      labelStatus: 'Status',
      labelNotes: 'Catatan',
      placeholderNotes: 'Tambahkan catatan (opsional)',
      typeOptions: [
        { value: 'RFID', label: 'RFID' },
        { value: 'NFC', label: 'NFC' },
      ],
      purposeOptions: [
        { value: 'ATTENDANCE', label: 'Absensi' },
        { value: 'CHECKER', label: 'Checker' },
        { value: 'ENGINE_AUTH', label: 'Menghidupkan Mesin' },
      ],
      statusOptions: [
        { value: 'ACTIVE', label: 'Aktif' },
        { value: 'INACTIVE', label: 'Tidak Aktif' },
      ],
    },
  },
  en: {
    searchPlaceholder: 'Search card...',
    filter: {
      title: 'Filter Card',
      clearAll: 'Reset',
      allStatus: 'All Status',
      allType: 'All Types',
      status: 'Status',
      type: 'Type',
      active: 'Active',
      inactive: 'Inactive',
    },
    table: {
      colCard: 'Card',
      colType: 'Type',
      colUid: 'UID / Card Number',
      colPurpose: 'Purpose',
      colStatus: 'Status',
      colUpdatedAt: 'Updated',
      colActions: 'Actions',
      emptyTitle: 'No cards yet',
      emptyDescription: 'No cards have been registered. Card registration is done through the Admin application.',
      noResultTitle: 'No results',
      noResultDescription: 'Try changing the search keyword or filters.',
    },
    actions: {
      editCard: 'Edit Card',
    },
    purpose: {
      ATTENDANCE: 'Attendance',
      CHECKER: 'Checker',
      ENGINE_AUTH: 'Engine Authorization',
    },
    status: {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
    },
    form: {
      title: 'Edit Card',
      sectionInfo: 'Card Information',
      descInfo: 'Card identity and number.',
      sectionUsage: 'Usage & Status',
      descUsage: 'Card function and active status.',
      labelUid: 'UID / Card Number',
      helpUid: 'UID can only be changed through the Admin application.',
      labelType: 'Card Type',
      helpType: 'Card type can only be changed through the Admin application.',
      labelName: 'Card Name',
      placeholderName: 'E.g., CARD-DRV-001',
      labelPurposes: 'Card Usage',
      labelStatus: 'Status',
      labelNotes: 'Notes',
      placeholderNotes: 'Add notes (optional)',
      typeOptions: [
        { value: 'RFID', label: 'RFID' },
        { value: 'NFC', label: 'NFC' },
      ],
      purposeOptions: [
        { value: 'ATTENDANCE', label: 'Attendance' },
        { value: 'CHECKER', label: 'Checker' },
        { value: 'ENGINE_AUTH', label: 'Engine Authorization' },
      ],
      statusOptions: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
      ],
    },
  },
};

export function getCardTranslation(locale: Locale = 'id') {
  return cardDictionaries[locale] ?? cardDictionaries.id;
}
