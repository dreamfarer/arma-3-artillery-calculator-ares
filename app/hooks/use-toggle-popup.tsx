import {
  Popup as PopupMapLibre,
  Map as MapMapLibre,
  MapLayerMouseEvent,
  MapGeoJSONFeature,
} from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { RefObject, useEffect } from 'react';
import { Point } from 'geojson';
import { createRoot } from 'react-dom/client';
import Popup from '../components/popup';
import { ArtilleryFeatureProperties } from '@/types/artillery-feature-properties';
import { TargetFeatureProperties } from '@/types/target-feature-properties';

export function useTogglePopup(
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

    const handleToggle = async (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0] as MapGeoJSONFeature;
      const properties = feature.properties as
        | ArtilleryFeatureProperties
        | TargetFeatureProperties;
      const id = properties.id;

      if (popups.has(id)) {
        popups.get(id)!.remove();
        popups.delete(id);
        return;
      }

      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(<Popup properties={properties} />);

      const popup = new PopupMapLibre({
        closeButton: false,
        className: 'unit',
        offset: 25,
        closeOnClick: false,
      })
        .setDOMContent(container)
        .setLngLat(
          (e.features?.[0].geometry as Point).coordinates as [number, number]
        )
        .addTo(map);

      popup.on('remove', () => {
        root.unmount();
        popups.delete(id);
      });

      popups.set(id, popup);
    };

    map.on('click', markerLayerId, handleToggle);
    return () => {
      map.off('click', markerLayerId, handleToggle);
    };
  }, [map, sourceId, markerLayerId, mapMetadata, activeMap, popupsRef]);
}
