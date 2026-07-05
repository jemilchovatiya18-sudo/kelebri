import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { getPrimaryImage, DIAMOND_TYPE_LABELS } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const primaryImage = getPrimaryImage(product.images);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ position: 'relative' }}
    >
      <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="luxury-card" style={{ overflow: 'hidden' }}>
          {/* Image */}
          <div style={{ position: 'relative', paddingBottom: '110%', overflow: 'hidden' }}>
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />

            {/* Sold Out badge */}
            {product.isSoldOut && (
              <span className="badge-sold-out">Sold Out</span>
            )}

            {/* Best Seller badge */}
            {product.isBestSeller && !product.isSoldOut && (
              <span style={{
                position:'absolute', top:'1rem', left:'1rem',
                background:'linear-gradient(135deg, #C9A84C, #9A7A32)',
                color:'white',
                fontFamily:'var(--font-sans)', fontSize:'0.5625rem',
                fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
                padding:'0.375rem 0.75rem', zIndex:10,
              }}>
                Best Seller
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '1.25rem' }}>
            <p style={{
              fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
              letterSpacing:'0.12em', textTransform:'uppercase',
              color:'var(--color-gold)', marginBottom:'0.375rem',
            }}>
              {product.category?.name}
              {product.diamondType !== 'NONE' && ` · ${DIAMOND_TYPE_LABELS[product.diamondType]}`}
            </p>

            <h3 style={{
              fontFamily:'var(--font-serif)',
              fontSize:'1.125rem', fontWeight:400,
              color:'var(--color-charcoal)',
              marginBottom:'0.5rem',
              lineHeight:1.3,
            }}>
              {product.name}
            </h3>

            <p style={{
              fontFamily:'var(--font-sans)', fontSize:'0.75rem',
              color:'var(--color-muted)', letterSpacing:'0.06em',
            }}>
              SKU: {product.sku}
            </p>

            {product.showPrice && product.price && (
              <p style={{
                fontFamily:'var(--font-serif)', fontSize:'1.25rem',
                color:'var(--color-charcoal)', marginTop:'0.75rem',
              }}>
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            )}

            {/* Hover CTA */}
            <div style={{
              marginTop:'1rem',
              paddingTop:'1rem',
              borderTop:'1px solid var(--color-border)',
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
            }}>
              <span style={{
                fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
                letterSpacing:'0.1em', textTransform:'uppercase',
                color:'var(--color-charcoal)',
              }}>
                View Details
              </span>
              <span style={{
                width:'24px', height:'1px',
                background:'var(--color-gold)',
                display:'inline-block',
                transition:'width 0.3s',
              }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
