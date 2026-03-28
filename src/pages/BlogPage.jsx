// src/pages/BlogPage.jsx — Premium editorial redesign
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlogPosts, getCategories } from '../services/api';
import { useApi } from '../hooks/useApi';
import SEOHead from '../components/seo/SEOHead';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariant = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ════════════════════════════════════════════════
   BLOG PAGE — 6 premium sections
   ════════════════════════════════════════════════ */
export default function BlogPage() {
  const [activeTag, setActiveTag] = useState('all');
  const { data: blogPostsData, loading: postsLoading } = useApi(() => getBlogPosts(), []);
  const { data: catsRes } = useApi(() => getCategories(), []);
  const blogPosts = blogPostsData || [];
  const categories = catsRes?.data || [];

  const featuredPost = useMemo(() => blogPosts.find((p) => p.featured) || blogPosts[0], [blogPosts]);
  const allTags = useMemo(() => ['all', ...new Set(blogPosts.flatMap((p) => p.tags || []))], [blogPosts]);
  const filteredPosts = useMemo(
    () => activeTag === 'all' ? blogPosts : blogPosts.filter((p) => (p.tags || []).includes(activeTag)),
    [activeTag, blogPosts]
  );
  const gridPosts = useMemo(() => filteredPosts.filter((p) => p.id !== featuredPost?.id), [filteredPosts, featuredPost]);

  const getCat = (post) => categories.find((c) => c.id === post.categoryId);

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Spiritual Wisdom Blog — ShubhKarma"
        description="Insights, guides, and deep dives into Vedic rituals, planetary remedies, and sacred traditions — written by our experienced Pandits."
        url="https://shubhkarma.in/blog"
      />

      {/* ══════════════════════════════════════════
          §1 HERO — Cinematic dark with featured post
          ══════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#090603]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_40%,rgba(255,148,40,0.11)_0%,transparent_66%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/[0.04] rounded-full blur-[200px] pointer-events-none" />

        <div className="container-base relative z-10 pt-36 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* text block */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-6">
                <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.05] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/50 backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-saffron-400" />
                  Spiritual Wisdom
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-extrabold leading-[1.02] tracking-tight text-[clamp(2.4rem,5vw,4.2rem)] text-white mb-6">
                Ancient wisdom<br />
                <span className="bg-gradient-to-r from-saffron-300 via-[#FFCB6B] to-gold-400 bg-clip-text text-transparent">for modern life</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
                className="text-white/42 text-base md:text-lg leading-relaxed mb-8">
                Insights, guides, and deep dives into Vedic rituals, planetary remedies, and sacred traditions — written by our experienced Pandits.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center gap-6 text-sm text-white/35">
                <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-saffron-400" />{blogPosts.length} Articles</span>
                <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold-400" />{allTags.length - 1} Topics</span>
                <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-saffron-300" />Expert Authors</span>
              </motion.div>
            </div>

            {/* featured post card */}
            {featuredPost && (
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <Link to={`/blog/${featuredPost.slug}`} className="block no-underline group">
                  <div className="relative rounded-3xl overflow-hidden bg-dark-800 h-[400px] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                    <img src={featuredPost.imageUrl} alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-[1.04] group-hover:opacity-65 transition-all duration-700"
                      loading="eager" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-dark-900/10" />
                    <div className="absolute top-5 left-5">
                      <span className="rounded-full bg-saffron-500/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                        Featured
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <div className="flex items-center gap-2 mb-3">
                        {getCat(featuredPost) && (
                          <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                            {getCat(featuredPost).title}
                          </span>
                        )}
                        <span className="text-[11px] text-white/45">{featuredPost.readTime} read</span>
                      </div>
                      <h2 className="font-heading text-xl md:text-2xl font-bold text-white group-hover:text-saffron-300 transition-colors duration-300 leading-snug mb-3">
                        {featuredPost.title}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{featuredPost.author?.name}</span>
                        <span>·</span>
                        <span>{formatDate(featuredPost.date)}</span>
                      </div>
                    </div>
                    {/* hover underline */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0905] to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §2 TAG FILTER — Sticky dark
          ══════════════════════════════════════════ */}
      <div className="sticky top-[72px] z-30 bg-[#0D0905]/92 border-b border-white/[0.06] backdrop-blur-xl">
        <div className="container-base py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allTags.slice(0, 12).map((tag) => {
              const count = tag === 'all' ? blogPosts.length : blogPosts.filter((p) => (p.tags || []).includes(tag)).length;
              return (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTag === tag
                      ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-[0_4px_18px_rgba(255,122,0,0.26)]'
                      : 'border border-white/[0.08] bg-white/[0.04] text-white/55 hover:text-white/80 hover:border-white/[0.14]'
                  }`}>
                  <span className="capitalize">{tag === 'all' ? 'All Topics' : tag.replace(/-/g, ' ')}</span>
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${activeTag === tag ? 'bg-white/25 text-white' : 'bg-white/10 text-white/40'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          §3 ARTICLES GRID — Dark
          ══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0A0704] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/10 to-transparent" />
        <div className="container-base">
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden animate-pulse">
                  <div className="h-52 bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-white/5 rounded w-24" />
                    <div className="h-5 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTag}
                initial="hidden" animate="visible" exit={{ opacity: 0 }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              >
                {gridPosts.map((post) => {
                  const cat = getCat(post);
                  return (
                    <motion.article key={post.id} layout variants={itemVariant}>
                      <Link to={`/blog/${post.slug}`} className="block no-underline group h-full">
                        <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.04] overflow-hidden hover:border-saffron-400/22 hover:bg-white/[0.07] transition-all duration-400 flex flex-col">
                          {/* image */}
                          <div className="relative h-52 overflow-hidden bg-dark-800 shrink-0">
                            <img src={post.imageUrl} alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-[1.05] group-hover:opacity-70 transition-all duration-700"
                              loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-transparent" />
                            {cat && (
                              <div className="absolute top-4 left-4">
                                <span className="rounded-full bg-saffron-500/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                                  {cat.title}
                                </span>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                          </div>

                          {/* content */}
                          <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-3 text-[11px] text-white/40">
                              <span>{post.readTime} read</span>
                              <span>·</span>
                              <span>{formatDate(post.date)}</span>
                            </div>
                            <h3 className="font-heading text-base md:text-lg font-bold text-white/88 group-hover:text-saffron-300 transition-colors duration-300 line-clamp-2 mb-2 flex-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-white/45 line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                            {/* author */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                              <span className="text-xs font-medium text-white/45">{post.author?.name}</span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-saffron-400 group-hover:gap-2 transition-all duration-300">
                                Read
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {!postsLoading && gridPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/40 mb-5">No articles for this topic yet.</p>
              <button onClick={() => setActiveTag('all')} className="rounded-full border border-saffron-400/30 px-6 py-2.5 text-sm font-semibold text-saffron-400 hover:bg-saffron-500/10 transition-colors">
                View All Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §4 TOPICS CLOUD — Light
          ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#FFF8F0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/50 to-transparent" />
        <div className="container-base">
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Topics</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-dark-800">Explore by topic</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {allTags.slice(1).map((tag, i) => {
              const count = blogPosts.filter((p) => (p.tags || []).includes(tag)).length;
              return (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  onClick={() => { setActiveTag(tag); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-dark-50 text-sm font-medium text-dark-600 hover:border-saffron-300 hover:text-saffron-700 hover:bg-saffron-50 transition-all duration-300 shadow-sm"
                >
                  <span className="capitalize">{tag.replace(/-/g, ' ')}</span>
                  <span className="text-[10px] bg-dark-50 text-dark-400 rounded-full px-1.5 py-0.5">{count}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §5 NEWSLETTER CTA — Dark
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#090603] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,122,0,0.07)_0%,transparent_65%)] pointer-events-none" />
        <div className="container-base relative z-10">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center">
            <div className="mb-5 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-500">Ready to Act</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white mb-5 leading-tight">
              Ready to experience the rituals you've read about?
            </h2>
            <p className="text-white/42 text-lg mb-10">
              Book your puja with verified pandits and pure samagri — guided end to end.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pujas"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.32)] hover:scale-[1.03] transition-all duration-300 no-underline">
                Browse All Pujas
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/categories"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-9 py-4 text-[15px] font-semibold text-white/80 backdrop-blur-xl hover:border-saffron-400/28 hover:bg-white/[0.10] transition-all duration-300 no-underline">
                Browse Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
