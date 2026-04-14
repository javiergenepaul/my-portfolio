"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// ── Camera rig ────────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    // Angle from front-right so the PC tower is clearly in frame left-to-right
    camera.position.set(4.2, 3.4, 8.5);
    camera.lookAt(0.4, 0.15, 0.0);
    camera.updateProjectionMatrix();
  });
  return null;
}

// ── Flicker hook ──────────────────────────────────────────────────────────────
function useFlicker(base = 5, chance = 0.07) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        if (Math.random() < chance) {
          let n = 0;
          const max = Math.floor(Math.random() * 4) + 2;
          const b = setInterval(() => {
            setOn(v => !v);
            if (++n >= max * 2) { clearInterval(b); setOn(true); schedule(); }
          }, 60 + Math.random() * 80);
        } else schedule();
      }, base * 1000 + (Math.random() - 0.5) * 3000);
    };
    schedule();
    return () => clearTimeout(t);
  }, [base, chance]);
  return on;
}

// ── Screen shader ─────────────────────────────────────────────────────────────
function ScreenMat({
  color = "#00ffcc", on = true, distort = 0.35, curve = 0.0,
}: { color?: string; on?: boolean; distort?: number; curve?: number }) {
  const ref = useRef<THREE.ShaderMaterial>(null!);
  const base = useMemo(() => new THREE.Color(color), [color]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uOn: { value: 1.0 },
    uColor: { value: base }, uDistort: { value: distort }, uCurve: { value: curve },
  }), [base, distort, curve]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.uniforms.uTime.value = clock.getElapsedTime();
    ref.current.uniforms.uOn.value = on ? 1.0 : 0.0;
  });

  return (
    <shaderMaterial ref={ref} uniforms={uniforms}
      vertexShader={`
        varying vec2 vUv;
        uniform float uCurve;
        void main(){
          vUv = uv;
          vec3 p = position;
          p.z += uCurve * p.x * p.x;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
        }
      `}
      fragmentShader={`
        uniform float uTime,uOn,uDistort;
        uniform vec3 uColor;
        varying vec2 vUv;
        float rand(vec2 c){ return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453); }
        void main(){
          if(uOn<0.5){ gl_FragColor=vec4(0.013,0.013,0.017,1.0); return; }
          vec2 uv=vUv;
          float ny=step(0.965,rand(vec2(floor(uTime*5.0),floor(uv.y*26.0))));
          uv.x+=ny*uDistort*0.018*rand(vec2(uTime,uv.y));
          float scan=sin(uv.y*280.0+uTime*2.8)*0.018*uDistort;
          vec2 c=uv-0.5;
          float vig=1.0-smoothstep(0.25,0.90,dot(c,c)*2.6);
          float glow=clamp(1.0-length(c)*0.72,0.0,1.0);
          float noise=rand(uv+uTime*0.38)*0.032*uDistort;
          vec3 col=uColor*(0.44+glow*0.68+scan)*vig+vec3(noise);
          col.r+=0.028*uDistort*sin(uv.y*95.0+uTime*2.0);
          col.b-=0.012*uDistort*sin(uv.y*95.0+uTime*2.0);
          gl_FragColor=vec4(col,1.0);
        }
      `}
    />
  );
}

