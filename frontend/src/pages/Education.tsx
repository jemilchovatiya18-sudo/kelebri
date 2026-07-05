import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp } from 'lucide-react';

const educationTopics = [
  {
    id:'4cs',
    title:'The 4 C\'s of Diamonds',
    icon:'💎',
    content:`The quality of any diamond is determined by four key characteristics, universally known as the 4 C's:

**Cut**: The most important factor determining a diamond's brilliance. An excellent cut maximizes light reflection and creates that iconic sparkle. Grades range from Excellent to Poor.

**Color**: Diamond color is graded from D (colorless) to Z (light yellow). The closer to colorless, the rarer and more valuable. D-F are considered colorless; G-J near colorless.

**Clarity**: Refers to the presence of internal inclusions or external blemishes. Grades range from FL (Flawless) to I3 (Included). Eye-clean diamonds (VS2 and above) are ideal for fine jewelry.

**Carat**: The unit of diamond weight. One carat = 200 milligrams. While carat affects value significantly, cut quality should never be compromised for size.`,
  },
  {
    id:'lab-vs-natural',
    title:'Lab Grown vs Natural Diamonds',
    icon:'🔬',
    content:`Lab grown and natural diamonds are chemically, physically, and optically identical. The difference lies only in their origin.

**Natural Diamonds**: Formed over billions of years deep within the Earth under extreme heat and pressure. Their rarity and geological history make them uniquely valuable.

**Lab Grown Diamonds**: Created in controlled environments replicating natural conditions. They are certified by the same international bodies (GIA, IGI) and are significantly more affordable — typically 60–80% less than natural diamonds of the same quality.

**Our Recommendation**: Both are real diamonds. Choose based on your budget and values. Lab grown offers more stone for your money; natural offers traditional rarity.`,
  },
  {
    id:'moissanite',
    title:'What is Moissanite?',
    icon:'✨',
    content:`Moissanite is a gemstone that closely resembles a diamond but is made of silicon carbide (SiC). Originally discovered in a meteor crater by Henri Moissan in 1893, it is now created in laboratories.

**Key Properties**:
- Hardness: 9.25 on Mohs scale (diamond is 10) — extremely durable
- Refractive Index: Higher than diamonds — produces more fire and brilliance
- Price: Typically 90% less than equivalent natural diamonds

**How to Distinguish**: Professional gemologists can identify moissanite using a thermal conductivity probe. To the naked eye, high-quality moissanite is virtually indistinguishable from diamonds.

**Who Should Choose Moissanite**: Those who want maximum sparkle at a budget-friendly price, or who prefer lab-created alternatives.`,
  },
  {
    id:'certificates',
    title:'Diamond Certificates Explained',
    icon:'📜',
    content:`A diamond certificate (also called a grading report) is a document issued by an independent gemological laboratory that objectively grades a diamond's quality.

**GIA (Gemological Institute of America)**: The world's most respected and strict grading authority. A GIA certificate is the gold standard.

**IGI (International Gemological Institute)**: Widely accepted for lab grown diamonds. More affordable testing, commonly used in Asia.

**SGL (Solitaire Gemological Laboratories)**: A reputable Indian gemological laboratory. Certificates are widely accepted within India.

**HRD (Hoge Raad voor Diamant)**: European equivalent to GIA, particularly trusted in Belgium and Europe.

**Our Promise**: Every certified diamond at Kelebri comes with an authentic certificate from one of these recognized authorities.`,
  },
  {
    id:'metals',
    title:'Choosing the Right Metal',
    icon:'💛',
    content:`The metal you choose affects your jewelry's appearance, durability, and maintenance requirements.

**Yellow Gold**: The classic choice. 22K is richer in color; 18K is more durable for daily wear. Timeless and luxurious.

**White Gold**: Yellow gold mixed with palladium or nickel, coated with rhodium for a platinum-like appearance. Modern and sophisticated.

**Rose Gold**: Gold mixed with copper for a warm, romantic pink hue. Trending and unique.

**Platinum**: The rarest and most prestigious metal. Naturally white, hypoallergenic, and incredibly durable. Ages beautifully with a patina.

**Gold Purity**:
- 24K: 99.9% pure gold — too soft for jewelry
- 22K: 91.6% gold — ideal for plain gold jewelry
- 18K: 75% gold — best balance for diamond jewelry
- 14K: 58.5% gold — most durable, common internationally`,
  },
  {
    id:'care',
    title:'Caring for Your Jewelry',
    icon:'🛡️',
    content:`Proper care ensures your jewelry retains its brilliance for generations.

**Daily Care**:
- Remove jewelry before swimming, exercising, or applying perfume/lotion
- Store pieces individually in soft pouches to prevent scratching
- Keep away from harsh chemicals and ultrasonic cleaners (unless advised)

**Cleaning at Home**:
- Soak in warm water with a few drops of mild dish soap
- Gently scrub with a soft toothbrush
- Rinse thoroughly and pat dry with a lint-free cloth

**Professional Care**:
- Bring your jewelry for professional cleaning every 6–12 months
- Have prong settings checked annually to ensure stones are secure

**Storage**:
- Store in a cool, dry place away from direct sunlight
- Use anti-tarnish strips for silver jewelry

Kelebri offers complimentary cleaning and polishing for all our pieces — contact us on WhatsApp to schedule a visit.`,
  },
];

