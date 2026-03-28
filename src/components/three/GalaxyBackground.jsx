import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Galaxy Background - Cosmic spiral
   - Saffron/gold colored spiral galaxy
   - Twinkling stars
   - Nebula-like clouds
   - Slow majestic rotation
   ═══════════════════════════════════════════ */

function SpiralGalaxy({ starCount = 3000 }) {
  const ref = useRef();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const siz = new Float32Array(starCount);

    const saffron = new THREE.Color('#FF7A00');
    const gold = new THREE.Color('#D4AF37');
    const cream = new THREE.Color('#FFF8F0');
    const warmOrange = new THREE.Color('#FF9F40');
    const deepGold = new THREE.Color('#B8860B');

    const arms = 3;
    const spread = 0.6;

    for (let i = 0; i < starCount; i++) {
      const armIndex = i % arms;
      const armAngle = (armIndex / arms) * Math.PI * 2;

      const distance = Math.random() * 5 + 0.2;
      const spiralAngle = distance * 1.2 + armAngle;

      // Add randomness
      const rx = (Math.random() - 0.5) * spread * (distance * 0.3 + 0.2);
      const ry = (Math.random() - 0.5) * spread * 0.3;
      const rz = (Math.random() - 0.5) * spread * (distance * 0.3 + 0.2);

      pos[i * 3] = Math.cos(spiralAngle) * distance + rx;
      pos[i * 3 + 1] = ry;
      pos[i * 3 + 2] = Math.sin(spiralAngle) * distance + rz;

      // Color gradient: center is bright, edges are dimmer
      const t = distance / 5;
      const r = Math.random();
      let c;
      if (t < 0.3) {
        c = r < 0.5 ? cream : gold;
      } else if (t < 0.6) {
        c = r < 0.4 ? saffron : r < 0.7 ? gold : warmOrange;
      } else {
        c = r < 0.5 ? deepGold : r < 0.8 ? saffron : warmOrange;
      }

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      siz[i] = (1 - t) * 2 + Math.random() * 1.5;
    }
    return [pos, col, siz];
  }, [starCount]);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 200, 120, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 122, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref} rotation={[0.8, 0, 0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={starCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={starCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        map={texture}
        transparent
        opacity={0.8}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function BackgroundStars({ count = 500 }) {
  const ref = useRef();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      siz[i] = Math.random() * 0.5 + 0.1;
    }
    return [pos, siz];
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#FFF8F0" transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

function NebulaClouds() {
  const refs = [useRef(), useRef(), useRef()];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.z = t * 0.01 * (i + 1);
        ref.current.material.opacity = 0.04 + Math.sin(t * 0.3 + i) * 0.015;
      }
    });
  });

  return (
    <>
      <mesh ref={refs[0]} position={[1, 0.5, -3]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#FF7A00" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      <mesh ref={refs[1]} position={[-1.5, -0.5, -2]} rotation={[0.3, 0.5, 0]}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.035} side={THREE.BackSide} />
      </mesh>
      <mesh ref={refs[2]} position={[0, 0, -4]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial color="#FF9F40" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

function CoreGlow() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.15);
    }
  });

  return (
    <mesh ref={ref} rotation={[0.8, 0, 0.2]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <SpiralGalaxy starCount={3000} />
      <BackgroundStars count={400} />
      <NebulaClouds />
      <CoreGlow />
    </>
  );
}

export default function GalaxyBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
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
