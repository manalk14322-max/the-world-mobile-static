import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import type { Group } from "three";

function PhoneModel() {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={group}>
        <RoundedBox args={[1.05, 2.15, 0.12]} radius={0.08} smoothness={8} castShadow>
          <meshStandardMaterial color="#1a2332" metalness={0.85} roughness={0.25} />
        </RoundedBox>
        <RoundedBox args={[0.92, 1.95, 0.02]} radius={0.06} smoothness={8} position={[0, 0, 0.07]}>
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.4}
            chromaticAberration={0.08}
            anisotropy={0.25}
            distortion={0.15}
            distortionScale={0.25}
            temporalDistortion={0.08}
            color="#8ed8ff"
            transmission={0.95}
          />
        </RoundedBox>
        <mesh position={[0.38, 0.85, 0.08]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <spotLight position={[4, 6, 5]} angle={0.35} penumbra={0.5} intensity={2.2} castShadow />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#33a1ff" />
      <PhoneModel />
      <Environment preset="city" />
    </>
  );
}

export function PhoneHeroScene() {
  return (
    <div className="relative h-[min(52vh,420px)] w-full min-h-[280px] sm:h-[420px] lg:h-[480px]">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-brand-500/10 via-transparent to-transparent" />
      <Canvas
        className="rounded-3xl"
        shadows
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
