"use client";

import { useRef, Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import { twMerge } from "tailwind-merge";
import { useSettingsStore } from "@/stores";
import { getColor } from "@/lib";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Distributes `count` points evenly on the SURFACE of a sphere with the
 * given radius. This is the key difference from inSphere (which fills a
 * volume) — every star is at the same distance so there's no visible
 * spherical boundary when the camera is inside.
 */
function onSphereSurface(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = radius * Math.cos(phi);
  }
  return arr;
}

// ─── Star layers ──────────────────────────────────────────────────────────────

/**
 * Dense background stars — placed on a large sphere so they look like
 * distant stars at "infinity" with no visible edge.
 */
function BackgroundStars() {
  const ref = useRef<THREE.Points>(null!);
  // radius 120: all stars appear at the same depth, no sphere silhouette
  const positions = useMemo(() => onSphereSurface(6000, 120), []);

  useFrame((_s, dt) => {
    ref.current.rotation.x -= dt / 60;
    ref.current.rotation.y -= dt / 80;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#d8e8ff"
        size={0.9} // pixel size — sizeAttenuation off so all stars
        sizeAttenuation={false} // appear the same size regardless of depth
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

/** Sparser mid-layer stars — slightly larger, softly tinted with accent. */
function ForegroundStars({ accentColor }: { accentColor: string }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => onSphereSurface(900, 90), []);

  useFrame((_s, dt) => {
    ref.current.rotation.x += dt / 90;
    ref.current.rotation.y -= dt / 50;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={accentColor}
        size={1.8}
        sizeAttenuation={false}
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

// ─── Asteroid ─────────────────────────────────────────────────────────────────

interface AsteroidData {
  id: number;
  pos: [number, number, number];
  scale: number;
  spin: [number, number, number];
  drift: [number, number, number];
  detail: 0 | 1;
}

function Asteroid({
  pos,
  scale,
  spin,
  drift,
  detail,
}: Omit<AsteroidData, "id">) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const position = useRef(new THREE.Vector3(...pos));

  useFrame((_s, dt) => {
    const m = meshRef.current;
    m.rotation.x += spin[0] * dt;
    m.rotation.y += spin[1] * dt;
    m.rotation.z += spin[2] * dt;

    position.current.x += drift[0] * dt;
    position.current.y += drift[1] * dt;
    position.current.z += drift[2] * dt;

    // Wrap to opposite side when drifted out of bounds
    if (position.current.length() > 2.4) {
      position.current.multiplyScalar(-0.85);
    }

    m.position.copy(position.current);
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <icosahedronGeometry args={[0.06, detail]} />
      <meshStandardMaterial
        color="#1e1812"
        roughness={0.95}
        metalness={0.08}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

function Asteroids() {
  const data = useMemo<AsteroidData[]>(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.4;
        const r = 0.4 + Math.random() * 1.8;
        return {
          id: i,
          pos: [
            Math.cos(angle) * r + (Math.random() - 0.5) * 0.5,
            Math.sin(angle) * r + (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.8,
          ],
          scale: 0.25 + Math.random() * 1.4,
          spin: [
            (Math.random() - 0.5) * 0.7,
            (Math.random() - 0.5) * 0.7,
            (Math.random() - 0.5) * 0.4,
          ],
          drift: [
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            0,
          ],
          detail: Math.random() > 0.6 ? 1 : 0,
        } satisfies AsteroidData;
      }),
    [],
  );

  return (
    <>
      {data.map((a) => (
        <Asteroid key={a.id} {...a} />
      ))}
    </>
  );
}

// ─── Shooting star ────────────────────────────────────────────────────────────

function ShootingStar({ delay }: { delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);

  const state = useRef({
    alive: false,
    t: 0,
    duration: 0.6,
    origin: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    timer: delay,
  });

  const _yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const _quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_s, dt) => {
    const d = state.current;

    if (!d.alive) {
      d.timer -= dt;
      if (d.timer > 0) return;

      // Pick a spawn edge and shoot across
      const edge = Math.floor(Math.random() * 4);
      const span = 1.5 + Math.random() * 0.5;
      const side = (Math.random() - 0.5) * 2 * span;

      switch (edge) {
        case 0:
          d.origin.set(side, span, 0);
          break;
        case 1:
          d.origin.set(side, -span, 0);
          break;
        case 2:
          d.origin.set(span, side, 0);
          break;
        default:
          d.origin.set(-span, side, 0);
          break;
      }

      d.velocity
        .set(
          -d.origin.x + (Math.random() - 0.5) * 0.6,
          -d.origin.y + (Math.random() - 0.5) * 0.6,
          0,
        )
        .normalize()
        .multiplyScalar(2.5 + Math.random() * 1.5);

      d.t = 0;
      d.duration = 0.45 + Math.random() * 0.35;
      d.alive = true;
      meshRef.current.visible = true;
    } else {
      d.t += dt;

      const pos = d.origin.clone().addScaledVector(d.velocity, d.t);
      meshRef.current.position.copy(pos);

      // Align cylinder (Y-axis) with velocity direction
      _quat.setFromUnitVectors(_yAxis, d.velocity.clone().normalize());
      meshRef.current.quaternion.copy(_quat);

      matRef.current.opacity = Math.max(0, (1 - d.t / d.duration) * 0.95);

      if (d.t >= d.duration || pos.length() > 2.8) {
        d.alive = false;
        d.timer = Math.random() * 9 + 5;
        meshRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <cylinderGeometry args={[0.0006, 0.0002, 0.22, 3]} />
      <meshBasicMaterial
        ref={matRef}
        color="#e8f0ff"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Space scene root ─────────────────────────────────────────────────────────

function SpaceScene() {
  const { color } = useSettingsStore();
  const [accentColor, setAccentColor] = useState("#22c55e");

  useEffect(() => {
    setAccentColor(getColor(color));
  }, [color]);

  return (
    <>
      {/* Stars */}
      <BackgroundStars />
      <ForegroundStars accentColor={accentColor} />

      {/* Shooting stars — staggered start delays */}
      <ShootingStar delay={2} />
      <ShootingStar delay={6} />
      <ShootingStar delay={11} />
      <ShootingStar delay={17} />
    </>
  );
}

// ─── Exported canvas wrapper ──────────────────────────────────────────────────

export const StarsCanvas = () => {
  const { enableParticleBackground } = useSettingsStore();

  return (
    <div
      className={twMerge(
        "w-full h-auto absolute inset-0 -z-10 pointer-events-none",
        !enableParticleBackground ? "hidden" : "",
      )}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <SpaceScene />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};
