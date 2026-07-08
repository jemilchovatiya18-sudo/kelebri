import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Diamond, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
  { icon: <Package size={20} />, label: 'Products', href: '/admin/products' },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className="admin-sidebar"
        style={{
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
          zIndex: 1000,
          transition: 'transform 0.3s ease',
        }}>
      {/* Brand */}
      <div style={{
        padding: '2rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
        
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="admin-sidebar-close"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '6px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
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

      {/* Mobile-only responsive styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Desktop - sidebar always visible */
        @media (min-width: 769px) {
          .admin-sidebar {
            transform: translateX(0) !important;
          }
          .admin-sidebar-backdrop {
            display: none !important;
          }
          .admin-sidebar-close {
            display: none !important;
          }
        }

        /* Mobile - sidebar hidden by default, slides in when open */
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(${isOpen ? '0' : '-100%'});
            box-shadow: ${isOpen ? '2px 0 8px rgba(0,0,0,0.2)' : 'none'};
          }
        }
      `}</style>
    </aside>
    </>
  );
};

export default AdminSidebar;
