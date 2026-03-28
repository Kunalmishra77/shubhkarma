// Animated SVG Icons — looping CSS animations, no static icons
import { motion } from 'framer-motion';

const glow = (color = '#FF7A00') => `drop-shadow(0 0 8px ${color}40) drop-shadow(0 0 20px ${color}20)`;

// ── Search Icon (pulsing magnifier) ──
export function SearchIcon({ className = 'w-10 h-10' }) {
  return (
    <motion.svg viewBox="0 0 48 48" fill="none" className={className} animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ filter: glow() }}>
      <motion.circle cx="20" cy="20" r="12" stroke="#FF7A00" strokeWidth="3" fill="none" animate={{ r: [12, 13, 12] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.line x1="29" y1="29" x2="40" y2="40" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" animate={{ x2: [40, 42, 40], y2: [40, 42, 40] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="20" cy="20" r="5" fill="#FF7A00" opacity="0.15" animate={{ r: [5, 7, 5], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 2, repeat: Infinity }} />
    </motion.svg>
  );
}

// ── Calendar Icon (flipping page) ──
export function CalendarIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow() }}>
      <rect x="6" y="10" width="36" height="32" rx="4" stroke="#FF7A00" strokeWidth="2.5" fill="none" />
      <line x1="6" y1="20" x2="42" y2="20" stroke="#FF7A00" strokeWidth="2" opacity="0.5" />
      <line x1="16" y1="6" x2="16" y2="14" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="6" x2="32" y2="14" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <motion.circle cx="24" cy="30" r="4" fill="#FF7A00" animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.rect x="14" y="24" width="6" height="4" rx="1" fill="#D4AF37" opacity="0.3" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
      <motion.rect x="28" y="24" width="6" height="4" rx="1" fill="#D4AF37" opacity="0.3" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
    </svg>
  );
}

// ── Pandit Icon (praying figure with aura) ──
export function PanditIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow() }}>
      <circle cx="24" cy="14" r="6" stroke="#FF7A00" strokeWidth="2.5" fill="none" />
      <path d="M12 40 C12 30, 18 24, 24 24 C30 24, 36 30, 36 40" stroke="#FF7A00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Praying hands */}
      <motion.path d="M20 32 L24 28 L28 32" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      {/* Aura rings */}
      <motion.circle cx="24" cy="14" r="10" stroke="#FF7A00" fill="none" strokeWidth="1" animate={{ r: [10, 14, 10], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="24" cy="14" r="10" stroke="#D4AF37" fill="none" strokeWidth="1" animate={{ r: [10, 18, 10], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
    </svg>
  );
}

// ── Sparkle / Blessing Icon (radiating star) ──
export function BlessingIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#D4AF37') }}>
      <motion.path d="M24 4 L27 18 L42 18 L30 27 L33 42 L24 33 L15 42 L18 27 L6 18 L21 18Z" fill="#D4AF37" opacity="0.2" stroke="#D4AF37" strokeWidth="1.5" animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Radiating lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line key={i} x1="24" y1="24" x2={24 + Math.cos(angle * Math.PI / 180) * 20} y2={24 + Math.sin(angle * Math.PI / 180) * 20} stroke="#FF7A00" strokeWidth="1" strokeLinecap="round" animate={{ opacity: [0, 0.5, 0], x2: [24 + Math.cos(angle * Math.PI / 180) * 16, 24 + Math.cos(angle * Math.PI / 180) * 22, 24 + Math.cos(angle * Math.PI / 180) * 16], y2: [24 + Math.sin(angle * Math.PI / 180) * 16, 24 + Math.sin(angle * Math.PI / 180) * 22, 24 + Math.sin(angle * Math.PI / 180) * 16] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </svg>
  );
}

// ── Shield Icon (pulsing protection) ──
export function ShieldIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow() }}>
      <motion.path d="M24 4 L40 12 L40 24 C40 34, 32 42, 24 46 C16 42, 8 34, 8 24 L8 12Z" stroke="#FF7A00" strokeWidth="2.5" fill="none" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <path d="M24 4 L40 12 L40 24 C40 34, 32 42, 24 46 C16 42, 8 34, 8 24 L8 12Z" fill="#FF7A00" opacity="0.08" />
      <motion.path d="M18 24 L22 28 L30 18" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.8, 1] }} />
    </svg>
  );
}

