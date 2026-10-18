export type Vec3Tuple = [number, number, number];

export type RigState = {
  px: number;
  py: number;
  pz: number;
  tx: number;
  ty: number;
  tz: number;
  sun: number;
  pendants: number;
  ambient: number;
  sky: number;
  parallax: number;
};

export const sceneState: RigState = {
  px: 0,
  py: 2.4,
  pz: 6.8,
  tx: 0,
  ty: 1.15,
  tz: -0.5,
  sun: 1,
  pendants: 0,
  ambient: 1,
  sky: 0,
  parallax: 0,
};

export const INITIAL_CAMERA: Vec3Tuple = [sceneState.px, sceneState.py, sceneState.pz];
