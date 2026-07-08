import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, X } from 'lucide-react';
import api from '../lib/api';
import type { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);

  const { data, isLoading } = useQuery({
    queryKey: ['search', submitted],
    queryFn: () => api.get(`/products?search=${encodeURIComponent(submitted)}&limit=24`).then(r => r.data),
    enabled: !!submitted,
  });

  const products: Product[] = data?.data || [];
  const total = data?.meta?.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(query);
    setSearchParams({ q: query });
  };

  return (
    <>
      <Helmet>
        <title>Search{submitted ? ` — "${submitted}"` : ''} | Kelebri</title>
      </Helmet>

      <div style={{ paddingTop:'72px', minHeight:'100vh' }}>
        {/* Search hero */}
        <section style={{
          background:'var(--color-charcoal)',
          padding:'5rem 0 4rem',
          textAlign:'center',
        }}>
          <div className="container-luxury">
            <motion.h1
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5 }}
              style={{
                fontFamily:'var(--font-serif)',
                fontSize:'clamp(2rem, 4vw, 3rem)',
                fontWeight:300, color:'white',
                marginBottom:'2rem',
              }}
            >
              Search Our Collection
            </motion.h1>

            <form onSubmit={handleSearch} style={{ maxWidth:'600px', margin:'0 auto' }}>
              <div style={{
                display:'flex',
                background:'white',
                border:'1px solid var(--color-gold)',
              }}>
                <input
                  id="search-page-input"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name, SKU, category, diamond type..."
                  style={{
                    flex:1, padding:'1rem 1.25rem',
                    background:'transparent', border:'none', outline:'none',
                    fontFamily:'var(--font-sans)', fontSize:'0.9375rem',
                    color:'var(--color-charcoal)',
                  }}
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(''); setSubmitted(''); setSearchParams({}); }}
                    style={{ background:'none', border:'none', cursor:'pointer', padding:'0 0.5rem', color:'var(--color-muted)' }}>
                    <X size={16} />
                  </button>
                )}
                <button type="submit" className="btn-luxury" style={{ borderRadius:0 }}>
                  <SearchIcon size={16} />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="section-padding" style={{ background:'var(--color-cream)' }}>
          <div className="container-luxury">
            {submitted && (
              <p style={{
                fontFamily:'var(--font-sans)', fontSize:'0.875rem',
                color:'var(--color-muted)', marginBottom:'2.5rem',
              }}>
                {isLoading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''} for "${submitted}"`}
              </p>
            )}

            {isLoading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1.5rem' }}>
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height:'380px' }} />)}
              </div>
            ) : submitted && products.length === 0 ? (
              <div style={{ textAlign:'center', padding:'6rem 2rem' }}>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.5rem', color:'var(--color-muted)', marginBottom:'1rem' }}>
                  No results found
                </p>
                <p style={{ color:'var(--color-muted)', marginBottom:'2rem' }}>
                  Try a different search term or browse our collections.
                </p>
                <Link to="/collections" className="btn-luxury">Browse Collections</Link>
              </div>
            ) : products.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1.5rem' }}>
                {products.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.5rem', color:'var(--color-muted)' }}>
                  Enter a search term above
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default SearchPage;
