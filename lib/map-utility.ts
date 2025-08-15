import { Map } from 'maplibre-gl';
import { FeatureCollection } from 'geojson';

export function isSpaceBlocked(
  map: Map,
  featureCollection: FeatureCollection,
  thresholdPx: number,
  lng: number,
  lat: number
) {
  const clickPoint = map.project([lng, lat]);
  return featureCollection.features.some((feature) => {
    if (feature.geometry.type !== 'Point') return false;
    const [fx, fy] = feature.geometry.coordinates as [number, number];
    const screenPos = map.project([fx, fy]);
    const dx = screenPos.x - clickPoint.x;
    const dy = screenPos.y - clickPoint.y;
    return Math.sqrt(dx * dx + dy * dy) < thresholdPx;
  });
}

export function getNextMarkerType(featureCollection: FeatureCollection) {
  if (
    featureCollection.features.some(
      (feature) => feature.properties?.markerType === 'artillery'
    )
  ) {
    return 'target';
  }
  return 'artillery';
}
