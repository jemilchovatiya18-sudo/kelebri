import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import api from '../lib/api';
import type { Product, Category } from '../types';
import ProductCard from '../components/ui/ProductCard';

const DIAMOND_TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Lab Grown', value: 'LAB_GROWN' },
  { label: 'Natural', value: 'NATURAL' },
  { label: 'Moissanite', value: 'MOISSANITE' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

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
  const categoryName = categoryData?.name || category?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <Helmet>
        <title>{categoryName} | Kelebri Diamonds & Jewellery</title>
        <meta name="description" content={`Explore Kelebri's exquisite ${categoryName} collection. Premium diamonds and fine jewellery crafted with exceptional artistry.`} />
      </Helmet>

      {/* Hero banner */}
      <section style={{
        height:'300px', position:'relative', overflow:'hidden',
        background:'var(--color-charcoal)',
        marginTop:'72px',
      }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=60)`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity:0.3,
        }} />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(26,26,26,0.4), rgba(26,26,26,0.7))',
        }} />
        <div style={{
          position:'relative', zIndex:1,
          height:'100%', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', textAlign:'center',
          padding:'2rem',
        }}>
          {/* Breadcrumb */}
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'1rem' }}>
            <Link to="/" style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.75rem', letterSpacing:'0.1em', textDecoration:'none' }}>
              Home
            </Link>
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>/</span>
            <span style={{ color:'var(--color-gold)', fontSize:'0.75rem', letterSpacing:'0.1em' }}>
              {categoryName}
            </span>
          </div>

          <motion.h1
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6 }}
            style={{
              fontFamily:'var(--font-serif)',
              fontSize:'clamp(2rem, 5vw, 3.5rem)',
              fontWeight:300, color:'white',
              letterSpacing:'0.04em',
            }}
          >
            {categoryName}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding" style={{ background:'var(--color-cream)' }}>
        <div className="container-luxury">
          {/* Filters */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:'1rem',
            marginBottom:'3rem',
            paddingBottom:'1.5rem',
            borderBottom:'1px solid var(--color-border)',
          }}>
            <p style={{
              fontFamily:'var(--font-sans)', fontSize:'0.8125rem',
              color:'var(--color-muted)',
            }}>
              {meta?.total ?? 0} pieces
            </p>

            {/* Diamond type filter */}
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {DIAMOND_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setDiamondFilter(opt.value); setPage(1); }}
                  style={{
                    padding:'0.5rem 1rem',
                    background: diamondFilter === opt.value ? 'var(--color-charcoal)' : 'transparent',
                    color: diamondFilter === opt.value ? 'white' : 'var(--color-muted)',
                    border:'1px solid',
                    borderColor: diamondFilter === opt.value ? 'var(--color-charcoal)' : 'var(--color-border)',
                    cursor:'pointer',
                    fontFamily:'var(--font-sans)',
                    fontSize:'0.75rem',
                    letterSpacing:'0.08em',
                    textTransform:'uppercase',
                    transition:'all 0.2s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
              gap:'1.5rem',
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height:'380px' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign:'center', padding:'6rem 2rem' }}>
              <p style={{
                fontFamily:'var(--font-serif)', fontSize:'1.5rem',
                color:'var(--color-muted)', marginBottom:'1rem',
              }}>
                No products found
              </p>
              <p style={{ color:'var(--color-muted)', marginBottom:'2rem' }}>
                Check back soon or explore other collections.
              </p>
              <Link to="/collections" className="btn-luxury">
                Browse All Collections
              </Link>
            </div>
          ) : (
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
              gap:'1.5rem',
            }}>
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={fadeUp} initial="hidden" animate="visible" custom={i}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div style={{
              display:'flex', justifyContent:'center', gap:'0.5rem',
              marginTop:'4rem',
            }}>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width:'40px', height:'40px',
                    background: p === page ? 'var(--color-charcoal)' : 'transparent',
                    color: p === page ? 'white' : 'var(--color-charcoal)',
                    border:'1px solid',
                    borderColor: p === page ? 'var(--color-charcoal)' : 'var(--color-border)',
                    cursor:'pointer',
                    fontFamily:'var(--font-sans)',
                    fontSize:'0.875rem',
                    transition:'all 0.2s',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CollectionPage;
