import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Diamond, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-cream)',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Diamond size={24} style={{ color: 'var(--color-gold)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-charcoal)', fontWeight: 400, letterSpacing: '0.05em' }}>
            Kelebri Admin
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
            Sign in to manage your showcase
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="luxury-input"
              placeholder="admin@kelebri.com"
              style={{ borderRadius: '6px' }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="luxury-input"
              placeholder="••••••••"
              style={{ borderRadius: '6px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-luxury"
            style={{ width: '100%', borderRadius: '6px', marginTop: '0.5rem' }}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
