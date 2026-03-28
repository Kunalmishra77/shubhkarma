import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Wedding Scene - 3D Component
   - Sacred fire (havan kund) in center
   - Two jaimala (flower garland) rings
   - Floating marigold particles
   - Warm orange/red/gold palette
   ═══════════════════════════════════════════ */

function HavanKund() {
  const fireRef = useRef();
  const sparksRef = useRef();
  const sparkCount = 60;

  const sparkPositions = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fireRef.current) {
      fireRef.current.children.forEach((child, i) => {
        if (child.isMesh) {
          child.scale.x = 1 + Math.sin(t * 6 + i * 2) * 0.2;
          child.scale.z = 1 + Math.cos(t * 5 + i * 1.5) * 0.2;
          child.scale.y = 1 + Math.sin(t * 8 + i) * 0.15;
          child.rotation.y = Math.sin(t * 3 + i) * 0.3;
        }
      });
    }
    if (sparksRef.current) {
      const arr = sparksRef.current.geometry.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        arr[i * 3 + 1] += 0.015 + Math.random() * 0.01;
        arr[i * 3] += Math.sin(t + i) * 0.003;
        arr[i * 3 + 2] += Math.cos(t + i * 0.7) * 0.003;
        if (arr[i * 3 + 1] > 3) {
          const angle = Math.random() * Math.PI * 2;
          arr[i * 3] = Math.cos(angle) * Math.random() * 0.3;
          arr[i * 3 + 1] = 0;
          arr[i * 3 + 2] = Math.sin(angle) * Math.random() * 0.3;
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* Kund base - square pit */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Kund rim */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Inner fire pit */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.9, 0.15, 0.9]} />
        <meshBasicMaterial color="#1A0A00" />
      </mesh>

      {/* Fire flames */}
      <group ref={fireRef} position={[0, 0.3, 0]}>
        <mesh>
          <coneGeometry args={[0.25, 1.2, 8]} />
          <meshBasicMaterial color="#FF4500" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.1, 0, 0.05]}>
          <coneGeometry args={[0.18, 0.9, 8]} />
          <meshBasicMaterial color="#FF7A00" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.08, 0.1, -0.05]}>
          <coneGeometry args={[0.15, 0.7, 8]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <coneGeometry args={[0.1, 0.5, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Fire sparks */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={sparkCount} array={sparkPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#FF7A00" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Fire glow lights */}
      <pointLight color="#FF4500" intensity={4} distance={6} position={[0, 0.5, 0]} />
      <pointLight color="#FFD700" intensity={2} distance={4} position={[0, 1, 0]} />
    </group>
  );
}

function Jaimala({ radius = 1.5, color = '#FF6B00', yPos = 0, rotationSpeed = 0.3 }) {
  const ref = useRef();
  const flowerCount = 40;

  const positions = useMemo(() => {
    const pos = new Float32Array(flowerCount * 3);
    for (let i = 0; i < flowerCount; i++) {
      const angle = (i / flowerCount) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.05;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.05;
    }
    return pos;
  }, [radius]);

  const colors = useMemo(() => {
    const col = new Float32Array(flowerCount * 3);
    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color('#FFD700');
    for (let i = 0; i < flowerCount; i++) {
      const c = i % 3 === 0 ? c2 : c1;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, [color]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * rotationSpeed;
      ref.current.position.y = yPos + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={ref} position={[0, yPos, 0]}>
      {/* Garland ring */}
      <mesh>
        <torusGeometry args={[radius, 0.06, 12, 40]} />
        <meshStandardMaterial color="#228B22" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Flowers on garland */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={flowerCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={flowerCount} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors transparent opacity={0.9} depthWrite={false} />
      </points>
      {/* Individual flower spheres */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? color : '#FFD700'} emissive={color} emissiveIntensity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function FloatingMarigolds() {
  const ref = useRef();
  const count = 100;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const orange = new THREE.Color('#FF8C00');
    const yellow = new THREE.Color('#FFD700');
    const red = new THREE.Color('#DC143C');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const r = Math.random();
      const c = r < 0.4 ? orange : r < 0.7 ? yellow : red;
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
      arr[i * 3 + 1] -= 0.003;
      arr[i * 3] += Math.sin(t * 0.5 + i) * 0.002;
      arr[i * 3 + 2] += Math.cos(t * 0.4 + i * 0.7) * 0.001;
      if (arr[i * 3 + 1] < -3) {
        arr[i * 3 + 1] = 3;
        arr[i * 3] = (Math.random() - 0.5) * 8;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} color="#FFF0E0" />
      <directionalLight position={[3, 5, 5]} intensity={0.3} color="#FFD700" />
      <HavanKund />
      <Jaimala radius={1.8} color="#FF6B00" yPos={0.5} rotationSpeed={0.2} />
      <Jaimala radius={2.2} color="#DC143C" yPos={0.2} rotationSpeed={-0.15} />
      <FloatingMarigolds />
      <Sparkles count={40} scale={10} size={3} speed={0.3} opacity={0.4} color="#FFD700" />
    </>
  );
}

export default function WeddingScene() {
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
