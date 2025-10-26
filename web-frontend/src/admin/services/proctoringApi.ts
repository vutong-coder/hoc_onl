// Admin Proctoring API Service
const PROCTORING_API_URL = 'http://localhost:8082/api';

export interface ProctoringEvent {
  id: string;
  sessionId: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  metadata?: any;
  isReviewed?: boolean;
}

export interface MediaCapture {
  id: string;
  eventId: string;
  captureType: 'screenshot' | 'video_clip';
  storagePath: string;
  createdAt: string;
}

export interface ProctoringSession {
  id: string;
  userId: number;
  examId: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'terminated';
  maxSeverityLevel?: string;
  highSeverityViolationCount: number;
}

export interface SessionWithEvents extends ProctoringSession {
  events: ProctoringEvent[];
  mediaCaptures: MediaCapture[];
}

class ProctoringApiService {
  /**
   * Lấy tất cả sessions
   */
  async getAllSessions(): Promise<ProctoringSession[]> {
    try {
      const response = await fetch(`${PROCTORING_API_URL}/proctoring/sessions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  /**
   * Lấy session theo ID với events và media
   */
  async getSessionById(sessionId: string): Promise<SessionWithEvents | null> {
    try {
      const sessionResponse = await fetch(`${PROCTORING_API_URL}/proctoring/sessions/${sessionId}`);
      if (!sessionResponse.ok) {
        throw new Error(`HTTP error! status: ${sessionResponse.status}`);
      }
      const session = await sessionResponse.json();

      // Fetch events
      const events = await this.getEventsBySession(sessionId);
      
      // Fetch media captures for each event
      const mediaCaptures: MediaCapture[] = [];
      for (const event of events) {
        const media = await this.getMediaByEventId(event.id);
        mediaCaptures.push(...media);
      }

      return {
        ...session,
        events,
        mediaCaptures
      };
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }

  /**
   * Lấy events của một session
   */
  async getEventsBySession(sessionId: string): Promise<ProctoringEvent[]> {
    try {
      const response = await fetch(`${PROCTORING_API_URL}/sessions/${sessionId}/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  /**
   * Lấy media captures của một event
   */
  async getMediaByEventId(eventId: string): Promise<MediaCapture[]> {
    try {
      const response = await fetch(`${PROCTORING_API_URL}/proctoring/events/${eventId}/media`);
      if (!response.ok) {
        // If endpoint doesn't exist, return empty array
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching media:', error);
      return [];
    }
  }

  /**
   * Terminate session
   */
  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${PROCTORING_API_URL}/proctoring/sessions/${sessionId}/terminate`, {
        method: 'POST'
      });
      return response.ok;
    } catch (error) {
      console.error('Error terminating session:', error);
      return false;
    }
  }

  /**
   * Mark violation as reviewed
   */
  async reviewEvent(eventId: string, isReviewed: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${PROCTORING_API_URL}/proctoring/events/${eventId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isReviewed })
      });
      return response.ok;
    } catch (error) {
      console.error('Error reviewing event:', error);
      return false;
    }
  }

  /**
   * Get media file URL (local or CDN)
   */
  getMediaUrl(storagePath: string): string {
    // If it's a relative path, prepend backend URL
    if (storagePath.startsWith('/')) {
      return `http://localhost:8082${storagePath}`;
    }
    return storagePath;
  }
}

export const proctoringApi = new ProctoringApiService();

