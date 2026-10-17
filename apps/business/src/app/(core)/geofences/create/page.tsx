import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Tambah Geofence | ADATRACK Business',
  description: 'Buat batas wilayah virtual dan perimeter operasi baru',
};

const GeofenceCreate = dynamic(
  () =>
    import('../../../../features/core/geofences/GeofenceCreateFeature').then(
      (mod) => mod.GeofenceCreateFeature,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100dvh-52px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-foreground-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm">Memuat editor geofence...</p>
        </div>
      </div>
    ),
  },
);

export default function CreateGeofencePage() {
  return <GeofenceCreate />;
}
