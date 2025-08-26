import { LatLng } from '@/types/lat-lng';
import { MapMetadata } from '@/types/map-metadata';
import { Point } from '@/types/point';

export function convertToLatLng(map: MapMetadata, point: Point): LatLng {
  const [imgW, imgH] = map.size;
  const [bx0, by0, bx1, by1] = map.boundsImage;
  const [dx0, dy0, dx1, dy1] = map.boundsData;

  const rx = (point.x - dx0) / (dx1 - dx0);
  const ry = (point.y - dy0) / (dy1 - dy0);
  const px = bx0 + rx * (bx1 - bx0);
  const py = by0 + ry * (by1 - by0);

  const lng = (px / imgW) * 360 - 180;
  const mercY = 1 - 2 * (py / imgH);
  const lat = (Math.atan(Math.sinh(Math.PI * mercY)) * 180) / Math.PI;

  return { lng, lat };
}
