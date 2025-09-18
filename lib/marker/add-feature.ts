import { type GeoJSONSource, LngLat } from 'maplibre-gl';
import { Point2D } from '@/types/point-2-d';
import { FeatureCollection } from 'geojson';
import { getNextMarkerType } from '@/lib/marker/get-next-marker-type';
import { generateTargetProperties } from '@/lib/marker/generate-target-properties';
import { generateArtilleryProperties } from '@/lib/marker/generate-artillery-properties';
import { ArtilleryFeatureProperties } from '@/types/artillery-feature-properties';
import { TargetFeatureProperties } from '@/types/target-feature-properties';
import { appendFeature } from '@/lib/marker/append-feature';
import { getArtilleryPosition } from '@/lib/map/get-artillery-position';
import { recalculateFeatures } from '@/lib/marker/recalculate-features';
import { hasTargets } from '@/lib/marker/has-targets';

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

  let next: FeatureCollection = appendFeature(data, lngLat, properties);

  if (nextMarkerType === 'artillery' && hasTargets(next)) {
    const artilleryPosition = await getArtilleryPosition(next);
    next = recalculateFeatures(next, artilleryPosition);
  }

  source.setData(next);
}
