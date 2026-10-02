import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const KelebriStorySection = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <>
      {/* ── ABOUT KELEBRI SECTION ──────────────────────── */}
      <section style={{
        padding: 'clamp(2rem, 4vw, 3.5rem) 0 1.5rem 0',
        background: 'var(--color-cream)',
        textAlign: 'center',
      }}>
        <div className="container-luxury" style={{ maxWidth: '800px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={fadeUpVariants}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                color: 'var(--color-charcoal)',
                marginBottom: '0.35rem',
              }}
            >
              About Kelebri
            </motion.h2>
            
            <motion.p
              variants={fadeUpVariants}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '1.75rem',
              }}
            >
              Where Timeless Craft Meets Modern Luxury
            </motion.p>
            
            <motion.div variants={fadeUpVariants} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: 'var(--color-muted)',
                lineHeight: 1.8,
              }}>
                Kelebri is a modern jewellery house where timeless craftsmanship meets contemporary luxury. Every piece is thoughtfully designed to celebrate individuality, refined beauty, and the art of fine jewellery.
              </p>
              
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: 'var(--color-muted)',
                lineHeight: 1.8,
              }}>
                Each creation is crafted with attention to detail and a commitment to quality, bringing together elegant design, trusted materials, and exceptional craftsmanship.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariants}>
              <Link to="/about" className="btn-luxury btn-dark" style={{ 
                background: 'var(--color-charcoal)', 
                color: 'white',
                padding: '0.6rem 1.4rem',
                fontSize: '0.65rem'
              }}>
                Discover Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── OUR PROMISE OF AUTHENTICITY SECTION ────────── */}
      <section style={{
        padding: '1.5rem 0 clamp(2.8rem, 5.5vw, 4.2rem) 0',
        background: 'var(--color-cream)',
      }}>
        <div className="container-luxury">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            style={{ textAlign: 'center' }}
          >
            <motion.h2 
              variants={fadeUpVariants}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)',
                fontWeight: 300,
                color: 'var(--color-charcoal)',
                marginBottom: '2rem',
              }}
            >
              Our Promise of Authenticity
            </motion.h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              {/* Column 1 */}
              <motion.div variants={fadeUpVariants} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '1rem',
                transition: 'transform 0.3s ease',
              }} className="auth-card">
                <div style={{
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.35rem',
                }}>
                  <img src="/BIS.png" alt="BIS Hallmark Logo" style={{ maxHeight: '100%', maxWidth: '50px', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    color: 'var(--color-charcoal)',
                    marginBottom: '0.35rem',
                  }}>
                    BIS Hallmark
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.65rem',
                    color: 'var(--color-muted)',
                  }}>
                    Government-certified purity of gold
                  </p>
                </div>
              </motion.div>

              {/* Column 2 */}
              <motion.div variants={fadeUpVariants} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '1rem',
                transition: 'transform 0.3s ease',
              }} className="auth-card">
                <div style={{
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.35rem',
                }}>
                  <img src="/GIA.png" alt="GIA Certified Logo" style={{ maxHeight: '100%', maxWidth: '100px', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    color: 'var(--color-charcoal)',
                    marginBottom: '0.35rem',
                  }}>
                    GIA Certified
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.65rem',
                    color: 'var(--color-muted)',
                  }}>
                    Diamonds graded by the world's leading authority
                  </p>
                </div>
              </motion.div>

              {/* Column 3 */}
              <motion.div variants={fadeUpVariants} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '1rem',
                transition: 'transform 0.3s ease',
              }} className="auth-card">
                <div style={{
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.35rem',
                }}>
                  <img src="/IGI.png" alt="IGI Certified Logo" style={{ maxHeight: '100%', maxWidth: '50px', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    color: 'var(--color-charcoal)',
                    marginBottom: '0.35rem',
                  }}>
                    IGI Certified
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.65rem',
                    color: 'var(--color-muted)',
                  }}>
                    Trusted diamond evaluation recognized globally
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <style>{`
          .auth-card:hover {
            transform: translateY(-5px);
          }
        `}</style>
      </section>
    </>
  );
};

export default KelebriStorySection;
