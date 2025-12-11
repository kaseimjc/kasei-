export type AppPhase = 'tree' | 'blooming' | 'nebula' | 'collapsing';

export type GestureType = 'None' | 'Open_Palm' | 'Closed_Fist' | 'Pointing_Up';

export interface ParticleData {
  position: [number, number, number];
  scale: number;
  color: string;
}
