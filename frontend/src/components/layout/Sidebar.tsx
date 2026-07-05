import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronRight, Diamond } from 'lucide-react';
import { useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'Rings', href: '/collections/rings' },
      { label: 'Earrings', href: '/collections/earrings' },
      { label: 'Pendants', href: '/collections/pendants' },
      { label: 'Bracelets & Bangles', href: '/collections/bracelets-bangles' },
      { label: 'Necklaces', href: '/collections/necklaces' },
      { label: 'Tennis Collection', href: '/collections/tennis-collection' },
    ],
  },
  {
    label: 'Diamonds',
    href: '/diamonds',
    children: [
      { label: 'Lab Grown Diamonds', href: '/collections/lab-grown-diamonds' },
      { label: 'Natural Diamonds', href: '/collections/natural-diamonds' },
      { label: 'Moissanite', href: '/collections/moissanite' },
      { label: 'Custom Jewelry', href: '/collections/custom-jewelry' },
    ],
  },
  { label: 'About Us', href: '/about' },
  { label: 'Education', href: '/education' },
  { label: 'Contact', href: '/contact' },
  { label: 'Visit Showroom', href: '/contact#showroom' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  // Close on route change
  useEffect(() => { onClose(); }, [location.pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 1001,
              background: 'rgba(26,26,26,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', left: 0, top: 0, bottom: 0,
              width: 'min(380px, 90vw)',
              background: 'var(--color-cream)',
              zIndex: 1002,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <Diamond size={14} style={{ color:'var(--color-gold)' }} />
                <span style={{
                  fontFamily:'var(--font-serif)',
                  fontSize:'1.25rem', letterSpacing:'0.18em',
                  color:'var(--color-charcoal)',
                }}>
                  Kelebri
                </span>
              </div>
              <button
                id="sidebar-close"
                onClick={onClose}
                style={{
                  background:'none', border:'none', cursor:'pointer',
                  color:'var(--color-charcoal)', padding:'4px',
                  display:'flex', alignItems:'center',
                }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0' }}>
              {navItems.map((item, i) => (
                <div key={i}>
                  {/* Parent item */}
                  <div style={{ padding: '0 2rem' }}>
                    <Link
                      to={item.href}
                      id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid var(--color-border)',
                        textDecoration: 'none',
                        color: location.pathname === item.href ? 'var(--color-gold)' : 'var(--color-charcoal)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.label}
                      {item.children && <ChevronRight size={14} style={{ color:'var(--color-muted)' }} />}
                    </Link>
                  </div>

                  {/* Children */}
                  {item.children && (
                    <div style={{ background:'white', padding:'0.5rem 0' }}>
                      {item.children.map((child, j) => (
                        <div key={j} style={{ padding: '0 2rem 0 3rem' }}>
                          <Link
                            to={child.href}
                            style={{
                              display: 'block',
                              padding: '0.625rem 0',
                              textDecoration: 'none',
                              color: location.pathname === child.href ? 'var(--color-gold)' : 'var(--color-muted)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.8125rem',
                              letterSpacing: '0.06em',
                              transition: 'color 0.2s',
                            }}
                          >
                            {child.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer CTA */}
            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/[^0-9]/g,'') || '919876543210'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                id="sidebar-whatsapp-cta"
                style={{ fontSize:'0.8125rem', padding:'0.875rem 1.5rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Enquiry
              </a>
              <p style={{
                fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
                color:'var(--color-muted)', textAlign:'center', letterSpacing:'0.06em',
              }}>
                Mon–Sat, 10am–8pm IST
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
