// src/components/seo/SEOHead.jsx — Reusable SEO meta component
import { Helmet } from 'react-helmet-async';

const SITE = {
  name: 'ShubhKarma',
  tagline: 'Sacred Rituals, Modern Convenience',
  url: 'https://shubhkarma.in',
  defaultDescription:
    'Book authentic Vedic pujas performed by experienced pandits. Sacred rituals for prosperity, peace, and divine blessings — delivered to your doorstep.',
  defaultImage: '/og-image.jpg',
  themeColor: '#FF7A00',
  locale: 'en_IN',
  twitterHandle: '@shubhkarma',
};

export default function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  jsonLd,
  children,
}) {
  const pageTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const pageDescription = description || SITE.defaultDescription;
  const pageImage = image || SITE.defaultImage;
  const pageUrl = url || SITE.url;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:locale" content={SITE.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      {children}
    </Helmet>
  );
}

/* ── Pre-built JSON-LD helpers ── */

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ShubhKarma',
    url: SITE.url,
    logo: `${SITE.url}/favicon.svg`,
    description: SITE.defaultDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9999999999',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://instagram.com/shubhkarma',
      'https://youtube.com/@shubhkarma',
      'https://facebook.com/shubhkarma',
    ],
  };
}

export function serviceJsonLd(puja) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: puja.title,
    description: puja.shortDescription || puja.description,
    provider: { '@type': 'Organization', name: 'ShubhKarma' },
    areaServed: { '@type': 'Country', name: 'India' },
    ...(puja.tiers?.basic?.price && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: puja.tiers.basic.price,
        highPrice: puja.tiers.premium?.price || puja.tiers.basic.price,
        priceCurrency: 'INR',
      },
    }),
    ...(puja.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: puja.rating,
        reviewCount: puja.reviews || 0,
      },
    }),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
