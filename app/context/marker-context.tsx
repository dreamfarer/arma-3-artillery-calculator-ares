'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import { useMapContext } from './map-context';
import { usePopupContext } from './popup-context';
import { useSetupMarkers } from '../hooks/use-setup-markers';
import { useMapClickToAddMarker } from '../hooks/use-add-marker';

type Marker = {
  id: string;
  x: number;
  y: number;
};

type TMarkerContext = {
  markers: Marker[];
  setMarkers: (markers: Marker[]) => void;
  selectedMarkerType: 'artillery' | 'target';
  setSelectedMarkerType: (type: 'artillery' | 'target') => void;
};

const MarkerContext = createContext<TMarkerContext | null>(null);

export function MarkerProvider({ children }: { children: React.ReactNode }) {
  const { mapInstance, mapMetadata, activeMap } = useMapContext();
  const { attachPopupHandler } = usePopupContext();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarkerType, setSelectedMarkerType] = useState<
    'artillery' | 'target'
  >('artillery');

  useSetupMarkers(mapInstance, attachPopupHandler);
  useMapClickToAddMarker(
    mapInstance,
    mapMetadata,
    activeMap,
    selectedMarkerType
  );

  const contextValue = useMemo<TMarkerContext>(
    () => ({
      markers,
      setMarkers,
      selectedMarkerType,
      setSelectedMarkerType,
    }),
    [markers, selectedMarkerType]
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
