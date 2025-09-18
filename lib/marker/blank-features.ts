import { Feature, FeatureCollection } from 'geojson';

export function blankFeatures(features: FeatureCollection): FeatureCollection {
  features.features.forEach((feature: Feature) => {
    if (!feature.properties || feature.properties.markerType === 'artillery') {
      return;
    }
    feature.properties.azimuth = null;
    feature.properties.direct = null;
    feature.properties.indirect = null;
    feature.properties.fireMode = null;
  });
  return features;
}
