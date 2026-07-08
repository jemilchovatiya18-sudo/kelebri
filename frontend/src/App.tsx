import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { useAuthStore } from './store/authStore';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/admin/AdminSidebar';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Pages
import Home from './pages/Home';
import CollectionPage from './pages/CollectionPage';
import ProductDetail from './pages/ProductDetail';
import SearchPage from './pages/SearchPage';
import AboutUs from './pages/AboutUs';
import Education from './pages/Education';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEdit from './pages/admin/AdminProductEdit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-cream-dark)' }}>
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="admin-main-content" style={{ 
        flex: 1, 
        marginLeft: '260px', 
        overflowX: 'hidden',
        position: 'relative',
      }}>
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="admin-mobile-menu-btn"
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 998,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--color-charcoal)',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {children}

        {/* Mobile-only responsive styles */}
        <style>{`
          /* Desktop - hide mobile menu button, show sidebar margin */
          @media (min-width: 769px) {
            .admin-mobile-menu-btn {
              display: none !important;
            }
            .admin-main-content {
              margin-left: 260px !important;
            }
          }

          /* Mobile - show menu button, remove sidebar margin */
          @media (max-width: 768px) {
            .admin-main-content {
              margin-left: 0 !important;
            }
            .admin-mobile-menu-btn {
              display: flex !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
};

function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    const token = localStorage.getItem('kelebri_token');
    if (token) {
      fetchMe();
    }
  }, [fetchMe]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-charcoal)',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/collections" element={<MainLayout><CollectionPage /></MainLayout>} />
          <Route path="/collections/:category" element={<MainLayout><CollectionPage /></MainLayout>} />
          <Route path="/products/:slug" element={<MainLayout><ProductDetail /></MainLayout>} />
          <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
          <Route path="/education" element={<MainLayout><Education /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
            <Route path="/admin/products/:id/edit" element={<AdminLayout><AdminProductEdit /></AdminLayout>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
