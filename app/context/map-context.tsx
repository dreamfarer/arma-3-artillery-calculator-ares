'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadMapMetadata } from '@/lib/map-utility';
import { MapMetadataRecord } from '@/types/map-metadata';
import { Map } from 'maplibre-gl';

type TMapContext = {
  mapInstance: Map | null;
  mapMetadata: MapMetadataRecord | null;
  activeMap: string | null;
  setMapInstance: (map: Map) => void;
  setActiveMap: (mapName: string) => void;
};

const MapContext = createContext<TMapContext | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [activeMap, setActiveMap] = useState<string | null>('altis');
  const [mapMetadata, setMapMetadata] = useState<MapMetadataRecord | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      setMapMetadata(await loadMapMetadata());
    };
    load();
  }, []);

  const contextValue = useMemo<TMapContext>(
    () => ({
      mapInstance,
      mapMetadata,
      activeMap,
      setMapInstance,
      setActiveMap,
    }),
    [mapInstance, mapMetadata, activeMap, setMapInstance, setActiveMap]
  );

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (!context)
    throw new Error('useMapContext must be used inside <MapProvider>');
  return context;
}
