import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { CanvasLoader } from "../canvas-loader";
import { useSettingsStore } from "@/stores";
import { getColor } from "@/lib";

const Earth = () => {
  const { color } = useSettingsStore();
  const logo: any = useGLTF("./logo/logo.gltf");
  const earthRef: any = useRef();

  // Rotate the Earth around the y-axis
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005; // Adjust the speed of rotation as needed
    }
  });

  logo.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.color.set(getColor(color));
    }
  });

  return (
    <group ref={earthRef}>
      {/* Your 3D model */}
      <primitive
        object={logo.scene}
        scale={80}
        position-y={-3}
        rotation-y={0}
      />
    </group>
  );
};

const FollowCameraLight = () => {
  const lightRef: any = useRef();
  const { camera } = useThree();

  useFrame(() => {
    lightRef.current.position.copy(camera.position);
  });

  return (
    <directionalLight
      ref={lightRef}
      intensity={5}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-far={50}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
    />
  );
};

export const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Earth />
        <OrbitControls
          autoRotate={true}
          enablePan={true}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Preload all />
      </Suspense>
      <FollowCameraLight />
    </Canvas>
  );
};
