import React, { useEffect, useRef } from 'react';
import { Camera, CameraOff, Minimize2, AlertTriangle, RefreshCw, Loader } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

interface ProctoringViewProps {
  width?: number;
  height?: number;
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
  showControls?: boolean;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  className?: string;
}

export const ProctoringView: React.FC<ProctoringViewProps> = ({
  width = 320,
  height = 240,
  onStreamReady,
  onError,
  showControls = true,
  isMinimized = false,
  onToggleMinimize,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamReadyCalledRef = useRef(false);
  const { stream, error, isCameraOn, startCamera, stopCamera } = useCamera();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      console.log('Setting video srcObject:', stream);
      video.srcObject = stream;
      
      // Call onStreamReady only once
      if (!streamReadyCalledRef.current && stream) {
        console.log('Calling onStreamReady');
        onStreamReady?.(stream);
        streamReadyCalledRef.current = true;
      }
    }
  }, [stream, onStreamReady]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleToggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const getStatusColor = () => {
    if (error) return '#ef4444';
    if (isCameraOn) return '#10b981';
    return '#f59e0b';
  };

  const getStatusText = () => {
    if (error) return 'Lỗi camera';
    if (isCameraOn) return 'Đang giám sát';
    return 'Đang tải...';
  };

  if (isMinimized) {
    return (
      <div 
        onClick={onToggleMinimize}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }}
      >
        <div style={{ padding: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: getStatusColor(),
            boxShadow: `0 0 8px ${getStatusColor()}`
          }} />
          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', fontWeight: 500 }}>
            {getStatusText()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      width: 'fit-content'
    }}>
      {/* Header - Only show if controls enabled */}
      {showControls && (
        <div style={{
          background: 'linear-gradient(135deg, var(--card) 0%, var(--background) 100%)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: getStatusColor(),
              boxShadow: `0 0 10px ${getStatusColor()}`,
              animation: isCameraOn ? 'pulse 2s ease-in-out infinite' : 'none'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--foreground)'
            }}>
              Camera giám sát
            </span>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'relative',
        background: '#1e293b'
      }}>
        {error ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
          }}>
            <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <AlertTriangle style={{
                width: '40px',
                height: '40px',
                color: '#dc2626',
                margin: '0 auto var(--space-3)'
              }} />
              <p style={{
                fontSize: '13px',
                color: '#991b1b',
                marginBottom: 'var(--space-3)',
                fontWeight: 500
              }}>
                {error}
              </p>
              <button
                onClick={startCamera}
                style={{
                  padding: '6px 16px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: 'white',
                  fontSize: '12px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  margin: '0 auto',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                Thử lại
              </button>
            </div>
          </div>
        ) : !isCameraOn ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Loader style={{
                width: '40px',
                height: '40px',
                color: '#60a5fa',
                margin: '0 auto var(--space-3)',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{
                fontSize: '13px',
                color: '#cbd5e1',
                fontWeight: 500
              }}>
                Đang khởi động camera...
              </p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              display: 'block',
              background: '#000'
            }}
            onLoadedMetadata={(e) => {
              console.log('Video metadata loaded');
              const video = e.currentTarget;
              video.play().catch(err => console.error('Play error:', err));
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: 'linear-gradient(135deg, var(--background) 0%, var(--card) 100%)',
        padding: 'var(--space-3)',
        borderTop: '1px solid var(--border)'
      }}>
        <p style={{
          fontSize: '11px',
          color: 'var(--muted-foreground)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.4
        }}>
          Camera đang được sử dụng để giám sát quá trình làm bài thi
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};
