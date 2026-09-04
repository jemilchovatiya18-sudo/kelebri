import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import api from '../lib/api';
import type { Product, Category } from '../types';
import ProductCard from '../components/ui/ProductCard';

/* ─── Diamond filter options ─────────────────────────────── */
const DIAMOND_TYPE_OPTIONS = [
  { label: 'All',        value: '' },
  { label: 'Lab Grown',  value: 'LAB_GROWN' },
  { label: 'Natural',    value: 'NATURAL' },
  { label: 'Moissanite', value: 'MOISSANITE' },
];

/* ─── Per-category descriptions ──────────────────────────── */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  rings:                'Crafted for every occasion, from timeless solitaires to intricate diamond bands.',
  earrings:             'Delicate drops and statement studs, each one a miniature work of art.',
  pendants:             'Elevate your neckline with pendants designed to catch light and turn heads.',
  necklaces:            'From layered chains to bold collar pieces — refined elegance for every neckline.',
  'bracelets-bangles':  'Effortlessly stack or wear solo — each piece a quiet declaration of taste.',
  'tennis-collection':  'The timeless tennis silhouette, reimagined with Kelebri\'s signature craftsmanship.',
  'lab-grown-diamonds': 'Ethically grown, optically identical. The future of fine diamond jewellery.',
  'natural-diamonds':   'Sourced from the earth\'s deepest reaches — uncompromising natural brilliance.',
  moissanite:           'Exceptional fire and brilliance at its most accessible and sustainable.',
  'custom-jewelry':     'Your vision, our artistry. Commission a piece that\'s uniquely yours.',
};

/* ─── Diamond category slugs ─────────────────────────────── */
const DIAMOND_SLUGS = ['lab-grown-diamonds', 'natural-diamonds', 'moissanite', 'custom-jewelry'];

/* ─── Animation variants ─────────────────────────────────── */
const headerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeSlideUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const cardFade: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => {
    const transition: Transition = { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] };
    return { opacity: 1, y: 0, transition };
  },
};

