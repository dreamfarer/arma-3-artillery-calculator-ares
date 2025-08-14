'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { TMarkerFeature } from '@/types/marker-feature';
import { PopupManager } from '../hooks/popup-manager';

type TPopupContext = {
  attachPopupHandler: (map: Map) => void;
};

const PopupContext = createContext<TPopupContext | null>(null);
const MARKERS_LAYER = 'artillery-layer';

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [attachedMaps] = useState(() => new WeakSet<Map>());
  const popupManagerRef = useRef(new PopupManager());

  const attachPopupHandler = useCallback(
    (map: Map) => {
      if (attachedMaps.has(map)) return;
      attachedMaps.add(map);

      const handleClick = (e: MapLayerMouseEvent) => {
        const feature = e.features?.[0] as TMarkerFeature | undefined;
        if (!feature) return;
        popupManagerRef.current.togglePopup({ feature, map });
      };

      map.on('click', MARKERS_LAYER, handleClick);
      map.on('contextmenu', MARKERS_LAYER, (e) => {
        e.preventDefault();
        handleClick(e);
      });
    },
    [attachedMaps]
  );

  const value = useMemo(() => ({ attachPopupHandler }), [attachPopupHandler]);

  return (
    <PopupContext.Provider value={value}>{children}</PopupContext.Provider>
  );
}

export function usePopupContext() {
  const context = useContext(PopupContext);
  if (!context)
    throw new Error('usePopupContext must be used within a <PopupProvider>');
  return context;
}
