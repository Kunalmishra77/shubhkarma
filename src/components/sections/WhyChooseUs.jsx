import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';

const features = [
  { icon: '🙏', title: 'Vedic Authenticity', desc: 'Every ritual follows ancient Vedic scriptures performed by learned pandits with decades of experience.' },
  { icon: '📦', title: 'Complete Samagri', desc: 'All puja materials are carefully sourced and arranged — you don\'t need to worry about a thing.' },
  { icon: '🏠', title: 'At Your Doorstep', desc: 'Our pandits come to your home, temple, or preferred location. No travel hassle for your family.' },
  { icon: '💬', title: 'WhatsApp Updates', desc: 'Get real-time booking confirmations, reminders, and support directly on WhatsApp.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden costs or surprise charges. Everything is clearly listed upfront.' },
  { icon: '⏰', title: 'Flexible Scheduling', desc: 'Choose your preferred date and time. Need to reschedule? No problem — it\'s free.' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-6 bg-cream relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="Why ShubhKarma"
          title="Why Families Trust Us"
          subtitle="We're committed to making every spiritual experience authentic, convenient, and deeply meaningful."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-2xl bg-white border border-dark/5 shadow-card hover:shadow-card-hover transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron/10 to-gold/10 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-heading text-lg font-bold text-dark mb-2">{feature.title}</h3>
              <p className="text-sm text-dark/50 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
