import { Elevation } from '@/types/elevation';
import { radToDeg } from '@/lib/convert';

export function calculateElevationFromProjectileTrajectory(
  distance: number,
  deltaElevation: number,
  muzzleVelocity: number,
  gravity: number = 9.80665
): Elevation {
  const velocitySquared = Math.pow(muzzleVelocity, 2);
  const discriminant = Math.sqrt(
    Math.pow(muzzleVelocity, 4) -
      gravity *
        (gravity * Math.pow(distance, 2) + 2 * deltaElevation * velocitySquared)
  );

  const direct = radToDeg(
    Math.atan((velocitySquared - discriminant) / (gravity * distance))
  );
  const indirect = radToDeg(
    Math.atan((velocitySquared + discriminant) / (gravity * distance))
  );

  return { direct, indirect };
}
