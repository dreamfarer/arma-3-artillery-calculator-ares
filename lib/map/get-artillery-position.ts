import { FeatureCollection } from 'geojson';
import { GeoJSONSource } from 'maplibre-gl';
import { Point } from '@/types/point';

export async function getArtilleryPosition(
  source: GeoJSONSource
): Promise<Point> {
  const featureCollection = (await source.getData()) as FeatureCollection;
  const artilleryFeature = featureCollection.features.find(
    (feature) => feature.properties?.markerType === 'artillery'
  );

  if (!artilleryFeature) {
    throw new Error('No artillery marker type found in the feature collection');
  }

  return artilleryFeature.properties?.position;
}
