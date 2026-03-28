// src/components/ui/OptimizedImage.jsx — Lazy image with blur placeholder, smart fallback & error handling
import { useState, useCallback, memo, useRef } from 'react';
import { useIntersection } from '../../hooks/useIntersection';
import { getPujaImage, getCategoryImage, getSamagriImage, getPanditImage, getBlogImage, handleImageError } from '../../utils/images';

/**
 * Resolve an asset path to a real image URL.
 * Paths like /assets/pujas/bhagwat-katha.jpg get mapped to Unsplash URLs.
 */
function resolveImageSrc(src) {
  if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith('blob:')) return src;
  // Extract slug from paths like /assets/pujas/slug.jpg
  const match = src.match(/\/assets\/(pujas|categories|samagri|pandits|blog|testimonials)\/([\w-]+)/);
  if (!match) return src;
  const [, type, slug] = match;
  switch (type) {
    case 'pujas': return getPujaImage(slug);
    case 'categories': return getCategoryImage(slug);
    case 'samagri': return getSamagriImage(slug, '');
    case 'pandits': return getPanditImage(slug);
    case 'blog': return getBlogImage(slug);
    default: return src;
  }
}

function OptimizedImageInner({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  onLoad: onLoadProp,
  fallbackSrc,
  ...rest
}) {
  const resolvedSrc = resolveImageSrc(src) || src;
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const retryRef = useRef(false);

  const { ref, isIntersecting } = useIntersection({
    rootMargin: '200px',
    once: true,
    enabled: !priority,
  });

  const shouldLoad = priority || isIntersecting;

  const handleLoad = useCallback(
    (e) => {
      setLoaded(true);
      onLoadProp?.(e);
    },
    [onLoadProp]
  );

  const handleErrorCb = useCallback((e) => {
    if (!retryRef.current && fallbackSrc) {
      retryRef.current = true;
      e.target.src = fallbackSrc;
      return;
    }
    // Final fallback: placehold.co with alt text
    if (!retryRef.current) {
      retryRef.current = true;
      handleImageError(e, alt, 600);
      return;
    }
    setError(true);
  }, [fallbackSrc, alt]);

  const style = aspectRatio ? { aspectRatio } : undefined;

  if (error) {
    return (
      <div
        ref={ref}
        className={`bg-gradient-to-br from-cream-dark to-gold-100 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center px-4">
          <svg className="w-8 h-8 text-dark-100 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-dark-200 line-clamp-2">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ width, height, ...style }}>
      {/* Blur placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-cream-dark to-gold-100 transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden
      />

      {shouldLoad && (
        <img
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : undefined}
          onLoad={handleLoad}
          onError={handleErrorCb}
          className={`w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
          {...rest}
        />
      )}
    </div>
  );
}

export const OptimizedImage = memo(OptimizedImageInner);
