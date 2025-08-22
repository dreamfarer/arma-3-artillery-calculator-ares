import { GeoJSONSource, Map, MapLayerMouseEvent } from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { useEffect } from 'react';
import { Feature } from 'geojson';
import { removeFeature } from '@/lib/map-utility';

export function useRemoveMarker(
  map: Map | null,
  sourceId: string,
  markerLayerId: string,
  mapMetadata: MapMetadataRecord | null,
  activeMap: string | null
) {
  useEffect(() => {
    if (!map || !mapMetadata || !activeMap) return;

    const handleRemove = async (e: MapLayerMouseEvent) => {
      const source = map.getSource(sourceId);
      const feature = e.features?.[0] as Feature | null;
      if (!source || !feature) return;
      await removeFeature(source as GeoJSONSource, feature);
    };

    map.on('contextmenu', markerLayerId, handleRemove);
    return () => {
      map.off('contextmenu', markerLayerId, handleRemove);
    };
  }, [map, sourceId, markerLayerId, mapMetadata, activeMap]);
}
