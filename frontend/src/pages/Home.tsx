import { motion } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Category, Product } from '../types';
import CategoryCard from '../components/ui/CategoryCard';
import ProductCard from '../components/ui/ProductCard';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => {
    const transition: Transition = { duration: 0.7, delay: i * 0.1, ease: 'easeOut' };
    return { opacity: 1, y: 0, transition };
  },
};

const Home = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data as Category[]),
  });

  // Fetch best sellers
  const { data: bestSellersData } = useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: () => api.get('/products?bestSeller=true&limit=8').then(r => r.data.data as Product[]),
  });

  // Fetch hero products
  const { data: heroProductsData } = useQuery({
    queryKey: ['products', 'hero'],
    queryFn: () => api.get('/products?hero=true&limit=4').then(r => r.data.data as Product[]),
  });

  const jewelryCategories = categoriesData?.filter(c => c.type === 'JEWELRY') || [];
  const diamondCategories = categoriesData?.filter(c => c.type === 'DIAMOND') || [];
  const bestSellers = bestSellersData || [];
  const heroProducts = heroProductsData || [];

  const scrollToContent = () => {
    document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Kelebri Diamonds & Jewellery | Luxury Jewelry</title>
        <meta name="description" content="Discover Kelebri's exquisite collection of diamonds and fine jewellery. Lab grown diamonds, natural diamonds, moissanite, and custom jewelry crafted with unparalleled artistry." />
        <meta property="og:title" content="Kelebri Diamonds & Jewellery" />
        <meta property="og:description" content="Luxury diamonds and fine jewellery. Rings, earrings, pendants, necklaces, and custom designs." />
      </Helmet>

      {/* ── HERO VIDEO ────────────────────────────── */}
      <section 
        className="hero-section"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden',
          background: 'var(--color-charcoal)',
        }}>
        {/* Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: videoLoaded ? 0.9 : 0,
            transition: 'opacity 1.5s ease',
          }}
        >
          <source src="https:// assets.mixkit.co/videos/preview/mixkit-close-up-of-a-diamond-ring-on-a-dark-background-17882-large.mp4 " type="video/mp4" />
          {/* Fallback */}
          <source src="https://iracarats.com/cdn/shop/videos/c/vp/4245de4c14174ada83086a2327dd5f7d/4245de4c14174ada83086a2327dd5f7d.HD-1080p-7.2Mbps-57527704.mp4?v=0" type="video/mp4" />
        </video>

        {/* Fallback bg image if video not loaded */}
        {!videoLoaded && (
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:'url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80)',
            backgroundSize:'cover', backgroundPosition:'center',
            // opacity:0.5,
          }} />
        )}

        {/* Overlay gradient */}
        <div style={{
          position:'absolute', inset:0,
          // background:'linear-gradient(to bottom, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.5) 60%, rgba(26,26,26,0.8) 100%)',
        }} />

        {/* Gold shimmer particle effect */}
        <div style={{
          position:'absolute', inset:0,
          // background:'radial-gradient(elli pse at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }} />

        {/* Hero content */}
        <div style={{
          position:'relative', zIndex:10,
          height:'100%',
          margin:'5% 0',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          textAlign:'center',
          padding:'2rem',
        }}>
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{
              fontFamily:'var(--font-sans)',
              fontSize:'0.6875rem', letterSpacing:'0.3em',
              textTransform:'uppercase', color:'var(--color-gold)',
              marginBottom:'1.5rem',
            }}
          >
            Diamonds & Jewellery
          </motion.p>

          {/* Main heading */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{
              fontFamily:'var(--font-serif)',
              fontSize:'clamp(3rem, 8vw, 6.5rem)',
              fontWeight:300, color:'white',
              lineHeight:1.05, letterSpacing:'0.02em',
              marginBottom:'1.5rem',
              maxWidth:'900px',
            }}
          >
            Wear the Light<br />
            <span style={{ fontStyle:'italic', color:'var(--color-gold-light)' }}>
              of Diamonds
            </span>
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{ marginBottom:'1.5rem' }}
          >
            <div className="gold-divider" style={{ width:'80px' }} />
          </motion.div>

          {/* Subheading */}
          {/* <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{
              fontFamily:'var(--font-sans)',
              fontSize:'clamp(0.875rem, 2vw, 1.0625rem)',
              color:'rgba(255,255,255,0.7)',
              letterSpacing:'0.06em',
              marginBottom:'3rem',
              maxWidth:'500px',
            }}
          >
            Crafted for those who believe in the extraordinary.
            Each piece is a testament to timeless elegance.
          </motion.p> */}

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}
          >
            <Link to="/collections" className="btn-luxury" id="hero-explore-btn">
              Explore Collection
            </Link>
            <a
              href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210').replace(/[^0-9]/g,'')}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              id="hero-whatsapp-btn"
              style={{ color:'white', borderColor:'rgba(255,255,255,0.6)' }}
            >
              WhatsApp Enquiry
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToContent}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{
            position:'absolute', bottom:'2.5rem', left:'50%',
            transform:'translateX(-50%)',
            background:'none', border:'none', cursor:'pointer',
            color:'rgba(255,255,255,0.5)', zIndex:10,
            display:'flex', flexDirection:'column', alignItems:'center', gap:'0.25rem',
          }}
          aria-label="Scroll down"
        >
          <span style={{ fontFamily:'var(--font-sans)', fontSize:'0.625rem', letterSpacing:'0.2em', textTransform:'uppercase' }}>
            Scroll
          </span>
          <ChevronDown size={16} />
        </motion.button>
      </section>

      {/* ── JEWELRY CATEGORIES ────────────────────── */}
      <section id="collections-section" className="section-padding jewelry-section" style={{ background:'white' }}>
        <div className="container-luxury">
          {/* Section header */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }}
            variants={fadeUp}
            style={{ textAlign:'center', marginBottom:'4rem' }}
          >
            <p style={{
              fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
              letterSpacing:'0.25em', textTransform:'uppercase',
              color:'var(--color-gold)', marginBottom:'1rem',
            }}>
              Our Collections
            </p>
            <h2 style={{
              fontFamily:'var(--font-serif)',
              fontSize:'clamp(2.25rem, 4vw, 3.5rem)',
              fontWeight:300, color:'var(--color-charcoal)',
              marginBottom:'1.25rem',
            }}>
              Fine Jewellery
            </h2>
            <div className="gold-divider" />
          </motion.div>

          {/* 6-category grid */}
          <div 
            className="jewelry-categories-grid"
            style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
              gap:'1.5rem',
            }}>
            {(jewelryCategories.length > 0 ? jewelryCategories : [
              { id:'1', name:'Rings', slug:'rings', type:'JEWELRY' as const, imageUrl:null, publicId:null, sortOrder:1, createdAt:'', updatedAt:'' },
              { id:'2', name:'Earrings', slug:'earrings', type:'JEWELRY' as const, imageUrl:null, publicId:null, sortOrder:2, createdAt:'', updatedAt:'' },
              { id:'3', name:'Pendants', slug:'pendants', type:'JEWELRY' as const, imageUrl:null, publicId:null, sortOrder:3, createdAt:'', updatedAt:'' },
              { id:'4', name:'Bracelets & Bangles', slug:'bracelets-bangles', type:'JEWELRY' as const, imageUrl:null, publicId:null, sortOrder:4, createdAt:'', updatedAt:'' },
              { id:'5', name:'Necklaces', slug:'necklaces', type:'JEWELRY' as const, imageUrl:null, publicId:null, sortOrder:5, createdAt:'', updatedAt:'' },
              { id:'6', name:'Tennis Collection', slug:'tennis-collection', type:'JEWELRY' as const, imageUrl:null, publicId:null, sortOrder:6, createdAt:'', updatedAt:'' },
            ]).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.2 }}
                variants={fadeUp} custom={i * 0.5}
              >
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="section-padding best-sellers-section" style={{ background:'  ' }}>
          <div className="container-luxury">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }}
              variants={fadeUp}
              style={{ textAlign:'center', marginBottom:'4rem' }}
            >
              <p style={{
                fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
                letterSpacing:'0.25em', textTransform:'uppercase',
                color:'var(--color-gold)', marginBottom:'1rem',
              }}>
                Curated Picks
              </p>
              <h2 style={{
                fontFamily:'var(--font-serif)',
                fontSize:'clamp(2.25rem, 4vw, 3.5rem)',
                fontWeight:300, color:'var(--color-charcoal)',
                marginBottom:'1.25rem',
              }}>
                Best Sellers
              </h2>
              <div className="gold-divider" />
            </motion.div>

            <div 
              className="products-grid"
              style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
                gap:'1.5rem',
              }}>
              {bestSellers.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.2 }}
                  variants={fadeUp} custom={i * 0.5}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <div style={{ textAlign:'center', marginTop:'3rem' }}>
              <Link to="/collections" className="btn-luxury" id="bestsellers-view-all-btn">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── DIAMOND CATEGORIES ────────────────────── */}
      <section className="section-padding diamond-section" style={{
        background:'var(--color-charcoal)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Gold radial accent */}
        <div style={{
          position:'absolute', top:'-20%', right:'-10%',
          width:'600px', height:'600px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
          pointerEvents:'none',
        }} />

        <div className="container-luxury" style={{ position:'relative', zIndex:1 }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }}
            variants={fadeUp}
            style={{ textAlign:'center', marginBottom:'4rem' }}
          >
            <p style={{
              fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
              letterSpacing:'0.25em', textTransform:'uppercase',
              color:'var(--color-gold)', marginBottom:'1rem',
            }}>
              The Finest Stones
            </p>
            <h2 style={{
              fontFamily:'var(--font-serif)',
              fontSize:'clamp(2.25rem, 4vw, 3.5rem)',
              fontWeight:300, color:'white',
              marginBottom:'1.25rem',
            }}>
              Diamond Collections
            </h2>
            <div className="gold-divider" />
          </motion.div>

          <div 
            className="diamond-categories-grid"
            style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
              gap:'1.5rem',
            }}>
            {(diamondCategories.length > 0 ? diamondCategories : [
              { id:'7', name:'Lab Grown Diamonds', slug:'lab-grown-diamonds', type:'DIAMOND' as const, imageUrl:null, publicId:null, sortOrder:1, createdAt:'', updatedAt:'' },
              { id:'8', name:'Natural Diamonds', slug:'natural-diamonds', type:'DIAMOND' as const, imageUrl:null, publicId:null, sortOrder:2, createdAt:'', updatedAt:'' },
              { id:'9', name:'Moissanite', slug:'moissanite', type:'DIAMOND' as const, imageUrl:null, publicId:null, sortOrder:3, createdAt:'', updatedAt:'' },
              { id:'10', name:'Custom Jewelry', slug:'custom-jewelry', type:'DIAMOND' as const, imageUrl:null, publicId:null, sortOrder:4, createdAt:'', updatedAt:'' },
            ]).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.2 }}
                variants={fadeUp} custom={i * 0.5}
              >
                <CategoryCard category={cat} variant="large" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO PRODUCTS ─────────────────────────── */}
      {heroProducts.length > 0 && (
        <section className="section-padding hero-products-section" style={{ background:'white' }}>
          <div className="container-luxury">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }}
              variants={fadeUp}
              style={{ textAlign:'center', marginBottom:'4rem' }}
            >
              <p style={{
                fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
                letterSpacing:'0.25em', textTransform:'uppercase',
                color:'var(--color-gold)', marginBottom:'1rem',
              }}>
                Handpicked for You
              </p>
              <h2 style={{
                fontFamily:'var(--font-serif)',
                fontSize:'clamp(2.25rem, 4vw, 3.5rem)',
                fontWeight:300, color:'var(--color-charcoal)',
                marginBottom:'1.25rem',
              }}>
                Featured Pieces
              </h2>
              <div className="gold-divider" />
            </motion.div>

            <div 
              className="hero-products-grid"
              style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
                gap:'2rem',
              }}>
              {heroProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.2 }}
                  variants={fadeUp} custom={i * 0.5}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND STORY STRIP ─────────────────────── */}
      <section style={{
        padding:'5rem 0',
        background:'linear-gradient(135deg, var(--color-cream) 0%, #f0ede6 100%)',
        borderTop:'1px solid var(--color-border)',
        borderBottom:'1px solid var(--color-border)',
      }}>
        <div className="container-luxury">
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
            gap:'3rem',
            textAlign:'center',
          }}>
            {[
              { num:'20+', label:'Years of Craftsmanship', desc:'Decades of fine jewellery expertise' },
              { num:'5000+', label:'Happy Clients', desc:'Trusted by families across India' },
              { num:'100%', label:'Certified Diamonds', desc:'GIA, IGI & SGL certified stones' },
              { num:'∞', label:'Lifetime Service', desc:'Complimentary cleaning & polishing' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.4 }}
                variants={fadeUp} custom={i * 0.5}
              >
                <p style={{
                  fontFamily:'var(--font-serif)',
                  fontSize:'3rem', color:'var(--color-gold)',
                  fontWeight:300, marginBottom:'0.5rem',
                }}>
                  {stat.num}
                </p>
                <p style={{
                  fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
                  letterSpacing:'0.14em', textTransform:'uppercase',
                  color:'var(--color-charcoal)', fontWeight:600,
                  marginBottom:'0.5rem',
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontFamily:'var(--font-sans)', fontSize:'0.8125rem',
                  color:'var(--color-muted)', lineHeight:1.6,
                }}>
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA STRIP ────────────────────── */}
      <section style={{
        padding:'4rem 0',
        background:'var(--color-charcoal)',
        textAlign:'center',
      }}>
        <div className="container-luxury">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.4 }}
            variants={fadeUp}
          >
            <p style={{
              fontFamily:'var(--font-serif)',
              fontSize:'clamp(1.5rem, 3vw, 2.25rem)',
              color:'white', marginBottom:'0.75rem',
            }}>
              Looking for something special?
            </p>
            <p style={{
              fontFamily:'var(--font-sans)',
              fontSize:'0.9375rem', color:'rgba(255,255,255,0.6)',
              marginBottom:'2rem', letterSpacing:'0.04em',
            }}>
              Chat with our jewelry experts on WhatsApp for personalized recommendations.
            </p>
            <a
              href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210').replace(/[^0-9]/g,'')}`}
              target="_blank" rel="noopener noreferrer"
              id="home-whatsapp-strip-btn"
              className="btn-whatsapp"
              style={{ display:'inline-flex', width:'auto', minWidth:'260px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with Us Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE-ONLY RESPONSIVE STYLES ────────── */}
      <style>{`
        /* Mobile-only optimizations (tablets and phones) */
        @media (max-width: 768px) {
          /* ========== HERO SECTION ========== */
          .hero-section {
            height: 70vh !important;
            min-height: 500px !important;
          }

          .hero-section > div {
            padding: 1.5rem !important;
          }

          .hero-section h1 {
            font-size: clamp(2.5rem, 7vw, 4rem) !important;
            margin-bottom: 1rem !important;
          }

          .hero-section p:first-of-type {
            font-size: 0.625rem !important;
            margin-bottom: 1rem !important;
          }

          .hero-section > div > div:last-of-type {
            flex-direction: column !important;
            width: 100%;
            max-width: 300px;
          }

          .hero-section .btn-luxury,
          .hero-section .btn-outline {
            width: 100%;
          }

          /* ========== JEWELRY CATEGORIES ========== */
          .jewelry-section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .jewelry-categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
            gap: 1rem !important;
          }

          .jewelry-section h2 {
            font-size: clamp(1.75rem, 5vw, 2.25rem) !important;
            margin-bottom: 1rem !important;
          }

          .jewelry-section .container-luxury > div:first-child {
            margin-bottom: 2.5rem !important;
          }

          /* ========== BEST SELLERS SECTION ========== */
          .best-sellers-section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .best-sellers-section .container-luxury > div:first-child {
            margin-bottom: 2.5rem !important;
          }

          .best-sellers-section h2 {
            font-size: clamp(1.75rem, 5vw, 2.25rem) !important;
          }

          /* Products grid - 2 columns on mobile */
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }

          /* ========== DIAMOND SECTION ========== */
          .diamond-section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .diamond-section .container-luxury > div:first-child {
            margin-bottom: 2.5rem !important;
          }

          .diamond-section h2 {
            font-size: clamp(1.75rem, 5vw, 2.25rem) !important;
          }

          /* Diamond categories grid - 2 columns on mobile */
          .diamond-categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }

          /* ========== HERO PRODUCTS SECTION ========== */
          .hero-products-section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .hero-products-section .container-luxury > div:first-child {
            margin-bottom: 2.5rem !important;
          }

          .hero-products-section h2 {
            font-size: clamp(1.75rem, 5vw, 2.25rem) !important;
          }

          /* Hero Products grid - 2 columns on mobile */
          .hero-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }

          /* ========== PRODUCT & CATEGORY CARDS ========== */
          /* Reduce card padding */
          .luxury-card > div:last-child {
            padding: 1rem !important;
          }

          /* Product image aspect ratio - less tall on mobile */
          .luxury-card > div:first-child {
            padding-bottom: 100% !important;
          }

          /* Product card typography */
          .luxury-card h3 {
            font-size: 0.9375rem !important;
            margin-bottom: 0.375rem !important;
          }

          .luxury-card > div:last-child > p:first-child {
            font-size: 0.625rem !important;
            margin-bottom: 0.25rem !important;
          }

          .luxury-card > div:last-child > p:nth-child(3) {
            font-size: 0.6875rem !important;
          }

          .luxury-card > div:last-child > p:nth-child(4) {
            font-size: 1rem !important;
            margin-top: 0.5rem !important;
          }

          /* View details section */
          .luxury-card > div:last-child > div:last-child {
            margin-top: 0.75rem !important;
            padding-top: 0.75rem !important;
          }

          .luxury-card > div:last-child > div:last-child > span:first-child {
            font-size: 0.625rem !important;
          }

          /* Container padding */
          .container-luxury {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }

        /* Extra small mobile devices */
        @media (max-width: 480px) {
          /* Further reduce hero */
          .hero-section {
            height: 65vh !important;
            min-height: 450px !important;
          }

          /* Smaller category cards */
          .jewelry-categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
            gap: 0.75rem !important;
          }

          /* Tighter product grids */
          .products-grid,
          .diamond-categories-grid,
          .hero-products-grid {
            gap: 0.75rem !important;
          }

          /* Further reduce card padding */
          .luxury-card > div:last-child {
            padding: 0.875rem !important;
          }

          /* Smaller typography */
          .luxury-card h3 {
            font-size: 0.875rem !important;
            line-height: 1.25 !important;
          }

          .luxury-card > div:last-child > p:nth-child(4) {
            font-size: 0.9375rem !important;
          }

          /* Tighter container */
          .container-luxury {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }

          /* Reduce section padding */
          .best-sellers-section,
          .diamond-section,
          .hero-products-section,
          .jewelry-section {
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
        }

        /* Disable hover effects on touch devices */
        @media (hover: none) and (pointer: coarse) {
          .luxury-card:hover {
            transform: none !important;
          }
        }
      `}</style>
    </HelmetProvider>
  );
};

export default Home;
