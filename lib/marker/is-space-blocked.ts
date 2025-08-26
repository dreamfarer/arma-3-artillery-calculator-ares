import { type GeoJSONSource, Map } from 'maplibre-gl';
import { FeatureCollection } from 'geojson';
import { LatLng } from '@/types/lat-lng';

export async function isSpaceBlocked(
  map: Map,
  source: GeoJSONSource,
  thresholdPx: number,
  coordinates: LatLng
) {
  const data = (await source.getData()) as FeatureCollection;
  const clickPoint = map.project([coordinates.lng, coordinates.lat]);
  return data.features.some((feature) => {
    if (feature.geometry.type !== 'Point') return false;
    const [fx, fy] = feature.geometry.coordinates as [number, number];
    const screenPos = map.project([fx, fy]);
    const dx = screenPos.x - clickPoint.x;
    const dy = screenPos.y - clickPoint.y;
    return Math.sqrt(dx * dx + dy * dy) < thresholdPx;
  });
}