// ── Samsung Odyssey Neo G9 57" ────────────────────────────────────────────────
function OdysseyG9({ pos }: { pos: [number, number, number] }) {
  const on = useFlicker(9, 0.06);
  const W = 5.6, H = 1.58, bCol = "#dde0ee";
  return (
    <group position={pos}>
      <mesh position={[0, H/2+0.04, 0]}><boxGeometry args={[W+0.16,0.06,0.06]}/><meshStandardMaterial color={bCol} roughness={0.25} metalness={0.6}/></mesh>
      <mesh position={[0,-H/2-0.06, 0]}><boxGeometry args={[W+0.16,0.10,0.06]}/><meshStandardMaterial color={bCol} roughness={0.25} metalness={0.6}/></mesh>
      <mesh position={[-(W/2+0.04),0,0]}><boxGeometry args={[0.06,H+0.14,0.06]}/><meshStandardMaterial color={bCol} roughness={0.25} metalness={0.6}/></mesh>
      <mesh position={[ (W/2+0.04),0,0]}><boxGeometry args={[0.06,H+0.14,0.06]}/><meshStandardMaterial color={bCol} roughness={0.25} metalness={0.6}/></mesh>

      <mesh position={[0,0,0.042]}>
        <planeGeometry args={[W,H,48,1]}/>
        <ScreenMat color="#a855f7" on={on} distort={0.28} curve={0.025}/>
      </mesh>

      {on && <>
        <Text position={[0,0.22,0.12]}   fontSize={0.34} color="#d8b4fe" anchorX="center" anchorY="middle" letterSpacing={0.13}>COMING SOON</Text>
        <Text position={[0,-0.14,0.12]}  fontSize={0.12} color="#c084fc" anchorX="center" anchorY="middle" letterSpacing={0.22} fillOpacity={0.6}>GPM · 2027 PORTFOLIO</Text>
      </>}

      {/* Odyssey Infinity LED strip */}
      <mesh position={[0,-H/2-0.07,0.09]}><boxGeometry args={[W-0.1,0.02,0.006]}/><meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={on?1.6:0}/></mesh>
      <mesh position={[-(W/2+0.04),0,0.06]}><boxGeometry args={[0.008,H,0.006]}/><meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={on?1.0:0}/></mesh>
      <mesh position={[ (W/2+0.04),0,0.06]}><boxGeometry args={[0.008,H,0.006]}/><meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={on?1.0:0}/></mesh>

      <mesh position={[0,-H/2-0.14,0.04]}><boxGeometry args={[0.13,0.22,0.10]}/><meshStandardMaterial color="#c4c8d8" roughness={0.4} metalness={0.7}/></mesh>
      <mesh position={[0,-H/2-0.28,0.32]} rotation={[-0.04,0,0]}>
        <cylinderGeometry args={[0.62,0.65,0.05,32]}/>
        <meshStandardMaterial color="#bec2d2" roughness={0.45} metalness={0.65}/>
      </mesh>
    </group>
  );
}

// ── MSI 32" ───────────────────────────────────────────────────────────────────
function MSIMonitor({ pos, rot }: { pos:[number,number,number]; rot:[number,number,number] }) {
  const on = useFlicker(7, 0.09);
  return (
    <group position={pos} rotation={rot}>
      <mesh><boxGeometry args={[2.26,1.40,0.06]}/><meshStandardMaterial color="#1c1c22" roughness={0.4} metalness={0.65}/></mesh>
      <mesh position={[0,0,0.035]}><planeGeometry args={[2.08,1.24]}/><ScreenMat color="#f97316" on={on} distort={0.22}/></mesh>
      {on && <>
        <Text position={[0, 0.13,0.055]} fontSize={0.14} color="#fb923c" anchorX="center" anchorY="middle" letterSpacing={0.1}>COMING SOON</Text>
        <Text position={[0,-0.10,0.055]} fontSize={0.068} color="#fed7aa" anchorX="center" anchorY="middle" letterSpacing={0.18} fillOpacity={0.6}>2027 EDITION</Text>
      </>}
      <mesh position={[0,-0.71,0.036]}><boxGeometry args={[1.9,0.02,0.007]}/><meshStandardMaterial color="#dc2626" emissive="#cc1111" emissiveIntensity={1.2}/></mesh>
      <mesh position={[0,0,-0.055]}><boxGeometry args={[0.09,0.12,0.055]}/><meshStandardMaterial color="#222228" roughness={0.5} metalness={0.8}/></mesh>
    </group>
  );
}

