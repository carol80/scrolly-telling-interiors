import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { woodTexture, stoneTexture, palette } from './materials';
import { sceneState } from './sceneState';

const BOOK_COLORS = ['#b8674a', '#9aa88f', '#2a2724', '#c9a27a', '#f2ecdf', '#74826a', '#a8b8c4'];

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

type PendantProps = {
  position: [number, number, number];
  drop?: number;
  shade?: string;
};

export function Pendant({ position, drop = 0.95, shade = palette.charcoal }: PendantProps) {
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const on = sceneState.pendants;
    if (light.current) light.current.intensity = 16 * on;
    if (bulb.current) {
      const mat = bulb.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.15 + 2.6 * on;
    }
  });

  const shadeTopY = position[1] + drop;
  return (
    <group position={position}>
      <mesh position={[0, (3 - shadeTopY) / 2 + 0.01, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 3 - shadeTopY, 6]} />
        <meshStandardMaterial color={palette.charcoal} />
      </mesh>
      <mesh position={[0, drop, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.15, 0.18, 24]} />
        <meshStandardMaterial color={shade} roughness={0.6} />
      </mesh>
      <mesh ref={bulb} position={[0, drop - 0.06, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#fff3dc" emissive="#ffca7a" emissiveIntensity={0.2} />
      </mesh>
      <pointLight
        ref={light}
        position={[0, drop - 0.1, 0]}
        color="#ffb472"
        intensity={0}
        distance={5.5}
        decay={2}
      />
    </group>
  );
}

export function Kitchen() {
  const counter = useMemo(() => stoneTexture(), []);
  return (
    <group>
      <mesh position={[-4.61, 0.44, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.88, 4.6]} />
        <meshStandardMaterial color="#e7e0d2" roughness={0.85} />
      </mesh>
      {[-2.35, -1.45, -0.55, 0.35].map((z) => (
        <mesh key={z} position={[-4.29, 0.78, z]}>
          <boxGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color={palette.charcoal} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-4.58, 0.905, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.05, 4.72]} />
        <meshStandardMaterial map={counter} roughness={0.35} />
      </mesh>
      <mesh position={[-4.9, 1.2, -0.9]}>
        <boxGeometry args={[0.03, 0.56, 4.6]} />
        <meshStandardMaterial map={counter} roughness={0.35} />
      </mesh>
      {[1.72, 2.08].map((y) => (
        <mesh key={y} position={[-4.77, y, -0.9]} castShadow>
          <boxGeometry args={[0.26, 0.035, 2.7]} />
          <meshStandardMaterial color={palette.oakLight} roughness={0.6} />
        </mesh>
      ))}
      {[
        [-4.77, 1.86, -1.7],
        [-4.77, 1.86, -1.35],
        [-4.77, 1.86, -0.4],
        [-4.77, 2.22, -1.5],
        [-4.77, 2.22, -0.7],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.2, 14]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#d9d2c2' : palette.sage}
            roughness={0.4}
          />
        </mesh>
      ))}
      <mesh position={[-4.62, 0.945, -2.1]}>
        <boxGeometry args={[0.4, 0.015, 0.55]} />
        <meshStandardMaterial color="#aeb3ba" metalness={0.4} roughness={0.3} />
      </mesh>
      <group position={[-4.62, 0.955, -2.1]}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.28, 10]} />
          <meshStandardMaterial color={palette.brass} metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.28, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.011, 8, 16, Math.PI / 2]} />
          <meshStandardMaterial color={palette.brass} metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.19, 0.18]}>
          <cylinderGeometry args={[0.011, 0.011, 0.1, 10]} />
          <meshStandardMaterial color={palette.brass} metalness={0.35} roughness={0.35} />
        </mesh>
      </group>
      <mesh position={[-4.62, 0.935, 0.55]}>
        <boxGeometry args={[0.5, 0.012, 0.55]} />
        <meshStandardMaterial color="#33302c" roughness={0.4} />
      </mesh>
      {[
        [-4.74, 0.45],
        [-4.5, 0.45],
        [-4.74, 0.65],
        [-4.5, 0.65],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.945, z]}>
          <cylinderGeometry args={[0.07, 0.07, 0.008, 20]} />
          <meshStandardMaterial color="#1d1b19" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-4.72, 1.0, -0.25]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 10]} />
        <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Island() {
  const counter = useMemo(() => stoneTexture(), []);
  const rng = useMemo(() => seededRandom(7), []);
  const fruit = useMemo(
    () =>
      Array.from({ length: 3 }, () => ({
        x: -2.5 + (rng() - 0.5) * 0.12,
        z: 0.15 + (rng() - 0.5) * 0.12,
        color: ['#c96f43', '#9aa88f', '#d9a441'][Math.floor(rng() * 3)],
        r: 0.04 + rng() * 0.015,
      })),
    [rng],
  );
  return (
    <group>
      <mesh position={[-2.5, 0.45, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.9, 2.1]} />
        <meshStandardMaterial color={palette.oak} roughness={0.55} />
      </mesh>
      <mesh position={[-2.5, 0.93, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.06, 2.3]} />
        <meshStandardMaterial map={counter} roughness={0.3} />
      </mesh>
      {[-0.25 - 1.17, -0.25 + 1.17].map((z) => (
        <mesh key={z} position={[-2.5, 0.45, z]} castShadow>
          <boxGeometry args={[1.15, 0.9, 0.04]} />
          <meshStandardMaterial map={counter} roughness={0.3} />
        </mesh>
      ))}
      {[-0.85, -0.25, 0.35].map((z) => (
        <group key={z} position={[-1.7, 0, z]}>
          <mesh position={[0, 0.62, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.16, 0.05, 20]} />
            <meshStandardMaterial color={palette.oakLight} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.6, 10]} />
            <meshStandardMaterial color={palette.charcoal} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.14, 0.15, 0.02, 20]} />
            <meshStandardMaterial color={palette.charcoal} roughness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh position={[-2.5, 1.0, 0.15]}>
        <cylinderGeometry args={[0.16, 0.12, 0.06, 20]} />
        <meshStandardMaterial color="#ddd6c8" roughness={0.5} />
      </mesh>
      {fruit.map((f, i) => (
        <mesh key={i} position={[f.x, 1.04, f.z]} castShadow>
          <sphereGeometry args={[f.r, 14, 14]} />
          <meshStandardMaterial color={f.color} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-2.42, 0.975, -0.65]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.34, 0.02, 0.24]} />
        <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function DiningSet() {
  const wood = useMemo(() => woodTexture([1, 1]), []);
  const candleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const rng = useMemo(() => seededRandom(21), []);
  const chairs = useMemo(
    () => [
      { x: 0.15, z: -0.82, ry: 0 },
      { x: 0.85, z: -0.82, ry: 0 },
      { x: 0.15, z: -2.38, ry: Math.PI },
      { x: 0.85, z: -2.38, ry: Math.PI },
    ],
    [],
  );
  const books = useMemo(
    () =>
      Array.from({ length: 2 }, (_, i) => ({
        y: 0.795 + i * 0.028,
        w: 0.2 - i * 0.03,
        color: BOOK_COLORS[Math.floor(rng() * BOOK_COLORS.length)],
        ry: rng() * 0.6,
      })),
    [rng],
  );

  useFrame(() => {
    candleRefs.current.forEach((c) => {
      if (!c) return;
      const mat = c.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = sceneState.pendants * 3;
    });
  });

  return (
    <group>
      <mesh position={[0.5, 0.745, -1.6]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.05, 0.95]} />
        <meshStandardMaterial map={wood} roughness={0.5} />
      </mesh>
      {[
        [-0.31, -1.21],
        [1.31, -1.21],
        [-0.31, -1.99],
        [1.31, -1.99],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
          <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
        </mesh>
      ))}
      {chairs.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]} rotation={[0, c.ry, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.4]} />
            <meshStandardMaterial color={palette.oakLight} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.72, 0.19]} castShadow>
            <boxGeometry args={[0.4, 0.5, 0.035]} />
            <meshStandardMaterial color={palette.oakLight} roughness={0.6} />
          </mesh>
          {[
            [-0.18, 0.17],
            [0.18, 0.17],
            [-0.18, -0.17],
            [0.18, -0.17],
          ].map(([lx, lz], j) => (
            <mesh key={j} position={[lx, 0.225, lz]}>
              <boxGeometry args={[0.03, 0.45, 0.03]} />
              <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0.5, 0.865, -1.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.065, 0.17, 14]} />
        <meshStandardMaterial color={palette.sage} roughness={0.5} />
      </mesh>
      <mesh position={[0.5, 0.99, -1.6]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={palette.sageDark} roughness={0.7} />
      </mesh>
      {books.map((b, i) => (
        <mesh key={i} position={[0.14, b.y, -1.52]} rotation={[0, b.ry, 0]}>
          <boxGeometry args={[b.w, 0.024, 0.15]} />
          <meshStandardMaterial color={b.color} roughness={0.7} />
        </mesh>
      ))}
      {[0.88, 1.0].map((x, i) => (
        <group key={i} position={[x, 0, -1.68]}>
          <mesh position={[0, 0.81, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.022, 0.12, 10]} />
            <meshStandardMaterial color={palette.linen} roughness={0.6} />
          </mesh>
          <mesh ref={(el) => { candleRefs.current[i] = el; }} position={[0, 0.89, 0]}>
            <sphereGeometry args={[0.013, 8, 8]} />
            <meshStandardMaterial
              color="#ffc98a"
              emissive="#ffb257"
              emissiveIntensity={0}
            />
          </mesh>
        </group>
      ))}
      <Pendant position={[0.5, 1.85, -1.6]} drop={0.9} shade={palette.terracotta} />
    </group>
  );
}

