import { useEffect } from 'react';
import type { GeoJSONSource, Map, MapMouseEvent } from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { isSpaceBlocked } from '@/lib/marker/is-space-blocked';
import { addFeature } from '@/lib/marker/add-feature';
import { useElevation } from '@/app/hooks/use-elevation';
import { convertToPoint2D } from '@/lib/geo/convert-to-point-2-d';

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
      const source = map.getSource(sourceId);
      if (!source) return;
      if (await isSpaceBlocked(map, source as GeoJSONSource, 20, e.lngLat))
        return;
      const point2d = convertToPoint2D(mapMetadata[activeMap], e.lngLat);
      const elevation = await getElevation(point2d);
      const point3d = { ...point2d, z: elevation };
      if (!elevation) return;
      await addFeature(activeMap, source as GeoJSONSource, e.lngLat, point3d);
    };

    map.on('click', handleAdd);
    return () => {
      map.off('click', handleAdd);
    };
  }, [map, sourceId, mapMetadata, activeMap, getElevation]);
}
