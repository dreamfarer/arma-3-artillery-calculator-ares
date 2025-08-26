import { RectangleLatLng } from '@/types/rectangle-lat-lng';

export function flattenRectangleLatLng(
  rectangle: RectangleLatLng
): [number, number, number, number] {
  return [
    rectangle.northWest.lng,
    rectangle.southEast.lat,
    rectangle.southEast.lng,
    rectangle.northWest.lat,
  ];
}
