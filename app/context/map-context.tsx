'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Map } from 'maplibre-gl';
import type { MapMetadataRecord } from '@/types/map-metadata';

type TMapContext = {
  mapInstance: Map | null;
  mapMetadata: MapMetadataRecord | null;
  activeMap: string;
  setMapInstance: (map: Map | null) => void;
  setActiveMap: (mapName: string) => void;
};

const MapContext = createContext<TMapContext | null>(null);

export function MapProvider({
  children,
  mapMetadata,
  initialActiveMap = 'altis',
}: Readonly<{
  children: ReactNode;
  mapMetadata: MapMetadataRecord | null;
  initialActiveMap?: string;
}>) {
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [activeMap, setActiveMap] = useState<string>(initialActiveMap);

  const contextValue = useMemo<TMapContext>(
    () => ({
      mapInstance,
      mapMetadata,
      activeMap,
      setMapInstance,
      setActiveMap,
    }),
    [mapInstance, mapMetadata, activeMap]
  );

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
}

export function useMapContext() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used inside <MapProvider>');
  return ctx;
}
