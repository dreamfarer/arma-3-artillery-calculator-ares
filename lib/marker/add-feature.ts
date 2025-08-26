import { MapMetadata } from '@/types/map-metadata';
import type { GeoJSONSource } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';
import { getNextMarkerType } from '@/lib/marker/get-next-marker-type';
import { convertToPoint } from '@/lib/geo/convert-to-point';
import { LatLng } from '@/types/lat-lng';

export async function addFeature(
  mapName: string,
  metadata: MapMetadata,
  source: GeoJSONSource,
  latLng: LatLng
) {
  const position = convertToPoint(metadata, latLng);
  const data = (await source.getData()) as FeatureCollection;
  const newFeature: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [latLng.lng, latLng.lat],
    },
    properties: {
      id: crypto.randomUUID(),
      position,
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
