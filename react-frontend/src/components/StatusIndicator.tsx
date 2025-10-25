import React from 'react';
import type { ListingStatus } from '../types/listing';

interface StatusIndicatorProps {
  status: ListingStatus;
  className?: string;
}

const statusConfig: Record<ListingStatus, { text: string; icon: string; color: string }> = {
  uploading: {
    text: 'Uploading...',
    icon: '📤',
    color: '#3b82f6' // blue
  },
  processing_bg: {
    text: 'Processing background...',
    icon: '✨',
    color: '#8b5cf6' // purple
  },
  bg_removed: {
    text: 'Background removed',
    icon: '✅',
    color: '#10b981' // green
  },
  generating_ai: {
    text: 'AI writing listing...',
    icon: '🤖',
    color: '#f59e0b' // amber
  },
  ai_complete: {
    text: '✅ Ready to post!',
    icon: '🎉',
    color: '#10b981' // green
  },
  ready: {
    text: '✅ Ready to post!',
    icon: '🎉',
    color: '#10b981' // green
  },
  error: {
    text: 'Error occurred',
    icon: '❌',
    color: '#ef4444' // red
  }
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];
  const isProcessing = ['uploading', 'processing_bg', 'generating_ai'].includes(status);

  return (
    <div 
      className={`status-indicator ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        backgroundColor: `${config.color}15`,
        border: `2px solid ${config.color}40`,
        fontSize: '1rem',
        fontWeight: 600,
        color: config.color,
        transition: 'all 0.3s ease'
      }}
    >
      <span 
        className={isProcessing ? 'processing-icon' : ''}
        style={{
          fontSize: '1.5rem',
          display: 'inline-block',
          animation: isProcessing ? 'pulse 2s ease-in-out infinite' : 'none'
        }}
      >
        {config.icon}
      </span>
      <span>{config.text}</span>
      {isProcessing && (
        <div 
          className="spinner"
          style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${config.color}30`,
            borderTopColor: config.color,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginLeft: 'auto'
          }}
        />
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
