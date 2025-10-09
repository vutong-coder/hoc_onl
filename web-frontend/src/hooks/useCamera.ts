import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCameraReturn {
  stream: MediaStream | null;
  error: string | null;
  isCameraOn: boolean;
  isPermissionGranted: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => string | null;
}

export const useCamera = (): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isStartingRef = useRef(false);

  const startCamera = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isStartingRef.current || stream) {
      console.log('Camera already starting or started, skipping...');
      return;
    }
    
    isStartingRef.current = true;
    
    try {
      setError(null);
      console.log('Starting camera...');
      
      // Yêu cầu quyền truy cập camera và microphone
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      console.log('Camera stream obtained:', mediaStream);
      setStream(mediaStream);
      setIsCameraOn(true);
      setIsPermissionGranted(true);
      isStartingRef.current = false;

      // Tạo video element ẩn để xử lý stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      } else {
        const video = document.createElement('video');
        video.srcObject = mediaStream;
        video.autoplay = true;
        video.muted = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        videoRef.current = video;
      }

      // Tạo canvas ẩn để chụp ảnh
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        canvasRef.current = canvas;
      }

    } catch (err) {
      console.error('Error accessing camera:', err);
      let errorMessage = 'Không thể truy cập camera';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép camera để tiếp tục.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Không tìm thấy camera. Vui lòng kiểm tra camera của bạn.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera đang được sử dụng bởi ứng dụng khác. Vui lòng đóng các ứng dụng khác.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage = 'Camera không hỗ trợ cài đặt yêu cầu.';
        } else {
          errorMessage = err.message || 'Lỗi không xác định khi truy cập camera';
        }
      }
      
      setError(errorMessage);
      setIsCameraOn(false);
      setIsPermissionGranted(false);
      isStartingRef.current = false;
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOn(false);
    }

    // Dọn dẹp các element ẩn
    if (videoRef.current && videoRef.current.parentNode) {
      document.body.removeChild(videoRef.current);
      videoRef.current = null;
    }
    if (canvasRef.current && canvasRef.current.parentNode) {
      document.body.removeChild(canvasRef.current);
      canvasRef.current = null;
    }
    
    isStartingRef.current = false;
  }, [stream]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return null;

      // Thiết lập kích thước canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Vẽ frame hiện tại từ video
      context.drawImage(video, 0, 0);

      // Chuyển đổi thành base64
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (err) {
      console.error('Error capturing frame:', err);
      return null;
    }
  }, [stream]);

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    stream,
    error,
    isCameraOn,
    isPermissionGranted,
    startCamera,
    stopCamera,
    captureFrame
  };
};

