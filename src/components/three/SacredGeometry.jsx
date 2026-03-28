// src/components/three/SacredGeometry.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';

export function SacredGeometry({ color = '#fbbf24', position = [0, 0, 0] }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Torus ref={meshRef} args={[2, 0.5, 16, 100]} position={position}>
      <meshStandardMaterial color={color} wireframe />
    </Torus>
  );
}
