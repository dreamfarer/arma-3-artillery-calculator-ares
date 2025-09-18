import { Point3D } from '@/types/point-3-d';

export function getDeltaElevation(source: Point3D, target: Point3D) {
  return target.z - source.z;
}
