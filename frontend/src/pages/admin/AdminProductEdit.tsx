import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import type { Category, ProductForm } from '../../types';
import ImageUploader, { type ImageObject } from '../../components/admin/ImageUploader';

const DIAMOND_TYPES = ['LAB_GROWN', 'NATURAL', 'MOISSANITE', 'NONE'];
const METAL_TYPES = ['GOLD', 'WHITE_GOLD', 'ROSE_GOLD', 'SILVER', 'PLATINUM'];
const GOLD_PURITIES = ['K14', 'K18', 'K22', 'K24', 'NONE'];
const CERTIFICATES = ['GIA', 'IGI', 'SGL', 'HRD', 'NONE'];

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    sku: '',
    description: '',
    specifications: '',
    categoryId: '',
    diamondType: 'NONE',
    metalType: 'GOLD',
    metalColor: '',
    goldPurity: 'NONE',
    diamondWeight: '',
    diamondShape: '',
    diamondQuality: '',
    diamondColor: '',
    diamondClarity: '',
    stoneType: '',
    certificate: 'NONE',
    price: undefined,
    showPrice: false,
    isAvailable: true,
    isSoldOut: false,
    isBestSeller: false,
    isHeroProduct: false,
  });

  const [images, setImages] = useState<ImageObject[]>([]);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data as Category[]),
  });

  // Fetch product if editing
  const { isLoading: isLoadingProduct, data: productData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/admin/${id}`).then(r => r.data.data),
    enabled: !isNew,
  });

  // Update form when product data is loaded
  useEffect(() => {
    if (productData && !isNew) {
      console.log('📝 Loading product data:', productData);
      setFormData({
        name: productData.name || '',
        sku: productData.sku || '',
        description: productData.description || '',
        specifications: productData.specifications || '',
        categoryId: productData.categoryId || '',
        diamondType: productData.diamondType || 'NONE',
        metalType: productData.metalType || 'GOLD',
        metalColor: productData.metalColor || '',
        goldPurity: productData.goldPurity || 'NONE',
        diamondWeight: productData.diamondWeight || '',
        diamondShape: productData.diamondShape || '',
        diamondQuality: productData.diamondQuality || '',
        diamondColor: productData.diamondColor || '',
        diamondClarity: productData.diamondClarity || '',
        stoneType: productData.stoneType || '',
        certificate: productData.certificate || 'NONE',
        price: productData.price || undefined,
        showPrice: productData.showPrice ?? false,
        isAvailable: productData.isAvailable ?? true,
        isSoldOut: productData.isSoldOut ?? false,
        isBestSeller: productData.isBestSeller ?? false,
        isHeroProduct: productData.isHeroProduct ?? false,
      });
      setImages(productData.images || []);
      console.log('✅ Form data loaded successfully');
    }
  }, [productData, isNew]);

  const mutation = useMutation({
    mutationFn: (data: ProductForm & { images?: ImageObject[] }) => {
      if (isNew) {
        return api.post('/products', data);
      } else {
        return api.put(`/products/${id}`, data);
      }
    },
    onSuccess: () => {
      toast.success(isNew ? 'Product created' : 'Product updated');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] as const });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] as const });
      navigate('/admin/products');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }
    
    // Convert string empty values to undefined for optional fields
    const payload = { ...formData, images: isNew ? images : undefined };
    mutation.mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isNew && isLoadingProduct) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading product details...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{isNew ? 'New Product' : 'Edit Product'} | Kelebri Admin</title>
      </Helmet>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'white', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-charcoal)', transition: 'all 0.2s' }}>
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-charcoal)' }}>
                {isNew ? 'Add New Product' : 'Edit Product'}
              </h1>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={mutation.status === 'pending'}
            className="btn-luxury"
            style={{ borderRadius: '6px', padding: '0.625rem 1.25rem' }}
          >
            {mutation.status === 'pending' ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Product</>}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
          {/* Main Info */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-charcoal)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Basic Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="admin-label">Product Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }} />
              </div>
              <div>
                <label className="admin-label">SKU *</label>
                <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Category *</label>
                <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }}>
                  <option value="">Select Category</option>
                  {categories.map(c => {
                    const catId = c.id || (c as any)._id;
                    return <option key={catId} value={catId}>{c.name}</option>;
                  })}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="luxury-input" style={{ borderRadius: '6px', resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-charcoal)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Images</h2>
            <ImageUploader images={images} onChange={setImages} maxFiles={6} />
            {!isNew && <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>Note: Image updates are saved immediately.</p>}
          </div>

          {/* Details */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-charcoal)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Specifications</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="admin-label">Diamond Type</label>
                <select name="diamondType" value={formData.diamondType} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }}>
                  {DIAMOND_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Metal Type</label>
                <select name="metalType" value={formData.metalType} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }}>
                  {METAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Gold Purity</label>
                <select name="goldPurity" value={formData.goldPurity} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }}>
                  {GOLD_PURITIES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Certificate</label>
                <select name="certificate" value={formData.certificate} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }}>
                  {CERTIFICATES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Diamond Weight (ct)</label>
                <input type="text" name="diamondWeight" value={formData.diamondWeight} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }} />
              </div>
              <div>
                <label className="admin-label">Diamond Shape</label>
                <input type="text" name="diamondShape" value={formData.diamondShape} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }} />
              </div>
            </div>
          </div>

          {/* Pricing & Flags */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-charcoal)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Pricing & Status</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label className="admin-label">Price (INR)</label>
                <input type="number" name="price" value={formData.price || ''} onChange={handleChange} className="luxury-input" style={{ borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                  <input type="checkbox" name="showPrice" checked={formData.showPrice} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                  Show price to customers
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                Mark as Best Seller
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                <input type="checkbox" name="isHeroProduct" checked={formData.isHeroProduct} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                Feature in Hero Section
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                <input type="checkbox" name="isSoldOut" checked={formData.isSoldOut} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                Mark as Sold Out
              </label>
            </div>
          </div>

          {/* Bottom Save Action Bar */}
          <div style={{
            background: 'white',
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-card)'
          }}>
            <Link
              to="/admin/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-charcoal)',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={mutation.status === 'pending'}
              className="btn-luxury"
              style={{
                borderRadius: '6px',
                padding: '0.875rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem'
              }}
            >
              {mutation.status === 'pending' ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Saving Product...
                </>
              ) : (
                <>
                  <Save size={20} /> {isNew ? 'Save Product' : 'Update Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-charcoal);
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default AdminProductEdit;
