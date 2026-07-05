import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Diamond } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
  { icon: <Package size={20} />, label: 'Products', href: '/admin/products' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--color-charcoal)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{
        padding: '2rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <Diamond size={24} style={{ color: 'var(--color-gold)' }} />
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Kelebri
          </h2>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1.5rem 0' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href} style={{ padding: '0 1rem' }}>
                <Link
                  to={item.href}
                  id={`admin-nav-${item.label.toLowerCase()}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                    background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--color-gold)' : 'inherit' }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)', fontWeight: 600 }}>
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {admin?.name}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {admin?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          id="admin-logout-btn"
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: 'white',
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
