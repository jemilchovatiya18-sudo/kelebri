import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export interface ImageObject {
  id?: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  file?: File;
  isUploading?: boolean;
}

interface ImageUploaderProps {
  images: ImageObject[];
  onChange: (images: ImageObject[]) => void;
  maxFiles?: number;
}

const ImageUploader = ({ images, onChange, maxFiles = 5 }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images`);
      return;
    }

    console.log('📤 Starting upload for', acceptedFiles.length, 'file(s)');
    setIsUploading(true);

    try {
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        console.log(`📤 Uploading file ${index + 1}:`, file.name, file.type, file.size, 'bytes');
        
        const formData = new FormData();
        formData.append('image', file);
        
        console.log('🔑 Auth token present:', !!localStorage.getItem('kelebri_token'));
        
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        console.log('✅ Upload response:', res.data);
        
        return {
          url: res.data.data.url,
          publicId: res.data.data.publicId,
          isPrimary: false,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...uploadedImages];
      // If this is the first image, make it primary automatically
      if (images.length === 0 && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      
      onChange(newImages);
      toast.success('Images uploaded successfully');
      console.log('✅ All images uploaded successfully');
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
      
      const errorMsg = error.response?.data?.message || error.message || 'Failed to upload images';
      
      // Check for specific errors
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Is the backend running on http://localhost:5000?');
      } else if (errorMsg.includes('cloud_name') || errorMsg.includes('api_key') || errorMsg.includes('not configured')) {
        toast.error('Cloudinary not configured. Please check backend .env file.');
      } else if (error.response?.status === 401) {
        toast.error('Please login again to upload images');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsUploading(false);
    }
  }, [images, maxFiles, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: maxFiles - images.length,
    disabled: isUploading || images.length >= maxFiles,
  });

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];
    
    // Optimistic UI update
    const newImages = [...images];
    newImages.splice(index, 1);
    
    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    onChange(newImages);

    // If it's uploaded to Cloudinary, delete it there
    if (imageToRemove.publicId && !imageToRemove.file) {
      try {
        await api.delete(`/upload/${encodeURIComponent(imageToRemove.publicId)}`);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary', error);
      }
    }
  };

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
        Product Images ({images.length}/{maxFiles})
      </label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--color-gold)' : 'var(--color-border)'}`,
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          background: isDragActive ? 'rgba(201,168,76,0.05)' : 'white',
          cursor: (isUploading || images.length >= maxFiles) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          marginBottom: '1rem',
        }}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--color-muted)' }}>
            <Loader2 size={24} className="animate-spin" />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>Uploading images...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-muted)' }}>
            <UploadCloud size={28} style={{ color: isDragActive ? 'var(--color-gold)' : 'var(--color-muted-light)' }} />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
              {isDragActive
                ? 'Drop the files here...'
                : `Drag 'n' drop some files here, or click to select files (Max ${maxFiles})`
              }
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
          {images.map((img, idx) => (
            <div key={idx} style={{
              position: 'relative',
              paddingBottom: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              border: img.isPrimary ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
            }}>
              <img
                src={img.url}
                alt={`Preview ${idx}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Actions */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                opacity: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(idx)}
                    title="Set as Primary"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}
                  >
                    <Star size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Remove Image"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Primary Badge */}
              {img.isPrimary && (
                <div style={{
                  position: 'absolute', top: '0.5rem', left: '0.5rem',
                  background: 'var(--color-gold)', color: 'white',
                  fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600,
                  letterSpacing: '0.05em', padding: '0.125rem 0.5rem', borderRadius: '4px',
                }}>
                  PRIMARY
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
