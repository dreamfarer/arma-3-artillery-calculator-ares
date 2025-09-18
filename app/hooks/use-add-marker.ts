import { useEffect } from 'react';
import type { GeoJSONSource, Map, MapMouseEvent } from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { isSpaceBlocked } from '@/lib/marker/is-space-blocked';
import { useElevation } from '@/app/hooks/use-elevation';
import { convertToPoint2D } from '@/lib/geo/convert-to-point-2-d';
import { addFeature } from '@/lib/marker/add-feature';

export function useAddMarker(
  map: Map | null,
  sourceId: string,
  mapMetadata: MapMetadataRecord | null,
  activeMap: string | null
) {
  const getElevation = useElevation();

  useEffect(() => {
    if (!map || !mapMetadata || !activeMap) return;

    const handleAdd = async (e: MapMouseEvent) => {
      const source = map.getSource(sourceId) as GeoJSONSource;
      const latLng = e.lngLat;
      if (await isSpaceBlocked(map, source, 20, latLng)) return;
      const position = convertToPoint2D(mapMetadata[activeMap], latLng);
      const elevation = await getElevation(position);
      await addFeature(activeMap, source, latLng, position, elevation);
    };

    map.on('click', handleAdd);
    return () => {
      map.off('click', handleAdd);
    };
  }, [map, sourceId, mapMetadata, activeMap, getElevation]);
}
