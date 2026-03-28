import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { fallbackBlogPosts } from '../../data/fallbackData';

const categoryColors = {
  'Traditions': 'bg-orange-100 text-orange-700',
  'Astrology': 'bg-purple-100 text-purple-700',
  'Guide': 'bg-emerald-100 text-emerald-700',
};

export default function BlogPreview() {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Spiritual Insights"
          title="Wisdom & Knowledge"
          subtitle="Explore our articles on Vedic traditions, astrology, and the significance of sacred rituals."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fallbackBlogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-cream-dark to-gold-light">
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-30">📜</span>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-dark/30">{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-dark/20" />
                <span className="text-xs text-dark/30">{post.readTime}</span>
              </div>

              <h3 className="font-heading text-lg font-bold text-dark mb-2 group-hover:text-saffron transition-colors duration-300 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-dark/50 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-saffron group-hover:gap-2 transition-all duration-300">
                Read More <span>→</span>
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
