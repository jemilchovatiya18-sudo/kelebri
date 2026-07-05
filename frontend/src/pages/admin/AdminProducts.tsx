import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Edit2, Trash2, Star, Award, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import type { Product } from '../../types';
import { getPrimaryImage } from '../../lib/utils';

const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => api.get('/products', { params: { page, limit, search } }).then(r => r.data),
    keepPreviousData: true,
  });

  const products: Product[] = data?.data || [];
  const meta = data?.meta;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const toggleFlagMutation = useMutation({
    mutationFn: ({ id, flag, value }: { id: string; flag: string; value: boolean }) =>
      api.patch(`/products/${id}/flag`, { flag, value }),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: () => toast.error('Failed to update status'),
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Products | Kelebri Admin</title>
      </Helmet>

      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-charcoal)' }}>
              Products
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
              Manage your jewelry showcase
            </p>
          </div>
          <Link to="/admin/products/new/edit" className="btn-luxury" style={{ borderRadius: '6px' }}>
            <Plus size={18} /> Add Product
          </Link>
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'white', padding: '1rem 1.5rem',
          borderRadius: '12px 12px 0 0',
          border: '1px solid var(--color-border)',
          borderBottom: 'none',
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{
                width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem',
                border: '1px solid var(--color-border)', borderRadius: '6px',
                fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            {meta?.total || 0} items
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                  <th style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                  <th style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cream-dark)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={getPrimaryImage(product.images)}
                            alt=""
                            style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-charcoal)' }}>{product.name}</p>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.625rem',
                          background: 'var(--color-cream-dark)',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                          color: 'var(--color-charcoal)',
                        }}>
                          {product.category?.name}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>
                        {product.showPrice && product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Hidden'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => toggleFlagMutation.mutate({ id: product.id, flag: 'isBestSeller', value: !product.isBestSeller })}
                            title="Toggle Best Seller"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: product.isBestSeller ? '#EAB308' : 'var(--color-muted-light)', transition: 'color 0.2s' }}
                          >
                            <Star size={18} fill={product.isBestSeller ? '#EAB308' : 'none'} />
                          </button>
                          <button
                            onClick={() => toggleFlagMutation.mutate({ id: product.id, flag: 'isHeroProduct', value: !product.isHeroProduct })}
                            title="Toggle Hero Product"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: product.isHeroProduct ? '#10B981' : 'var(--color-muted-light)', transition: 'color 0.2s' }}
                          >
                            <Award size={18} fill={product.isHeroProduct ? '#10B981' : 'none'} />
                          </button>
                          <button
                            onClick={() => toggleFlagMutation.mutate({ id: product.id, flag: 'isSoldOut', value: !product.isSoldOut })}
                            title="Toggle Sold Out"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: product.isSoldOut ? '#EF4444' : 'var(--color-muted-light)', transition: 'color 0.2s' }}
                          >
                            <AlertCircle size={18} fill={product.isSoldOut ? '#EF4444' : 'none'} />
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <Link to={`/admin/products/${product.id}/edit`} style={{ color: 'var(--color-charcoal)', transition: 'color 0.2s' }}>
                            <Edit2 size={18} />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: '36px', height: '36px',
                  background: p === page ? 'var(--color-charcoal)' : 'white',
                  color: p === page ? 'white' : 'var(--color-charcoal)',
                  border: '1px solid',
                  borderColor: p === page ? 'var(--color-charcoal)' : 'var(--color-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;
