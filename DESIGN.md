# ShubhKarma — Design System Contract
> Machine-readable design specification for Claude Code and AI agents.
> **RULE: Never invent values. Always reference this file for any UI work.**

---

## Brand Identity

**Name:** ShubhKarma
**Category:** Premium Spiritual Services Platform
**Positioning:** India's most trusted, modern pandit booking and puja services platform
**Design Level:** Awwwards / agency-quality — never template, never generic
**Tone:** Sacred but modern. Warm but premium. Trustworthy but exciting.

---

## Color Palette

### Primary — Saffron (Energy, Devotion)
```
saffron-50:  #FFF7ED    saffron-100: #FFEDD5    saffron-200: #FED7AA
saffron-300: #FDBA74    saffron-400: #FF9F40    saffron-500: #FF7A00
saffron-600: #EA6C00    saffron-700: #CC5E00    saffron-800: #9A4700
saffron-900: #7C3A00
```

### Accent — Gold (Premium, Divine)
```
gold-50:  #FDFAF0    gold-100: #F9F0D4    gold-200: #F2E0A8
gold-300: #E8CC73    gold-400: #D4AF37    gold-500: #B8962E
gold-600: #9A7D25    gold-700: #7A631D    gold-800: #5C4A16
gold-900: #3E3210
```

### Surface — Cream (Purity, Space)
```
cream:       #FFF8F0    cream-dark:  #FFF0E0    cream-deep:  #FFE8CC
white:       #FFFFFF    white-soft:  #FEFCFA
```

### Dark — Warm Blacks (Grounding)
```
dark-50:  #F5F0EB    dark-100: #E0D6CC    dark-200: #B8A898
dark-300: #8C7A68    dark-400: #6B5A48    dark-500: #4A3D2E
dark-600: #3D2E1A    dark-700: #2D1F0E    dark-800: #1A1207
dark-900: #0F0A04
```

### Background Variants
```
Hero dark bg:   #090603    Section alt:  #0D0905
Light section:  #FFF8F0    Mid section:  #FFFBF5
```

### Glow Utilities
```
glow-saffron:        rgba(255, 122, 0, 0.12)
glow-saffron-md:     rgba(255, 122, 0, 0.20)
glow-saffron-strong: rgba(255, 122, 0, 0.35)
glow-gold:           rgba(212, 175, 55, 0.10)
glow-gold-md:        rgba(212, 175, 55, 0.18)
```

---

## Typography

### Font Stack
```
Heading:  'Outfit', system-ui, sans-serif       → font-heading
Accent:   'Playfair Display', Georgia, serif    → font-accent (italic for quotes, ceremony names)
Body:     'Inter', system-ui, sans-serif        → font-body (default)
```

### Scale (Major Third — 1.25 ratio)
```
xs:   12px    sm:  14px    base: 16px    lg:  18px
xl:   20px    2xl: 24px    3xl: 30px     4xl: 36px
5xl:  48px    6xl: 60px    7xl: 72px     8xl: 96px (hero only)
```

### Heading Sizes by Context
```
Hero H1:       clamp(3rem, 7vw, 5.6rem)   — Outfit ExtraBold 800
Section H2:    clamp(2rem, 4vw, 3.2rem)   — Outfit Bold 700
Card H3:       1.5rem–2rem                — Outfit SemiBold 600
Label/Eyebrow: 11px–13px, tracking 0.2em  — Outfit SemiBold 600, UPPERCASE
```

### Key Rules
- Headings: `font-heading font-bold tracking-tight leading-[1.05]`
- Accent italic text: `font-accent italic` — use for ceremony names, Sanskrit terms
- Body text on dark: `text-white/55` (subtle) `text-white/75` (readable) `text-white/90` (primary)
- Body text on light: `text-dark-400` (subtle) `text-dark-600` (readable) `text-dark-800` (primary)

---

## Spacing System (4px grid)

```
1: 4px    2: 8px    3: 12px   4: 16px   5: 20px   6: 24px
8: 32px   10: 40px  12: 48px  16: 64px  20: 80px  24: 96px
32: 128px  40: 160px
```

### Section Vertical Padding
```
Compact sections:  py-16 (64px)
Default sections:  py-24 (96px)
Hero / CTA:        py-32 (128px)
```

### Container Max-Widths
```
Narrow:  max-w-2xl  (672px)
Content: max-w-4xl  (896px)
Default: max-w-6xl  (1152px)
Wide:    max-w-7xl  (1280px)
Full:    max-w-[1400px]
```

---

## Border Radius

```
Tags / badges:     rounded-full
Inputs:            rounded-xl (12px)
Cards:             rounded-2xl (24px)
Feature cards:     rounded-3xl (32px)
Modals / panels:   rounded-[2rem] (32px)
Pill buttons:      rounded-full
```

---

## Shadows

```
Card default:    shadow-[0_2px_12px_rgba(26,18,7,0.06)]
Card hover:      shadow-[0_12px_40px_rgba(255,122,0,0.10),0_4px_20px_rgba(26,18,7,0.08)]
Glow small:      shadow-[0_0_24px_rgba(255,122,0,0.12)]
Glow medium:     shadow-[0_0_40px_rgba(255,122,0,0.18),0_0_80px_rgba(212,175,55,0.08)]
Glow strong:     shadow-[0_0_60px_rgba(255,122,0,0.28),0_0_120px_rgba(212,175,55,0.14)]
CTA button:      shadow-[0_4px_24px_rgba(255,122,0,0.32),0_0_60px_rgba(255,122,0,0.10)]
```

---

## Component Patterns

