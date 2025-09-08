import { MapMetadata } from '@/types/map-metadata';
import { Point2D } from '@/types/point-2-d';
import { LatLng } from '@/types/lat-lng';

export function convertToPoint2D(map: MapMetadata, latLng: LatLng): Point2D {
  const [imgW, imgH] = map.size;
  const [bx0, by0, bx1, by1] = map.boundsImage;
  const [dx0, dy0, dx1, dy1] = map.boundsData;

  const px = ((latLng.lng + 180) / 360) * imgW;
  const mercY = Math.log(Math.tan(Math.PI / 4 + (latLng.lat * Math.PI) / 360));
  const py = ((1 - mercY / Math.PI) / 2) * imgH;

  const rx = (px - bx0) / (bx1 - bx0);
  const ry = 1 - (py - by0) / (by1 - by0);

  const x = dx0 + rx * (dx1 - dx0);
  const y = dy0 + ry * (dy1 - dy0);

  return { x, y };
}