export function LivingArea() {
  const rng = useMemo(() => seededRandom(42), []);
  const bookRows = useMemo(() => {
    const rows: { x: number; y: number; z: number; h: number; d: number; color: string }[] = [];
    [0.52, 1.02, 1.52].forEach((shelfY) => {
      let cursor = -1.82;
      while (cursor < -0.08) {
        const d = 0.03 + rng() * 0.03;
        if (rng() > 0.82) {
          cursor += 0.1 + rng() * 0.15;
          continue;
        }
        rows.push({
          x: 4.82,
          y: shelfY + 0.11,
          z: cursor + d / 2,
          h: 0.16 + rng() * 0.1,
          d,
          color: BOOK_COLORS[Math.floor(rng() * BOOK_COLORS.length)],
        });
        cursor += d + 0.006;
      }
    });
    return rows;
  }, [rng]);

  return (
    <group>
      <mesh position={[2.35, 0.014, 1.1]} receiveShadow>
        <boxGeometry args={[3.3, 0.024, 2.35]} />
        <meshStandardMaterial color="#d5c7ae" roughness={0.95} />
      </mesh>
      <group position={[3.5, 0, 1.1]}>
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 0.34, 2.15]} />
          <meshStandardMaterial color={palette.fabric} roughness={0.9} />
        </mesh>
        {[-0.52, 0.52].map((z) => (
          <mesh key={z} position={[0.02, 0.52, z]} castShadow>
            <boxGeometry args={[0.85, 0.18, 1.02]} />
            <meshStandardMaterial color="#e0d7c7" roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[0.36, 0.68, 0]} castShadow>
          <boxGeometry args={[0.22, 0.62, 2.15]} />
          <meshStandardMaterial color={palette.fabric} roughness={0.9} />
        </mesh>
        {[-0.52, 0.52].map((z) => (
          <mesh key={z} position={[0.26, 0.86, z]} rotation={[0, 0, -0.08]} castShadow>
            <boxGeometry args={[0.16, 0.5, 0.95]} />
            <meshStandardMaterial color="#e4dccd" roughness={0.95} />
          </mesh>
        ))}
        {[-1.08, 1.08].map((z) => (
          <mesh key={z} position={[0, 0.55, z]} castShadow>
            <boxGeometry args={[0.95, 0.52, 0.24]} />
            <meshStandardMaterial color={palette.fabric} roughness={0.9} />
          </mesh>
        ))}
        {[-1.08, 1.08].map((z) => (
          <group key={`legset-${z}`}>
            {[-0.38, 0.38].map((x) => (
              <mesh key={x} position={[x, 0.05, z]}>
                <cylinderGeometry args={[0.03, 0.025, 0.1, 8]} />
                <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}
        <RoundedBox
          args={[0.34, 0.34, 0.12]}
          radius={0.05}
          position={[0.12, 0.62, -0.68]}
          rotation={[0, 0, 0.35]}
          castShadow
        >
          <meshStandardMaterial color={palette.terracotta} roughness={0.9} />
        </RoundedBox>
        <RoundedBox
          args={[0.32, 0.32, 0.12]}
          radius={0.05}
          position={[0.14, 0.62, 0.66]}
          rotation={[0, 0, -0.3]}
          castShadow
        >
          <meshStandardMaterial color={palette.sage} roughness={0.9} />
        </RoundedBox>
      </group>
      <group position={[2.05, 0, 1.1]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.045, 28]} />
          <meshStandardMaterial color={palette.oak} roughness={0.5} />
        </mesh>
        {[0, 2.1, 4.2].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.3, 0.2, Math.sin(a) * 0.3]} castShadow>
            <cylinderGeometry args={[0.022, 0.018, 0.4, 8]} />
            <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
          </mesh>
        ))}
        {[
          { y: 0.475, w: 0.24, color: BOOK_COLORS[3], ry: 0.2 },
          { y: 0.503, w: 0.2, color: BOOK_COLORS[1], ry: -0.1 },
        ].map((b, i) => (
          <mesh key={i} position={[0.08, b.y, 0.06]} rotation={[0, b.ry, 0]}>
            <boxGeometry args={[b.w, 0.028, 0.17]} />
            <meshStandardMaterial color={b.color} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[-0.15, 0.52, -0.1]}>
          <cylinderGeometry args={[0.045, 0.06, 0.12, 12]} />
          <meshStandardMaterial color="#ddd6c8" roughness={0.5} />
        </mesh>
      </group>
      <FloorLamp position={[4.35, 0, 2.35]} />
      <group position={[4.9, 1.35, 1.1]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.15, 0.85, 0.04]} />
          <meshStandardMaterial color={palette.oakLight} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.08, 0.025]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color={palette.terracotta} roughness={0.9} />
        </mesh>
        <mesh position={[0.22, -0.2, 0.025]} rotation={[0, 0, 0.3]}>
          <planeGeometry args={[0.3, 0.22]} />
          <meshStandardMaterial color={palette.sage} roughness={0.9} />
        </mesh>
        <mesh position={[-0.22, -0.18, 0.025]}>
          <planeGeometry args={[0.2, 0.34]} />
          <meshStandardMaterial color={palette.linen} roughness={0.9} />
        </mesh>
      </group>
      <group position={[4.84, 0, -0.95]}>
        {[-1.9, 0.0].map((z) => (
          <mesh key={z} position={[0, 1.25, z]} castShadow>
            <boxGeometry args={[0.3, 2.5, 0.035]} />
            <meshStandardMaterial color={palette.oak} roughness={0.6} />
          </mesh>
        ))}
        {[0.5, 1.0, 1.5, 2.0].map((y) => (
          <mesh key={y} position={[0, y, -0.95]} castShadow>
            <boxGeometry args={[0.3, 0.035, 1.9]} />
            <meshStandardMaterial color={palette.oak} roughness={0.6} />
          </mesh>
        ))}
        {bookRows.map((b, i) => (
          <mesh key={i} position={[b.x - 4.84, b.y, b.z - 0.95]} castShadow>
            <boxGeometry args={[0.2, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.75} />
          </mesh>
        ))}
        <mesh position={[0, 1.68, -1.4]}>
          <cylinderGeometry args={[0.09, 0.07, 0.06, 16]} />
          <meshStandardMaterial color="#ddd6c8" roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.17, -0.6]}>
          <boxGeometry args={[0.18, 0.14, 0.14]} />
          <meshStandardMaterial color={palette.charcoal} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export function FloorLamp({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const on = sceneState.pendants;
    if (light.current) light.current.intensity = 14 * on;
    if (bulb.current) {
      const mat = bulb.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.1 + 2.4 * on;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.17, 0.03, 20]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 1.5, 8]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.17, 0.21, 0.3, 24, 1, true]} />
        <meshStandardMaterial
          color={palette.linen}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={bulb} position={[0, 1.56, 0]}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial color="#fff3dc" emissive="#ffca7a" emissiveIntensity={0.1} />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 1.5, 0]}
        color="#ffb472"
        intensity={0}
        distance={5}
        decay={2}
      />
    </group>
  );
}

