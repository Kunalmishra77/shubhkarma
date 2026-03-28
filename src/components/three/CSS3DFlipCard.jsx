// src/components/three/CSS3DFlipCard.jsx
import { useState, useCallback } from 'react';

export function CSS3DFlipCard({
  front,
  back,
  className = '',
  height = 'h-80',
  flipOnClick = false,
}) {
  const [flipped, setFlipped] = useState(false);

  const handleEnter = useCallback(() => {
    if (!flipOnClick) setFlipped(true);
  }, [flipOnClick]);

  const handleLeave = useCallback(() => {
    if (!flipOnClick) setFlipped(false);
  }, [flipOnClick]);

  const handleClick = useCallback(() => {
    if (flipOnClick) setFlipped((f) => !f);
  }, [flipOnClick]);

  return (
    <div
      className={`flip-card-root ${height} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      style={{ perspective: '1200px' }}
    >
      <div
        className="flip-card-inner relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
