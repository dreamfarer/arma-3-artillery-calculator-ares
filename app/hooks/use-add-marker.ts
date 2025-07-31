import { useEffect } from 'react';
import { Map, MapMouseEvent } from 'maplibre-gl';
import { convertToUnit } from '@/lib/convert';
import { MapMetadataRecord } from '@/types/map-metadata';

export function useMapClickToAddMarker(
  map: Map | null,
  mapMetadata: MapMetadataRecord | null,
  activeMap: string | null,
  selectedMarkerType: 'artillery' | 'target'
) {
  useEffect(() => {
    if (!map || !mapMetadata || !activeMap) return;

    const handleClick = (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      const positions = convertToUnit(mapMetadata[activeMap], lng, lat);
      const source = map.getSource('user-markers') as maplibregl.GeoJSONSource;
      if (!source) return;

      const current = source._data as GeoJSON.FeatureCollection;
      const clickPoint = map.project([lng, lat]);
      const thresholdPx = 20;

      const exists = current.features.some((feature) => {
        if (feature.geometry.type !== 'Point') return false;
        const [fx, fy] = feature.geometry.coordinates;
        const screenPos = map.project([fx, fy]);
        const dx = screenPos.x - clickPoint.x;
        const dy = screenPos.y - clickPoint.y;
        return Math.sqrt(dx * dx + dy * dy) < thresholdPx;
      });

      if (exists) return;

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

      current.features.push(newFeature);
      source.setData(current);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, mapMetadata, activeMap, selectedMarkerType]);
}
