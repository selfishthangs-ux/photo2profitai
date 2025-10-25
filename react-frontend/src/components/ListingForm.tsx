import React, { useState, useRef, useEffect } from 'react';
import { useListing } from '../hooks/useListing';
import { StatusIndicator } from './StatusIndicator';
import type { ListingFormData } from '../types/listing';

interface ListingFormProps {
  listingId: string;
}

export const ListingForm: React.FC<ListingFormProps> = ({ listingId }) => {
  const { listing, loading, error, initializeListing, handleImageUpload, saveDraft } = useListing(listingId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state (user can edit these)
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    price: undefined,
    category: ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize listing on mount
  useEffect(() => {
    initializeListing();
  }, []);

  // Auto-populate form when AI generates content
  useEffect(() => {
    if (listing?.ai) {
      setFormData(prev => ({
        title: prev.title || listing.ai?.title || '',
        description: prev.description || listing.ai?.description || '',
        price: prev.price || listing.ai?.pricing?.boutique,
        category: prev.category || listing.ai?.category || ''
      }));
    }
  }, [listing?.ai]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase
    await handleImageUpload(file);
  };

  const handleInputChange = (field: keyof ListingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = async () => {
    await saveDraft(formData);
  };

  const displayImage = listing?.processedUrl || listing?.originalUrl || imagePreview;

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '2rem auto', 
      padding: '0 1rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      alignItems: 'start'
    }}>
      {/* Image Upload Section */}
      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
          📸 Upload Image
        </h2>

        {!displayImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '3px dashed #ddd',
              borderRadius: '15px',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📤</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>
              Click to upload or drag & drop
            </p>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>
              PNG, JPG, or WebP (max 10MB)
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img 
              src={displayImage} 
              alt="Product preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '400px', 
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Change Image
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Status Indicator */}
        {listing && (
          <div style={{ marginTop: '1.5rem' }}>
            <StatusIndicator status={listing.status} />
          </div>
        )}

        {error && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#fee', 
            borderRadius: '8px',
            color: '#c00' 
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Listing Details Section */}
      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
          ✍️ Listing Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600,
              color: '#2d3748' 
            }}>
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="AI will generate this..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600,
              color: '#2d3748' 
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="AI will generate this..."
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                resize: 'vertical',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Category and Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 600,
                color: '#2d3748' 
              }}>
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Clothing"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 600,
                color: '#2d3748' 
              }}>
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="0.00"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* AI Pricing Suggestions */}
          {listing?.ai?.pricing && (
            <div style={{ 
              padding: '1rem', 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
              borderRadius: '10px',
              fontSize: '0.9rem'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#667eea' }}>
                💡 AI Price Suggestions:
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span>Thrift: ${listing.ai.pricing.thrift}</span>
                <span>Boutique: ${listing.ai.pricing.boutique}</span>
                <span>New: ${listing.ai.pricing.new}</span>
              </div>
            </div>
          )}

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)',
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(240, 147, 251, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.3)';
            }}
          >
            {loading ? 'Saving...' : '💾 Save Draft'}
          </button>
        </div>
      </div>
    </div>
  );
};
