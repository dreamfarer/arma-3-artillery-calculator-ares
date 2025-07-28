import maplibregl, { Popup as MapLibrePopup } from 'maplibre-gl';
import { Root, createRoot } from 'react-dom/client';
import Popup from '../components/popup';
import { TMarkerFeature } from '@/types/marker-feature';

type RenderArgs = {
  feature: TMarkerFeature;
  map: maplibregl.Map;
};

export class ActivePopup {
  private mapLibrePopup: MapLibrePopup | null = null;
  private root: Root | null = null;
  private markerId: string | null = null;

  isSame(markerId: string) {
    return markerId === this.markerId;
  }

  remove() {
    this.mapLibrePopup?.remove();
    this.root?.unmount();
    this.mapLibrePopup = null;
    this.root = null;
    this.markerId = null;
  }

  render({ feature, map }: RenderArgs) {
    const markerId = feature.properties.id as string;
    const coordinates = feature.geometry.coordinates as [number, number];

    const container = document.createElement('div');
    const root = createRoot(container);

    root.render(<Popup position={coordinates} />);

    const popupInstance = new maplibregl.Popup({
      closeButton: false,
      className: 'arma-popup',
      offset: 25,
    })
      .setDOMContent(container)
      .setLngLat(coordinates)
      .addTo(map);

    popupInstance.on('close', () => this.remove());

    this.mapLibrePopup = popupInstance;
    this.root = root;
    this.markerId = markerId;
  }
}
