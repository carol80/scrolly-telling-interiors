import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { woodTexture, plasterTexture, palette } from './materials';
import { sceneState } from './sceneState';
import { Kitchen, Island, DiningSet, LivingArea, DeskNook, Pendant } from './furniture';

const WIN = { xMin: -3.2, xMax: 3.2, yMin: 0.75, yMax: 2.55, z: -3.5 };

function SkyBackdrop() {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const gradient = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.55, '#fdf4e4');
    g.addColorStop(1, '#f7e3c2');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const day = useMemo(() => new THREE.Color('#dcebf2'), []);
  const dusk = useMemo(() => new THREE.Color('#eb9a55'), []);
  const night = useMemo(() => new THREE.Color('#2b3448'), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!mat.current) return;
    const s = sceneState.sky;
    if (s < 0.6) tmp.lerpColors(day, dusk, s / 0.6);
    else tmp.lerpColors(dusk, night, (s - 0.6) / 0.4);
    mat.current.color.copy(tmp);
  });

  return (
    <mesh position={[0, 4.5, -11]}>
      <planeGeometry args={[44, 22]} />
      <meshBasicMaterial ref={mat} map={gradient} toneMapped={false} />
    </mesh>
  );
}

function SunShafts() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const base = sceneState.sun * 0.12;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = base * (0.8 + 0.2 * Math.sin(clock.elapsedTime * 0.4 + i));
    });
  });
  return (
    <group ref={group}>
      {[
        { pos: [-1.6, 1.35, -1.4], w: 1.1, ry: 0.32 },
        { pos: [-0.2, 1.3, -1.1], w: 0.8, ry: 0.38 },
        { pos: [1.2, 1.25, -0.8], w: 1.3, ry: 0.3 },
      ].map((s, i) => (
        <mesh key={i} position={[s.pos[0], s.pos[1], s.pos[2]]} rotation={[-1.05, s.ry, 0]}>
          <planeGeometry args={[s.w, 4.4]} />
          <meshBasicMaterial
            color="#ffe3b0"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Ceiling() {
  const materials = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame(({ camera }) => {
    const opacity = THREE.MathUtils.clamp((3.25 - camera.position.y) / 0.6, 0, 1);
    materials.current.forEach((m) => {
      m.opacity = opacity;
      m.transparent = opacity < 1;
    });
  });
  const collect = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !materials.current.includes(m)) materials.current.push(m);
  };
  return (
    <group>
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.4, 7.4]} />
        <meshStandardMaterial
          ref={collect}
          color="#f6f1e7"
          emissive="#f6f1e7"
          emissiveIntensity={0.22}
          roughness={0.95}
          transparent
          opacity={1}
        />
      </mesh>
      {[-2.1, -0.4, 1.3].map((z) => (
        <mesh key={z} position={[0, 2.9, z]}>
          <boxGeometry args={[10.2, 0.16, 0.14]} />
          <meshStandardMaterial
            ref={collect}
            color={palette.oak}
            roughness={0.7}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Curtains() {
  return (
    <group>
      <mesh position={[0, 2.62, -3.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 7.4, 8]} />
        <meshStandardMaterial color={palette.brass} metalness={0.3} roughness={0.4} />
      </mesh>
      {[-3.5, 3.5].map((x) => (
        <mesh key={x} position={[x, 1.42, -3.3]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 2.35, 18, 1, true, Math.PI * 0.15, Math.PI * 0.7]} />
          <meshStandardMaterial
            color={palette.linen}
            roughness={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Plants() {
  const rng = useMemo(() => {
    let s = 99;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }, []);
  const foliage = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        pos: [(rng() - 0.5) * 0.5, 0.62 + rng() * 0.5, (rng() - 0.5) * 0.5] as const,
        r: 0.14 + rng() * 0.14,
        color: rng() > 0.5 ? palette.sageDark : palette.green,
      })),
    [rng],
  );
  return (
    <group>
      <group position={[-4.35, 0, -2.95]}>
        <mesh position={[0, 0.19, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.18, 0.38, 18]} />
          <meshStandardMaterial color={palette.terracotta} roughness={0.8} />
        </mesh>
        {foliage.map((f, i) => (
          <mesh key={i} position={[f.pos[0], f.pos[1], f.pos[2]]} scale={[1, 0.8, 1]} castShadow>
            <sphereGeometry args={[f.r, 12, 12]} />
            <meshStandardMaterial color={f.color} roughness={0.85} />
          </mesh>
        ))}
      </group>
      <group position={[4.35, 0, -0.3]}>
        <mesh position={[0, 0.26, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.14, 0.52, 14]} />
          <meshStandardMaterial color="#ddd6c8" roughness={0.7} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[Math.cos(i * 2.1) * 0.12, 0.75 + i * 0.14, Math.sin(i * 2.1) * 0.12]}
            rotation={[0.3 * Math.cos(i), 0, 0.3 * Math.sin(i)]}
            scale={[0.35, 1, 0.35]}
            castShadow
          >
            <sphereGeometry args={[0.28, 10, 10]} />
            <meshStandardMaterial color={palette.sageDark} roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Clock() {
  return (
    <group position={[3.9, 2.2, -3.4]}>
      <mesh>
        <cylinderGeometry args={[0.17, 0.17, 0.035, 28]} />
        <meshStandardMaterial color={palette.oak} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.005, 28]} />
        <meshStandardMaterial color={palette.linen} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.045, 0.028]}>
        <boxGeometry args={[0.012, 0.09, 0.005]} />
        <meshStandardMaterial color={palette.charcoal} />
      </mesh>
      <mesh position={[0, 0, 0.028]} rotation={[0, 0, -1.2]}>
        <boxGeometry args={[0.012, 0.07, 0.005]} />
        <meshStandardMaterial color={palette.charcoal} />
      </mesh>
    </group>
  );
}

export function HomeInterior() {
  const floorTex = useMemo(() => woodTexture([4, 3]), []);
  const wallTex = useMemo(() => plasterTexture(), []);

  return (
    <group>
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[10.4, 0.12, 7.4]} />
        <meshStandardMaterial map={floorTex} roughness={0.65} />
      </mesh>
      <mesh position={[0, -0.13, 0]} receiveShadow={false}>
        <boxGeometry args={[16, 0.02, 12]} />
        <meshStandardMaterial color="#e6ddcb" roughness={1} />
      </mesh>
      <mesh position={[0, 4.5, 14]}>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#e6ddcb" roughness={1} />
      </mesh>

      <mesh position={[-4.925, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[7.4, 3]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[4.925, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[7.4, 3]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[-4.1, 1.5, -3.575]}>
        <boxGeometry args={[1.8, 3, 0.15]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[4.1, 1.5, -3.575]}>
        <boxGeometry args={[1.8, 3, 0.15]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.375, -3.575]}>
        <boxGeometry args={[6.4, 0.75, 0.15]} />
        <meshStandardMaterial color={palette.wallClay} roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.775, -3.575]}>
        <boxGeometry args={[6.4, 0.45, 0.15]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>

      {[
        { pos: [WIN.xMin - 0.05, (WIN.yMin + WIN.yMax) / 2, WIN.z + 0.08], size: [0.1, WIN.yMax - WIN.yMin, 0.12] },
        { pos: [WIN.xMax + 0.05, (WIN.yMin + WIN.yMax) / 2, WIN.z + 0.08], size: [0.1, WIN.yMax - WIN.yMin, 0.12] },
        { pos: [0, WIN.yMax + 0.05, WIN.z + 0.08], size: [6.5, 0.1, 0.12] },
        { pos: [0, WIN.yMin - 0.02, WIN.z + 0.14], size: [6.7, 0.07, 0.24] },
      ].map((f, i) => (
        <mesh key={i} position={f.pos as [number, number, number]} castShadow>
          <boxGeometry args={f.size as [number, number, number]} />
          <meshStandardMaterial color={palette.oakLight} roughness={0.55} />
        </mesh>
      ))}
      {[-1.07, 1.07].map((x) => (
        <mesh key={x} position={[x, 1.65, WIN.z + 0.08]}>
          <boxGeometry args={[0.05, 1.8, 0.1]} />
          <meshStandardMaterial color={palette.oakLight} roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 1.65, WIN.z + 0.08]}>
        <boxGeometry args={[6.4, 0.05, 0.1]} />
        <meshStandardMaterial color={palette.oakLight} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.65, WIN.z + 0.1]}>
        <planeGeometry args={[6.4, 1.8]} />
        <meshPhysicalMaterial
          color="#dce8ee"
          transparent
          opacity={0.07}
          roughness={0.05}
          metalness={0}
        />
      </mesh>

      <SkyBackdrop />
      <SunShafts />
      <Curtains />
      <Ceiling />
      <Clock />
      <Plants />

      <Kitchen />
      <Island />
      <Pendant position={[-2.5, 1.95, -0.75]} drop={0.95} />
      <Pendant position={[-2.5, 1.95, 0.25]} drop={0.95} />
      <DiningSet />
      <LivingArea />
      <DeskNook />
    </group>
  );
}
