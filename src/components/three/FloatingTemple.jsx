import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Floating Temple Silhouette - 3D Component
   - Temple shape from basic geometries
   - Ethereal golden glow
   - Particle dust around it
   - Used for About/spiritual pages
   ═══════════════════════════════════════════ */

function TempleStructure() {
  const group = useRef();

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.15;
      group.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  const goldMat = useMemo(() => ({
    color: '#D4AF37',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#8B6914',
    emissiveIntensity: 0.15,
  }), []);

  const pillarMat = useMemo(() => ({
    color: '#B8860B',
    metalness: 0.85,
    roughness: 0.2,
    emissive: '#704214',
    emissiveIntensity: 0.1,
  }), []);

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} scale={0.8}>
        {/* Base platform */}
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[4, 0.2, 3]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[3.6, 0.15, 2.7]} />
          <meshStandardMaterial {...pillarMat} />
        </mesh>

        {/* Steps */}
        {[0, 1, 2].map(i => (
          <mesh key={`step-${i}`} position={[0, -1.5 - (i * 0.15), 1.5 + (i * 0.2)]}>
            <boxGeometry args={[2 + i * 0.3, 0.12, 0.3]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
        ))}

        {/* Four pillars */}
        {[[-1.2, 0, -0.8], [1.2, 0, -0.8], [-1.2, 0, 0.8], [1.2, 0, 0.8]].map((pos, i) => (
          <group key={`pillar-${i}`}>
            <mesh position={[pos[0], -0.3, pos[2]]}>
              <cylinderGeometry args={[0.1, 0.12, 2.2, 12]} />
              <meshStandardMaterial {...pillarMat} />
            </mesh>
            {/* Pillar base */}
            <mesh position={[pos[0], -1.35, pos[2]]}>
              <cylinderGeometry args={[0.15, 0.15, 0.15, 12]} />
              <meshStandardMaterial {...goldMat} />
            </mesh>
            {/* Pillar capital */}
            <mesh position={[pos[0], 0.78, pos[2]]}>
              <cylinderGeometry args={[0.15, 0.1, 0.15, 12]} />
              <meshStandardMaterial {...goldMat} />
            </mesh>
          </group>
        ))}

        {/* Main roof / Shikhara */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[3, 0.15, 2.2]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>

        {/* Pyramid roof layers */}
        {[0, 1, 2, 3].map(i => (
          <mesh key={`roof-${i}`} position={[0, 1.3 + i * 0.35, 0]}>
            <coneGeometry args={[1.3 - i * 0.25, 0.4, 4]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
        ))}

        {/* Temple spire (Kalash) */}
        <mesh position={[0, 2.9, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0} emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 3.15, 0]}>
          <coneGeometry args={[0.05, 0.3, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0} />
        </mesh>

        {/* Flag */}
        <mesh position={[0, 3.4, 0.03]}>
          <planeGeometry args={[0.2, 0.12]} />
          <meshBasicMaterial color="#FF7A00" side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>

        {/* Inner sanctum glow */}
        <mesh position={[0, -0.5, 0.5]}>
          <boxGeometry args={[0.8, 1.2, 0.05]} />
          <meshBasicMaterial color="#FF7A00" transparent opacity={0.3} />
        </mesh>
        <pointLight color="#FF7A00" intensity={2} distance={3} position={[0, -0.3, 0.5]} />

        {/* Dome light */}
        <pointLight color="#FFD700" intensity={1.5} distance={5} position={[0, 2.5, 0]} />
      </group>
    </Float>
  );
}

function DustParticles() {
  const ref = useRef();
  const count = 120;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 4;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.003;
      const angle = t * 0.05 + i * 0.1;
      const r = Math.sqrt(arr[i * 3] ** 2 + arr[i * 3 + 2] ** 2);
      arr[i * 3] = Math.cos(angle + i) * r;
      arr[i * 3 + 2] = Math.sin(angle + i) * r;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#D4AF37" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} color="#FFF0E0" />
      <directionalLight position={[3, 5, 5]} intensity={0.5} color="#FFD700" />
      <directionalLight position={[-3, 3, -5]} intensity={0.2} color="#FF7A00" />
      <TempleStructure />
      <DustParticles />
      <Sparkles count={30} scale={8} size={2} speed={0.3} opacity={0.3} color="#FFD700" />
    </>
  );
}

export default function FloatingTemple() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
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
