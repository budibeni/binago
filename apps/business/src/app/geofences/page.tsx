import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Geofences | ADATRACK Business',
  description: 'Kelola area aman dan pembatas',
};

// WAJIB ssr:false — @adatrack/maps → maplibre-gl adalah browser-only library
const GeofencePage = dynamic(
  () => import('./GeofencePageClient').then((mod) => mod.GeofencePageClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100dvh-52px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-foreground-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm">Memuat peta...</p>
        </div>
      </div>
    ),
  },
);

export default function GeofencesPage() {
  return <GeofencePage />;
}
