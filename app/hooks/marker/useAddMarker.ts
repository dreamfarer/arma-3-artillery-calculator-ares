import { useEffect } from 'react';
import type { Map, MapMouseEvent } from 'maplibre-gl';
import { addFeature, getSource, isSpaceBlocked } from '@/lib/map-utility';
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
      const source = getSource(map, sourceId);
      if (!source) return;
      const { lng, lat } = e.lngLat;
      if (await isSpaceBlocked(map, source, 20, lng, lat)) return;
      await addFeature(activeMap, mapMetadata[activeMap], source, lat, lng);
    };

    map.on('click', handleAdd);
    return () => {
      map.off('click', handleAdd);
    };
  }, [map, sourceId, mapMetadata, activeMap]);
}
