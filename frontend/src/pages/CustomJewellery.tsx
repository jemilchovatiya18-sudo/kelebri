import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getWhatsAppContactUrl, KELEBRI_WHATSAPP_NUMBER } from '../lib/utils';

const CustomJewellery = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    type: '',
    description: '',
    metal: '',
    purity: '',
    stone: '',
    budget: '',
    date: '',
    occasion: '',
    additional: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    if (!formData.mobile.trim() || !/^\+?[0-9\s-]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = 'Valid Mobile Number is required.';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid Email Address is required.';
    }
    if (!formData.type) newErrors.type = 'Jewellery Type is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const message = `Hello Kelebri,

I would like to enquire about Custom Jewellery.

CUSTOMER DETAILS
Name: ${formData.name}
Mobile: ${formData.mobile}
Email: ${formData.email}

JEWELLERY REQUIREMENTS
Jewellery Type: ${formData.type}
Description: ${formData.description}
Metal: ${formData.metal || 'Not specified'}
Gold Purity: ${formData.purity || 'Not specified'}
Stone/Diamond Preference: ${formData.stone || 'Not specified'}
Budget: ${formData.budget || 'Not specified'}
Required Date: ${formData.date || 'Not specified'}
Occasion: ${formData.occasion || 'Not specified'}
Additional Requirements: ${formData.additional || 'None'}

Thank you.`;

      const phone = KELEBRI_WHATSAPP_NUMBER;
      if (!phone.trim()) {
        setErrors({ submit: 'WhatsApp contact is not configured. Please call or email us instead.' });
        return;
      }

      window.open(getWhatsAppContactUrl(phone, message), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Helmet>
        <title>Custom Jewellery Enquiry | Kelebri Diamonds & Jewellery</title>
      </Helmet>

      <section style={{ padding: '6rem 0', background: 'var(--color-cream)', minHeight: '100vh' }}>
        <div className="container-luxury" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
              Custom Jewellery Enquiry
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
              Your vision, our artistry. Commission a piece that's uniquely yours. Please fill out the form below and our experts will get back to you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            style={{ background: 'white', padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-charcoal)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              Customer Information
            </h2>
            
            <div className="custom-jewellery-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: `1px solid ${errors.name ? 'red' : 'var(--color-border)'}`, borderRadius: '6px', fontFamily: 'var(--font-sans)' }} />
                {errors.name && <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Mobile Number *</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: `1px solid ${errors.mobile ? 'red' : 'var(--color-border)'}`, borderRadius: '6px', fontFamily: 'var(--font-sans)' }} />
                {errors.mobile && <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.mobile}</span>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: `1px solid ${errors.email ? 'red' : 'var(--color-border)'}`, borderRadius: '6px', fontFamily: 'var(--font-sans)' }} />
                {errors.email && <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-charcoal)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              Jewellery Requirements
            </h2>

            <div className="custom-jewellery-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Jewellery Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: `1px solid ${errors.type ? 'red' : 'var(--color-border)'}`, borderRadius: '6px', fontFamily: 'var(--font-sans)', background: 'white' }}>
                  <option value="">Select Type</option>
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Pendant">Pendant</option>
                  <option value="Jewellery Set">Jewellery Set</option>
                  <option value="Other">Other</option>
                </select>
                {errors.type && <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.type}</span>}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Custom Jewellery Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Tell us about the jewellery you want us to create..." style={{ width: '100%', padding: '0.75rem', border: `1px solid ${errors.description ? 'red' : 'var(--color-border)'}`, borderRadius: '6px', fontFamily: 'var(--font-sans)', resize: 'vertical' }} />
                {errors.description && <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.description}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Preferred Material / Metal</label>
                <select name="metal" value={formData.metal} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-sans)', background: 'white' }}>
                  <option value="">Select Metal</option>
                  <option value="Gold">Gold</option>
                  <option value="White Gold">White Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Preferred Gold Purity</label>
                <select name="purity" value={formData.purity} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-sans)', background: 'white' }}>
                  <option value="">Select Purity</option>
                  <option value="18K">18K</option>
                  <option value="22K">22K</option>
                  <option value="24K">24K</option>
                  <option value="Not Sure">Not Sure</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Stone / Diamond Preference</label>
                <select name="stone" value={formData.stone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-sans)', background: 'white' }}>
                  <option value="">Select Stone</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Natural Diamond">Natural Diamond</option>
                  <option value="Lab-Grown Diamond">Lab-Grown Diamond</option>
                  <option value="Gemstone">Gemstone</option>
                  <option value="No Stone">No Stone</option>
                  <option value="Not Sure">Not Sure</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Approximate Budget</label>
                <select name="budget" value={formData.budget} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-sans)', background: 'white' }}>
                  <option value="">Select Budget</option>
                  <option value="Below ₹50,000">Below ₹50,000</option>
                  <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                  <option value="₹1,00,000 – ₹2,00,000">₹1,00,000 – ₹2,00,000</option>
                  <option value="₹2,00,000 – ₹5,00,000">₹2,00,000 – ₹5,00,000</option>
                  <option value="Above ₹5,00,000">Above ₹5,00,000</option>
                  <option value="Not Sure">Not Sure</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Required Date / Occasion</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-sans)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Occasion</label>
                <select name="occasion" value={formData.occasion} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-sans)', background: 'white' }}>
                  <option value="">Select Occasion</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Gift">Gift</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>Additional Requirements</label>
                <textarea name="additional" value={formData.additional} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-sans)', resize: 'vertical' }} />
              </div>
            </div>

            {errors.submit && (
              <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>{errors.submit}</p>
            )}
            <button type="submit" className="btn-whatsapp" style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send Enquiry on WhatsApp
            </button>
          </motion.form>
        </div>
      </section>
      <style>{`
        @media (max-width: 640px) {
          .custom-jewellery-form-grid {
            grid-template-columns: 1fr !important;
          }
          .custom-jewellery-form-grid input,
          .custom-jewellery-form-grid select,
          .custom-jewellery-form-grid textarea {
            max-width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </>
  );
};

export default CustomJewellery;