// ── Fire Icon (flickering flame) ──
export function FireIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow() }}>
      <motion.path d="M24 4 C24 4, 36 16, 36 28 C36 35, 30 42, 24 42 C18 42, 12 35, 12 28 C12 16, 24 4, 24 4Z" fill="url(#fireGrad)" animate={{ d: ['M24 4 C24 4, 36 16, 36 28 C36 35, 30 42, 24 42 C18 42, 12 35, 12 28 C12 16, 24 4, 24 4Z', 'M24 2 C24 2, 38 14, 38 27 C38 36, 31 44, 24 44 C17 44, 10 36, 10 27 C10 14, 24 2, 24 2Z', 'M24 4 C24 4, 36 16, 36 28 C36 35, 30 42, 24 42 C18 42, 12 35, 12 28 C12 16, 24 4, 24 4Z'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.path d="M24 18 C24 18, 30 24, 30 30 C30 34, 27 38, 24 38 C21 38, 18 34, 18 30 C18 24, 24 18, 24 18Z" fill="#FFF7ED" opacity="0.4" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1, repeat: Infinity }} />
      <defs>
        <radialGradient id="fireGrad" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="30%" stopColor="#FF9F40" />
          <stop offset="100%" stopColor="#FF7A00" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Om Icon (rotating + glowing) ──
export function OmIcon({ className = 'w-10 h-10' }) {
  return (
    <motion.div className={`relative flex items-center justify-center ${className}`} animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
      <motion.div className="absolute inset-0 rounded-full bg-saffron-500/10" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <span className="text-3xl text-saffron-500 font-serif" style={{ filter: glow() }}>ॐ</span>
    </motion.div>
  );
}

// ── Lotus Icon (blooming animation) ──
export function LotusIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#D4AF37') }}>
      {/* Center petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.ellipse key={i} cx="24" cy="24" rx="4" ry="12" fill="#FF7A00" opacity="0.4" transform={`rotate(${angle} 24 24)`}
          animate={{ ry: [12, 14, 12], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }} />
      ))}
      <circle cx="24" cy="24" r="4" fill="#D4AF37" />
      <motion.circle cx="24" cy="24" r="4" fill="#FFF7ED" animate={{ r: [2, 3, 2], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  );
}

// ── Globe Icon (orbiting ring) ──
export function GlobeIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow() }}>
      <circle cx="24" cy="24" r="16" stroke="#FF7A00" strokeWidth="2" fill="none" opacity="0.5" />
      <ellipse cx="24" cy="24" rx="8" ry="16" stroke="#FF7A00" strokeWidth="1.5" fill="none" opacity="0.3" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
      {/* Orbiting dot */}
      <motion.circle cx="24" cy="8" r="2.5" fill="#D4AF37" animate={{ cx: [40, 24, 8, 24, 40], cy: [24, 8, 24, 40, 24] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
      <motion.circle cx="24" cy="24" r="18" stroke="#FF7A00" fill="none" strokeWidth="0.5" strokeDasharray="4 4" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '24px 24px' }} />
    </svg>
  );
}

// ── Star / Navagraha Icon (orbiting planets) ──
export function StarIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#D4AF37') }}>
      <defs>
        <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D4AF37" />
        </radialGradient>
      </defs>
      <motion.path d="M24 4 L27.5 16 L40 16 L30 23.5 L33.5 36 L24 28.5 L14.5 36 L18 23.5 L8 16 L20.5 16Z"
        fill="url(#starGrad)" stroke="#D4AF37" strokeWidth="1"
        animate={{ scale: [1, 1.06, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '24px 24px' }} />
      {[0, 90, 180, 270].map((deg, i) => (
        <motion.circle key={i} cx={24 + 18 * Math.cos(deg * Math.PI / 180)} cy={24 + 18 * Math.sin(deg * Math.PI / 180)} r="2"
          fill="#FF7A00" opacity="0.6"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
      ))}
    </svg>
  );
}

