// src/components/three/FloatingElements.jsx
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ── Procedural floating shapes ─────────────── */

function GlowOrb({ position, color, size = 0.3, speed = 1 }) {
  const ref = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.y = position[1] + Math.sin(t) * 0.6;
    ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[size * 2.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function SacredRing({ position, radius = 1.2, color = '#D4AF37' }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.3;
    ref.current.rotation.z = clock.getElapsedTime() * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[radius, 0.02, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

function DiamondShape({ position, color = '#FF7A00', scale = 0.4 }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.5;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

/* ── Scene composition ──────────────────────── */

function Scene({ count, spread }) {
  const elements = useMemo(() => {
    const items = [];
    const saffron = '#FF7A00';
    const gold = '#D4AF37';
    const cream = '#F5E6B8';

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread * 0.6;
      const z = (Math.random() - 0.5) * spread * 0.4;
      const type = i % 3;

      if (type === 0) {
        items.push(
          <GlowOrb
            key={`orb-${i}`}
            position={[x, y, z]}
            color={i % 2 === 0 ? saffron : gold}
            size={0.15 + Math.random() * 0.2}
            speed={0.5 + Math.random() * 0.8}
          />
        );
      } else if (type === 1) {
        items.push(
          <SacredRing
            key={`ring-${i}`}
            position={[x, y, z]}
            radius={0.6 + Math.random() * 0.8}
            color={i % 2 === 0 ? gold : cream}
          />
        );
      } else {
        items.push(
          <DiamondShape
            key={`diamond-${i}`}
            position={[x, y, z]}
            color={i % 3 === 0 ? saffron : gold}
            scale={0.2 + Math.random() * 0.3}
          />
        );
      }
    }
    return items;
  }, [count, spread]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#FF7A00" />
      <pointLight position={[-10, -5, 5]} intensity={0.4} color="#D4AF37" />

      <Stars
        radius={80}
        depth={50}
        count={1500}
        factor={3}
        saturation={0.2}
        fade
        speed={0.8}
      />

      {elements}
    </>
  );
}

export function FloatingElements({
  count = 12,
  spread = 20,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0, ...style }}
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene count={count} spread={spread} />
        </Suspense>
      </Canvas>
    </div>
  );
}
