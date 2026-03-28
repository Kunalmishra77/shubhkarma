import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Sacred Mandala / Yantra Pattern
   - Concentric rotating rings at different speeds
   - Lotus petal geometry
   - Sacred geometry dot patterns
   - Golden wireframe glow aesthetic
   ═══════════════════════════════════════════ */

function MandalaRing({ radius, segments = 64, speed = 0.1, direction = 1, color = '#D4AF37', opacity = 0.3, dotted = false }) {
  const ref = useRef();

  const geometry = useMemo(() => {
    if (dotted) {
      const count = segments;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 1] = Math.sin(angle) * radius;
        pos[i * 3 + 2] = 0;
      }
      return pos;
    }
    return null;
  }, [radius, segments, dotted]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * speed * direction;
    }
  });

  if (dotted) {
    return (
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={segments} array={geometry} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    );
  }

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 8, segments]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function LotusPetals({ radius = 2, petals = 8, speed = 0.05 }) {
  const group = useRef();

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.15, 0.3, 0.1, 0.7, 0, 1);
    shape.bezierCurveTo(-0.1, 0.7, -0.15, 0.3, 0, 0);
    return shape;
  }, []);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.z = clock.getElapsedTime() * speed;
      const t = clock.getElapsedTime();
      group.current.children.forEach((child, i) => {
        child.scale.setScalar(0.8 + Math.sin(t * 0.5 + i * 0.5) * 0.15);
      });
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius * 0.3, Math.sin(angle) * radius * 0.3, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
            <shapeGeometry args={[petalShape]} />
            <meshBasicMaterial color="#FF7A00" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function SacredTriangles({ radius = 1.5, speed = -0.03 }) {
  const group = useRef();

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.z = clock.getElapsedTime() * speed;
    }
  });

  const trianglePositions = useMemo(() => {
    const positions = [];
    // Upward triangles
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        vertices: [
          [0, radius, 0],
          [Math.cos(angle + Math.PI * 2 / 3) * radius, Math.sin(angle + Math.PI * 2 / 3) * radius, 0],
          [Math.cos(angle - Math.PI * 2 / 3) * radius, Math.sin(angle - Math.PI * 2 / 3) * radius, 0],
        ],
        rotation: (i / 3) * Math.PI * 2,
      });
    }
    return positions;
  }, [radius]);

  return (
    <group ref={group}>
      {/* Sri Yantra inspired triangles */}
      <mesh>
        <ringGeometry args={[radius * 0.98, radius, 3]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.12} wireframe side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI]}>
        <ringGeometry args={[radius * 0.7, radius * 0.72, 3]} />
        <meshBasicMaterial color="#FF7A00" transparent opacity={0.1} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CenterDot() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.3);
      ref.current.material.opacity = 0.5 + Math.sin(t * 1.5) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <circleGeometry args={[0.08, 16]} />
      <meshBasicMaterial color="#FF7A00" transparent opacity={0.6} />
    </mesh>
  );
}

function MandalaScene() {
  const group = useRef();

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      group.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.08) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <group ref={group}>
        {/* Concentric rings */}
        <MandalaRing radius={0.5} speed={0.15} color="#FF7A00" opacity={0.35} />
        <MandalaRing radius={1} speed={-0.1} color="#D4AF37" opacity={0.25} dotted segments={24} />
        <MandalaRing radius={1.5} speed={0.08} color="#FF7A00" opacity={0.2} />
        <MandalaRing radius={2} speed={-0.06} color="#D4AF37" opacity={0.18} dotted segments={36} />
        <MandalaRing radius={2.5} speed={0.04} color="#FF9F40" opacity={0.15} />
        <MandalaRing radius={3} speed={-0.03} color="#D4AF37" opacity={0.12} dotted segments={48} />
        <MandalaRing radius={3.5} speed={0.025} color="#FF7A00" opacity={0.1} />
        <MandalaRing radius={4} speed={-0.02} color="#D4AF37" opacity={0.08} dotted segments={60} />

        {/* Lotus petals at different radii */}
        <LotusPetals radius={1.2} petals={6} speed={0.06} />
        <LotusPetals radius={2.2} petals={8} speed={-0.04} />
        <LotusPetals radius={3.2} petals={12} speed={0.025} />

        {/* Sacred triangles */}
        <SacredTriangles radius={1.8} speed={-0.03} />
        <SacredTriangles radius={2.8} speed={0.02} />

        {/* Center bindu */}
        <CenterDot />
      </group>
    </>
  );
}

export default function SacredMandala() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <MandalaScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
