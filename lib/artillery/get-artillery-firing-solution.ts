import { getAzimuth } from '@/lib/geo/get-azimuth';
import { ArtilleryFiringSolution } from '@/types/artillery-firing-solution';
import { getDistance2D } from '@/lib/geo/get-distance-2-d';
import { getDeltaElevation } from '@/lib/geo/get-delta-elevation';
import { getArtilleryFireMode } from '@/lib/artillery/get-artillery-firemode';
import { calculateElevationFromProjectileTrajectory } from '@/lib/artillery/calculate-elevation-from-projectile-trajectory';
import { Point3D } from '@/types/point-3-d';

export function getArtilleryFiringSolution(
  source: Point3D,
  target: Point3D
): ArtilleryFiringSolution {
  const azimuth = getAzimuth(source, target);
  const distance = getDistance2D(source, target);
  const deltaElevation = getDeltaElevation(source, target);
  const fireMode = getArtilleryFireMode(distance);
  const elevation = calculateElevationFromProjectileTrajectory(
    distance,
    deltaElevation,
    fireMode.initialVelocity
  );

  return { fireMode, azimuth, elevation };
}
