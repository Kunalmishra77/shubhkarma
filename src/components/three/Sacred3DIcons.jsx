import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Diya (Lamp)
export function Diya3D({ position, scale = 1, rotation = [0, 0, 0] }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <group scale={scale} rotation={rotation}>
        {/* Bowl */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.6, 0.4, 0.4, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Flame */}
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[0.2, 0.6, 16]} />
          <meshBasicMaterial color="#FF7A00" />
          <Sparkles count={15} scale={1.5} size={2} speed={0.4} opacity={0.6} position={[0, 0.2, 0]} color="#FF9F40" />
        </mesh>
        {/* Inner glow light */}
        <pointLight color="#FF7A00" intensity={2} distance={4} position={[0, 0.5, 0]} />
      </group>
    </Float>
  );
}

// 3D Crystal / Sacred Geometry
export function SacredCrystal({ position, scale = 1 }) {
  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2} position={position}>
      <mesh scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial 
          backside 
          thickness={0.5} 
          roughness={0.1} 
          transmission={1} 
          ior={1.2} 
          chromaticAberration={0.04} 
          color="#FFF8F0"
        />
        <meshBasicMaterial color="#FF9F40" wireframe opacity={0.15} transparent />
      </mesh>
    </Float>
  );
}

// 3D Abstract Lotus / Energy ring
export function EnergyLotus({ position, scale = 1 }) {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5} position={position}>
      <group scale={scale}>
        <mesh>
          <torusKnotGeometry args={[0.6, 0.15, 64, 16]} />
          <MeshDistortMaterial 
            color="#FF7A00" 
            emissive="#CC6200"
            emissiveIntensity={0.2}
            distort={0.3} 
            speed={2} 
            roughness={0.2} 
            metalness={0.8}
          />
        </mesh>
        <pointLight color="#FF7A00" intensity={1} distance={3} />
      </group>
    </Float>
  );
}

// 3D Temple Bell
export function PremiumBell({ position, scale = 1, rotation = [0, 0, 0] }) {
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2} position={position}>
       <group scale={scale} rotation={rotation}>
         {/* Bell body */}
         <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.6, 1.2, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
         </mesh>
         {/* Bell top handle */}
         <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.05, 16, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
         </mesh>
         {/* Clapper */}
         <mesh position={[0, -0.65, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#A88A2D" metalness={0.9} roughness={0.2} />
         </mesh>
       </group>
    </Float>
  )
}
