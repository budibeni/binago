import re

with open('apps/business/src/features/modules/rental/monitoring/MonitoringFeature.tsx', 'r') as f:
    content = f.read()

# Imports
content = content.replace("import { Clock, AlertTriangle, CheckCircle2, MapPin, List, Eye, Navigation, ChevronDown } from 'lucide-react';", 
"""import { Clock, AlertTriangle, CheckCircle2, MapPin, List, Eye, Navigation, ChevronDown } from 'lucide-react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getMonitoringTranslation } from './i18n';""")

# hook call inside MonitoringFeature
content = content.replace("  const router = useRouter();",
"""  const router = useRouter();
  const locale = useBusinessLocale();
  const labels = getMonitoringTranslation(locale);""")

# Panel stats labels
content = content.replace("label=\"Semua Kendaraan\"", "label={labels.allVehicles}")
content = content.replace("label=\"Aman (> 24 Jam)\"", "label={labels.safe}")
content = content.replace("label=\"Segera Habis (< 24 Jam)\"", "label={labels.warning}")
content = content.replace("label=\"Terlambat (Overdue)\"", "label={labels.overdue}")

# Columns
content = content.replace("header: 'No Ref',", "header: labels.colRef,")
content = content.replace("header: 'Pelanggan',", "header: labels.colCustomer,")
content = content.replace("header: 'Kontak',", "header: labels.colCustomer, // Will just use colCustomer if we don't have colContact")
content = content.replace("header: 'Kendaraan',", "header: labels.colVehicle,")
content = content.replace("header: 'Status',", "header: labels.colStatus,")

# Table
content = content.replace("exportFilename=\"Data_Monitoring\"", "exportFilename={labels.exportFilename}")
content = content.replace("searchPlaceholder=\"Cari pelanggan, no ref, atau plat nomor...\"", "searchPlaceholder={labels.searchPlaceholder}")
content = content.replace("emptyTitle=\"Tidak ada data kendaraan terpantau\"", "emptyTitle={labels.emptyTitle}")
content = content.replace("emptyDescription=\"Belum ada kendaraan yang disewa atau sesuai dengan pencarian Anda.\"", "emptyDescription={labels.emptyDescription}")

# Status cells
content = content.replace("label = 'Aman';", "label = labels.statusSafe;")
content = content.replace("label = 'Segera Habis';", "label = labels.statusWarning;")
content = content.replace("label = 'Terlambat';", "label = labels.statusOverdue;")
content = content.replace("title=\"Lihat Detail\"", "title={labels.actionDetail}")

# Group headers
content = content.replace("? 'Unknown' :", "? labels.unknown :")
content = content.replace("|| 'Unknown'", "|| labels.unknown")
content = content.replace("{selectedIds.length} Data Terpilih", "{labels.selectedItems.replace('{0}', String(selectedIds.length))}")
content = content.replace("Buka Live Tracking", "{labels.openTracking}")

with open('apps/business/src/features/modules/rental/monitoring/MonitoringFeature.tsx', 'w') as f:
    f.write(content)

