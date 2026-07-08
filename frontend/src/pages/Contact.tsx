import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const Contact = () => {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '+919876543210';

  return (
    <>
      <Helmet>
        <title>Contact Us | Kelebri Diamonds & Jewellery</title>
        <meta name="description" content="Visit Kelebri's showroom or contact us via WhatsApp, phone, or email. Our jewelry experts are here to help you find the perfect piece." />
      </Helmet>

      <div style={{ paddingTop:'72px' }}>
        {/* Hero */}
        <section style={{
          height:'320px', position:'relative', overflow:'hidden',
          background:'var(--color-charcoal)',
        }}>
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:'url(https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=1920&q=60)',
            backgroundSize:'cover', backgroundPosition:'center', opacity:0.25,
          }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(26,26,26,0.3), rgba(26,26,26,0.7))' }} />
          <div style={{
            position:'relative', zIndex:1,
            height:'100%', display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', textAlign:'center', padding:'2rem',
          }}>
            <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.6875rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-gold)', marginBottom:'1rem' }}>
              Get In Touch
            </p>
            <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2rem, 5vw, 3.5rem)', fontWeight:300, color:'white' }}>
              Contact Us
            </h1>
          </div>
        </section>

        {/* Contact info + map */}
        <section className="section-padding" style={{ background:'white' }}>
          <div className="container-luxury">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'4rem', alignItems:'start' }}>

              {/* Left: contact info */}
              <div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }}>
                  <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.6875rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--color-gold)', marginBottom:'0.75rem' }}>
                    Reach Us
                  </p>
                  <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'2.25rem', fontWeight:300, color:'var(--color-charcoal)', marginBottom:'2rem' }}>
                    We're Here to Help
                  </h2>
                  <div className="gold-divider" style={{ margin:'0 0 2.5rem' }} />
                </motion.div>

                <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
                  {[
                    {
                      icon: <MessageCircle size={20} style={{ color:'var(--color-gold)' }} />,
                      label:'WhatsApp',
                      value:whatsapp,
                      href:`https://wa.me/${whatsapp.replace(/[^0-9]/g,'')}`,
                    },
                    {
                      icon: <Phone size={20} style={{ color:'var(--color-gold)' }} />,
                      label:'Phone',
                      value:'+91 98765 43210',
                      href:'tel:+919876543210',
                    },
                    {
                      icon: <Mail size={20} style={{ color:'var(--color-gold)' }} />,
                      label:'Email',
                      value:'info@kelebri.com',
                      href:'mailto:info@kelebri.com',
                    },
                    {
                      icon: <MapPin size={20} style={{ color:'var(--color-gold)' }} />,
                      label:'Showroom',
                      value:'Your Showroom Address, City, State – 000000',
                      href:'https://maps.google.com',
                    },
                    {
                      icon: <Clock size={20} style={{ color:'var(--color-gold)' }} />,
                      label:'Hours',
                      value:'Mon–Sat: 10:00 AM – 8:00 PM\nSunday: By Appointment',
                      href:null,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial="hidden" whileInView="visible" viewport={{ once:true }}
                      variants={fadeUp} custom={i}
                      style={{ display:'flex', gap:'1.25rem', alignItems:'flex-start' }}
                    >
                      <div style={{
                        width:'44px', height:'44px', background:'var(--color-cream)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        border:'1px solid var(--color-border)', flexShrink:0,
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.6875rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:'0.375rem' }}>
                          {item.label}
                        </p>
                        {item.href ? (
                          <a href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            style={{ fontFamily:'var(--font-sans)', fontSize:'0.9375rem', color:'var(--color-charcoal)', textDecoration:'none', lineHeight:1.6 }}>
                            {item.value}
                          </a>
                        ) : (
                          <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.9375rem', color:'var(--color-charcoal)', lineHeight:1.6, whiteSpace:'pre-line' }}>
                            {item.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <div style={{ marginTop:'3rem' }}>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g,'')}`}
                    target="_blank" rel="noopener noreferrer"
                    id="contact-whatsapp-btn"
                    className="btn-whatsapp"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Right: map placeholder + showroom card */}
              <div id="showroom" style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                {/* Google Maps embed placeholder */}
                <div style={{
                  height:'350px', background:'var(--color-cream)',
                  border:'1px solid var(--color-border)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  position:'relative', overflow:'hidden',
                }}>
                  {/* Replace src with actual Google Maps embed URL */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border:0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Kelebri Showroom Location"
                  />
                </div>

                {/* Showroom card */}
                <div style={{
                  padding:'2rem',
                  background:'var(--color-charcoal)',
                  color:'white',
                }}>
                  <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.5rem', fontWeight:300, marginBottom:'0.75rem', color:'white' }}>
                    Visit Our Showroom
                  </h3>
                  <div style={{ width:'40px', height:'1px', background:'var(--color-gold)', marginBottom:'1.25rem' }} />
                  <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.875rem', color:'rgba(255,255,255,0.7)', lineHeight:1.8, marginBottom:'1rem' }}>
                    Experience our collection in person. Our experts will guide you to find the perfect piece for any occasion.
                  </p>
                  <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8125rem', color:'rgba(255,255,255,0.5)' }}>
                    By appointment on Sundays
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
