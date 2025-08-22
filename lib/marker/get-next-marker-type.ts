import { FeatureCollection } from 'geojson';

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
