import { type GeoJSONSource, LngLat } from 'maplibre-gl';
import { Point2D } from '@/types/point-2-d';
import { Feature, FeatureCollection } from 'geojson';
import { getNextMarkerType } from '@/lib/marker/get-next-marker-type';
import { generateTargetProperties } from '@/lib/marker/generate-target-properties';
import { generateArtilleryProperties } from '@/lib/marker/generate-artillery-properties';
import { ArtilleryFeatureProperties } from '@/types/artillery-feature-properties';
import { TargetFeatureProperties } from '@/types/target-feature-properties';

export async function addFeature(
  map: string,
  source: GeoJSONSource,
  lngLat: LngLat,
  position: Point2D,
  elevation: number
) {
  const data = (await source.getData()) as FeatureCollection;
  const nextMarkerType = getNextMarkerType(data);
  let properties:
    | ArtilleryFeatureProperties
    | TargetFeatureProperties
    | undefined;
  if (nextMarkerType === 'target') {
    properties = await generateTargetProperties(
      map,
      source,
      position,
      elevation
    );
  } else {
    properties = generateArtilleryProperties(map, position, elevation);
  }
  if (!properties) return;

  const newFeature: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lngLat.lng, lngLat.lat],
    },
    properties,
  };
  const next: FeatureCollection = {
    type: 'FeatureCollection',
    features: [...data.features, newFeature],
  };
  source.setData(next);
}
