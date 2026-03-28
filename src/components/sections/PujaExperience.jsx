import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';

const experiences = [
  { icon: '🕉️', title: 'Auspicious Muhurat', desc: 'We select the most auspicious time for your puja based on Vedic panchang and planetary positions.' },
  { icon: '🎍', title: 'Sacred Decoration', desc: 'Your puja space is beautifully decorated with flowers, mango leaves, rangoli, and traditional elements.' },
  { icon: '🔥', title: 'Vedic Havan', desc: 'Sacred fire ritual with authentic ghee, samagri, and Vedic mantra chanting for divine purification.' },
  { icon: '📿', title: 'Mantra Chanting', desc: 'Precise recitation of Vedic mantras by experienced pandits, creating powerful spiritual vibrations.' },
  { icon: '🍚', title: 'Prasad Distribution', desc: 'Blessed prasad is prepared and distributed to all family members as divine offering.' },
  { icon: '💫', title: 'Aarti & Blessings', desc: 'The puja concludes with a beautiful aarti ceremony and personalized blessings for your family.' },
];

export default function PujaExperience() {
  return (
    <section className="py-24 px-6 section-gradient-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-saffron/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="The Experience"
          title="What to Expect"
          subtitle="Every puja with ShubhKarma is a deeply immersive spiritual experience, crafted with devotion and care."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-dark rounded-2xl p-7 group hover:border-saffron/20 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center text-3xl mb-5 group-hover:bg-saffron/20 transition-all duration-300">
                {exp.icon}
              </div>
              <h3 className="font-heading text-lg font-semibold text-white mb-2">{exp.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
