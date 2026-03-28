// SVG Logo component — works on any background (light or dark)
export default function Logo({ className = '', light = false }) {
  return (
    <svg viewBox="0 0 280 80" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Lotus + Om icon */}
      <g transform="translate(0, 4)">
        {/* Outer petals */}
        <path d="M36 58 C28 48, 12 38, 8 28 C4 18, 12 8, 20 12 C24 14, 30 22, 36 32 C42 22, 48 14, 52 12 C60 8, 68 18, 64 28 C60 38, 44 48, 36 58Z" fill="url(#lotusGrad)" />
        {/* Inner petals */}
        <path d="M36 52 C30 44, 20 36, 18 30 C16 24, 22 18, 26 20 C28 21, 32 26, 36 34 C40 26, 44 21, 46 20 C50 18, 56 24, 54 30 C52 36, 42 44, 36 52Z" fill="url(#lotusGrad2)" opacity="0.7" />
        {/* Center */}
        <circle cx="36" cy="30" r="5" fill="#FF7A00" opacity="0.9" />
        {/* Om symbol */}
        <text x="36" y="34" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="serif">ॐ</text>
        {/* Glow */}
        <circle cx="36" cy="12" r="8" fill="#FF7A00" opacity="0.08" />
      </g>

      {/* Text: ShubhKarma */}
      <text x="80" y="42" fontFamily="'Outfit', system-ui, sans-serif" fontSize="30" fontWeight="700" letterSpacing="-0.5">
        <tspan fill={light ? '#FFFFFF' : '#2D1F0E'}>Shubh</tspan>
        <tspan fill="url(#textGrad)">Karma</tspan>
      </text>

      {/* Tagline */}
      <text x="80" y="60" fontFamily="'Inter', system-ui, sans-serif" fontSize="8" fontWeight="500" letterSpacing="2.5" fill={light ? 'rgba(255,255,255,0.5)' : '#8C7A68'} style={{textTransform: 'uppercase'}}>
        SACRED RITUALS, SIMPLIFIED
      </text>

      {/* Gradients */}
      <defs>
        <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9F40" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#EA6C00" />
        </linearGradient>
        <linearGradient id="lotusGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#FF9F40" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
    </svg>
  );
}
