"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WireKnot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.elapsedTime * 0.04;
    ref.current.rotation.y = clock.elapsedTime * 0.06;
  });
  return (
    <mesh ref={ref} scale={6}>
      <torusKnotGeometry args={[0.8, 0.22, 120, 16]} />
      <meshBasicMaterial color="#BE123C" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

function Particles({ count = 160 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 34;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.35 + i) * 0.0008;
      arr[i * 3]     += Math.cos(t * 0.25 + i) * 0.0008;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.055} color="#FB7185" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function ParticleBg() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 12], fov: 55 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
    >
      <Particles />
      <WireKnot />
    </Canvas>
  );
}
