import { Metadata } from 'next';
import { MapProvider } from '../context/map-context';
import MapWrapper from '../components/map-wrapper';

export const metadata: Metadata = {
  alternates: {
    canonical: '/artillery',
  },
  openGraph: {
    url: '/artillery',
  },
};

export default function ArtilleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MapProvider>
      <MapWrapper />
      {children}
    </MapProvider>
  );
}
