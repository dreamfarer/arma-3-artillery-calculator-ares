import MapWrapper from '@/app/components/map-wrapper';
import { MapProvider } from '@/app/context/map-context';
import { MarkerProvider } from '@/app/context/marker-context';
import { PopupProvider } from '@/app/context/popup-context';
import { Metadata } from 'next';
import { ReactNode } from 'react';

type MapParams = { map: string };

interface Props {
  params: Promise<MapParams>;
  children: ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { map } = await params;
  const mapName = map.charAt(0).toUpperCase() + map.slice(1);
  return {
    alternates: {
      canonical: `${map}/artillery`,
    },
    openGraph: {
      url: `${map}/artillery`,
    },
    title: `${mapName}`,
  };
}

export default async function ArtilleryLayout({ children }: Props) {
  return (
    <MapProvider>
      <PopupProvider>
        <MarkerProvider>
          <MapWrapper />
          {children}
        </MarkerProvider>
      </PopupProvider>
    </MapProvider>
  );
}
