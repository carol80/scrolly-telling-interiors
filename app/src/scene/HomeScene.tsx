import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneErrorBoundary } from './SceneErrorBoundary';
import { Lighting } from './Lighting';
import { HomeInterior } from './HomeInterior';
import { CameraRig } from './CameraRig';
import { INITIAL_CAMERA } from './sceneState';

export function HomeScene() {
  const [ready, setReady] = useState(false);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#efe7d8] transition-opacity duration-1000 ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <SceneErrorBoundary>
        <Canvas
          shadows="soft"
          dpr={[1, 2]}
          camera={{ fov: 42, near: 0.1, far: 80, position: INITIAL_CAMERA }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
            setReady(true);
          }}
        >
          <Suspense fallback={null}>
            <Lighting />
            <HomeInterior />
            <CameraRig />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
