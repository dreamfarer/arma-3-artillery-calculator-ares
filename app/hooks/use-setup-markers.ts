import { useEffect } from 'react';
import { Map } from 'maplibre-gl';
import { loadIcon } from '@/lib/marker/load-icon';

export function useSetupMarkers(map: Map | null) {
  useEffect(() => {
    if (!map) return;

    const setup = async () => {
      if (!map.hasImage('artillery')) {
        const artilleryImg = await loadIcon(
          map,
          '/icon/64/artillery-marker.webp'
        );
        map.addImage('artillery', artilleryImg);
      }

      if (!map.hasImage('target')) {
        const targetImg = await loadIcon(map, '/icon/64/target-marker.webp');
        map.addImage('target', targetImg);
      }

      if (!map.getSource('units')) {
        map.addSource('units', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      if (!map.getLayer('artillery')) {
        map.addLayer({
          id: 'artillery',
          type: 'symbol',
          source: 'units',
          layout: {
            'icon-image': 'artillery',
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-anchor': 'center',
          },
          filter: ['==', ['get', 'markerType'], 'artillery'],
        });
      }

      if (!map.getLayer('target')) {
        map.addLayer({
          id: 'target',
          type: 'symbol',
          source: 'units',
          layout: {
            'icon-image': 'target',
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-anchor': 'center',
          },
          filter: ['==', ['get', 'markerType'], 'target'],
        });
      }
    };

    setup().catch((err) =>
      console.error('Failed to set up marker icon/layer:', err)
    );
  }, [map]);
}
