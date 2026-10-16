import type { Metadata } from 'next';
import { Truck, Clock } from 'lucide-react';
import { Card, Badge } from '@adatrack/ui';

export const metadata: Metadata = {
  title: 'Aktivitas Kendaraan | ADATRACK Business',
  description: 'Log riwayat aktivitas armada kendaraan operasional.',
};

export default function ActivityVehiclesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Aktivitas Kendaraan</h1>
          <Badge variant="warning" className="text-xs">Segera Hadir</Badge>
        </div>
        <p className="text-sm text-foreground-muted mt-1">
          Modul monitoring aktivitas, checklist inspeksi, dan pergerakan unit armada kendaraan.
        </p>
      </div>

      <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <Truck className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Fitur Aktivitas Kendaraan Sedang Disiapkan</h3>
        <p className="text-sm text-foreground-muted max-w-md mt-1 mb-4">
          Halaman ini akan memuat log pergerakan kendaraan, utilisasi jam operasional mesin (engine hours), checklist inspeksi berkala, dan riwayat pemakaian armada.
        </p>
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Clock className="h-4 w-4" />
          <span>Pengembangan Tahap Lanjutan</span>
        </div>
      </Card>
    </div>
  );
}
