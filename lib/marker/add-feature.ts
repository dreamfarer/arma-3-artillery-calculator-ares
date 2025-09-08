import type { GeoJSONSource } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';
import { getNextMarkerType } from '@/lib/marker/get-next-marker-type';
import { LatLng } from '@/types/lat-lng';
import { Point3D } from '@/types/point-3-d';

export async function addFeature(
  mapName: string,
  source: GeoJSONSource,
  latLng: LatLng,
  position: Point3D
) {
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
