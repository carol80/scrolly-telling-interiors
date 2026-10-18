import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sceneState } from './sceneState';

const DAMPING = 5;
const PARALLAX_EASE = 0.05;
const POSITION_DRIFT = 0.06;
const TARGET_DRIFT = 0.22;

export function CameraRig() {
  const pointer = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  const desired = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const smoothTarget = useRef(new THREE.Vector3(sceneState.tx, sceneState.ty, sceneState.tz));
  const elapsed = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const onPointerMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame(({ camera }, delta) => {
    const s = sceneState;
    elapsed.current += delta;

    const c = cursor.current;
    c.x += (pointer.current.x - c.x) * PARALLAX_EASE;
    c.y += (pointer.current.y - c.y) * PARALLAX_EASE;

    const drift = s.parallax;
    const breathe = Math.sin(elapsed.current * 0.45) * 0.015;

    desired.current.set(s.px, s.py + breathe, s.pz);
    desired.current.x += c.x * POSITION_DRIFT * drift;
    desired.current.y += -c.y * POSITION_DRIFT * drift;
    desiredTarget.current.set(
      s.tx + c.x * TARGET_DRIFT * drift,
      s.ty - c.y * TARGET_DRIFT * drift,
      s.tz,
    );

    const t = 1 - Math.exp(-DAMPING * delta);
    camera.position.lerp(desired.current, t);
    smoothTarget.current.lerp(desiredTarget.current, t);
    camera.lookAt(smoothTarget.current);
  });

  return null;
}
