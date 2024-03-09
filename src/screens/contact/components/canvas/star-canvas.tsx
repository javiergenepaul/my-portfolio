import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.cjs";
import { CanvasLoader } from "../canvas-loader";

const Stars = (props: any) => {
  const ref: any = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 2 })
  );

  useFrame((_, delta) => {
    ref.current.rotation.x -= delta / 50;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={4} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="white"
          size={0.004}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => {
  return (
    <div className="w-full h-auto absolute inset-0 z-[-1]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={<CanvasLoader />}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};
