import { Feature, FeatureCollection } from 'geojson';
import { Point3D } from '@/types/point-3-d';
import { getArtilleryFiringSolution } from '@/lib/artillery/get-artillery-firing-solution';

export function recalculateFeatures(
  features: FeatureCollection,
  artilleryPosition: Point3D
): FeatureCollection {
  features.features.forEach((feature: Feature) => {
    if (!feature.properties || feature.properties.markerType === 'artillery') {
      return;
    }
    try {
      console.log(feature.properties);
      const firingSolution = getArtilleryFiringSolution(artilleryPosition, {
        x: feature.properties.x,
        y: feature.properties.y,
        z: feature.properties.z,
      } as Point3D);
      console.log(firingSolution);
      feature.properties.azimuth = firingSolution.azimuth;
      feature.properties.direct = firingSolution.elevation.direct;
      feature.properties.indirect = firingSolution.elevation.indirect;
      feature.properties.fireMode = firingSolution.fireMode.name;
    } catch (err) {
      console.error('Failed to calculate firing solution:', err);
      return;
    }
  });
  return features;
}