### Section Structure
Every section follows this pattern:
1. **Eyebrow** — `text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-500` + decorative lines
2. **Headline** — `font-heading font-bold text-[clamp(2rem,4vw,3.2rem)] text-dark-800` (light) or `text-white` (dark)
3. **Subtitle** — `text-base md:text-lg text-dark-400` (max-w-2xl centered)
4. **Content grid / feature set**
5. **CTA** (optional)

### Cards — Light (on cream/white backgrounds)
```
bg-white border border-gold-200/40 rounded-2xl p-6 md:p-8
shadow-[0_2px_12px_rgba(26,18,7,0.06)]
hover:shadow-[0_12px_40px_rgba(255,122,0,0.10)] hover:-translate-y-1
transition-all duration-500
```

### Cards — Dark (on dark backgrounds)
```
bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 md:p-8
backdrop-blur-xl
hover:bg-white/[0.09] hover:border-saffron-400/25
transition-all duration-500
```

### Featured / Hero Cards (premium glow)
```
bg-gradient-to-br from-saffron-500/10 to-gold-400/5
border border-saffron-400/25 rounded-3xl
shadow-[0_0_40px_rgba(255,122,0,0.14)]
```

### Icon Containers
```
Light:  w-12 h-12 rounded-2xl bg-saffron-50 border border-saffron-100 flex items-center justify-center
Dark:   w-12 h-12 rounded-2xl bg-saffron-500/15 border border-saffron-500/25 flex items-center justify-center
```

### Buttons
```
Primary CTA:   rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500
               px-8 py-4 text-[15px] font-semibold text-white
               shadow-[0_4px_24px_rgba(255,122,0,0.32)] hover:scale-[1.03]

Secondary CTA: rounded-full border border-white/[0.12] bg-white/[0.06]
               px-8 py-4 text-[15px] font-semibold text-white/80 backdrop-blur-xl
               hover:border-saffron-400/28 hover:bg-white/[0.10]

Light outline: rounded-full border-2 border-saffron-500 text-saffron-600
               px-8 py-4 text-[15px] font-semibold
               hover:bg-saffron-500 hover:text-white
```

### Eyebrow Label
```jsx
<div className="mb-4 inline-flex items-center gap-2">
  <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-500">Label Here</span>
  <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
</div>
```

### Number/Stat Display
```jsx
<div>
  <div className="font-heading text-4xl md:text-5xl font-extrabold text-saffron-500">1,200+</div>
  <div className="text-sm font-medium text-dark-400 uppercase tracking-wider">Pujas Performed</div>
</div>
```

### Badge / Tag
```jsx
// On dark bg
<span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-400/25 bg-saffron-500/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-saffron-300">
  Tag Label
</span>

// On light bg
<span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-50 px-4 py-1.5 text-[12px] font-semibold text-saffron-700 border border-saffron-100">
  Tag Label
</span>
```

### Divider
```jsx
<div className="h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent my-16" />
```

---

## Section Backgrounds — Alternating Pattern

Pages must alternate between these to create visual rhythm:

```
1. Dark hero:      bg-[#090603]  → floating particles, mandala, ambient glow
2. Light:          bg-[#FFF8F0]  → cards on white, warm cream backdrop
3. Dark section:   bg-[#0D0905]  → dark glass cards, subtle grid
4. Neutral light:  bg-[#FFFBF5]  → softer cards, gold accents
5. Deep dark:      bg-dark-800   → strong contrast CTAs
```

---

## Animation Contracts

### Entrance Animations (scroll-triggered)
```
Fade up:    initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} duration:0.7 ease:[0.16,1,0.3,1]
Fade in:    initial={{ opacity:0 }} animate={{ opacity:1 }} duration:0.8
Scale in:   initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} duration:0.6
Stagger:    staggerChildren: 0.08–0.12
```

### Hover States
```
Cards:       hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300
Buttons:     hover:scale-[1.03] transition-all duration-300
Images:      hover:scale-[1.04] transition-all duration-500 (inside overflow-hidden)
Icon boxes:  hover:bg-saffron-500/20 transition-colors duration-200
```

### Page scroll-triggered reveals: use `whileInView={{ opacity:1, y:0 }}` with `viewport={{ once:true, margin:"-80px" }}`

---

## Data Fetching Pattern

Always use `useApi` hook. Never hardcode counts/stats if API provides them.

```jsx
const { data: pujas, loading } = useApi(() => getPujas({ featured: true }));
const { data: stats } = useApi(getStats);

// Skeleton while loading:
{loading ? (
  <div className="h-48 rounded-2xl bg-dark-100 animate-pulse" />
) : (
  <RealContent data={pujas} />
)}
```

---

## Content Density Rules

- **Hero section:** Eyebrow + H1 + subtitle + 2 CTAs + stats strip. Nothing more.
- **Feature sections:** 3–6 items max in a grid. Add numbered prefixes `01 02 03` for premium feel.
- **Testimonial sections:** Show avatar + name + puja + rating + quote. Minimum 6 visible, paginated.
- **Pricing tiers:** Always 3 tiers. Middle = highlighted with saffron glow border.
- **FAQ:** Always accordion. Show 6–8 items. Load more on click.
- **Stats bars:** 4 stats in a horizontal strip. Large number + small label.

---

## Page-Level Rules

1. Every page **must** have: hero section with breadcrumb, 4+ content sections, footer CTA
2. All data **must** come from API (`useApi`) with loading skeletons
3. Section backgrounds **must** alternate dark/light
4. Every section needs an eyebrow + headline
5. Mobile-first — all grids go `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
6. Images use `OptimizedImage` component with fallback
7. All CTAs link to either `/booking/[slug]` or WhatsApp
