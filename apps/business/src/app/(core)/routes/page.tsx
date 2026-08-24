import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Routes | ADATRACK Business',
  description: 'Kelola daftar rute operasional',
};

const RoutePage = dynamic(
  () => import('./RoutePageClient').then((mod) => mod.RoutePageClient),
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
  }
);

export default function RoutesPage() {
  return <RoutePage />;
}