// ── Coin / Prosperity Icon (spinning gold coin) ──
export function CoinIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#D4AF37') }}>
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <motion.circle cx="24" cy="24" r="18" fill="url(#coinGrad)"
        animate={{ scaleX: [1, 0.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }} />
      <motion.circle cx="24" cy="24" r="14" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5"
        animate={{ scaleX: [1, 0.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }} />
      <motion.text x="24" y="29" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#92400E"
        animate={{ scaleX: [1, 0.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}>₹</motion.text>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.circle key={i} cx={24 + 22 * Math.cos(deg * Math.PI / 180)} cy={24 + 22 * Math.sin(deg * Math.PI / 180)} r="1.5"
          fill="#FBBF24" animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </svg>
  );
}

// ── Diya / Festival Icon (flickering lamp) ──
export function DiyaIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#FBBF24') }}>
      <defs>
        <radialGradient id="diyaGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF7ED" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow aura */}
      <motion.ellipse cx="24" cy="20" rx="10" ry="12" fill="url(#diyaGlow)"
        animate={{ ry: [12, 15, 12], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} />
      {/* Flame */}
      <motion.path d="M24 6 C25 10, 29 13, 27 18 C26 21, 24 22, 24 22 C24 22, 22 21, 21 18 C19 13, 23 10, 24 6Z"
        fill="#FBBF24"
        animate={{ d: ['M24 6 C25 10, 29 13, 27 18 C26 21, 24 22, 24 22 C24 22, 22 21, 21 18 C19 13, 23 10, 24 6Z', 'M24 4 C26 8, 31 12, 28 17 C27 21, 24 23, 24 23 C24 23, 21 21, 20 17 C17 12, 22 8, 24 4Z', 'M24 6 C25 10, 29 13, 27 18 C26 21, 24 22, 24 22 C24 22, 22 21, 21 18 C19 13, 23 10, 24 6Z'] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.path d="M24 12 C24.5 14, 26 16, 25 18.5 C24.5 20, 24 21, 24 21 C24 21, 23.5 20, 23 18.5 C22 16, 23.5 14, 24 12Z"
        fill="#FFF7ED" opacity="0.7"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 0.8, repeat: Infinity }} />
      {/* Diya bowl */}
      <path d="M12 30 C12 26, 16 24, 24 24 C32 24, 36 26, 36 30 C36 34, 31 38, 24 38 C17 38, 12 34, 12 30Z" fill="#C2410C" opacity="0.8" />
      <path d="M12 30 C12 26, 16 24, 24 24 C32 24, 36 26, 36 30" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Wick */}
      <line x1="24" y1="24" x2="24" y2="22" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Leaf / Pitru Icon (growing leaf with veins) ──
export function LeafIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#4ADE80') }}>
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="60%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
      <motion.path d="M24 40 C24 40, 8 28, 8 16 C8 8, 16 4, 24 8 C32 4, 40 8, 40 16 C40 28, 24 40, 24 40Z"
        fill="url(#leafGrad)" opacity="0.85"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '24px 24px' }} />
      <motion.path d="M24 40 L24 12" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
      {[[-8, -8], [8, -4], [-6, 2], [7, 4]].map(([dx, dy], i) => (
        <motion.path key={i} d={`M24 ${24 + dy} Q${24 + dx} ${24 + dy - 4} ${24 + dx * 1.5} ${24 + dy}`}
          stroke="#166534" strokeWidth="1" fill="none" opacity="0.5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
    </svg>
  );
}

// ── Trishul / Tantra Icon (glowing trident) ──
export function TrishulIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#A855F7') }}>
      <defs>
        <linearGradient id="trishulGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      {/* Center prong */}
      <motion.path d="M24 6 L26 14 L22 14 Z" fill="url(#trishulGrad)"
        animate={{ scaleY: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '24px 14px' }} />
      <line x1="24" y1="14" x2="24" y2="42" stroke="url(#trishulGrad)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left prong */}
      <motion.path d="M12 10 L14 18 L10 18 Z" fill="url(#trishulGrad)" opacity="0.8"
        animate={{ scaleY: [1, 1.06, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        style={{ transformOrigin: '12px 18px' }} />
      <path d="M12 18 C12 20, 16 22, 20 22" stroke="url(#trishulGrad)" strokeWidth="2" fill="none" opacity="0.7" />
      {/* Right prong */}
      <motion.path d="M36 10 L38 18 L34 18 Z" fill="url(#trishulGrad)" opacity="0.8"
        animate={{ scaleY: [1, 1.06, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        style={{ transformOrigin: '36px 18px' }} />
      <path d="M36 18 C36 20, 32 22, 28 22" stroke="url(#trishulGrad)" strokeWidth="2" fill="none" opacity="0.7" />
      {/* Glow dot */}
      <motion.circle cx="24" cy="22" r="3" fill="#A855F7" opacity="0.4"
        animate={{ r: [3, 5, 3], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  );
}

// ── Hands / Prayers Icon (gentle pulse) ──
export function PrayerIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow() }}>
      <defs>
        <linearGradient id="prayerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </defs>
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        {/* Left hand */}
        <path d="M16 14 C14 14, 12 16, 12 18 L12 30 C12 33, 14 36, 17 38 L24 42 L24 42" stroke="url(#prayerGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Right hand */}
        <path d="M32 14 C34 14, 36 16, 36 18 L36 30 C36 33, 34 36, 31 38 L24 42" stroke="url(#prayerGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Center join */}
        <path d="M16 14 L24 8 L32 14 L24 42Z" fill="url(#prayerGrad)" opacity="0.15" />
        <line x1="24" y1="8" x2="24" y2="42" stroke="#FF7A00" strokeWidth="1.5" opacity="0.4" />
      </motion.g>
      <motion.circle cx="24" cy="6" r="3" fill="#FF7A00" opacity="0.3"
        animate={{ r: [3, 5, 3], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  );
}

// ── Wave / Peace Icon (rippling waves) ──
export function WaveIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#38BDF8') }}>
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      {[0, 8, 16].map((yOff, i) => (
        <motion.path key={i}
          d={`M6 ${18 + yOff} Q12 ${14 + yOff} 18 ${18 + yOff} Q24 ${22 + yOff} 30 ${18 + yOff} Q36 ${14 + yOff} 42 ${18 + yOff}`}
          stroke="url(#waveGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity={1 - i * 0.25}
          animate={{ d: [`M6 ${18 + yOff} Q12 ${14 + yOff} 18 ${18 + yOff} Q24 ${22 + yOff} 30 ${18 + yOff} Q36 ${14 + yOff} 42 ${18 + yOff}`, `M6 ${20 + yOff} Q12 ${16 + yOff} 18 ${20 + yOff} Q24 ${24 + yOff} 30 ${20 + yOff} Q36 ${16 + yOff} 42 ${20 + yOff}`, `M6 ${18 + yOff} Q12 ${14 + yOff} 18 ${18 + yOff} Q24 ${22 + yOff} 30 ${18 + yOff} Q36 ${14 + yOff} 42 ${18 + yOff}`] }}
          transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }} />
      ))}
    </svg>
  );
}

// ── Package / Delivery Icon (animated box) ──
export function PackageIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow() }}>
      <defs>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </defs>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        {/* Box body */}
        <path d="M8 18 L24 10 L40 18 L40 36 L24 44 L8 36Z" fill="#FF7A00" opacity="0.1" stroke="#FF7A00" strokeWidth="2" strokeLinejoin="round" />
        {/* Top face */}
        <path d="M8 18 L24 26 L40 18" stroke="#D4AF37" strokeWidth="2" fill="none" />
        <line x1="24" y1="26" x2="24" y2="44" stroke="#FF7A00" strokeWidth="1.5" opacity="0.5" />
        {/* Ribbon */}
        <motion.path d="M16 14 L24 18 L32 14" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" fill="none"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </motion.g>
      {/* Speed lines */}
      {[26, 30, 34].map((y, i) => (
        <motion.line key={i} x1="2" y1={y} x2="6" y2={y} stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round"
          animate={{ x1: [2, 0, 2], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </svg>
  );
}

// ── Microscope / Lab Icon (scanning beam) ──
export function LabIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#22D3EE') }}>
      <defs>
        <linearGradient id="labGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      {/* Microscope body */}
      <path d="M20 8 L28 8 L28 28 L20 28Z" fill="url(#labGrad)" opacity="0.3" stroke="#22D3EE" strokeWidth="1.5" />
      <path d="M16 28 L32 28 L34 36 L14 36Z" fill="url(#labGrad)" opacity="0.2" stroke="#22D3EE" strokeWidth="1.5" />
      <line x1="10" y1="36" x2="38" y2="36" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" />
      {/* Lens */}
      <circle cx="24" cy="14" r="5" fill="none" stroke="#22D3EE" strokeWidth="2" />
      <motion.circle cx="24" cy="14" r="3" fill="#22D3EE" opacity="0.4"
        animate={{ r: [3, 4, 3], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }} />
      {/* Scan beam */}
      <motion.line x1="24" y1="19" x2="24" y2="28" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="2 2"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }} />
      {/* Checkmark */}
      <motion.path d="M14 42 L18 46 L26 38" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.8, 1] }} />
    </svg>
  );
}

// ── Book Icon (page turning) ──
export function BookIcon({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={{ filter: glow('#D4AF37') }}>
      <path d="M8 8 L24 12 L24 42 L8 38Z" fill="#FF7A00" opacity="0.15" stroke="#FF7A00" strokeWidth="2" />
      <path d="M40 8 L24 12 L24 42 L40 38Z" fill="#D4AF37" opacity="0.1" stroke="#D4AF37" strokeWidth="2" />
      <line x1="24" y1="12" x2="24" y2="42" stroke="#FF7A00" strokeWidth="1.5" opacity="0.5" />
      {/* Animated page */}
      <motion.path d="M24 12 L36 9 L36 39 L24 42" fill="#D4AF37" opacity="0.1" stroke="#D4AF37" strokeWidth="1" animate={{ d: ['M24 12 L36 9 L36 39 L24 42', 'M24 12 L30 10 L30 40 L24 42', 'M24 12 L36 9 L36 39 L24 42'] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Text lines */}
      {[18, 24, 30].map((y, i) => (
        <motion.line key={i} x1="12" y1={y} x2="20" y2={y + 1} stroke="#FF7A00" strokeWidth="1" strokeLinecap="round" opacity="0.3" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
      ))}
    </svg>
  );
}
