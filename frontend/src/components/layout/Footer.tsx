import { Link } from 'react-router-dom';
import { Diamond, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+919876543210';

  return (
    <footer style={{
      background: 'var(--color-charcoal)',
      color: 'rgba(255,255,255,0.7)',
      paddingTop: '5rem',
    }}>
      {/* Gold top border */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
        marginBottom: '5rem',
        opacity: 0.6,
      }} />

      <div className="container-luxury">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          paddingBottom: '4rem',
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'1rem' }}>
              <Diamond size={16} style={{ color:'var(--color-gold)' }} />
              <span style={{
                fontFamily:'var(--font-serif)',
                fontSize:'1.5rem', letterSpacing:'0.2em',
                color:'white', textTransform:'uppercase',
              }}>Kelebri</span>
            </div>
            <p style={{
              fontSize:'0.8125rem', lineHeight:1.8,
              marginBottom:'1.5rem', maxWidth:'280px',
            }}>
              Crafting timeless luxury jewelry with the world's finest diamonds.
              Each piece tells a story of elegance, craftsmanship, and enduring love.
            </p>
            {/* Socials */}
            <div style={{ display:'flex', gap:'1rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                style={{ color:'rgba(255,255,255,0.6)', transition:'color 0.2s', display:'flex' }}
                aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                style={{ color:'rgba(255,255,255,0.6)', transition:'color 0.2s', display:'flex' }}
                aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ color:'rgba(255,255,255,0.6)', transition:'color 0.2s', display:'flex' }}
                aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 style={{
              fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
              letterSpacing:'0.18em', textTransform:'uppercase',
              color:'var(--color-gold)', marginBottom:'1.25rem', fontWeight:600,
            }}>
              Collections
            </h4>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.625rem' }}>
              {['Rings','Earrings','Pendants','Bracelets & Bangles','Necklaces','Tennis Collection'].map(item => (
                <li key={item}>
                  <Link to={`/collections/${item.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`}
                    style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:'0.8125rem',
                      transition:'color 0.2s', letterSpacing:'0.04em',
                    }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Diamonds */}
          <div>
            <h4 style={{
              fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
              letterSpacing:'0.18em', textTransform:'uppercase',
              color:'var(--color-gold)', marginBottom:'1.25rem', fontWeight:600,
            }}>
              Diamonds
            </h4>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.625rem' }}>
              {['Lab Grown Diamonds','Natural Diamonds','Moissanite','Custom Jewelry'].map(item => (
                <li key={item}>
                  <Link to={`/collections/${item.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`}
                    style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:'0.8125rem',
                      transition:'color 0.2s', letterSpacing:'0.04em',
                    }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 style={{
              fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
              letterSpacing:'0.18em', textTransform:'uppercase',
              color:'var(--color-gold)', marginBottom:'1.25rem', fontWeight:600,
              marginTop:'2rem',
            }}>
              Customer Service
            </h4>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.625rem' }}>
              {[
                { label:'About Us', href:'/about' },
                { label:'Education', href:'/education' },
                { label:'Privacy Policy', href:'/privacy' },
                { label:'Terms & Conditions', href:'/terms' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.href}
                    style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:'0.8125rem',
                      transition:'color 0.2s', letterSpacing:'0.04em',
                    }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Showroom */}
          <div>
            <h4 style={{
              fontFamily:'var(--font-sans)', fontSize:'0.6875rem',
              letterSpacing:'0.18em', textTransform:'uppercase',
              color:'var(--color-gold)', marginBottom:'1.25rem', fontWeight:600,
            }}>
              Visit Our Showroom
            </h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
                <MapPin size={16} style={{ color:'var(--color-gold)', flexShrink:0, marginTop:'2px' }} />
                <p style={{ fontSize:'0.8125rem', lineHeight:1.7 }}>
                  Your Showroom Address,<br />
                  City, State – 000000
                </p>
              </div>
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                <Phone size={16} style={{ color:'var(--color-gold)', flexShrink:0 }} />
                <a href="tel:+919876543210" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:'0.8125rem' }}>
                  +91 98765 43210
                </a>
              </div>
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                <Mail size={16} style={{ color:'var(--color-gold)', flexShrink:0 }} />
                <a href="mailto:info@kelebri.com" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:'0.8125rem' }}>
                  info@kelebri.com
                </a>
              </div>
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
                <Clock size={16} style={{ color:'var(--color-gold)', flexShrink:0, marginTop:'2px' }} />
                <div style={{ fontSize:'0.8125rem', lineHeight:1.7 }}>
                  <p>Monday – Saturday</p>
                  <p>10:00 AM – 8:00 PM</p>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem', marginTop:'0.25rem' }}>
                    Sunday: By Appointment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '1.5rem 0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ fontSize:'0.75rem', letterSpacing:'0.06em', opacity:0.5 }}>
            © {new Date().getFullYear()} Kelebri Diamonds & Jewellery. All rights reserved.
          </p>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            <Link to="/privacy" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:'0.75rem', letterSpacing:'0.06em' }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:'0.75rem', letterSpacing:'0.06em' }}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
