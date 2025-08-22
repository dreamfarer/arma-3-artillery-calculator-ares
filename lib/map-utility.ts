import { type GeoJSONSource, Map } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';
import { MapMetadata } from '@/types/map-metadata';
import { convertToUnit } from '@/lib/convert';

export function getSource(map: Map, sourceId: string) {
  return map.getSource(sourceId) as GeoJSONSource | undefined;
}

export async function addFeature(
  mapName: string,
  metadata: MapMetadata,
  source: GeoJSONSource,
  lat: number,
  lng: number
) {
  const [x, y] = convertToUnit(metadata, lng, lat);
  const data = (await source.getData()) as FeatureCollection;
  const newFeature: Feature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: {
      id: crypto.randomUUID(),
      x,
      y,
      map: mapName,
      markerType: getNextMarkerType(data),
    },
  };
  const next: FeatureCollection = {
    type: 'FeatureCollection',
    features: [...data.features, newFeature],
  };
  source.setData(next);
}

export async function removeFeature(source: GeoJSONSource, feature: Feature) {
  const data = (await source.getData()) as FeatureCollection;
  const id =
    feature.properties && (feature.properties.id as string | undefined);
  if (!id) return;
  const next: FeatureCollection = {
    type: 'FeatureCollection',
    features: data.features.filter((f) => f.properties?.id !== id),
  };
  source.setData(next);
}

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
