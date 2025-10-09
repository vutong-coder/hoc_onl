import React from 'react';
import { Camera, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { ProctoringView } from '../molecules/ProctoringView';

export interface CameraCheckSectionProps {
  onCameraReady: (stream: MediaStream) => void;
  onCameraError: (error: string) => void;
  isCameraWorking: boolean;
  cameraError: string | null;
}

export const CameraCheckSection: React.FC<CameraCheckSectionProps> = ({
  onCameraReady,
  onCameraError,
  isCameraWorking,
  cameraError
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-6)',
      padding: 'var(--space-6)'
    }}>
      {/* Left Panel - Camera Check */}
      <div style={{
        background: 'transparent',
        padding: 0
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: 'var(--space-5)',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Camera style={{ width: '24px', height: '24px', marginRight: 'var(--space-2)', color: 'var(--primary)' }} />
          Kiểm tra camera
        </h2>
        
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--space-4)', fontSize: '14px' }}>
          Vui lòng cho phép truy cập camera và microphone để tiếp tục.
        </p>
        
        <div style={{ 
          marginBottom: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ProctoringView
            width={450}
            height={338}
            onStreamReady={onCameraReady}
            onError={onCameraError}
            showControls={true}
          />
        </div>
        
        {cameraError && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)'
          }}>
            <p style={{ color: '#991b1b', fontSize: '14px', fontWeight: 600 }}>
              Lỗi camera: {cameraError}
            </p>
            <p style={{ color: '#7f1d1d', fontSize: '12px', marginTop: 'var(--space-2)' }}>
              Vui lòng kiểm tra kết nối camera và thử lại.
            </p>
          </div>
        )}
        
        {isCameraWorking && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CheckCircle style={{ width: '20px', height: '20px', color: '#059669', marginRight: 'var(--space-2)' }} />
            <p style={{ color: '#065f46', fontSize: '14px', fontWeight: 600, margin: 0 }}>
              Camera đã sẵn sàng!
            </p>
          </div>
        )}
      </div>

      {/* Right Panel - Camera Instructions */}
      <div style={{
        background: 'transparent',
        padding: 0
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: 'var(--space-5)',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Lightbulb style={{ width: '24px', height: '24px', marginRight: 'var(--space-2)', color: '#f59e0b' }} />
          Hướng dẫn sử dụng camera
        </h2>

        <div style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-5)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e40af', marginBottom: 'var(--space-3)' }}>
            Điều chỉnh camera:
          </h3>
          <ul style={{ fontSize: '14px', color: '#1e3a8a', lineHeight: 1.6, paddingLeft: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Đặt camera ở vị trí có thể nhìn rõ khuôn mặt</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Đảm bảo ánh sáng đủ sáng</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Giữ khoảng cách phù hợp (50-80cm)</li>
            <li>• Tránh ánh sáng ngược chiều</li>
          </ul>
        </div>

        <div style={{
          background: 'var(--background)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: 'var(--space-3)' }}>
            Trong quá trình thi:
          </h3>
          <ul style={{ fontSize: '14px', color: 'var(--muted-foreground)', lineHeight: 1.6, paddingLeft: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Luôn giữ khuôn mặt trong tầm nhìn camera</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Không được che camera</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Không được rời khỏi chỗ ngồi</li>
            <li>• Tập trung vào màn hình máy tính</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
