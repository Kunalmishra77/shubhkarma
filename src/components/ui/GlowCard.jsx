// src/components/ui/GlowCard.jsx — re-exports PujaCard for backward compat
import { PujaCard } from './PujaCard';

export default function GlowCard({ puja, index }) {
  return <PujaCard puja={puja} index={index} />;
}
