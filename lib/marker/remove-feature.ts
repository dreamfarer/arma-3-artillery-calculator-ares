import type { GeoJSONSource } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';
import { blankFeatures } from '@/lib/marker/blank-features';
import { hasArtillery } from '@/lib/marker/has-artillery';

export async function removeFeature(source: GeoJSONSource, feature: Feature) {
  const data = (await source.getData()) as FeatureCollection;
  const id =
    feature.properties && (feature.properties.id as string | undefined);
  if (!id) return;
  let next: FeatureCollection = {
    type: 'FeatureCollection',
    features: data.features.filter((f) => f.properties?.id !== id),
  };
  if (!hasArtillery(next)) {
    next = blankFeatures(next);
  }
  source.setData(next);
}
