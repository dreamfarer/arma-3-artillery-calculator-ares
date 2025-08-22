import { type GeoJSONSource, Map } from 'maplibre-gl';
import { FeatureCollection } from 'geojson';

export async function isSpaceBlocked(
  map: Map,
  source: GeoJSONSource,
  thresholdPx: number,
  lng: number,
  lat: number
) {
  const data = (await source.getData()) as FeatureCollection;
  const clickPoint = map.project([lng, lat]);
  return data.features.some((feature) => {
    if (feature.geometry.type !== 'Point') return false;
    const [fx, fy] = feature.geometry.coordinates as [number, number];
    const screenPos = map.project([fx, fy]);
    const dx = screenPos.x - clickPoint.x;
    const dy = screenPos.y - clickPoint.y;
    return Math.sqrt(dx * dx + dy * dy) < thresholdPx;
  });
}
