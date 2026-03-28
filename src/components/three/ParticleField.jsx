import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Enhanced Sacred Particle Field
   - 500+ interactive particles
   - Mouse-responsive repulsion
   - Sacred geometry Om outline
   - Floating golden rings
   - Glow orbs with organic motion
   ═══════════════════════════════════════════ */

function SacredParticles({ count = 500 }) {
  const mesh = useRef();
  const { viewport } = useThree();

  const [positions, originalPos, colors, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const saffron = new THREE.Color('#FF7A00');
    const gold = new THREE.Color('#D4AF37');
    const cream = new THREE.Color('#FFF0E0');
    const warmOrange = new THREE.Color('#FF9F40');

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 24;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      const r = Math.random();
      const c = r < 0.3 ? saffron : r < 0.55 ? gold : r < 0.8 ? warmOrange : cream;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      spd[i] = 0.2 + Math.random() * 0.6;
    }
    return [pos, orig, col, spd];
  }, [count]);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 200, 100, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 160, 50, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 122, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const posArr = mesh.current.geometry.attributes.position.array;
    const mx = pointer.x * viewport.width * 0.5;
    const my = pointer.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const s = speeds[i];

      posArr[i3] = originalPos[i3] + Math.sin(t * s + i * 0.1) * 0.5;
      posArr[i3 + 1] = originalPos[i3 + 1] + Math.cos(t * s * 0.7 + i * 0.15) * 0.6 + Math.sin(t * 0.15) * 0.2;
      posArr[i3 + 2] = originalPos[i3 + 2] + Math.sin(t * s * 0.4 + i * 0.05) * 0.3;

      const dx = posArr[i3] - mx;
      const dy = posArr[i3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        const force = (3 - dist) * 0.12;
        posArr[i3] += (dx / (dist || 1)) * force;
        posArr[i3 + 1] += (dy / (dist || 1)) * force;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        map={particleTexture}
        transparent
        opacity={0.85}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRings() {
  const group = useRef();

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.x = Math.sin(t * 0.12) * 0.1;
    group.current.rotation.y = t * 0.04;
  });

  const rings = [
    { radius: 3, thickness: 0.015, opacity: 0.15, color: '#D4AF37', rotX: 0.5, rotZ: 0 },
    { radius: 4.5, thickness: 0.012, opacity: 0.1, color: '#FF7A00', rotX: 0.3, rotZ: 0.4 },
    { radius: 6, thickness: 0.01, opacity: 0.06, color: '#D4AF37', rotX: -0.2, rotZ: 0.8 },
    { radius: 8, thickness: 0.008, opacity: 0.04, color: '#FF9F40', rotX: 0.7, rotZ: 0.2 },
  ];

  return (
    <group ref={group} position={[0, 0, -3]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[r.rotX, 0, r.rotZ]}>
          <torusGeometry args={[r.radius, r.thickness, 16, 100]} />
          <meshBasicMaterial color={r.color} transparent opacity={r.opacity} />
        </mesh>
      ))}
    </group>
  );
}

function OmPattern() {
  const points = useRef();

  const omPositions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const r = 2 + 0.7 * Math.sin(t * 3) + 0.4 * Math.cos(t * 5) + 0.2 * Math.sin(t * 7);
      pos[i * 3] = r * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(t) + 0.3;
      pos[i * 3 + 2] = 0.3 * Math.sin(t * 4);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime();
    points.current.rotation.y = t * 0.08;
    points.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    points.current.material.opacity = 0.25 + Math.sin(t * 0.4) * 0.1;
  });

  return (
    <points ref={points} position={[0, 0, -2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={200} array={omPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#FF7A00"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlowOrbs() {
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const configs = [
    { pos: [-9, 4, -4], size: 0.7, color: '#FF7A00', speed: [0.3, 0.2] },
    { pos: [10, -3, -5], size: 0.5, color: '#D4AF37', speed: [0.25, 0.15] },
    { pos: [0, -6, -6], size: 0.9, color: '#FF9F40', speed: [0.35, 0.18] },
    { pos: [-6, -5, -3], size: 0.4, color: '#D4AF37', speed: [0.2, 0.25] },
  ];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    configs.forEach((c, i) => {
      if (!refs[i].current) return;
      refs[i].current.position.y = c.pos[1] + Math.sin(t * c.speed[0]) * 2;
      refs[i].current.position.x = c.pos[0] + Math.cos(t * c.speed[1]) * 1.5;
    });
  });

  return (
    <>
      {configs.map((c, i) => (
        <mesh key={i} ref={refs[i]} position={c.pos}>
          <sphereGeometry args={[c.size, 16, 16]} />
          <meshBasicMaterial color={c.color} transparent opacity={0.07} />
        </mesh>
      ))}
    </>
  );
}

function Diya3DSmall({ position, scale = 1 }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <group scale={scale}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.5, 0.3, 0.35, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <coneGeometry args={[0.15, 0.5, 12]} />
          <meshBasicMaterial color="#FF7A00" transparent opacity={0.9} />
        </mesh>
        <pointLight color="#FF7A00" intensity={1.5} distance={4} position={[0, 0.4, 0]} />
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <SacredParticles count={500} />
      <FloatingRings />
      <OmPattern />
      <GlowOrbs />
      <Diya3DSmall position={[-7, 4, -4]} scale={1.2} />
      <Diya3DSmall position={[8, -5, -6]} scale={1.5} />
      <Sparkles count={40} scale={20} size={3} speed={0.3} opacity={0.3} color="#D4AF37" />
    </>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
