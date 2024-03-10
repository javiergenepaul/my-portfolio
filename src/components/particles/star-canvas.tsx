import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.cjs";
import { twMerge } from "tailwind-merge";
import { useSettingsStore } from "@/stores";

const Stars = (props: any) => {
  const { color } = useSettingsStore();
  const [colorParticle, setColorParticle] = useState("#22C55E");

  useEffect(() => {
    setColorParticle(getColor(color));
  }, [color]);

  const getColor = (colorSelected: string) => {
    switch (colorSelected) {
      case "azure":
        return "#3B82F6";
      case "emerald":
        return "#22C55E";
      case "golden":
        return "#FACC15";
      case "sunset":
        return "#EA580C";
      case "lavender":
        return "#6D28D9";
      case "scarlet":
        return "#E11D48";
      case "silver":
        return "#57616D";
      default:
        return "#22C55E";
    }
  };

  const ref: any = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((_state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={colorParticle}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => {
  const { enableParticleBackground } = useSettingsStore();

  return (
    <div
      className={twMerge(
        "w-full h-auto absolute inset-0 z-[-10]",
        !enableParticleBackground ? "hidden" : ""
      )}
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};
