import dynamic from 'next/dynamic';

const DriverPortalFeature = dynamic(
  () => import('@/features/modules/portal/driver/DriverPortalFeature').then((mod) => mod.DriverPortalFeature),
  { ssr: false }
);

export default function DriverPortalPage() {
  return <DriverPortalFeature />;
}
