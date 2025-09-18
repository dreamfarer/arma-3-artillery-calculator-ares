import { LngLat } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';
import { ArtilleryFeatureProperties } from '@/types/artillery-feature-properties';
import { TargetFeatureProperties } from '@/types/target-feature-properties';

export function appendFeature(
  features: FeatureCollection,
  lngLat: LngLat,
  properties: ArtilleryFeatureProperties | TargetFeatureProperties
): FeatureCollection {
  const newFeature: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lngLat.lng, lngLat.lat],
    },
    properties,
  };
  return {
    type: 'FeatureCollection',
    features: [...features.features, newFeature],
  };
}
