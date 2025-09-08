import { FireMode } from '@/types/fire-mode';

export function getArtilleryFireMode(distance: number): FireMode {
  console.log(distance);
  if (distance < 826) throw new Error('Too close.');
  if (distance < 2237) return { name: 'Close', initialVelocity: 153.9 }; // 810*0.19 m/s
  if (distance < 5646) return { name: 'Medium', initialVelocity: 243 }; // 810*0.3 m/s
  if (distance < 15029) return { name: 'Far', initialVelocity: 388.8 }; // 810*0.48 m/s
  if (distance < 42818) return { name: 'Further', initialVelocity: 648 }; // 810*0.48 m/s
  throw new Error('Too far.');
}