// ── Monitor arm ───────────────────────────────────────────────────────────────
function MonitorArm({ pos }: { pos:[number,number,number] }) {
  return (
    <group position={pos}>
      <mesh position={[0,0.5,0]}><cylinderGeometry args={[0.02,0.02,1.8,10]}/><meshStandardMaterial color="#282830" roughness={0.4} metalness={0.85}/></mesh>
      <mesh position={[0,1.22,-0.3]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.015,0.015,0.62,10]}/><meshStandardMaterial color="#282830" roughness={0.4} metalness={0.85}/></mesh>
      <mesh position={[0,1.22,0]}><sphereGeometry args={[0.032,10,10]}/><meshStandardMaterial color="#1e1e24" roughness={0.5} metalness={0.8}/></mesh>
      <mesh position={[0,-0.44,0]}><boxGeometry args={[0.10,0.12,0.10]}/><meshStandardMaterial color="#222228" roughness={0.5} metalness={0.8}/></mesh>
    </group>
  );
}

// ── Gaming PC tower ───────────────────────────────────────────────────────────
function GamingPC({ pos }: { pos:[number,number,number] }) {
  const fan1 = useRef<THREE.MeshStandardMaterial>(null!);
  const fan2 = useRef<THREE.MeshStandardMaterial>(null!);
  const fan3 = useRef<THREE.MeshStandardMaterial>(null!);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta * 0.5;
    const c = new THREE.Color().setHSL((t.current * 0.07) % 1, 1.0, 0.55);
    fan1.current?.emissive.copy(c);
    fan2.current?.emissive.copy(c);
    fan3.current?.emissive.copy(c);
  });

  return (
    <group position={pos}>
      <mesh>
        <boxGeometry args={[0.68,1.85,0.80]}/>
        {/* Lighter gunmetal so case silhouette reads in dark scene */}
        <meshStandardMaterial color="#2e2e3e" roughness={0.45} metalness={0.85}/>
      </mesh>
      {/* Glass panel */}
      <mesh position={[-0.341,0.05,0]}>
        <boxGeometry args={[0.006,1.72,0.76]}/>
        <meshStandardMaterial color="#88bbff" transparent opacity={0.16} roughness={0.0} metalness={0.0} side={THREE.DoubleSide}/>
      </mesh>
      {/* Front mesh */}
      <mesh position={[0,0,0.401]}>
        <boxGeometry args={[0.62,1.70,0.01]}/>
        <meshStandardMaterial color="#16161e" roughness={0.8} metalness={0.4}/>
      </mesh>
      {/* 3 RGB fans */}
      {([-0.44,0.0,0.44] as number[]).map((y,i) => (
        <group key={i} position={[0,y,0.408]}>
          <mesh><torusGeometry args={[0.098,0.016,8,24]}/><meshStandardMaterial color="#111118" roughness={0.5}/></mesh>
          <mesh>
            <circleGeometry args={[0.086,24]}/>
            <meshStandardMaterial ref={i===0?fan1:i===1?fan2:fan3} color="#00183a" emissive="#0055ff" emissiveIntensity={3.5} transparent opacity={0.88}/>
          </mesh>
          <mesh position={[0,0,0.003]}><circleGeometry args={[0.024,12]}/><meshStandardMaterial color="#0a0a12" roughness={0.6}/></mesh>
        </group>
      ))}
      {/* Power LED */}
      <mesh position={[0.342,0.80,0.28]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.014,0.014,0.006,12]}/>
        <meshStandardMaterial color="#00aaff" emissive="#0066ff" emissiveIntensity={2.5}/>
      </mesh>
      <mesh position={[0,0.928,0]}><boxGeometry args={[0.65,0.012,0.76]}/><meshStandardMaterial color="#111118" roughness={0.85} metalness={0.4}/></mesh>
      {([-0.22,0.22] as number[]).flatMap(x=>
        ([-0.28,0.28] as number[]).map(z=>(
          <mesh key={`${x}-${z}`} position={[x,-0.932,z]}><boxGeometry args={[0.055,0.024,0.055]}/><meshStandardMaterial color="#1a1a22" roughness={0.9}/></mesh>
        ))
      )}
    </group>
  );
}

