import maplibregl, { Popup as MapLibrePopup } from 'maplibre-gl';
import { Root, createRoot } from 'react-dom/client';
import Popup from '../components/popup';
import { TMarkerFeature } from '@/types/marker-feature';

type RenderArgs = {
  feature: TMarkerFeature;
  map: maplibregl.Map;
};

type PopupInstance = {
  popup: MapLibrePopup;
  root: Root;
};

export class PopupManager {
  private popups: Map<string, PopupInstance> = new Map();

  togglePopup({ feature, map }: RenderArgs) {
    const id = feature.properties.id as string;

    if (this.popups.has(id)) {
      this.removePopup(id);
      return;
    }

    const container = document.createElement('div');
    const root = createRoot(container);

    root.render(
      <Popup position={[feature.properties.x, feature.properties.y]} />
    );

    const popup = new maplibregl.Popup({
      closeButton: false,
      className: 'arma-popup',
      offset: 25,
      closeOnClick: false,
    })
      .setDOMContent(container)
      .setLngLat(feature.geometry.coordinates as [number, number])
      .addTo(map);

    popup.on('close', () => {
      this.removePopup(id);
    });

    this.popups.set(id, { popup, root });
  }

  removePopup(id: string) {
    const instance = this.popups.get(id);
    if (!instance) return;

    instance.popup.remove();
    instance.root.unmount();
    this.popups.delete(id);
  }

  removeAllPopups() {
    for (const id of this.popups.keys()) {
      this.removePopup(id);
    }
  }
}
