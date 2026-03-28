// src/components/three/WebGLGradient.jsx
import React from 'react';

export function WebGLGradient({ className = '' }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 opacity-90 ${className}`}>
      {/* Simple CSS gradient fallback instead of complex WebGL shader for now */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
    </div>
  );
}
