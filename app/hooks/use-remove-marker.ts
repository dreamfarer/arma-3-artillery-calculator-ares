import {
  GeoJSONSource,
  Popup as PopupMapLibre,
  Map as MapMapLibre,
  MapLayerMouseEvent,
} from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { RefObject, useEffect } from 'react';
import { Feature } from 'geojson';
import { removeFeature } from '@/lib/map-utility';

export function useRemoveMarker(
  map: MapMapLibre | null,
  sourceId: string,
  markerLayerId: string,
  mapMetadata: MapMetadataRecord | null,
  activeMap: string | null,
  popupsRef: RefObject<Map<string, PopupMapLibre>>
) {
  useEffect(() => {
    if (!map || !mapMetadata || !activeMap) return;
    const popups = popupsRef.current;

    const handleRemove = async (e: MapLayerMouseEvent) => {
      const source = map.getSource(sourceId);
      const feature = e.features?.[0] as Feature | null;
      if (!source || !feature) return;

      const id =
        feature.properties && (feature.properties.id as string | undefined);
      if (id && popups.has(id)) {
        popups.get(id)!.remove();
        popups.delete(id);
      }

      await removeFeature(source as GeoJSONSource, feature);
    };

    map.on('contextmenu', markerLayerId, handleRemove);
    return () => {
      map.off('contextmenu', markerLayerId, handleRemove);
    };
  }, [map, sourceId, markerLayerId, mapMetadata, activeMap, popupsRef]);
}
