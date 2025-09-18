import { MapGeoJSONFeature } from 'maplibre-gl';

export function getFeatureId(feature: MapGeoJSONFeature): string {
  return feature.properties.id;
}