export function DeskNook() {
  const wood = useMemo(() => woodTexture([1, 1]), []);
  return (
    <group position={[3.15, 0, -3.02]}>
      <mesh position={[0, 0.73, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.04, 0.55]} />
        <meshStandardMaterial map={wood} roughness={0.5} />
      </mesh>
      {[
        [-0.58, -0.22],
        [0.58, -0.22],
        [-0.58, 0.22],
        [0.58, 0.22],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.355, z]}>
          <boxGeometry args={[0.045, 0.71, 0.045]} />
          <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-0.3, 0.79, 0.05]} castShadow>
        <boxGeometry args={[0.24, 0.02, 0.17]} />
        <meshStandardMaterial color={BOOK_COLORS[0]} roughness={0.7} />
      </mesh>
      <mesh position={[0.32, 0.815, 0]}>
        <cylinderGeometry args={[0.04, 0.035, 0.09, 14]} />
        <meshStandardMaterial color={palette.terracotta} roughness={0.5} />
      </mesh>
      <mesh position={[0.385, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.028, 0.007, 8, 14]} />
        <meshStandardMaterial color={palette.terracotta} roughness={0.5} />
      </mesh>
      <mesh position={[0.55, 0.98, -0.18]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.4} />
      </mesh>
      <mesh position={[0.55, 1.1, -0.24]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.075, 0.09, 16, 1, true]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.55, 1.09, -0.24]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshStandardMaterial color="#fff3dc" emissive="#ffca7a" emissiveIntensity={0.4} />
      </mesh>
      <group position={[0, 0, 0.62]}>
        <mesh position={[0, 0.235, 0]} castShadow>
          <boxGeometry args={[0.4, 0.04, 0.38]} />
          <meshStandardMaterial color={palette.oakLight} roughness={0.6} />
        </mesh>
        {[
          [-0.16, -0.15],
          [0.16, -0.15],
          [-0.16, 0.15],
          [0.16, 0.15],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.11, z]}>
            <boxGeometry args={[0.03, 0.2, 0.03]} />
            <meshStandardMaterial color={palette.oakDark} roughness={0.6} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 1.62, -0.1]}>
        <boxGeometry args={[1.1, 0.03, 0.22]} />
        <meshStandardMaterial color={palette.oakLight} roughness={0.6} />
      </mesh>
      <mesh position={[-0.25, 1.74, -0.1]}>
        <boxGeometry args={[0.14, 0.18, 0.1]} />
        <meshStandardMaterial color={palette.sage} roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 1.72, -0.1]}>
        <cylinderGeometry args={[0.06, 0.05, 0.14, 12]} />
        <meshStandardMaterial color="#d9d2c2" roughness={0.4} />
      </mesh>
    </group>
  );
}
