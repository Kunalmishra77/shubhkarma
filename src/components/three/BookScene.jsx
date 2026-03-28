import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Sacred Book Scene - For Bhagwat Mahapuran
   - Open book with curved pages
   - Glowing text particles rising from pages
   - Sanskrit-inspired particle effects
   - Dramatic golden light
   ═══════════════════════════════════════════ */

function OpenBook() {
  const bookRef = useRef();
  const leftPageRef = useRef();
  const rightPageRef = useRef();

  const pageGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.8, 2.4, 20, 1);
    const posAttr = geo.getAttribute('position');
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      posAttr.setZ(i, Math.sin(Math.abs(x) * 0.8) * 0.08);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
      bookRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  const pageMat = useMemo(() => ({
    color: '#FFF8E7',
    side: THREE.DoubleSide,
    roughness: 0.9,
    metalness: 0,
  }), []);

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={bookRef} rotation={[-0.3, 0, 0]}>
        {/* Book spine */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.15, 2.5, 0.12]} />
          <meshStandardMaterial color="#8B0000" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Left cover */}
        <mesh position={[-1, 0, -0.08]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[1.9, 2.55, 0.06]} />
          <meshStandardMaterial color="#800000" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Right cover */}
        <mesh position={[1, 0, -0.08]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[1.9, 2.55, 0.06]} />
          <meshStandardMaterial color="#800000" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Gold border on covers */}
        <mesh position={[-1, 0, -0.04]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[1.85, 2.5, 0.005]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} transparent opacity={0.3} />
        </mesh>
        <mesh position={[1, 0, -0.04]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[1.85, 2.5, 0.005]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} transparent opacity={0.3} />
        </mesh>

        {/* Left page */}
        <mesh ref={leftPageRef} position={[-0.9, 0, 0.02]} rotation={[0, 0.12, 0]} geometry={pageGeometry}>
          <meshStandardMaterial {...pageMat} />
        </mesh>

        {/* Right page */}
        <mesh ref={rightPageRef} position={[0.9, 0, 0.02]} rotation={[0, -0.12, 0]} geometry={pageGeometry}>
          <meshStandardMaterial {...pageMat} />
        </mesh>

        {/* Text lines on left page */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={`left-${i}`} position={[-0.9, 0.9 - i * 0.16, 0.04]} rotation={[0, 0.12, 0]}>
            <planeGeometry args={[1.2 - Math.random() * 0.3, 0.02]} />
            <meshBasicMaterial color="#4A3728" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Text lines on right page */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={`right-${i}`} position={[0.9, 0.9 - i * 0.16, 0.04]} rotation={[0, -0.12, 0]}>
            <planeGeometry args={[1.2 - Math.random() * 0.3, 0.02]} />
            <meshBasicMaterial color="#4A3728" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Glowing center fold light */}
        <pointLight color="#FFD700" intensity={2} distance={4} position={[0, 0, 0.5]} />
        <pointLight color="#FF7A00" intensity={1} distance={3} position={[0, 0, 0.3]} />
      </group>
    </Float>
  );
}

function RisingTextParticles() {
  const ref = useRef();
  const count = 150;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = Math.random() * 0.5 - 0.5;
      pos[i * 3 + 2] = Math.random() * 0.5 + 0.1;
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = 0.005 + Math.random() * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return [pos, vel];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] + Math.sin(t + i) * 0.001;
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      // Reset when too high
      if (arr[i * 3 + 1] > 4) {
        arr[i * 3] = (Math.random() - 0.5) * 3;
        arr[i * 3 + 1] = -0.5;
        arr[i * 3 + 2] = Math.random() * 0.5 + 0.1;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.material.opacity = 0.4 + Math.sin(t * 0.5) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#FFD700"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SacredAura() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.z = t * 0.05;
      ref.current.material.opacity = 0.06 + Math.sin(t * 0.3) * 0.02;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.5, -1]}>
      <ringGeometry args={[2, 4, 64]} />
      <meshBasicMaterial color="#FFD700" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} color="#FFF0E0" />
      <directionalLight position={[0, 5, 5]} intensity={0.4} color="#FFD700" />
      <spotLight position={[0, 4, 3]} intensity={0.6} color="#FF7A00" angle={0.5} penumbra={0.8} />
      <OpenBook />
      <RisingTextParticles />
      <SacredAura />
      <Sparkles count={50} scale={8} size={3} speed={0.2} opacity={0.3} color="#FFD700" />
    </>
  );
}

export default function BookScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1, 4.5], fov: 45 }}
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