const EducationCard = ({ topic }: { topic: typeof educationTopics[0] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      border:'1px solid var(--color-border)',
      background:'white',
      overflow:'hidden',
      transition:'border-color 0.2s',
      borderColor: isOpen ? 'rgba(201,168,76,0.4)' : 'var(--color-border)',
    }}>
      <button
        id={`education-${topic.id}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width:'100%', padding:'1.75rem 2rem',
          background:'none', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', gap:'1.25rem',
          textAlign:'left',
        }}
      >
        <span style={{ fontSize:'1.75rem', flexShrink:0 }}>{topic.icon}</span>
        <span style={{
          flex:1,
          fontFamily:'var(--font-serif)',
          fontSize:'1.25rem', fontWeight:400,
          color:'var(--color-charcoal)',
        }}>
          {topic.title}
        </span>
        {isOpen ? <ChevronUp size={18} style={{ color:'var(--color-gold)', flexShrink:0 }} /> : <ChevronDown size={18} style={{ color:'var(--color-muted)', flexShrink:0 }} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }}
            transition={{ duration:0.35, ease:'easeInOut' }}
            style={{ overflow:'hidden' }}
          >
            <div style={{ padding:'0 2rem 2rem 4.75rem', borderTop:'1px solid var(--color-border)' }}>
              <div style={{ paddingTop:'1.5rem' }}>
                {topic.content.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontFamily:'var(--font-sans)',
                    fontSize:'0.9375rem', color:'var(--color-muted)',
                    lineHeight:1.85, marginBottom:'1rem',
                  }}>
                    {para.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                      j % 2 === 1
                        ? <strong key={j} style={{ color:'var(--color-charcoal)', fontWeight:600 }}>{part}</strong>
                        : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Education = () => (
  <>
    <Helmet>
      <title>Diamond Education | Kelebri Diamonds & Jewellery</title>
      <meta name="description" content="Learn about the 4 C's of diamonds, lab grown vs natural diamonds, moissanite, certifications, and how to care for fine jewelry." />
    </Helmet>

    <div style={{ paddingTop:'72px' }}>
      {/* Hero */}
      <section style={{ height:'320px', position:'relative', overflow:'hidden', background:'var(--color-charcoal)' }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'url(https://images.unsplash.com/photo-1587502537104-aac10f5fb6f7?w=1920&q=60)',
          backgroundSize:'cover', backgroundPosition:'center', opacity:0.25,
        }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(26,26,26,0.3), rgba(26,26,26,0.8))' }} />
        <div style={{
          position:'relative', zIndex:1, height:'100%',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          textAlign:'center', padding:'2rem',
        }}>
          <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.6875rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-gold)', marginBottom:'1rem' }}>
            Knowledge is Brilliance
          </p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2rem, 5vw, 3.5rem)', fontWeight:300, color:'white' }}>
            Diamond Education
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding" style={{ background:'var(--color-cream)' }}>
        <div className="container-luxury">
          <div style={{ maxWidth:'800px', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'4rem' }}>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'2.25rem', fontWeight:300, color:'var(--color-charcoal)', marginBottom:'1rem' }}>
                Everything You Need to Know
              </h2>
              <div className="gold-divider" style={{ marginBottom:'1.5rem' }} />
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'1rem', color:'var(--color-muted)', lineHeight:1.8 }}>
                Making an informed decision is the first step to finding the perfect diamond. Explore our comprehensive guides below.
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {educationTopics.map(topic => (
                <EducationCard key={topic.id} topic={topic} />
              ))}
            </div>

            {/* CTA */}
            <div style={{
              marginTop:'4rem', padding:'3rem 2rem',
              background:'var(--color-charcoal)', textAlign:'center',
            }}>
              <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.75rem', fontWeight:300, color:'white', marginBottom:'0.75rem' }}>
                Still Have Questions?
              </h3>
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.9375rem', color:'rgba(255,255,255,0.6)', marginBottom:'2rem' }}>
                Our diamond experts are available on WhatsApp to guide you personally.
              </p>
              <a
                href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210').replace(/[^0-9]/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                id="education-whatsapp-btn"
                className="btn-whatsapp"
                style={{ display:'inline-flex', width:'auto', minWidth:'240px' }}
              >
                Ask an Expert
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default Education;
