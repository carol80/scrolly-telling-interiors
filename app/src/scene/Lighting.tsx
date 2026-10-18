import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sceneState } from './sceneState';

const SUN_DAY = new THREE.Color('#fff1dc');
const SUN_GOLDEN = new THREE.Color('#ff9d5c');

export function Lighting() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const tmp = useMemo(() => new THREE.Color(), []);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const s = sceneState;
    if (sun.current) {
      sun.current.intensity = 3.6 * s.sun;
      tmp.lerpColors(SUN_DAY, SUN_GOLDEN, Math.min(1, s.sky * 1.4));
      sun.current.color.copy(tmp);
    }
    if (hemi.current) hemi.current.intensity = 0.62 * s.ambient;
    if (fill.current) fill.current.intensity = 2.2 + 3.5 * s.pendants;
  });

  return (
    <group>
      <primitive object={target} position={[0.5, 0, 1.2]} />
      <directionalLight
        ref={sun}
        position={[-3.5, 5.5, -9]}
        target={target}
        intensity={3.6}
        color="#fff1dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <hemisphereLight
        ref={hemi}
        color="#fff6e6"
        groundColor="#c4ab90"
        intensity={0.62}
      />
      <pointLight
        ref={fill}
        position={[0, 1.6, 0.5]}
        color="#ffd9ac"
        intensity={1.2}
        distance={12}
        decay={2}
      />
    </group>
  );
}
