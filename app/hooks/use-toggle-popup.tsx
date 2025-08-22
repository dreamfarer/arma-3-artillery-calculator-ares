import {
  Popup as PopupMapLibre,
  Map as MapMapLibre,
  MapLayerMouseEvent,
} from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { RefObject, useEffect } from 'react';
import { GeoJsonProperties, Point } from 'geojson';
import { createRoot } from 'react-dom/client';
import Popup from '../components/popup';

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
      const source = map.getSource(sourceId);
      const geometry = e.features?.[0].geometry as Point;
      const properties = e.features?.[0].properties as GeoJsonProperties | null;
      const id = properties?.id as string | undefined;
      if (!source || !properties || !id) return;

      if (popups.has(id)) {
        popups.get(id)!.remove();
        popups.delete(id);
        return;
      }

      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(<Popup position={[properties.x, properties.y]} />);

      const popup = new PopupMapLibre({
        closeButton: false,
        className: 'unit',
        offset: 25,
        closeOnClick: false,
      })
        .setDOMContent(container)
        .setLngLat(geometry.coordinates as [number, number])
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
