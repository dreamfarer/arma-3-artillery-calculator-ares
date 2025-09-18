import { FeatureCollection } from 'geojson';

export function hasTargets(featureCollection: FeatureCollection): boolean {
  return featureCollection.features.some(
    (feature) => feature.properties?.markerType === 'target'
  );
}
