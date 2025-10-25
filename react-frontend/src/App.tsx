import { useState } from 'react'
import { ListingForm } from './components/ListingForm'
import './App.css'

function App() {
  // Generate a unique listing ID for this session
  const [listingId] = useState(() => `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '2rem' }}>📸</span>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              Photo2ProfitAI
            </h1>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#718096', 
              margin: 0,
              fontWeight: 500 
            }}>
              Transform photos into profitable listings
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <ListingForm listingId={listingId} />
      </main>
    </div>
  )
}

export default App
