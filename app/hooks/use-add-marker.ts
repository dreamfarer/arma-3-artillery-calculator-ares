import { useEffect } from 'react';
import type { GeoJSONSource, Map, MapMouseEvent } from 'maplibre-gl';
import { addFeature, isSpaceBlocked } from '@/lib/map-utility';
import { MapMetadataRecord } from '@/types/map-metadata';

export function useAddMarker(
  map: Map | null,
  sourceId: string,
  mapMetadata: MapMetadataRecord | null,
  activeMap: string | null
) {
  useEffect(() => {
    if (!map || !mapMetadata || !activeMap) return;

    const handleAdd = async (e: MapMouseEvent) => {
      const source = map.getSource(sourceId);
      if (!source) return;
      const { lng, lat } = e.lngLat;
      if (await isSpaceBlocked(map, source as GeoJSONSource, 20, lng, lat))
        return;
      await addFeature(
        activeMap,
        mapMetadata[activeMap],
        source as GeoJSONSource,
        lat,
        lng
      );
    };

    map.on('click', handleAdd);
    return () => {
      map.off('click', handleAdd);
    };
  }, [map, sourceId, mapMetadata, activeMap]);
}
