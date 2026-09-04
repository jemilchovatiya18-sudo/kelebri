import { motion } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => {
    const transition: Transition = { duration: 0.6, delay: i * 0.12, ease: 'easeOut' };
    return { opacity: 1, y: 0, transition };
  },
};

const AboutUs = () => (
  <>
    <Helmet>
      <title>About Us | Kelebri Diamonds & Jewellery</title>
      <meta name="description" content="Learn about Kelebri's story — two decades of crafting exquisite diamonds and fine jewellery with uncompromising artistry and integrity." />
    </Helmet>

    <div style={{ paddingTop:'72px' }}>
      {/* Hero */}
      <section style={{ height:'400px', position:'relative', overflow:'hidden', background:'var(--color-charcoal)' }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'url(https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=1920&q=60)',
          backgroundSize:'cover', backgroundPosition:'center', opacity:0.3,
        }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(26,26,26,0.3), rgba(26,26,26,0.8))' }} />
        <div style={{
          position:'relative', zIndex:1, height:'100%',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          textAlign:'center', padding:'2rem',
        }}>
          <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.6875rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-gold)', marginBottom:'1rem' }}>
            Our Story
          </p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2.5rem, 6vw, 4rem)', fontWeight:300, color:'white' }}>
            About Kelebri
          </h1>
        </div>
      </section>

      {/* Brand story */}
      <section className="section-padding" style={{ background:'white' }}>
        <div className="container-luxury">
          <div style={{ maxWidth:'760px', margin:'0 auto', textAlign:'center' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.6875rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--color-gold)', marginBottom:'1rem' }}>
                Est. 2004
              </p>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:300, color:'var(--color-charcoal)', marginBottom:'2rem' }}>
                Where Diamonds Meet Artistry
              </h2>
              <div className="gold-divider" style={{ marginBottom:'2.5rem' }} />
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'1rem', color:'var(--color-muted)', lineHeight:1.9, marginBottom:'1.5rem' }}>
                Kelebri was born from a passion for the extraordinary. For over two decades, we have dedicated ourselves to the art of fine jewellery — curating diamonds of exceptional beauty and crafting each piece with the precision of a master artisan.
              </p>
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'1rem', color:'var(--color-muted)', lineHeight:1.9 }}>
                Every ring, every pendant, every bracelet carries within it a story of love, skill, and timeless elegance. We believe that the finest jewellery is not just an ornament — it is a legacy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" style={{ background:'var(--color-cream)' }}>
        <div className="container-luxury">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once:true }}
            variants={fadeUp}
            style={{ textAlign:'center', marginBottom:'4rem' }}
          >
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:300, color:'var(--color-charcoal)', marginBottom:'1rem' }}>
              Our Promise
            </h2>
            <div className="gold-divider" />
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'2.5rem' }}>
            {[
              {
                icon:'💎',
                title:'Uncompromising Quality',
                desc:'Every diamond we use is hand-selected for its brilliance, cut, and character. We settle for nothing less than extraordinary.',
              },
              {
                icon:'✨',
                title:'Certified Authenticity',
                desc:'All our diamonds come with internationally recognized certificates from GIA, IGI, and SGL for your complete peace of mind.',
              },
              {
                icon:'🎨',
                title:'Master Craftsmanship',
                desc:'Each piece is crafted by skilled artisans who have dedicated their lives to the perfection of fine jewellery making.',
              },
              {
                icon:'💛',
                title:'Personal Service',
                desc:'We believe every customer deserves personalized attention. Our experts are always available on WhatsApp for guidance.',
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once:true }}
                variants={fadeUp} custom={i}
                style={{
                  padding:'2.5rem 2rem', background:'white',
                  border:'1px solid var(--color-border)',
                  textAlign:'center',
                  transition:'box-shadow 0.3s, border-color 0.3s',
                }}
                whileHover={{ borderColor:'rgba(201,168,76,0.4)', boxShadow:'0 8px 30px rgba(201,168,76,0.12)' }}
              >
                <span style={{ fontSize:'2.5rem', display:'block', marginBottom:'1.25rem' }}>{val.icon}</span>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.25rem', fontWeight:400, color:'var(--color-charcoal)', marginBottom:'0.75rem' }}>
                  {val.title}
                </h3>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.875rem', color:'var(--color-muted)', lineHeight:1.8 }}>
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:'var(--color-charcoal)', padding:'5rem 0', textAlign:'center' }}>
        <div className="container-luxury">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'3rem' }}>
            {[
              { num:'20+', label:'Years of Excellence' },
              { num:'5,000+', label:'Happy Clients' },
              { num:'100%', label:'Certified Stones' },
              { num:'∞', label:'Lifetime Service' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once:true }}
                variants={fadeUp} custom={i}
              >
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'3.5rem', color:'var(--color-gold)', fontWeight:300, marginBottom:'0.5rem' }}>
                  {stat.num}
                </p>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.75rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </>
);

export default AboutUs;
