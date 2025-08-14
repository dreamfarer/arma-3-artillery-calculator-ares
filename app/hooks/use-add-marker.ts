import { useEffect } from 'react';
import { GeoJSONSource, Map, MapMouseEvent } from 'maplibre-gl';
import { convertToUnit } from '@/lib/convert';
import { MapMetadataRecord } from '@/types/map-metadata';
import { Feature, FeatureCollection } from 'geojson';
import { getNextMarkerType, isSpaceBlocked } from '@/lib/map-utility';

export function useMapClickToAddMarker(
  map: Map | null,
  sourceId: string,
  mapMetadata: MapMetadataRecord | null,
  activeMap: string | null
) {
  useEffect(() => {
    if (!map || !mapMetadata || !activeMap) return;

    const handleClick = (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      const positions = convertToUnit(mapMetadata[activeMap], lng, lat);
      const source = map.getSource(sourceId) as GeoJSONSource | undefined;
      if (!source) return;
      const current = source._data as FeatureCollection;

      if (isSpaceBlocked(map, current, 20, lng, lat)) return;

      const newFeature: Feature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          id: crypto.randomUUID(),
          x: positions[0],
          y: positions[1],
          map: activeMap,
          markerType: getNextMarkerType(current),
        },
      };

      current.features.push(newFeature);
      source.setData(current);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, mapMetadata, activeMap, sourceId]);
}
