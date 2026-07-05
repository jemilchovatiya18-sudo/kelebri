import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';
import { ArrowRight } from 'lucide-react';

// Fallback luxury images for categories (Unsplash)
const FALLBACK_IMAGES: Record<string, string> = {
  rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
  earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
  pendants: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80',
  'bracelets-bangles': 'https://images.unsplash.com/photo-1573408301185-9519f94f8d14?w=600&q=80',
  necklaces: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600&q=80',
  'tennis-collection': 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
  'lab-grown-diamonds': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  'natural-diamonds': 'https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?w=600&q=80',
  moissanite: 'https://images.unsplash.com/photo-1583937443986-a6ba2ceef875?w=600&q=80',
  'custom-jewelry': 'https://images.unsplash.com/photo-1527685609591-44b0aef2400b?w=600&q=80',
};

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'large';
}

const CategoryCard = ({ category, variant = 'default' }: CategoryCardProps) => {
  const imageUrl = category.imageUrl || FALLBACK_IMAGES[category.slug] || FALLBACK_IMAGES.rings;
  const href = `/collections/${category.slug}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Link to={href} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: variant === 'large' ? '130%' : '120%',
        }}>
          {/* Image */}
          <img
            src={imageUrl}
            alt={category.name}
            loading="lazy"
            style={{
              position:'absolute', inset:0,
              width:'100%', height:'100%',
              objectFit:'cover',
              transition:'transform 0.7s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {/* Dark gradient overlay */}
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(to bottom, rgba(26,26,26,0.1) 30%, rgba(26,26,26,0.75) 100%)',
          }} />

          {/* Gold shimmer line at top */}
          <div style={{
            position:'absolute', top:0, left:0, right:0,
            height:'2px',
            background:'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
            opacity:0,
            transition:'opacity 0.3s',
          }} className="category-gold-line" />

          {/* Text */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            padding: variant === 'large' ? '2rem' : '1.5rem',
          }}>
            <h3 style={{
              fontFamily:'var(--font-serif)',
              fontSize: variant === 'large' ? '1.75rem' : '1.375rem',
              fontWeight:400, color:'white',
              letterSpacing:'0.04em',
              marginBottom:'0.5rem',
            }}>
              {category.name}
            </h3>
            <div style={{
              display:'flex', alignItems:'center', gap:'0.5rem',
              color:'var(--color-gold-light)',
              fontFamily:'var(--font-sans)',
              fontSize:'0.6875rem',
              letterSpacing:'0.14em',
              textTransform:'uppercase',
            }}>
              <span>Explore</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
