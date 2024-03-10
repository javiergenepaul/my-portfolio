import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { CanvasLoader } from "../canvas-loader";
import { useSettingsStore } from "@/stores";
import { getColor } from "@/lib";
import { twMerge } from "tailwind-merge";

const Logo = () => {
  const { color } = useSettingsStore();
  const logo: any = useGLTF("./logo/logo.gltf");
  const logoRef: any = useRef();

  useEffect(() => {
    // Function to update the color of the meshes
    const updateMeshColor = (child: any) => {
      if (child.isMesh) {
        child.material.color.set(getColor(color));
      }
    };

    // Traverse through the scene and update mesh colors
    logo.scene.traverse(updateMeshColor);

    // Return cleanup function to avoid memory leaks
    return () => {
      logo.scene.traverse(updateMeshColor);
    };
  }, [color]);

  useEffect(() => {
    // Function to update the color of the meshes
    const updateMeshColor = (child: any) => {
      if (child.isMesh) {
        child.material.color.set(getColor(color));
      }
    };

    // Traverse through the scene and update mesh colors
    logo.scene.traverse(updateMeshColor);

    // Return cleanup function to avoid memory leaks
    return () => {
      logo.scene.traverse(updateMeshColor);
    };
  }, []);

  return (
    <group ref={logoRef}>
      {/* Your 3D model */}
      <primitive
        object={logo.scene}
        scale={60}
        position-y={-2}
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

export const LogoCanvas = () => {
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  return (
    <Canvas
      onMouseDown={() => setIsGrabbing(true)}
      onMouseUp={() => setIsGrabbing(false)}
      className={twMerge("cursor-grab", isGrabbing ? "cursor-grabbing" : "")}
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
        <Logo />
        <OrbitControls
          autoRotate={true}
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Suspense>
      <FollowCameraLight />
    </Canvas>
  );
};
