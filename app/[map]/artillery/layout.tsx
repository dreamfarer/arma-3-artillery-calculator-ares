import MapWrapper from '@/app/components/map-wrapper';
import { MapProvider } from '@/app/context/map-context';
import { MarkerProvider } from '@/app/context/marker-context';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import maps from '@/public/maps.json';

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

export default async function ArtilleryLayout({ children, params }: Props) {
  const mapMetadata = maps;
  const activeMap = (await params).map ?? 'altis';
  return (
    <MapProvider mapMetadata={mapMetadata} initialActiveMap={activeMap}>
      <MarkerProvider>
        <MapWrapper />
        {children}
      </MarkerProvider>
    </MapProvider>
  );
}
