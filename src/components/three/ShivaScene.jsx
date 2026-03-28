import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Shiva Scene - For Health/Protection pages
   - Shivling with water dripping effect
   - Trishul (trident) silhouette
   - Bael leaves particles
   - Blue/silver/gold color scheme
   ═══════════════════════════════════════════ */

function Shivling() {
  const waterRef = useRef();
  const dropCount = 40;

  const dropPositions = useMemo(() => {
    const pos = new Float32Array(dropCount * 3);
    for (let i = 0; i < dropCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.15;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.random() * 2 + 1;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!waterRef.current) return;
    const arr = waterRef.current.geometry.attributes.position.array;
    for (let i = 0; i < dropCount; i++) {
      arr[i * 3 + 1] -= 0.02;
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3 + 1] = 2 + Math.random() * 0.5;
        const angle = Math.random() * Math.PI * 2;
        arr[i * 3] = Math.cos(angle) * 0.05;
        arr[i * 3 + 2] = Math.sin(angle) * 0.05;
      }
    }
    waterRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[0, -1, 0]}>
        {/* Base (Yoni) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.2, 32]} />
          <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.7, 0.8, 0.05, 32]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Lingam */}
        <mesh position={[0, 0.7, 0]}>
          <capsuleGeometry args={[0.3, 0.6, 16, 32]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.6}
            roughness={0.3}
            emissive="#1a1a2e"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Water dripping */}
        <points ref={waterRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={dropCount} array={dropPositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.04} color="#87CEEB" transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>

        {/* Bael leaves on lingam */}
        {[0, Math.PI * 0.66, Math.PI * 1.33].map((rot, i) => (
          <mesh key={i} position={[Math.cos(rot) * 0.32, 0.85, Math.sin(rot) * 0.32]} rotation={[0.3, rot, 0.2]}>
            <planeGeometry args={[0.12, 0.18]} />
            <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        ))}

        {/* Sacred thread */}
        <mesh position={[0, 0.65, 0]}>
          <torusGeometry args={[0.32, 0.006, 6, 32]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>

        <pointLight color="#87CEEB" intensity={1} distance={3} position={[0, 1.2, 0.5]} />
      </group>
    </Float>
  );
}

function Trishul() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={ref} position={[2.5, 0, -1]} rotation={[0, -0.3, 0.05]}>
        {/* Main shaft */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 4, 8]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Center prong */}
        <mesh position={[0, 2.3, 0]}>
          <coneGeometry args={[0.06, 0.6, 6]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Left prong */}
        <group position={[-0.25, 1.8, 0]} rotation={[0, 0, 0.2]}>
          <mesh>
            <coneGeometry args={[0.04, 0.45, 6]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Right prong */}
        <group position={[0.25, 1.8, 0]} rotation={[0, 0, -0.2]}>
          <mesh>
            <coneGeometry args={[0.04, 0.45, 6]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        <pointLight color="#87CEEB" intensity={0.5} distance={2} position={[0, 2.2, 0.3]} />
      </group>
    </Float>
  );
}

function CosmicParticles() {
  const ref = useRef();
  const count = 150;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const blue = new THREE.Color('#4FC3F7');
    const silver = new THREE.Color('#C0C0C0');
    const gold = new THREE.Color('#D4AF37');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const r = Math.random();
      const c = r < 0.4 ? blue : r < 0.7 ? silver : gold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.003;
      arr[i * 3] += Math.cos(t * 0.2 + i * 0.5) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} color="#E0E8FF" />
      <directionalLight position={[3, 5, 5]} intensity={0.3} color="#87CEEB" />
      <directionalLight position={[-2, 3, -3]} intensity={0.2} color="#D4AF37" />
      <Shivling />
      <Trishul />
      <CosmicParticles />
      <Sparkles count={30} scale={10} size={2} speed={0.2} opacity={0.3} color="#87CEEB" />
    </>
  );
}

export default function ShivaScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 50 }}
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
