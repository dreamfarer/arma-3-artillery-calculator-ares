import { Elevation } from '@/types/elevation';
import { FireMode } from '@/types/fire-mode';

export type ArtilleryFiringSolution = {
  fireMode: FireMode;
  azimuth: number;
  elevation: Elevation;
};