// ── Corsair Falchion Pro LP ───────────────────────────────────────────────────
const KC=["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#3b82f6"];

function FalchionLP({ pos }: { pos:[number,number,number] }) {
  const cols = useMemo(()=>Array.from({length:70},(_,i)=>KC[i%KC.length]),[]);
  return (
    <group position={pos}>
      <mesh><boxGeometry args={[1.30,0.032,0.46]}/><meshStandardMaterial color="#d4d8e8" roughness={0.20} metalness={0.55}/></mesh>
      <mesh position={[0,-0.025,0]}><boxGeometry args={[1.32,0.014,0.475]}/><meshStandardMaterial color="#c4c8d8" roughness={0.30} metalness={0.45}/></mesh>
      {Array.from({length:5},(_,row)=>
        Array.from({length:14},(_,col)=>{
          const isSpace=row===4&&col>=4&&col<=7;
          if(row===4&&col>4&&col<=7) return null;
          const kw=(isSpace?3.5:1)*0.082-0.010;
          const cx=-0.565+col*0.086+(isSpace?(col-4)*0.082*0.5:0);
          return (
            <mesh key={`${row}-${col}`} position={[cx,0.024,-0.175+row*0.086]}>
              <boxGeometry args={[kw,0.015,0.070]}/>
              <meshStandardMaterial color={cols[row*14+col]} emissive={cols[row*14+col]} emissiveIntensity={0.7} roughness={0.38}/>
            </mesh>
          );
        })
      )}
    </group>
  );
}

// ── Corsair Harpe Ace Mini ────────────────────────────────────────────────────
function HarpeAceMini({ pos, rot }: { pos:[number,number,number]; rot?:[number,number,number] }) {
  const r:[number,number,number]=rot??[0,0,0];
  return (
    <group position={pos} rotation={r}>
      <mesh><boxGeometry args={[0.160,0.046,0.282]}/><meshStandardMaterial color="#e6e8f2" roughness={0.20} metalness={0.16}/></mesh>
      <mesh position={[0,0.026,-0.042]}><boxGeometry args={[0.146,0.018,0.188]}/><meshStandardMaterial color="#eef0fa" roughness={0.16}/></mesh>
      <mesh position={[-0.042,0.027,-0.038]}><boxGeometry args={[0.062,0.006,0.150]}/><meshStandardMaterial color="#e0e2ec" roughness={0.27}/></mesh>
      <mesh position={[ 0.042,0.027,-0.038]}><boxGeometry args={[0.062,0.006,0.150]}/><meshStandardMaterial color="#e0e2ec" roughness={0.27}/></mesh>
      <mesh position={[0,0.032,-0.054]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.015,0.015,0.048,14]}/><meshStandardMaterial color="#b6b8cc" roughness={0.55} metalness={0.35}/></mesh>
      <mesh position={[0,0.028,0.062]}><circleGeometry args={[0.015,12]}/><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3}/></mesh>
    </group>
  );
}

// ── Mousepad ──────────────────────────────────────────────────────────────────
function Mousepad({ pos }: { pos:[number,number,number] }) {
  return <mesh position={pos}><boxGeometry args={[1.9,0.005,1.0]}/><meshStandardMaterial color="#0b0b10" roughness={0.97}/></mesh>;
}

