import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Package, Star, Award, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import type { AdminStats } from '../../types';

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/products/admin/stats').then(r => r.data.data as AdminStats),
  });

  const stats = [
    { label: 'Total Products', value: data?.total || 0, icon: <Package size={24} />, color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Best Sellers', value: data?.bestSellers || 0, icon: <Star size={24} />, color: '#EAB308', bg: '#FEF9C3' },
    { label: 'Hero Products', value: data?.heroProducts || 0, icon: <Award size={24} />, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Sold Out', value: data?.soldOut || 0, icon: <AlertCircle size={24} />, color: '#EF4444', bg: '#FEE2E2' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | Kelebri Admin</title>
      </Helmet>

      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-charcoal)' }}>
            Dashboard Overview
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
            Welcome to your showcase management panel
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}>
              <div style={{
                width: '60px', height: '60px',
                borderRadius: '12px',
                background: stat.bg,
                color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                  {stat.label}
                </p>
                {isLoading ? (
                  <div className="skeleton" style={{ width: '40px', height: '32px', marginTop: '0.25rem', borderRadius: '4px' }} />
                ) : (
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-charcoal)', fontWeight: 600, lineHeight: 1.2, marginTop: '0.25rem' }}>
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
