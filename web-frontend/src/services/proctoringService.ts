/**
 * Proctoring Service - Gọi API backend để phân tích frame camera
 */

const PROCTORING_API_URL = 'http://localhost:8082/api';

export interface FrameAnalysisRequest {
  image: string; // Base64 encoded image
  examId: string;
  studentId: string;
}

export interface Detection {
  type: 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'MOBILE_PHONE_DETECTED' | 'CAMERA_TAMPERED' | 'LOOKING_AWAY' | 'tab_switch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: number;
  description: string;
  metadata?: any;
}

export interface FrameAnalysisResponse {
  detections: Detection[];
}

class ProctoringService {
  /**
   * Gửi frame camera đến backend để phân tích bằng AI
   */
  async analyzeFrame(request: FrameAnalysisRequest): Promise<FrameAnalysisResponse> {
    try {

      const response = await fetch(`${PROCTORING_API_URL}/proctoring/analyze-frame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('proctoringService: HTTP error response', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('proctoringService: Error calling API:', error);
      // Return empty detections on error instead of throwing
      return { detections: [] };
    }
  }

  /**
   * Lấy danh sách vi phạm của một phiên thi
   */
  async getSessionEvents(sessionId: string) {
    try {
      const response = await fetch(`${PROCTORING_API_URL}/sessions/${sessionId}/events`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching session events:', error);
      return [];
    }
  }
}

export const proctoringService = new ProctoringService();

