import { useState, useEffect, useRef, useCallback } from 'react';
import { proctoringService } from '../services/proctoringService';
import { useFrameStorage } from './useFrameStorage';

export interface CheatingDetection {
  type: 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'MOBILE_PHONE_DETECTED' | 'CAMERA_TAMPERED' | 'LOOKING_AWAY' | 'tab_switch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  timestamp: number;
  description: string;
  screenshot?: string;
  metadata?: any;
}

export interface CameraMetrics {
  fps: number;
  resolution: string;
  brightness: number;
  contrast: number;
  isStable: boolean;
}

export interface AICameraMonitorReturn {
  // Camera state
  isActive: boolean;
  isAnalyzing: boolean;
  error: string | null;
  
  // Detection results
  detections: CheatingDetection[];
  metrics: CameraMetrics | null;
  
  // Actions
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => void;
  captureScreenshot: () => string | null;
  
  // Configuration
  setDetectionSensitivity: (level: 'low' | 'medium' | 'high') => void;
  enableDetectionType: (type: CheatingDetection['type'], enabled: boolean) => void;
  
  // Frame Storage
  frameStorage: {
    totalFramesCaptured: number;
    totalDetections: number;
    storageSize: number;
    getStatistics: () => any;
    exportData: () => void;
    clearAll: () => void;
  };
}

interface UseAICameraMonitorProps {
  examId?: string;
  studentId?: string;
}

interface CameraState {
  isActive: boolean;
  isAnalyzing: boolean;
  error: string | null;
  detections: CheatingDetection[];
  metrics: CameraMetrics | null;
  detectionSensitivity: 'low' | 'medium' | 'high';
  enabledDetections: Set<CheatingDetection['type']>;
}

const initialState: CameraState = {
  isActive: false,
  isAnalyzing: false,
  error: null,
  detections: [],
  metrics: null,
  detectionSensitivity: 'medium',
  enabledDetections: new Set(['FACE_NOT_DETECTED', 'MULTIPLE_FACES', 'MOBILE_PHONE_DETECTED', 'CAMERA_TAMPERED', 'LOOKING_AWAY', 'tab_switch'])
};

