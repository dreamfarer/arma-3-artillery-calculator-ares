'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useMapContext } from './map-context';
import { Map } from 'maplibre-gl';
import { convertToUnit } from '@/lib/convert';
import { loadIcon } from '@/lib/marker-utility';

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
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarkerType, setSelectedMarkerType] = useState<
    'artillery' | 'target'
  >('artillery');

  useEffect(() => {
    if (!mapInstance) return;

    const map = mapInstance as Map;

    const setupMarkers = async () => {
      if (!map.hasImage('artillery')) {
        const artilleryImg = await loadIcon(
          map,
          '/icon/64/artillery-marker.webp'
        );
        map.addImage('artillery', artilleryImg);
      }

      if (!map.hasImage('target')) {
        const targetImg = await loadIcon(map, '/icon/64/target-marker.webp');
        map.addImage('target', targetImg);
      }

      if (!map.getSource('user-markers')) {
        map.addSource('user-markers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      if (!map.getLayer('user-markers-layer')) {
        map.addLayer({
          id: 'user-markers-layer',
          type: 'symbol',
          source: 'user-markers',
          layout: {
            'icon-image': ['get', 'markerType'],
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-anchor': 'center',
          },
        });
      }
    };

    setupMarkers().catch((err) =>
      console.error('Failed to set up marker icon/layer:', err)
    );
  }, [mapInstance]);

  useEffect(() => {
    if (!mapInstance || !mapMetadata || !activeMap) return;
    const map = mapInstance as Map;

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      const positions = convertToUnit(mapMetadata[activeMap], lng, lat);
      const id = crypto.randomUUID();
      const newFeature: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          id,
          x: positions[0],
          y: positions[1],
          map: activeMap,
          markerType: selectedMarkerType,
        },
      };

      const source = map.getSource('user-markers') as maplibregl.GeoJSONSource;
      if (!source) return;

      const current = source._data as GeoJSON.FeatureCollection;
      current.features.push(newFeature);
      source.setData(current);
    });
  }, [mapInstance, activeMap, mapMetadata, selectedMarkerType]);

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
