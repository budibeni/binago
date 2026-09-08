export function getPersonelTranslation(locale: 'id' | 'en') {
  if (locale === 'en') {
    return {
      pageTitle: 'Personel',
      pageSubtitle: 'Manage personel data and assignments',
      
      addPersonel: 'Add Personel',
      exportFilename: 'personel-adatrack',
      searchPlaceholder: 'Search name, NIK, or phone...',
      clearFilters: 'Clear Filters',
      
      filterStatus: 'Status',
      filterType: 'Personel Type',
      
      tabs: {
        all: 'All Personel',
      },
      
      status: {
        active: 'Active',
        inactive: 'Inactive',
      },
      
      types: {
        CHECKER: 'Checker',
        MECHANIC: 'Mechanic',
        STAFF: 'Staff',
        MANAGEMENT: 'Management',
        OTHER: 'Other',
      },

      table: {
        colPersonel: 'Personel',
        colContact: 'Contact',
        colIdentity: 'Identity',
        colStatus: 'Status',
        colType: 'Type',
        colActions: 'Actions',
        emptyTitle: 'Personel Not Found',
        emptyDescription: 'No personel data matches your search.',
        noResultTitle: 'Personel not found',
        noResultDescription: 'Try adjusting your search or filters.',
      },
      
      actions: {
        detail: 'View Detail',
        edit: 'Edit Personel',
        delete: 'Delete Personel',
      },
      
      labels: {
        name: 'Full Name',
        type: 'Personel Type',
        nik: 'NIK / Employee ID',
        phone: 'Phone Number',
        email: 'Email',
        address: 'Address',
        card: 'Assigned Card',
        status: 'Status',
        notes: 'Notes',
        noCard: 'No Card Assigned',
      },
      
      form: {
        addTitle: 'Add New Personel',
        addSubtitle: 'Enter details for the new personel.',
        editTitle: 'Edit Personel',
        editSubtitle: 'Update personel information.',
        submit: 'Save Personel',
        descIdentity: 'Basic identity information.',
        descAddress: 'Personel home address.',
        descNotes: 'Additional notes regarding this personel.',
        successMessage: 'Personel saved successfully.',
      },

      drawer: {
        title: 'Personel Detail',
        close: 'Close',
        tabInfo: 'Information',
      },
      
      validation: {
        nameRequired: 'Full name is required',
        typeRequired: 'Personel type must be selected',
        emailInvalid: 'Invalid email format',
        statusRequired: 'Status must be selected',
      }
    };
  }

  // Indonesian Default
  return {
    pageTitle: 'Personel',
    pageSubtitle: 'Manajemen data personel dan penugasan',
    
    addPersonel: 'Tambah Personel',
    exportFilename: 'personel-adatrack',
    searchPlaceholder: 'Cari nama, NIK, atau telepon...',
    clearFilters: 'Hapus Filter',
    
    filterStatus: 'Status',
    filterType: 'Tipe Personel',
    
    tabs: {
      all: 'Semua Personel',
    },
    
    status: {
      active: 'Aktif',
      inactive: 'Tidak Aktif',
    },
    
    types: {
      CHECKER: 'Checker',
      MECHANIC: 'Teknisi / Mekanik',
      STAFF: 'Staf',
      MANAGEMENT: 'Manajemen',
      OTHER: 'Lainnya',
    },

    table: {
      colPersonel: 'Personel',
      colContact: 'Kontak',
      colIdentity: 'Identitas',
      colStatus: 'Status',
      colType: 'Tipe',
      colActions: 'Aksi',
      emptyTitle: 'Personel Tidak Ditemukan',
      emptyDescription: 'Tidak ada data personel yang sesuai dengan pencarian Anda.',
      noResultTitle: 'Personel tidak ditemukan',
      noResultDescription: 'Coba sesuaikan pencarian atau filter Anda.',
    },
    
    actions: {
      detail: 'Lihat Detail',
      edit: 'Edit Personel',
      delete: 'Hapus Personel',
    },
    
    labels: {
      name: 'Nama Lengkap',
      type: 'Tipe Personel',
      nik: 'NIK / ID Karyawan',
      phone: 'Nomor Telepon',
      email: 'Email',
      address: 'Alamat',
      card: 'Kartu yang Ditugaskan',
      status: 'Status',
      notes: 'Catatan',
      noCard: 'Tidak Ada Kartu',
    },
    
    form: {
      addTitle: 'Tambah Personel Baru',
      addSubtitle: 'Masukkan informasi detail personel baru.',
      editTitle: 'Edit Personel',
      editSubtitle: 'Perbarui informasi personel.',
      submit: 'Simpan Data Personel',
      descIdentity: 'Informasi dasar identitas personel.',
      descAddress: 'Alamat domisili personel.',
      descNotes: 'Catatan tambahan mengenai personel ini.',
      successMessage: 'Data personel berhasil disimpan.',
    },

    drawer: {
      title: 'Detail Personel',
      close: 'Tutup',
      tabInfo: 'Informasi',
    },
    
    validation: {
      nameRequired: 'Nama lengkap wajib diisi',
      typeRequired: 'Tipe personel wajib dipilih',
      emailInvalid: 'Format email tidak valid',
      statusRequired: 'Status wajib dipilih',
    }
  };
}
