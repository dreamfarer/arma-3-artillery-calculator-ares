import type { GeoJSONSource } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';

export async function removeFeature(source: GeoJSONSource, feature: Feature) {
  const data = (await source.getData()) as FeatureCollection;
  const id =
    feature.properties && (feature.properties.id as string | undefined);
  if (!id) return;
  const next: FeatureCollection = {
    type: 'FeatureCollection',
    features: data.features.filter((f) => f.properties?.id !== id),
  };
  source.setData(next);
}
