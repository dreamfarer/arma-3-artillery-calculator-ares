import {
  GeoJSONSource,
  Popup as PopupMapLibre,
  Map as MapMapLibre,
  MapLayerMouseEvent,
  MapGeoJSONFeature,
} from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { RefObject, useEffect } from 'react';
import { removeFeature } from '@/lib/marker/remove-feature';
import { getFeatureId } from '@/lib/marker/get-feature-id';

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
      const source = map.getSource(sourceId) as GeoJSONSource;
      const feature = e.features?.[0] as MapGeoJSONFeature | null;
      if (!source || !feature) return;

      const id = getFeatureId(feature);
      if (popups.has(id)) {
        popups.get(id)!.remove();
        popups.delete(id);
      }

      await removeFeature(source, feature);
    };

    map.on('contextmenu', markerLayerId, handleRemove);
    return () => {
      map.off('contextmenu', markerLayerId, handleRemove);
    };
  }, [map, sourceId, markerLayerId, mapMetadata, activeMap, popupsRef]);
}
