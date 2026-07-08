import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, X, Diamond } from 'lucide-react';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor : 'var(--color-charcoal)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
          boxShadow: isScrolled ? '0 1px 0 rgba(201,168,76,0.2)' : 'none',
        }}
        transition={{ duration: 0.3 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, opacity: isScrolled ? 0.95 : 1, transition: 'opacity 0.3s' }}
      >
        <div className="container-luxury">
          <div style={{ display: 'flex', alignItems: 'center', height: '72px', gap: '1rem' }}>

            {/* Left — Hamburger */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <button
                id="nav-menu-toggle"
                onClick={() => setIsSidebarOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  color: '#FCFCFC',
                }}
                aria-label="Open menu"
              >
                <span style={{ display:'block', width:'22px', height:'1px', background:'currentColor', transition:'all 0.3s' }} />
                <span style={{ display:'block', width:'16px', height:'1px', background:'currentColor', transition:'all 0.3s' }} />
                <span style={{ display:'block', width:'22px', height:'1px', background:'currentColor', transition:'all 0.3s' }} />
              </button>
            </div>

            {/* Center — Logo */}
            <Link
              to="/"
              style={{ display:'flex', flexDirection:'column', alignItems:'center', textDecoration:'none', gap:'2px' }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <Diamond size={16} style={{ color:'var(--color-gold)' }} />
                <span style={{
                  fontFamily:'var(--font-serif)',
                  fontSize:'1.5rem',
                  fontWeight:400,
                  letterSpacing:'0.2em',
                  color:'#FCFCFC',
                  textTransform:'uppercase',
                }}>
                  Kelebri
                </span>
                <Diamond size={16} style={{ color:'var(--color-gold)' }} />
              </div>
              <span style={{
                fontFamily:'var(--font-sans)',
                fontSize:'0.55rem',
                letterSpacing:'0.25em',
                color:'#FCFCFC',
                textTransform:'uppercase',
              }}>
                Diamonds & Jewellery
              </span>
            </Link>

            {/* Right — Search + Admin */}
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.5rem' }}>
              <button
                id="nav-search-toggle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                style={{
                  background:'none', border:'none', cursor:'pointer',
                  padding:'8px', color:'#FCFCFC',
                  transition:'color 0.2s',
                  display:'flex', alignItems:'center',
                }}
                aria-label="Search"
              >
                {isSearchOpen
                  ? <X size={18} />
                  : <Search size={18} />
                }
              </button>

              <Link
                to="/admin/login"
                id="nav-admin-link"
                style={{
                  background:'none', border:'none', cursor:'pointer',
                  padding:'8px', color:'#FCFCFC',
                  display:'flex', alignItems:'center',
                  textDecoration:'none',
                  transition:'color 0.2s',
                }}
                aria-label="Admin"
              >
                <User size={18} />
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden', borderTop: '1px solid var(--color-border)' }}
              >
                <form onSubmit={handleSearch} style={{ padding: '1rem 0' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                    <Search size={16} style={{ color:'var(--color-muted)', flexShrink:0 }} />
                    <input
                      id="nav-search-input"
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search rings, earrings, lab diamonds, SKU..."
                      style={{
                        flex:1, background:'transparent', border:'none', outline:'none',
                        fontFamily:'var(--font-sans)', fontSize:'0.9375rem',
                        color:'#FCFCFC',
                      }}
                    />
                    <button type="submit" className="btn-luxury" style={{ padding:'0.5rem 1.25rem', fontSize:'0.75rem' }}>
                      Search
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
