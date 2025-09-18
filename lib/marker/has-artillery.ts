import { FeatureCollection } from 'geojson';

export function hasArtillery(featureCollection: FeatureCollection): boolean {
  return featureCollection.features.some(
    (feature) => feature.properties?.markerType === 'artillery'
  );
}
