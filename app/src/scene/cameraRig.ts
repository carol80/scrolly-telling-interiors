import type { Vec3Tuple } from './sceneState';

export type Keyframe = {
  id: string;
  position: Vec3Tuple;
  target: Vec3Tuple;
  lighting: { sun: number; pendants: number; ambient: number };
  sky: number;
  parallax?: number;
};

export const KEYFRAMES: Keyframe[] = [
  {
    id: 'waking',
    position: [-0.5, 1.78, 7.0],
    target: [0, 1.0, -0.4],
    lighting: { sun: 1, pendants: 0, ambient: 1 },
    sky: 0,
    parallax: 0.6,
  },
  {
    id: 'kitchen',
    position: [-1.3, 1.6, 2.7],
    target: [-3.5, 0.95, -1.3],
    lighting: { sun: 1, pendants: 0, ambient: 0.95 },
    sky: 0,
    parallax: 1,
  },
  {
    id: 'tactile',
    position: [-1.55, 1.18, 1.05],
    target: [-2.7, 0.88, -0.65],
    lighting: { sun: 0.9, pendants: 0, ambient: 0.9 },
    sky: 0.1,
    parallax: 1,
  },
  {
    id: 'open-plan',
    position: [2.3, 1.5, 4.7],
    target: [-0.9, 1.0, -1.5],
    lighting: { sun: 0.55, pendants: 0.3, ambient: 0.7 },
    sky: 0.55,
    parallax: 0.8,
  },
  {
    id: 'dusk',
    position: [-1.5, 1.7, 4.3],
    target: [1.3, 0.85, -0.9],
    lighting: { sun: 0.18, pendants: 1, ambient: 0.55 },
    sky: 0.9,
    parallax: 0.8,
  },
  {
    id: 'settle',
    position: [0, 5.4, 9.6],
    target: [0, 0.85, 0],
    lighting: { sun: 0.06, pendants: 1, ambient: 0.45 },
    sky: 1,
    parallax: 0.3,
  },
];
