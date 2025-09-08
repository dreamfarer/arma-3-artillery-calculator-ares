import { Point2D } from '@/types/point-2-d';

export function getAzimuth(source: Point2D, target: Point2D): number {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const deg = (Math.atan2(dx, dy) * 180) / Math.PI;
  return (deg + 360) % 360;
}