/* ─── Component ──────────────────────────────────────────── */
const CollectionPage = () => {
  const { category } = useParams<{ category: string }>();
  const [diamondFilter, setDiamondFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: categoryData } = useQuery({
    queryKey: ['category', category],
    queryFn: () => api.get(`/categories/${category}`).then(r => r.data.data as Category),
    enabled: !!category,
  });

  const { data, isLoading } = useQuery<{ data: Product[]; meta?: { total?: number; totalPages?: number } }, Error>({
    queryKey: ['products', category, diamondFilter, page],
    queryFn: () => api.get(`/products`, {
      params: { category, diamondType: diamondFilter || undefined, page, limit },
    }).then(r => r.data),
  });

  const products: Product[] = data?.data || [];
  const meta = data?.meta;
  const slug = category ?? '';
  const categoryName =
    categoryData?.name ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ||
    'All Collections';

  const isDiamond    = DIAMOND_SLUGS.includes(slug);
  const parentLabel  = isDiamond ? 'Diamonds' : 'Collections';
  const parentHref   = isDiamond ? '/collections/lab-grown-diamonds' : '/collections';
  const description  = CATEGORY_DESCRIPTIONS[slug] ?? '';

  return (
    <>
      <Helmet>
        <title>{categoryName} | Kelebri Diamonds &amp; Jewellery</title>
        <meta
          name="description"
          content={description || `Explore Kelebri's exquisite ${categoryName} collection. Premium diamonds and fine jewellery crafted with exceptional artistry.`}
        />
      </Helmet>

      {/* ── Premium Page Header ───────────────────── */}
      <motion.section
        variants={headerContainer}
        initial="hidden"
        animate="visible"
        style={{
          marginTop: '72px',
          paddingTop: '3.5rem',
          paddingBottom: '2.5rem',
          background: 'var(--color-cream)',
          textAlign: 'center',
        }}
      >
        <div className="container-luxury">

          {/* Breadcrumb */}
          <motion.nav
            variants={fadeIn}
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              marginBottom: '1.5rem',
            }}
          >
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              Home
            </Link>

            <ChevronRight size={10} style={{ color: 'var(--color-muted-light)', flexShrink: 0 }} />

            {category && (
              <>
                <Link
                  to={parentHref}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                >
                  {parentLabel}
                </Link>
                <ChevronRight size={10} style={{ color: 'var(--color-muted-light)', flexShrink: 0 }} />
              </>
            )}

            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
              }}
            >
              {categoryName}
            </span>
          </motion.nav>

          {/* Category Title */}
          <motion.h1
            variants={fadeSlideUp}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              color: 'var(--color-charcoal)',
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              marginBottom: description ? '1rem' : '0',
            }}
          >
            {categoryName}
          </motion.h1>

          {/* Optional italic subtitle */}
          {description && (
            <motion.p
              variants={fadeSlideUp}
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)',
                color: 'var(--color-muted)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.7,
                letterSpacing: '0.01em',
              }}
            >
              {description}
            </motion.p>
          )}

          {/* Gold ornamental divider */}
          <motion.div
            variants={fadeIn}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '2.25rem',
            }}
          >
            <span style={{
              display: 'block', width: '52px', height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--color-gold))',
            }} />
            <span style={{
              display: 'block', width: '5px', height: '5px',
              borderRadius: '50%', background: 'var(--color-gold)', opacity: 0.75,
            }} />
            <span style={{
              display: 'block', width: '52px', height: '1px',
              background: 'linear-gradient(90deg, var(--color-gold), transparent)',
            }} />
          </motion.div>

        </div>
      </motion.section>

      {/* ── Products Section ──────────────────────── */}
      <section style={{ background: 'var(--color-cream)', paddingBottom: '6rem' }}>
        <div className="container-luxury">

          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              color: 'var(--color-muted)',
              letterSpacing: '0.06em',
            }}>
              {isLoading ? '' : `${meta?.total ?? 0} ${(meta?.total ?? 0) === 1 ? 'piece' : 'pieces'}`}
            </p>

            {/* Diamond type filter pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {DIAMOND_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setDiamondFilter(opt.value); setPage(1); }}
                  style={{
                    padding: '0.45rem 1rem',
                    background: diamondFilter === opt.value ? 'var(--color-charcoal)' : 'transparent',
                    color: diamondFilter === opt.value ? 'white' : 'var(--color-muted)',
                    border: '1px solid',
                    borderColor: diamondFilter === opt.value ? 'var(--color-charcoal)' : 'var(--color-border)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (diamondFilter !== opt.value) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-charcoal)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-charcoal)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (diamondFilter !== opt.value) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)';
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product grid */}
          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '380px' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center', padding: '6rem 2rem' }}
            >
              <div style={{
                width: '40px', height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                margin: '0 auto 2rem',
              }} />
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.5rem',
                color: 'var(--color-muted)',
                marginBottom: '0.75rem',
              }}>
                No pieces found
              </p>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                color: 'var(--color-muted-light)',
                marginBottom: '2.5rem',
                letterSpacing: '0.04em',
              }}>
                Check back soon or explore our other collections.
              </p>
              <Link to="/collections" className="btn-luxury">
                Browse All Collections
              </Link>
            </motion.div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}>
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  custom={i}
                  variants={cardFade}
                  initial="hidden"
                  animate="visible"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && (meta.totalPages ?? 0) > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.375rem',
                marginTop: '4rem',
              }}
            >
              {Array.from({ length: meta.totalPages ?? 0 }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: '40px', height: '40px',
                    background: p === page ? 'var(--color-charcoal)' : 'transparent',
                    color: p === page ? 'white' : 'var(--color-charcoal)',
                    border: '1px solid',
                    borderColor: p === page ? 'var(--color-charcoal)' : 'var(--color-border)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.04em',
                  }}
                >
                  {p}
                </button>
              ))}
            </motion.div>
          )}

        </div>
      </section>
    </>
  );
};

export default CollectionPage;
