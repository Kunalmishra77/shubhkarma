import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Kalash Scene - Sacred Pot for Booking Page
   - Kalash via LatheGeometry
   - Coconut on top
   - Mango leaves
   - Water ripple at base
   - Golden metallic finish
   ═══════════════════════════════════════════ */

function Kalash() {
  const group = useRef();

  const kalashProfile = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0, 0));
    pts.push(new THREE.Vector2(0.35, 0));
    pts.push(new THREE.Vector2(0.5, 0.05));
    pts.push(new THREE.Vector2(0.6, 0.15));
    pts.push(new THREE.Vector2(0.65, 0.35));
    pts.push(new THREE.Vector2(0.62, 0.6));
    pts.push(new THREE.Vector2(0.55, 0.85));
    pts.push(new THREE.Vector2(0.5, 1.0));
    pts.push(new THREE.Vector2(0.48, 1.1));
    pts.push(new THREE.Vector2(0.35, 1.2));
    pts.push(new THREE.Vector2(0.3, 1.25));
    pts.push(new THREE.Vector2(0.32, 1.3));
    pts.push(new THREE.Vector2(0.38, 1.35));
    pts.push(new THREE.Vector2(0.35, 1.4));
    pts.push(new THREE.Vector2(0.25, 1.42));
    pts.push(new THREE.Vector2(0, 1.42));
    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} position={[0, -0.5, 0]}>
        {/* Kalash body */}
        <mesh>
          <latheGeometry args={[kalashProfile, 32]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.9}
            roughness={0.1}
            emissive="#8B6914"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Decorative bands */}
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.62, 0.015, 8, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <torusGeometry args={[0.55, 0.012, 8, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0} />
        </mesh>

        {/* Coconut on top */}
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#5C3317" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Coconut tuft */}
        <mesh position={[0, 1.88, 0]}>
          <coneGeometry args={[0.06, 0.1, 6]} />
          <meshBasicMaterial color="#2F4F2F" />
        </mesh>

        {/* Mango leaves (simplified) */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const leafX = Math.cos(angle) * 0.28;
          const leafZ = Math.sin(angle) * 0.28;
          return (
            <group key={i} position={[leafX, 1.48, leafZ]} rotation={[0.3, angle, -0.5]}>
              <mesh>
                <planeGeometry args={[0.08, 0.35]} />
                <meshStandardMaterial
                  color="#228B22"
                  side={THREE.DoubleSide}
                  roughness={0.7}
                  metalness={0.1}
                />
              </mesh>
            </group>
          );
        })}

        {/* Sacred thread (Moli) */}
        <mesh position={[0, 1.2, 0]}>
          <torusGeometry args={[0.34, 0.008, 6, 32]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
        <mesh position={[0, 1.22, 0]}>
          <torusGeometry args={[0.345, 0.006, 6, 32]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>

        {/* Inner glow */}
        <pointLight color="#FFD700" intensity={1.5} distance={3} position={[0, 1.0, 0]} />
      </group>
    </Float>
  );
}

function WaterRipple() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
      ref.current.material.opacity = 0.15 + Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ref}>
        <ringGeometry args={[0.5, 2, 32]} />
        <meshBasicMaterial color="#4FC3F7" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Outer ripple rings */}
      {[1.5, 2, 2.5, 3].map((r, i) => (
        <mesh key={i}>
          <torusGeometry args={[r, 0.005, 4, 64]} />
          <meshBasicMaterial color="#4FC3F7" transparent opacity={0.1 - i * 0.02} />
        </mesh>
      ))}
    </group>
  );
}

function SacredSymbols() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      {/* Swastik-inspired pattern using lines */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <mesh key={i} position={[Math.cos(rot) * 2.5, 0, Math.sin(rot) * 2.5]} rotation={[0, -rot, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.8]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function AmbientGlow() {
  const count = 80;
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#FFD700" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} color="#FFF0E0" />
      <directionalLight position={[3, 5, 5]} intensity={0.4} color="#FFD700" />
      <directionalLight position={[-2, 3, -3]} intensity={0.2} color="#FF7A00" />
      <Kalash />
      <WaterRipple />
      <SacredSymbols />
      <AmbientGlow />
      <Sparkles count={25} scale={6} size={2} speed={0.2} opacity={0.3} color="#D4AF37" />
    </>
  );
}

export default function KalashScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
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
