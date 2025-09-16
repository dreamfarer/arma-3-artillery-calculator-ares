import { FeatureCollection } from 'geojson';

export function getNextMarkerType(
  featureCollection: FeatureCollection
): 'target' | 'artillery' {
  if (
    featureCollection.features.some(
      (feature) => feature.properties?.markerType === 'artillery'
    )
  ) {
    return 'target';
  }
  return 'artillery';
}
