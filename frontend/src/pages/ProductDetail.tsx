import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import api from '../lib/api';
import type { ProductWithRelated } from '../types';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import ProductCard from '../components/ui/ProductCard';
import {
  DIAMOND_TYPE_LABELS, METAL_TYPE_LABELS,
  GOLD_PURITY_LABELS, CERTIFICATE_LABELS,
} from '../lib/utils';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data.data as ProductWithRelated),
    enabled: !!slug,
  });

  if (isLoading) return (
    <div style={{ minHeight:'100vh', paddingTop:'72px', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div className="skeleton" style={{ width:'200px', height:'200px', borderRadius:'50%', margin:'0 auto' }} />
        <p style={{ marginTop:'1rem', color:'var(--color-muted)', fontFamily:'var(--font-serif)', fontSize:'1.25rem' }}>
          Loading...
        </p>
      </div>
    </div>
  );

  if (isError || !data) return (
    <div style={{ minHeight:'100vh', paddingTop:'72px', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <div>
        <p style={{ fontFamily:'var(--font-serif)', fontSize:'2rem', marginBottom:'1rem' }}>Product Not Found</p>
        <Link to="/collections" className="btn-luxury">Back to Collections</Link>
      </div>
    </div>
  );

  const product = data;
  const images = product.images || [];
  const primaryImageUrl = images[activeImage]?.url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80';

  const specRows = [
    { label: 'SKU', value: product.sku },
    { label: 'Category', value: product.category?.name },
    { label: 'Diamond Type', value: DIAMOND_TYPE_LABELS[product.diamondType] },
    { label: 'Metal Type', value: METAL_TYPE_LABELS[product.metalType] },
    { label: 'Metal Color', value: product.metalColor },
    { label: 'Gold Purity', value: GOLD_PURITY_LABELS[product.goldPurity] },
    { label: 'Diamond Weight', value: product.diamondWeight },
    { label: 'Diamond Shape', value: product.diamondShape },
    { label: 'Diamond Quality', value: product.diamondQuality },
    { label: 'Diamond Color', value: product.diamondColor },
    { label: 'Diamond Clarity', value: product.diamondClarity },
    { label: 'Stone Type', value: product.stoneType },
    { label: 'Certificate', value: CERTIFICATE_LABELS[product.certificate] },
    { label: 'Availability', value: product.isSoldOut ? 'Sold Out' : product.isAvailable ? 'In Stock' : 'Out of Stock' },
  ].filter(r => r.value && r.value !== '—');

  return (
    <>
      <Helmet>
        <title>{product.name} | Kelebri Diamonds & Jewellery</title>
        <meta name="description" content={product.description?.slice(0, 160) || `${product.name} - SKU ${product.sku}. Luxury jewelry from Kelebri.`} />
        <meta property="og:title" content={`${product.name} | Kelebri`} />
        <meta property="og:image" content={primaryImageUrl} />
      </Helmet>

      <div style={{ paddingTop:'72px', minHeight:'100vh' }}>
        {/* Breadcrumb */}
        <div className="container-luxury" style={{ paddingTop:'2rem', paddingBottom:'1rem' }}>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
            <Link to="/" style={{ color:'var(--color-muted)', fontSize:'0.75rem', textDecoration:'none' }}>Home</Link>
            <span style={{ color:'var(--color-muted)', fontSize:'0.75rem' }}>/</span>
            <Link to={`/collections/${product.category?.slug}`} style={{ color:'var(--color-muted)', fontSize:'0.75rem', textDecoration:'none' }}>
              {product.category?.name}
            </Link>
            <span style={{ color:'var(--color-muted)', fontSize:'0.75rem' }}>/</span>
            <span style={{ color:'var(--color-charcoal)', fontSize:'0.75rem' }}>{product.name}</span>
          </div>
        </div>

        {/* Main product section */}
        <section className="container-luxury" style={{ paddingBottom:'5rem' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
            gap:'4rem',
            alignItems:'start',
          }}>
            {/* Image gallery */}
            <div>
              {/* Main image */}
              <motion.div
                key={activeImage}
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ duration:0.4 }}
                style={{
                  position:'relative', paddingBottom:'110%', overflow:'hidden',
                  background:'var(--color-cream)',
                  marginBottom:'1rem',
                }}
              >
                <img
                  src={primaryImageUrl}
                  alt={product.name}
                  style={{
                    position:'absolute', inset:0,
                    width:'100%', height:'100%',
                    objectFit:'cover',
                  }}
                />

                {product.isSoldOut && (
                  <div style={{
                    position:'absolute', inset:0,
                    background:'rgba(26,26,26,0.5)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <span style={{
                      fontFamily:'var(--font-sans)', fontSize:'1rem',
                      letterSpacing:'0.2em', textTransform:'uppercase',
                      color:'white', fontWeight:600,
                    }}>
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Image navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
                      style={{
                        position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)',
                        background:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer',
                        width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setActiveImage((activeImage + 1) % images.length)}
                      style={{
                        position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)',
                        background:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer',
                        width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </motion.div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      style={{
                        width:'70px', height:'70px', padding:0,
                        border:'2px solid',
                        borderColor: i === activeImage ? 'var(--color-gold)' : 'transparent',
                        cursor:'pointer', overflow:'hidden',
                        transition:'border-color 0.2s',
                        background:'none',
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} ${i + 1}`}
                        style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              {/* Category + badges */}
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap' }}>
                <Link
                  to={`/collections/${product.category?.slug}`}
                  style={{
                    fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
                    letterSpacing:'0.14em', textTransform:'uppercase',
                    color:'var(--color-gold)', textDecoration:'none',
                  }}
                >
                  {product.category?.name}
                </Link>
                {product.isBestSeller && (
                  <span style={{
                    background:'linear-gradient(135deg, #C9A84C, #9A7A32)',
                    color:'white', fontFamily:'var(--font-sans)',
                    fontSize:'0.5625rem', fontWeight:600,
                    letterSpacing:'0.12em', textTransform:'uppercase',
                    padding:'0.25rem 0.625rem',
                  }}>
                    Best Seller
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 style={{
                fontFamily:'var(--font-serif)',
                fontSize:'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight:300, color:'var(--color-charcoal)',
                lineHeight:1.2, marginBottom:'0.75rem',
              }}>
                {product.name}
              </h1>

              {/* SKU */}
              <p style={{
                fontFamily:'var(--font-sans)', fontSize:'0.75rem',
                color:'var(--color-muted)', letterSpacing:'0.1em',
                marginBottom:'1.5rem',
              }}>
                SKU: {product.sku}
              </p>

              {/* Gold divider */}
              <div style={{ width:'50px', height:'1px', background:'var(--color-gold)', marginBottom:'1.5rem' }} />

              {/* Price */}
              {product.showPrice && product.price && (
                <p style={{
                  fontFamily:'var(--font-serif)',
                  fontSize:'2rem', color:'var(--color-charcoal)',
                  marginBottom:'1.5rem',
                }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              )}

              {/* Quick spec pills */}
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'2rem' }}>
                {product.diamondType !== 'NONE' && (
                  <span style={pillStyle}>{DIAMOND_TYPE_LABELS[product.diamondType]}</span>
                )}
                {product.metalType && (
                  <span style={pillStyle}>{METAL_TYPE_LABELS[product.metalType]}</span>
                )}
                {product.goldPurity !== 'NONE' && (
                  <span style={pillStyle}>{GOLD_PURITY_LABELS[product.goldPurity]}</span>
                )}
                {product.certificate !== 'NONE' && (
                  <span style={pillStyle}>{CERTIFICATE_LABELS[product.certificate]} Certified</span>
                )}
              </div>

              {/* WhatsApp CTA */}
              <div style={{ marginBottom:'1.5rem' }}>
                {product.isSoldOut ? (
                  <div style={{
                    padding:'1rem',
                    background:'var(--color-cream)',
                    border:'1px solid var(--color-border)',
                    textAlign:'center',
                    fontFamily:'var(--font-sans)',
                    fontSize:'0.875rem',
                    color:'var(--color-muted)',
                    letterSpacing:'0.06em',
                  }}>
                    This piece has been sold. Contact us for similar designs.
                  </div>
                ) : (
                  <WhatsAppButton
                    productName={product.name}
                    sku={product.sku}
                    slug={product.slug}
                  />
                )}

                {product.isSoldOut && (
                  <div style={{ marginTop:'0.75rem' }}>
                    <WhatsAppButton
                      productName={`Similar to ${product.name}`}
                      sku={product.sku}
                      slug={product.slug}
                    />
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div style={{
                display:'flex', gap:'1.5rem', flexWrap:'wrap',
                padding:'1.25rem',
                background:'var(--color-cream)',
                border:'1px solid var(--color-border)',
                marginBottom:'2rem',
              }}>
                {[
                  { icon:'💎', text:'Certified Diamonds' },
                  { icon:'✨', text:'Premium Craftsmanship' },
                  { icon:'🔒', text:'Secure Packaging' },
                ].map((badge, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <span style={{ fontSize:'1rem' }}>{badge.icon}</span>
                    <span style={{ fontFamily:'var(--font-sans)', fontSize:'0.75rem', color:'var(--color-muted)', letterSpacing:'0.06em' }}>
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tabs: Description / Specifications */}
              <div>
                <div style={{ display:'flex', borderBottom:'1px solid var(--color-border)', marginBottom:'1.5rem' }}>
                  {(['description', 'specifications'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding:'0.75rem 1.25rem',
                        background:'none', border:'none',
                        borderBottom:`2px solid ${activeTab === tab ? 'var(--color-gold)' : 'transparent'}`,
                        cursor:'pointer',
                        fontFamily:'var(--font-sans)',
                        fontSize:'0.75rem', letterSpacing:'0.12em',
                        textTransform:'uppercase',
                        color: activeTab === tab ? 'var(--color-charcoal)' : 'var(--color-muted)',
                        fontWeight: activeTab === tab ? 600 : 400,
                        transition:'all 0.2s',
                        marginBottom:'-1px',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'description' && (
                  <p style={{
                    fontFamily:'var(--font-sans)',
                    fontSize:'0.9375rem', color:'var(--color-muted)',
                    lineHeight:1.8,
                  }}>
                    {product.description || 'Contact us on WhatsApp for detailed information about this piece.'}
                  </p>
                )}

                {activeTab === 'specifications' && (
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <tbody>
                      {specRows.map((row, i) => (
                        <tr key={i} style={{ borderBottom:'1px solid var(--color-border)' }}>
                          <td style={{
                            padding:'0.75rem 0',
                            fontFamily:'var(--font-sans)',
                            fontSize:'0.8125rem',
                            color:'var(--color-muted)',
                            width:'45%',
                            letterSpacing:'0.06em',
                          }}>
                            {row.label}
                          </td>
                          <td style={{
                            padding:'0.75rem 0',
                            fontFamily:'var(--font-sans)',
                            fontSize:'0.8125rem',
                            color:'var(--color-charcoal)',
                            fontWeight:500,
                          }}>
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {product.related && product.related.length > 0 && (
          <section className="section-padding" style={{ background:'white' }}>
            <div className="container-luxury">
              <div style={{ textAlign:'center', marginBottom:'3rem' }}>
                <h2 style={{
                  fontFamily:'var(--font-serif)',
                  fontSize:'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight:300, color:'var(--color-charcoal)',
                  marginBottom:'1rem',
                }}>
                  You May Also Like
                </h2>
                <div className="gold-divider" />
              </div>

              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',
                gap:'1.5rem',
              }}>
                {product.related.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

const pillStyle: React.CSSProperties = {
  padding:'0.375rem 0.875rem',
  background:'var(--color-cream)',
  border:'1px solid var(--color-border)',
  fontFamily:'var(--font-sans)',
  fontSize:'0.6875rem',
  letterSpacing:'0.08em',
  color:'var(--color-charcoal)',
};

export default ProductDetail;
