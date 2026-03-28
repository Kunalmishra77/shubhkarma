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
