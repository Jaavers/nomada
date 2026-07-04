"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 900;

function GrainField() {
  const pointsRef = useRef<THREE.Points>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 3.2 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi) * 0.4;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    const target = pointer.current;
    pointsRef.current.rotation.y +=
      delta * 0.04 + target.x * delta * 0.06;
    pointsRef.current.rotation.x += target.y * delta * 0.03;
  });

  return (
    <Points ref={pointsRef} positions={positions} frustumCulled>
      <PointMaterial
        transparent
        color="#C4A482"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

export default function HeroCanvasScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <GrainField />
    </Canvas>
  );
}
