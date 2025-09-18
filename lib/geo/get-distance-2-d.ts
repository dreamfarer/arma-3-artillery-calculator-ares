import { Point2D } from '@/types/point-2-d';

export function getDistance2D(a: Point2D, b: Point2D) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(Math.pow(Math.abs(dx), 2) + Math.pow(Math.abs(dy), 2));
}
