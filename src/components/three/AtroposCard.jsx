// src/components/three/AtroposCard.jsx
import 'atropos/css';
import Atropos from 'atropos/react';

const defaultConfig = {
  activeOffset: 40,
  shadowScale: 1.05,
  rotateXMax: 15,
  rotateYMax: 15,
  duration: 400,
  shadow: true,
  highlight: true,
};

export function AtroposCard({
  children,
  className = '',
  innerClassName = '',
  config = {},
  ...rest
}) {
  return (
    <Atropos
      className={`atropos-shubhkarma ${className}`}
      innerClassName={innerClassName}
      {...defaultConfig}
      {...config}
      {...rest}
    >
      {children}
    </Atropos>
  );
}
