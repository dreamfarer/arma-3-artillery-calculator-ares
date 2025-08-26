import { MapMetadata } from '@/types/map-metadata';
import { RectangleLatLng } from '@/types/rectangle-lat-lng';
import { convertToLatLng } from '@/lib/geo/convert-to-lat-lng';
import { Point } from '@/types/point';

export function getMapBounds(map: MapMetadata): RectangleLatLng {
  const tL: Point = { x: map.boundsData[0], y: map.boundsData[1] };
  const bR: Point = { x: map.boundsData[2], y: map.boundsData[3] };
  const northWest = convertToLatLng(map, tL);
  const southEast = convertToLatLng(map, bR);
  return { northWest, southEast };
}
