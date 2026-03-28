import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import { fallbackCategories } from '../../data/fallbackData';

export default function PopularCategories() {
  const colors = [
    'from-orange-500/10 to-amber-500/10 border-orange-200/40',
    'from-rose-500/10 to-pink-500/10 border-rose-200/40',
    'from-emerald-500/10 to-teal-500/10 border-emerald-200/40',
    'from-violet-500/10 to-purple-500/10 border-violet-200/40',
    'from-sky-500/10 to-blue-500/10 border-sky-200/40',
    'from-amber-500/10 to-yellow-500/10 border-amber-200/40',
  ];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Browse by Category"
          title="Find Your Sacred Ritual"
          subtitle="Explore our curated categories to find the perfect puja for your needs."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {fallbackCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={`/pujas?category=${cat.slug}`}
                className="block no-underline group"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${colors[i]} border text-center transition-all duration-500 hover:shadow-card-hover`}
                >
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="font-heading text-sm font-bold text-dark mb-1">{cat.name}</h3>
                  <p className="text-xs text-dark/40">{cat.desc}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
