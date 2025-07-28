'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Map } from 'maplibre-gl';
import { ActivePopup } from '../hooks/active-popup';
import { TMarkerFeature } from '@/types/marker-feature';

type TPopupContext = {
  attachPopupHandler: (map: Map) => void;
};

const PopupContext = createContext<TPopupContext | null>(null);
const activePopup = new ActivePopup();
const MARKERS_LAYER = 'user-markers-layer';

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [attachedMaps] = useState(() => new WeakSet<Map>());

  const attachPopupHandler = useCallback(
    (map: Map) => {
      if (attachedMaps.has(map)) return;
      attachedMaps.add(map);

      const openPopup = (feature: TMarkerFeature) => {
        const id = feature.properties.id;
        const isSame = activePopup.isSame(id);
        activePopup.remove();
        if (isSame) return;

        activePopup.render({ feature, map });
      };

      map.on('click', MARKERS_LAYER, (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0] as unknown as TMarkerFeature;
        openPopup(feature);
      });

      map.on('contextmenu', MARKERS_LAYER, (e) => {
        e.preventDefault();
        if (!e.features?.length) return;
        const feature = e.features[0] as unknown as TMarkerFeature;
        openPopup(feature);
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
