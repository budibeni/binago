import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Buat Rute Baru | ADATRACK Business',
  description: 'Rancang rute operasional dan koridor perjalanan resmi armada',
};

const RouteCreate = dynamic(
  () =>
    import('../../../../features/core/routes/RouteCreateFeature').then(
      (mod) => mod.RouteCreateFeature,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100dvh-52px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-foreground-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm">Memuat visual route builder...</p>
        </div>
      </div>
    ),
  },
);

export default function CreateRoutePage() {
  return <RouteCreate />;
}
