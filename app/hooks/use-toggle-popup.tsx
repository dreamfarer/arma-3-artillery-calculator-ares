import {
  Popup as PopupMapLibre,
  Map as MapMapLibre,
  MapLayerMouseEvent,
} from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { useEffect, useRef } from 'react';
import { GeoJsonProperties, Point } from 'geojson';
import { createRoot } from 'react-dom/client';
import Popup from '../components/popup';

export function useTogglePopup(
  map: MapMapLibre | null,
  sourceId: string,
  markerLayerId: string,
  mapMetadata: MapMetadataRecord | null,
  activeMap: string | null
) {
  const popupsRef = useRef(new Map<string, PopupMapLibre>());

  useEffect(() => {
    if (!map || !mapMetadata || !activeMap) return;
    const popups = popupsRef.current;

    const handleToggle = async (e: MapLayerMouseEvent) => {
      const source = map.getSource(sourceId);
      const geometry = e.features?.[0].geometry as Point;
      const properties = e.features?.[0].properties as GeoJsonProperties | null;
      if (!source || !properties) return;

      if (popups.has(properties.id)) {
        popups.get(properties.id)!.remove();
        popups.delete(properties.id);
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
        popups.delete(properties.id);
      });

      popups.set(properties.id, popup);
    };

    map.on('click', markerLayerId, handleToggle);
    return () => {
      map.off('click', markerLayerId, handleToggle);
      popups.forEach((p) => p.remove());
      popups.clear();
    };
  }, [map, sourceId, markerLayerId, mapMetadata, activeMap, popupsRef]);
}