export const useAICameraMonitor = (props?: UseAICameraMonitorProps): AICameraMonitorReturn => {
  const { examId = 'default', studentId = '1' } = props || {};
  const [state, setState] = useState<CameraState>(initialState);
  
  // Frame Storage Hook
  const frameStorage = useFrameStorage({
    maxFrames: 100,
    maxResponses: 200,
    autoCleanup: true,
    cleanupInterval: 60000 // 1 minute
  });
  
  // Refs for tracking state
  const isActiveRef = useRef(false);
  const detectionCooldownRef = useRef(0); // Cooldown between detections

  // Helper functions to update state
  const updateState = useCallback((updates: Partial<CameraState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);

  // Tab switch detection (vẫn giữ vì dùng Browser API, không cần backend)
  const detectTabSwitch = useCallback((): CheatingDetection | null => {
    if (document.hidden) {
      return {
        type: 'tab_switch',
        severity: 'medium',
        confidence: 100,
        timestamp: Date.now(),
        description: 'Phát hiện chuyển tab hoặc cửa sổ khác'
      };
    }
    return null;
  }, []);

  const captureScreenshot = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('captureScreenshot: Video or canvas ref not available');
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Validate video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('captureScreenshot: Video dimensions not ready:', video.videoWidth, 'x', video.videoHeight);
        return null;
      }
      
      if (video.readyState < 2) {
        console.error('captureScreenshot: Video not ready, readyState:', video.readyState);
        return null;
      }
      
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('captureScreenshot: Cannot get canvas context');
        return null;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Clear canvas first
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL with HIGHER quality (0.95 instead of 0.8)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      // Validate captured image - Relaxed threshold for now
      // Expected: 20KB+ for 640x480, 50KB+ for 1280x720
      // But accept smaller sizes if browser doesn't support high quality
      const minSize = 5000; // Accept if > 5KB (relaxed from calculated minimum)
      if (!dataUrl || dataUrl.length < minSize) {
        console.error('captureScreenshot: Captured image too small:', dataUrl.length, 'bytes, expected >', minSize);
        return null;
      }
      
      console.log('captureScreenshot: Success!', video.videoWidth, 'x', video.videoHeight, 'dataUrl:', dataUrl.length, 'bytes');
      return dataUrl;
    } catch (err) {
      console.error('Error capturing screenshot:', err);
      return null;
    }
  }, []);

  const updateCameraMetrics = useCallback((video: HTMLVideoElement) => {
    // Mock metrics calculation
    const newMetrics: CameraMetrics = {
      fps: 25 + Math.random() * 5, // Mock FPS
      resolution: `${video.videoWidth}x${video.videoHeight}`,
      brightness: 50 + Math.random() * 30, // Mock brightness
      contrast: 60 + Math.random() * 20, // Mock contrast
      isStable: Math.random() > 0.1 // 90% stable
    };
    updateState({ metrics: newMetrics });
  }, [updateState]);

  const analyzeFrame = useCallback(async () => {
    console.log('analyzeFrame: Called with isActive =', isActiveRef.current, 'videoRef =', !!videoRef.current); // Debug log
    
    if (!videoRef.current || !isActiveRef.current) {
      console.log('analyzeFrame: Skipped - video not ready or not active'); // Debug log
      return;
    }

    console.log('analyzeFrame: Starting analysis...'); // Debug log

    const video = videoRef.current;
    let newDetections: CheatingDetection[] = [];
    const startTime = Date.now();

    try {
      // === GỌI AI BACKEND THẬT ===
      const screenshot = captureScreenshot();
      if (screenshot) {
        console.log('analyzeFrame: Calling AI backend...'); // Debug log
        
        // Lưu frame vào storage
        const frameId = frameStorage.addFrame(screenshot, examId, studentId);
        console.log('analyzeFrame: Frame saved to storage, ID:', frameId);
        
        const response = await proctoringService.analyzeFrame({
          image: screenshot,
          examId,
          studentId,
        });

        const processingTime = Date.now() - startTime;
        console.log('analyzeFrame: AI response:', response.detections.length, 'detections, processing time:', processingTime, 'ms'); // Debug log

        // Lưu response vào storage
        frameStorage.addResponse(frameId, response.detections.map(d => ({
          event_type: d.type,
          severity: d.severity,
          metadata: d.metadata
        })), processingTime);

        // Map detections từ backend
        newDetections = response.detections.map(d => ({
          ...d,
          screenshot: screenshot, // Attach screenshot to all detections
        }));
      }

      // Kiểm tra tab switch (Browser API - không cần backend)
      if (state.enabledDetections.has('tab_switch')) {
        const tabSwitchDetection = detectTabSwitch();
        if (tabSwitchDetection) {
          newDetections.push(tabSwitchDetection);
        }
      }

      // Update detections state - CHỈ HIỂN THỊ KHI THỰC SỰ CÓ VI PHẠM
      if (newDetections.length > 0) {
        const now = Date.now();
        // Giảm cooldown xuống 3 giây và chỉ áp dụng cho cùng loại vi phạm
        const lastDetection = state.detections[state.detections.length - 1];
        const shouldSkip = lastDetection && 
          (now - lastDetectionTimeRef.current < 3000) && // 3 giây cooldown
          lastDetection.type === newDetections[0].type; // Cùng loại vi phạm
        
        if (!shouldSkip) {
          console.log('analyzeFrame: New violations detected:', newDetections.length, newDetections.map(d => d.type)); // Debug log
          setState(prev => ({ 
            ...prev,
            detections: [...prev.detections, ...newDetections].slice(-50) // Keep last 50 detections
          }));
          lastDetectionTimeRef.current = now;
        } else {
          console.log('analyzeFrame: Detection skipped due to cooldown for type:', newDetections[0].type); // Debug log
        }
      } else {
        console.log('analyzeFrame: No violations detected'); // Debug log
      }

      // Update camera metrics
      updateCameraMetrics(video);

    } catch (err) {
      console.error('Error analyzing frame:', err);
    }
  }, [examId, studentId, state.enabledDetections, detectTabSwitch, captureScreenshot, updateCameraMetrics]);

  const startMonitoring = useCallback(async () => {
    try {
      updateState({ error: null, isAnalyzing: true });

      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      streamRef.current = stream;

      // Create video element
      if (!videoRef.current) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        videoRef.current = video;
      } else {
        videoRef.current.srcObject = stream;
      }

      // Create canvas for screenshots
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        canvasRef.current = canvas;
      }

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        }
      });

      updateState({ isActive: true, isAnalyzing: false });
      isActiveRef.current = true; // Update ref immediately
      
      console.log('startMonitoring: Camera is now ACTIVE!'); // Debug log

      // Start analysis loop - reduced frequency
      const analysisInterval = setInterval(analyzeFrame, 3000); // Analyze every 3 seconds instead of 1
      analysisIntervalRef.current = analysisInterval;
      
      console.log('startMonitoring: Analysis interval created:', analysisInterval); // Debug log
      
      // Test analyzeFrame immediately
      setTimeout(() => {
        console.log('startMonitoring: Testing analyzeFrame after 3 seconds...'); // Debug log
        analyzeFrame();
      }, 3000);

      // Listen for visibility changes (tab switching)
      const handleVisibilityChange = () => {
        if (state.enabledDetections.has('tab_switch')) {
          analyzeFrame();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

    } catch (err) {
      console.error('Error starting camera monitoring:', err);
      let errorMessage = 'Không thể khởi động camera AI';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép camera để tiếp tục.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Không tìm thấy camera. Vui lòng kiểm tra camera của bạn.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera đang được sử dụng bởi ứng dụng khác.';
        }
      }
      
      updateState({ error: errorMessage, isAnalyzing: false });
    }
  }, [analyzeFrame, state.enabledDetections]);

  const stopMonitoring = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    // Cleanup DOM elements
    if (videoRef.current && videoRef.current.parentNode) {
      document.body.removeChild(videoRef.current);
      videoRef.current = null;
    }
    if (canvasRef.current && canvasRef.current.parentNode) {
      document.body.removeChild(canvasRef.current);
      canvasRef.current = null;
    }

    updateState({ 
      isActive: false, 
      isAnalyzing: false, 
      detections: [], 
      metrics: null 
    });
    isActiveRef.current = false; // Update ref
  }, []);

  const handleSetDetectionSensitivity = useCallback((level: 'low' | 'medium' | 'high') => {
    updateState({ detectionSensitivity: level });
    // Adjust detection thresholds based on sensitivity
    // This would be implemented with real AI models
  }, [updateState]);

  const handleEnableDetectionType = useCallback((type: CheatingDetection['type'], enabled: boolean) => {
    setState(prev => {
      const newEnabledDetections = new Set(prev.enabledDetections);
      if (enabled) {
        newEnabledDetections.add(type);
      } else {
        newEnabledDetections.delete(type);
      }
      return { ...prev, enabledDetections: newEnabledDetections };
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    isActive: state.isActive,
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    detections: state.detections,
    metrics: state.metrics,
    startMonitoring,
    stopMonitoring,
    captureScreenshot,
    setDetectionSensitivity: handleSetDetectionSensitivity,
    enableDetectionType: handleEnableDetectionType,
    frameStorage: {
      totalFramesCaptured: frameStorage.totalFramesCaptured,
      totalDetections: frameStorage.totalDetections,
      storageSize: frameStorage.storageSize,
      getStatistics: frameStorage.getStatistics,
      exportData: frameStorage.exportData,
      clearAll: frameStorage.clearAll
    }
  };
};
