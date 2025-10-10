import { ExamDetails, ExamQuestion, ExamSubmission, ExamResult } from '../utils/types';
import { mockExamDetails } from '../data/mockExamData';

class ExamService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  /**
   * Lấy thông tin chi tiết của bài thi
   */
  async getExamDetails(examId: string): Promise<ExamDetails> {
    try {
      // Trong thực tế, sẽ gọi API:
      // const response = await fetch(`${this.baseUrl}/exams/${examId}`);
      // const data = await response.json();
      
      // Mock delay để simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trả về mock data
      return {
        ...mockExamDetails,
        id: examId
      };
    } catch (error) {
      console.error('Error fetching exam details:', error);
      throw new Error('Không thể tải thông tin bài thi');
    }
  }

  /**
   * Bắt đầu một bài thi (tạo session)
   */
  async startExam(examId: string): Promise<{ sessionId: string; startTime: string }> {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        sessionId: `session_${Date.now()}`,
        startTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error starting exam:', error);
      throw new Error('Không thể bắt đầu bài thi');
    }
  }

  /**
   * Lưu câu trả lời tạm thời
   */
  async saveAnswer(sessionId: string, questionId: number, answer: any): Promise<void> {
    try {
      // Mock implementation - trong thực tế sẽ gửi lên server
      console.log('Saving answer:', { sessionId, questionId, answer });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error saving answer:', error);
      throw new Error('Không thể lưu câu trả lời');
    }
  }

  /**
   * Nộp bài thi
   */
  async submitExam(submission: ExamSubmission): Promise<ExamResult> {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Tính điểm mock
      const totalPoints = submission.answers.reduce((total, answer) => {
        const question = mockExamDetails.questions.find(q => q.id === answer.questionId);
        if (question && question.type === 'multiple-choice') {
          return total + (answer.answer === question.correctAnswer ? question.points : 0);
        }
        return total + (question?.points || 0) * 0.8; // Giả định code questions đạt 80%
      }, 0);

      const maxPoints = mockExamDetails.questions.reduce((total, q) => total + q.points, 0);
      const score = Math.round((totalPoints / maxPoints) * 100);

      return {
        examId: submission.examId,
        sessionId: submission.sessionId,
        score,
        totalQuestions: submission.answers.length,
        correctAnswers: Math.round(submission.answers.length * (score / 100)),
        timeSpent: submission.timeSpent,
        submittedAt: new Date().toISOString(),
        passed: score >= 70
      };
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw new Error('Không thể nộp bài thi');
    }
  }

  /**
   * Gửi ảnh chụp màn hình để giám sát
   */
  async sendMonitoringScreenshot(sessionId: string, imageData: string): Promise<void> {
    try {
      // Mock implementation
      console.log('Sending monitoring screenshot:', { sessionId, imageDataLength: imageData.length });
      
      // Trong thực tế sẽ gửi ảnh lên server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error sending screenshot:', error);
      // Không throw error để không ảnh hưởng đến việc làm bài
    }
  }

  /**
   * Lấy kết quả bài thi đã nộp
   */
  async getExamResult(sessionId: string): Promise<ExamResult> {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        examId: 'javascript-advanced',
        sessionId,
        score: 85,
        totalQuestions: 5,
        correctAnswers: 4,
        timeSpent: 28,
        submittedAt: new Date().toISOString(),
        passed: true
      };
    } catch (error) {
      console.error('Error fetching exam result:', error);
      throw new Error('Không thể tải kết quả bài thi');
    }
  }
}

export const examService = new ExamService();

