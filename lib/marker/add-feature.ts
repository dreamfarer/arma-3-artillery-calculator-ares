import { MapMetadata } from '@/types/map-metadata';
import type { GeoJSONSource } from 'maplibre-gl';
import { convertToUnit } from '@/lib/convert';
import { Feature, FeatureCollection } from 'geojson';
import { getNextMarkerType } from '@/lib/marker/get-next-marker-type';

export async function addFeature(
  mapName: string,
  metadata: MapMetadata,
  source: GeoJSONSource,
  lat: number,
  lng: number
) {
  const [x, y] = convertToUnit(metadata, lng, lat);
  const data = (await source.getData()) as FeatureCollection;
  const newFeature: Feature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: {
      id: crypto.randomUUID(),
      x,
      y,
      map: mapName,
      markerType: getNextMarkerType(data),
    },
  };
  const next: FeatureCollection = {
    type: 'FeatureCollection',
    features: [...data.features, newFeature],
  };
  source.setData(next);
}
