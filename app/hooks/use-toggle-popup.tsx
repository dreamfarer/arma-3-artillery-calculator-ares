import {
  Popup as PopupMapLibre,
  Map as MapMapLibre,
  MapLayerMouseEvent,
  GeoJSONSource,
} from 'maplibre-gl';
import { MapMetadataRecord } from '@/types/map-metadata';
import { RefObject, useEffect } from 'react';
import { GeoJsonProperties, Point } from 'geojson';
import { createRoot } from 'react-dom/client';
import Popup from '../components/popup';
import { getArtilleryPosition } from '@/lib/map/get-artillery-position';
import { getArtilleryFiringSolution } from '@/lib/artillery/get-artillery-firing-solution';
import { Point3D } from '@/types/point-3-d';

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
      const source = map.getSource(sourceId) as GeoJSONSource;
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

      const artilleryPosition = await getArtilleryPosition(source);
      const targetPosition = JSON.parse(properties.position) as Point3D;
      const firingSolution = getArtilleryFiringSolution(
        artilleryPosition,
        targetPosition
      );

      root.render(<Popup firingSolution={firingSolution} />);

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
