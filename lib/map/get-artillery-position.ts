import { FeatureCollection } from 'geojson';
import { GeoJSONSource } from 'maplibre-gl';
import { Point3D } from '@/types/point-3-d';

export async function getArtilleryPosition(
  source: GeoJSONSource
): Promise<Point3D> {
  const featureCollection = (await source.getData()) as FeatureCollection;
  const artilleryFeature = featureCollection.features.find(
    (feature) => feature.properties?.markerType === 'artillery'
  );

  if (!artilleryFeature) {
    throw new Error('No artillery marker type found in the feature collection');
  }

  const properties = artilleryFeature.properties;
  if (!properties) {
    throw new Error('No properties found on the source feature');
  }

  return { x: properties.x, y: properties.y, z: properties.z };
}
