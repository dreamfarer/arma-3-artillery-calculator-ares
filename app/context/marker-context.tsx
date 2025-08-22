'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useMapContext } from './map-context';
import { usePopupContext } from './popup-context';
import { useSetupMarkers } from '../hooks/use-setup-markers';
import { useAddMarker } from '@/app/hooks/map/useAddMarker';
import { useRemoveMarker } from '@/app/hooks/map/useRemoveMarker';

type TMarkerContext = {
  debug: boolean;
};

const MarkerContext = createContext<TMarkerContext | null>(null);

export function MarkerProvider({ children }: { children: ReactNode }) {
  const { mapInstance, mapMetadata, activeMap } = useMapContext();
  const { attachPopupHandler } = usePopupContext();

  useSetupMarkers(mapInstance, attachPopupHandler);
  useAddMarker(mapInstance, 'units', mapMetadata, activeMap);
  useRemoveMarker(mapInstance, 'units', 'artillery', mapMetadata, activeMap);
  useRemoveMarker(mapInstance, 'units', 'target', mapMetadata, activeMap);

  const contextValue = useMemo<TMarkerContext>(
    () => ({
      debug: false,
    }),
    []
  );

  return (
    <MarkerContext.Provider value={contextValue}>
      {children}
    </MarkerContext.Provider>
  );
}

export function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context)
    throw new Error('useMarkerContext must be used inside <MarkerProvider>');
  return context;
}
