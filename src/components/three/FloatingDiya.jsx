import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Floating Diya (Oil Lamp) - 3D Component
   - Procedural diya shape via LatheGeometry
   - Animated flame with glow
   - Smoke particle effect
   - Golden metallic material
   ═══════════════════════════════════════════ */

function DiyaLamp({ position = [0, 0, 0], scale = 1 }) {
  const flameRef = useRef();
  const smokeRef = useRef();

  const diyaProfile = useMemo(() => {
    const points = [];
    // Bottom flat
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.3, 0));
    // Curved bowl
    points.push(new THREE.Vector2(0.45, 0.05));
    points.push(new THREE.Vector2(0.55, 0.12));
    points.push(new THREE.Vector2(0.6, 0.2));
    points.push(new THREE.Vector2(0.58, 0.28));
    points.push(new THREE.Vector2(0.52, 0.32));
    // Lip
    points.push(new THREE.Vector2(0.55, 0.35));
    points.push(new THREE.Vector2(0.5, 0.37));
    // Inner curve down
    points.push(new THREE.Vector2(0.4, 0.32));
    points.push(new THREE.Vector2(0.2, 0.28));
    points.push(new THREE.Vector2(0, 0.25));
    return points;
  }, []);

  // Smoke particles
  const smokePositions = useMemo(() => {
    const count = 30;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = Math.random() * 1.5 + 0.6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flameRef.current) {
      flameRef.current.scale.x = 1 + Math.sin(t * 8) * 0.15;
      flameRef.current.scale.z = 1 + Math.cos(t * 6) * 0.15;
      flameRef.current.scale.y = 1 + Math.sin(t * 10) * 0.1;
      flameRef.current.rotation.y = Math.sin(t * 3) * 0.1;
    }
    if (smokeRef.current) {
      const arr = smokeRef.current.geometry.attributes.position.array;
      for (let i = 0; i < 30; i++) {
        arr[i * 3 + 1] += 0.008;
        arr[i * 3] += Math.sin(t + i) * 0.002;
        if (arr[i * 3 + 1] > 2.5) {
          arr[i * 3 + 1] = 0.6;
          arr[i * 3] = (Math.random() - 0.5) * 0.15;
        }
      }
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8} position={position}>
      <group scale={scale}>
        {/* Diya body */}
        <mesh rotation={[0, 0, 0]}>
          <latheGeometry args={[diyaProfile, 32]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.85}
            roughness={0.15}
            emissive="#8B6914"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Oil inside */}
        <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 24]} />
          <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.8} />
        </mesh>

        {/* Wick */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
          <meshBasicMaterial color="#F5DEB3" />
        </mesh>

        {/* Flame outer */}
        <group ref={flameRef} position={[0, 0.55, 0]}>
          <mesh>
            <coneGeometry args={[0.08, 0.35, 12]} />
            <meshBasicMaterial color="#FF9F40" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Flame inner */}
          <mesh position={[0, -0.02, 0]}>
            <coneGeometry args={[0.04, 0.2, 8]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
          </mesh>
        </group>

        {/* Flame glow */}
        <pointLight color="#FF7A00" intensity={3} distance={6} position={[0, 0.6, 0]} />
        <pointLight color="#FFD700" intensity={1} distance={3} position={[0, 0.5, 0]} />

        {/* Sparkles around flame */}
        <Sparkles count={20} scale={1.5} size={2} speed={0.5} opacity={0.5} position={[0, 0.7, 0]} color="#FF9F40" />

        {/* Smoke particles */}
        <points ref={smokeRef} position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={30} array={smokePositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.03} color="#999999" transparent opacity={0.15} depthWrite={false} />
        </points>

        {/* Base plate */}
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.65, 32]} />
          <meshStandardMaterial color="#B8860B" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

function AmbientParticles() {
  const ref = useRef();
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.003;
      arr[i * 3] += Math.cos(t * 0.3 + i * 0.5) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#D4AF37" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#FFF0E0" />
      <DiyaLamp position={[0, -0.5, 0]} scale={2} />
      <DiyaLamp position={[-3, 0.5, -2]} scale={1.2} />
      <DiyaLamp position={[3.5, -0.3, -1.5]} scale={1} />
      <AmbientParticles />
    </>
  );
}

export default function FloatingDiya() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export { DiyaLamp };