// ── Desk + room ───────────────────────────────────────────────────────────────
function Desk() {
  return (
    <group>
      <mesh position={[0,-1.56,0.6]}><boxGeometry args={[8.5,0.07,2.9]}/><meshStandardMaterial color="#1a1510" roughness={0.68} metalness={0.12}/></mesh>
      {([-3.8,3.8] as number[]).flatMap(x=>
        ([-0.4,1.7] as number[]).map(z=>(
          <mesh key={`${x}-${z}`} position={[x,-2.84,z]}><boxGeometry args={[0.055,2.58,0.055]}/><meshStandardMaterial color="#18181e" roughness={0.5} metalness={0.85}/></mesh>
        ))
      )}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-4.26,0]}><planeGeometry args={[30,24]}/><meshStandardMaterial color="#0c0c0e" roughness={0.98}/></mesh>
      <mesh position={[0,2,-2.3]}><planeGeometry args={[30,14]}/><meshStandardMaterial color="#0e0e12" roughness={1.0}/></mesh>
      <mesh rotation={[0,-Math.PI/2,0]} position={[6.2,1,1.5]}><planeGeometry args={[8,12]}/><meshStandardMaterial color="#0f0f13" roughness={1.0}/></mesh>
    </group>
  );
}

// ── Scene — MAX 5 point lights total ─────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Base: hemisphere + ambient only — no point lights for general fill */}
      <ambientLight intensity={0.10} color="#1a1030"/>
      <hemisphereLight args={["#1e1540","#060408",0.22]}/>

      {/* 1 — Odyssey main glow (the scene's key light) */}
      <pointLight position={[0,0.35,1.2]} color="#9333ea" intensity={4.0} distance={10} decay={2}/>

      {/* 2 — Odyssey wide spill (both sides, single light centred) */}
      <pointLight position={[0,-0.5,0.6]} color="#6d28d9" intensity={1.0} distance={7} decay={2}/>

      {/* 3 — MSI screen glow */}
      <pointLight position={[0.3,2.4,0.6]} color="#ea580c" intensity={1.0} distance={5} decay={2}/>

      {/* 4 — PC RGB interior (strong, so it reads through glass) */}
      <pointLight position={[3.60,0.35,0.90]} color="#0055ff" intensity={4.5} distance={5.5} decay={2}/>

      {/* 5 — Soft front fill so keyboard/desk silhouette lifts out of black */}
      <pointLight position={[1.2,1.0,7.5]} color="#1e1840" intensity={0.45} distance={14} decay={2}/>

      {/* 6 — PC rim light from camera-right so case edge is readable */}
      <pointLight position={[5.5,1.5,3.5]} color="#334488" intensity={1.2} distance={5} decay={2}/>

      <Desk/>
      <OdysseyG9 pos={[0,0.30,0]}/>
      <MonitorArm pos={[0.4,0.40,-0.40]}/>
      <MSIMonitor pos={[0.4,2.28,-0.54]} rot={[0.30,0.0,0]}/>
      <GamingPC pos={[3.60,0.37,0.90]}/>
      <Mousepad pos={[0.65,-1.525,1.38]}/>
      <FalchionLP pos={[0,-1.506,1.38]}/>
      <HarpeAceMini pos={[1.30,-1.507,1.30]} rot={[0,0.08,0]}/>
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function DeskScene() {
  const [ctxLost, setCtxLost] = useState(false);

  if (ctxLost) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: "radial-gradient(ellipse 70% 60% at 50% 45%, #1a0a35 0%, #07070a 70%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 8, background: "linear-gradient(135deg,#6d28d9,#4f46e5)", opacity: 0.7 }}/>
        <span style={{ color: "#a78bfa", fontSize: 12, letterSpacing: "0.2em", fontFamily: "monospace" }}>
          GPM · 2027
        </span>
      </div>
    );
  }

  return (
    <Canvas
      // No shadows — saves 2–4 shadow map textures per light
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        // Recover gracefully if context is lost
        failIfMajorPerformanceCaveat: false,
      }}
      // Cap pixel ratio so hi-DPI screens don't over-allocate VRAM
      dpr={[1, 1.5]}
      style={{ background: "#07070a" }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          setCtxLost(true);
        });
      }}
    >
      <PerspectiveCamera makeDefault fov={50} near={0.1} far={80}/>
      <CameraRig/>
      <Scene/>
    </Canvas>
  );
}
